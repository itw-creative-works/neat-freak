// AutoSort CLI Tool (Updated)

const { input, checkbox, confirm } = require('@inquirer/prompts')
const jetpack = require('fs-jetpack')
const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const fetch = require('wonderful-fetch')
const chalk = require('chalk')
const { execute, template, wait } = require('node-powertools')
require('dotenv').config()
const config = loadConfig()

// Load package
const package = jetpack.read(path.join(__dirname, '../../', 'package.json'), 'json');
const project = jetpack.read(path.join(process.cwd(), 'package.json'), 'json');

// Load prompts
const prompts = {
  system: jetpack.read(path.join(__dirname, '../prompts/system.md')),
  user: jetpack.read(path.join(__dirname, '../prompts/user.md')),
}

let isDebug = false;
let shouldOpen = false;

module.exports = async function (options) {
  let scanPath = options.path
  isDebug = options.debug || options.d || false;
  shouldOpen = options.open || options.o || false;

  // Set config.apiKey
  config.apiKey = config.apiKey
    ? config.apiKey
    : options.apiKey || process.env.OPENAI_API_KEY;

  // Check for API key
  if (!config.apiKey) {
    console.error(chalk.red('❌ OpenAI API key not found. Please set config.apiKey or the OPENAI_API_KEY environment variable.'))
    return
  }

  if (!scanPath) scanPath = await input({ message: 'Enter path to pack:' })
  scanPath = scanPath
    .replace(/^['"]+|['"]+$/g, '')
    .replace(/\\ /g, ' ')
    .replace(/\\>/g, '>')
    .replace(/\\\\/g, '\\')
    .replace(/\\'/g, "'")
    .replace(/\\(.)/g, '$1')
    .replace(/ $/, '')
  scanPath = path.normalize(scanPath)
  if (!jetpack.exists(scanPath)) throw new Error('❌ Invalid path provided: ' + scanPath)

  const structureMap = await buildStructureMap(scanPath)
  const originalStat = fs.statSync(scanPath)
  const packFoldersTouched = new Set()

  if (isDebug) {
    console.log(chalk.gray('\n📤 Structure sent to OpenAI:'))
    console.log(chalk.white(JSON.stringify(structureMap, null, 2)))
  }

  // Delete getCategoryBasePath if in debug mode
  if (isDebug) {
    console.log(chalk.yellow('⚠️ Debug mode enabled, using debug paths for categories.'))
    jetpack.remove(getCategoryBasePath())
  }

  const system = generateSystemPrompt()
  const user = generateUserPrompt(scanPath, structureMap);

  const aiResponse = await askOpenAIChat([
    { role: 'system', content: system },
    { role: 'user', content: user },
  ])

  let parsed
  try {
    // console.log(chalk.gray('🔎 Parsing AI response...'))
    parsed = JSON.parse(aiResponse)
  } catch (e) {
    console.error(chalk.red('❌ Failed to parse AI response:\n'), aiResponse)
    return
  }

  const { creator, pack, map } = parsed

  console.log(chalk.bold('\n📦 Extracted Pack:'))
  console.log(chalk.green('Creator:'), chalk.white(creator))
  console.log(chalk.green('Pack:'), chalk.white(pack))
  console.log(chalk.green('Map:'), map)

  console.log(chalk.bold('\n📂 Output Structure:'))
  const confirmChoices = []
  for (let category in map) {
    const folderMap = map[category]
    const targetBase = getCategoryBasePath(category)
    const targetPath = path.join(targetBase, creator, pack)
    console.log(chalk.yellow(`${category}: ${chalk.gray(`${targetPath}`)}`))
    for (let src in folderMap) {
      console.log(chalk.gray(`  - ${src} → ${folderMap[src] || '(root)'}`))
    }
    confirmChoices.push({ name: `${category}`, value: category, checked: true })
  }

  console.log('');

  const confirmed = await checkbox({
    message: chalk.cyan('✅ Confirm which categories to process:'),
    choices: confirmChoices,
    pageSize: 20
  })

  console.log(chalk.blue(`\n📁 Processing folders...`))

  for (let category of confirmed) {
    const folderMap = map[category]

    for (let rel in folderMap) {
      const subfolder = folderMap[rel] || ''
      const src = path.join(scanPath, rel)
      const baseOut = getCategoryBasePath(category)
      const dest = path.join(baseOut, creator, pack, subfolder)

      const stat = fs.statSync(src)
      jetpack.dir(path.dirname(dest))

      try {
        if (jetpack.exists(src) === 'dir') {
          await fse.copy(src, dest, { overwrite: true, preserveTimestamps: true })
          fs.utimesSync(dest, stat.atime, stat.mtime)
        } else {
          const finalDest = path.join(dest, path.basename(src))
          await fse.copy(src, finalDest, { overwrite: true, preserveTimestamps: true })
          fs.utimesSync(finalDest, stat.atime, stat.mtime)
        }

        // 🕒 Set timestamps on the {pack} folder once
        const packFolderPath = path.join(baseOut, creator, pack)
        if (!packFoldersTouched.has(packFolderPath)) {
          packFoldersTouched.add(packFolderPath)
          // try {
          //   fs.utimesSync(packFolderPath, originalStat.atime, originalStat.mtime)
          // } catch (e) {
          //   console.warn(chalk.red(`⚠️ Failed to set timestamps for pack folder:`), packFolderPath)
          // }
        }

        console.log(chalk.green(`✓ Copied: ${rel} → ${category}/${subfolder}`))
        console.log(chalk.gray(`  From: ${src}`))
        console.log(chalk.gray(`  To: ${dest}`))
      } catch (err) {
        console.warn(chalk.red(`⚠️ Failed to copy: ${rel}`), err.message)
      }
    }
  }

  // Loop tru packFoldersTouched and set timestamps
  for (const folder of packFoldersTouched) {
    try {
      fs.utimesSync(folder, originalStat.atime, originalStat.mtime)
      // console.log(chalk.gray(`🕒 Set timestamps for: ${folder}`));
    } catch (e) {
      console.warn(chalk.red(`⚠️ Failed to set timestamps for pack folder:`), folder, e.message)
    }
  }

  console.log('\n');

  // Open folders in Finder if --open is set
  if (shouldOpen && packFoldersTouched.size > 0) {
    console.log(chalk.cyan('\n🔎 Opening sorted folders in Finder...'))
    for (const folder of packFoldersTouched) {
      try {
        await execute(`open "${folder}"`)
      } catch (e) {
        console.warn(chalk.red('⚠️ Failed to open folder:'), folder)
      }
    }
  }

  const shouldDelete = await confirm({
    message: chalk.yellow(`🗑️  Delete original folder? (${scanPath})`),
    default: !isDebug,
  })

  if (shouldDelete) {
    try {
      jetpack.remove(scanPath)
      console.log(chalk.green(`🗑️  Deleted original folder: ${scanPath}`))
    } catch (e) {
      console.warn(chalk.red('⚠️ Failed to delete folder:'), e.message)
    }
  }

  // Final message
  console.log(chalk.bold.green('\n✅ Sorting complete.'))
};


async function buildStructureMap(root) {
  if (isDebug) {
    console.log(chalk.cyan(`🧪 Debug mode: ${isDebug ? chalk.green('ON') : chalk.gray('OFF')}`))
  }
  console.log(chalk.cyan(`🔍 Scanning folder: ${chalk.gray(root)}`))

  const structure = {}
  const visited = new Set()

  async function unzipZipsInDir(dir) {
    const entries = jetpack.list(dir) || []
    for (let file of entries) {
      const full = path.join(dir, file)
      if (jetpack.exists(full) === 'file' && path.extname(full) === '.zip') {
        const unzipTo = path.join(dir, path.basename(file, '.zip'))
        console.log(chalk.magenta(`📦 Unzipping: ${full} → ${unzipTo}`))
        try {
          await execute(`unzip -o '${full}' -d '${unzipTo}'`)
          jetpack.remove(full)
        } catch (e) {
          console.warn(chalk.red(`⚠️ Failed to unzip ${file}:`), e.message)
        }
      }
    }
  }

  async function walk(current) {
    if (visited.has(current)) return
    visited.add(current)

    await unzipZipsInDir(current)

    const entries = jetpack.list(current) || []

    const shouldSkip = Object.values(config.categories).some(cat =>
      typeof cat.skipIfFolder === 'function' && cat.skipIfFolder(current)
    )
    if (shouldSkip) {
      console.log(chalk.gray(`⏭️  Skipping folder: ${current}`))
      return
    }

    for (let entry of entries) {
      const full = path.join(current, entry)
      const rel = path.relative(root, full)
      if (jetpack.exists(full) === 'dir') {
        await walk(full)
      } else {
        const ext = path.extname(entry).toLowerCase()
        if (ext === '.zip' || ext === '.rar') {
          console.error(chalk.red(`❌ Archive detected during final walk: ${rel}`))
          process.exit(1)
        }
        if (!ext) continue
        const folder = path.dirname(rel)
        if (!structure[folder]) structure[folder] = []
        const alreadyHas = structure[folder].some(f => path.extname(f).toLowerCase() === ext)
        if (!alreadyHas) structure[folder].push(rel)
      }
    }
  }

  await walk(root)

  const skipRoots = Object.values(structure).flat()
    .map(rel => path.join(root, rel))
    .filter(full =>
      Object.values(config.categories).some(cat =>
        typeof cat.skipInside === 'function' && cat.skipInside(path.dirname(full))
      )
    )
    .map(full => path.relative(root, path.dirname(full)))

  for (let folder of Object.keys(structure)) {
    if (skipRoots.some(base => folder !== base && folder.startsWith(base + path.sep))) {
      delete structure[folder]
    }
  }

  console.log(chalk.green('✅ Structure scan complete.'))

  const trimmed = {}
  for (let folder in structure) {
    const seen = new Set()
    trimmed[folder] = []
    for (let file of structure[folder]) {
      const ext = path.extname(file).toLowerCase()
      if (!seen.has(ext)) {
        trimmed[folder].push(file)
        seen.add(ext)
      }
    }
  }

  return trimmed
}

function generateSystemPrompt() {
  const categoryDescriptions = Object.entries(config.categories)
    .map(([name, config]) => {
      const matcher = config.match?.toString() || ''
      const skip = config.skipIfFolder ? ' [skip folder]' : ''
      return `- ${name}: ${matcher}${skip}`
    }).join('\n')

  return template(prompts.system, {
    categoryDescriptions: categoryDescriptions
  })
}

function generateUserPrompt(scanPath, structureMap) {
  return template(prompts.user, {
    scanPath: scanPath,
    destinationCategories: Object.entries(config.categories).map(([k, v]) => `- ${k}: ${v.path}`).join('\n'),
    structureMap: JSON.stringify(structureMap, null, 2)
  })
}

async function askOpenAIChat(messages) {
  console.log(chalk.cyan('\n📡 Sending structure to OpenAI...'))
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    response: 'json',
    headers: {
      Authorization: `Bearer ${config.apiKey}`
    },
    body: {
      model: config.model,
      response_format: { type: 'json_object' },
      messages,
      temperature: 0.2,
    }
  })
  console.log(chalk.green('📥 Response received from OpenAI!'))
  return response.choices?.[0]?.message?.content?.trim() || ''
}

function getCategoryBasePath(category) {
  return isDebug
    ? path.join(process.cwd(), '_debug', category ? config.categories[category].path : '')
    : (config.categories[category].path)
}

function loadConfig() {
  const defaults = require('../lib/config')
  const userConfigPathJs = path.join(process.cwd(), 'neat-freak-config.js')
  const userConfigPathJson = path.join(process.cwd(), 'neat-freak-config.json')

  let userConfig = {}

  console.log(chalk.blue(`🔧 Loading user config from ${userConfigPathJson}`));
  if (fs.existsSync(userConfigPathJs)) {
    userConfig = require(userConfigPathJs)
    console.log(chalk.green(`⚙️ Using user config from: ${userConfigPathJs}`))
  } else if (fs.existsSync(userConfigPathJson)) {
    userConfig = jetpack.read(userConfigPathJson, 'json') || {}
    console.log(chalk.green(`⚙️ Using user config from: ${userConfigPathJson}`))
  } else {
    console.log(chalk.yellow(`⚠️ No user config found, using defaults`))
  }

  // Merge defaults with user config
  return Object.assign({}, defaults, userConfig, {
    categories: Object.entries(defaults.categories).reduce((acc, [key, value]) => {
      acc[key] = Object.assign({}, value, userConfig.categories?.[key] || {})
      return acc
    }, {})
  })
}

