<p align="center">
  <a href="https://itwcreativeworks.com">
    <img src="https://cdn.itwcreativeworks.com/assets/itw-creative-works/images/logo/itw-creative-works-brandmark-black-x.svg" width="100px">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/package-json/v/itw-creative-works/neat-freak.svg">
  <br>
  <img src="https://img.shields.io/librariesio/release/npm/neat-freak.svg">
  <img src="https://img.shields.io/bundlephobia/min/neat-freak.svg">
  <img src="https://img.shields.io/codeclimate/maintainability-percentage/itw-creative-works/neat-freak.svg">
  <img src="https://img.shields.io/npm/dm/neat-freak.svg">
  <img src="https://img.shields.io/node/v/neat-freak.svg">
  <img src="https://img.shields.io/website/https/itwcreativeworks.com.svg">
  <img src="https://img.shields.io/github/license/itw-creative-works/neat-freak.svg">
  <img src="https://img.shields.io/github/contributors/itw-creative-works/neat-freak.svg">
  <img src="https://img.shields.io/github/last-commit/itw-creative-works/neat-freak.svg">
  <br>
  <br>
  <a href="https://itwcreativeworks.com">Site</a> | <a href="https://www.npmjs.com/package/neat-freak">NPM Module</a> | <a href="https://github.com/itw-creative-works/neat-freak">GitHub Repo</a>
  <br>
  <br>
  <strong>neat-freak</strong> is the official npm module of <a href="https://itwcreativeworks.com">Neat Freak</a>, a free tool for automatically sorting your downloaded sample packs, preset packs, and more!
  <br>
  <br>
  <img src="https://cdn.itwcreativeworks.com/assets/neat-freak/socials/neat-freak-promo-multi-1920x1080.gif">
</p>

> Now did this actually save me any time... or did I just spend 5 hours writing a tool to save me 5 minutes of work? 🤔

## 🦄 Features
- **Automatic Sorting**: Automatically sorts your downloaded sample packs, preset packs, and more.
- **Multi-Category Support**: Supports multiple categories like Samples, Presets, Project Files, and more.
- **Creator and Pack Detection**: Automatically detects the creator and pack name from the folder structure.

## 🥲 No more manually sorting your new packs
- Just drag and drop your pack and watch the magic happen.

## 📦 Install Neat Freak
### Option 1: Install via npm
Install globally with npm
```shell
npm install neat-freak -g
neat-freak
```

Now create a file named `neat-freak.config.json` in whatever directory you want to run Neat Freak in. This file should contain the paths to the folders you want to sort your files into, your OpenAI API key, and which model to use. Here is an example of what that file should look like:
```json
  "model": "gpt-4.1-mini",
  "apiKey": "sk-proj-...",
  "categories": {
    "Samples": {
      "path": "/Volumes/Jon Snow/Music/Libraries/Ableton/User Library/Samples/Third Party"
    }
  }
```
Check out the full [config.js from the source](https://github.com/itw-creative-works/neat-freak/blob/main/src/index.js) to see what the file should look like. You can add your own categories!

### Option 2: Download the source code
You can download the source code from the [GitHub repository](https://github.com/itw-creative-works/neat-freak) and run it locally. Just edit `./src/lib/config.js` with your own paths to the folders you want to sort your files into.
```shell
git clone https://github.com/itw-creative-works/neat-freak.git
cd neat-freak
npm install
npm start
```

## 🔥 Example
### Cymatics - Infinity Production Suite:
This pack includes
- 🎵 **Samples**
- 🎹 **MIDI**
- 🎛️ **Presets** (Massive & Serum + Serum Wavetables)
- 📂 **Project Files** (FL Studio & Ableton)
```
Cymatics - Infinity Production Suite/
├── Drum Loops/
│   ├── 120 BPM - Trap Loop 01.wav
│   └── 140 BPM - House Loop 02.wav
├── FX/
│   ├── Risers/
│   │   └── Riser 01.wav
│   └── Impacts/
│       └── Impact 01.wav
├── Melodies/
│   ├── MIDI/
│   │   └── Melody 01.mid
│   └── WAV/
│       └── Melody 01.wav
├── Presets/
│   ├── Serum/
│   │   ├── Wavetables/
│   │   │   └── Wavetable 01.wav
│   │   └── Presets/
│   │       └── Lead 01.srpresets
│   └── Massive/
│       └── Lead 01.nmsv
└── Project Files/
    ├── FL Studio/
    │   └── Infinity Demo.flp
    └── Ableton/
        └── Infinity Demo.als
```

### That's a lot of files to manually sort
**Neat Freak** will automatically put your files in the right place
```
Samples --> /Libraries/Ableton/User Library/Samples/Third Party/Cymatics/Infinity Production Suite/
Serum Presets --> /Library/Audio/Presets/Xfer Records/Serum Presets/Presets/User/Third Party/Cymatics/Infinity Production Suite/
Serum Wavetables --> /Library/Audio/Presets/Xfer Records/Serum Presets/Tabes/User/Third Party/Cymatics/Infinity Production Suite/
Massive Presets --> /Library/Audio/Presets/Native Instruments/Massive Presets/User/Third Party/Cymatics/Infinity Production Suite/
Project Files --> /Users/YourName/Documents/Projects/Cymatics/Infinity Production Suite/

```

## 🐒 Requirements
No matter how you install **Neat Freak**, there are a few requirements to keep in mind:
- **macOS**: Neat Freak is designed to work seamlessly on macOS, utilizing the standard file system paths for audio and project files.
- **Node.js**: Ensure you have [Node.js](https://nodejs.org/) installed on your system. Neat Freak requires Node.js to run. **Neat Freak** was tested it on **Node.js v22** but it should work on earlier versions.


## 📘 Using Neat Freak
After you have followed the install step, you can start using `neat-freak` to enhance your workflow.

For a more in-depth documentation of this library and the Neat Freak service, please visit the official Neat Freak website.

## 📝 What Can Neat Freak do?
Automatically sort your downloaded sample packs, preset packs, and even packs that contain all kinds of different files!

## 🗨️ Final Words
If you are still having difficulty, we would love for you to post
a question to [the Neat Freak issues page](https://github.com/itw-creative-works/neat-freak/issues). It is much easier to answer questions that include your code and relevant files! So if you can provide them, we'd be extremely grateful (and more likely to help you find the answer!)

## 📚 Projects Using this Library
* [ITW Creative Works](https://itwcreativeworks.com)
* [Somiibo](https://somiibo.com)
* [Slapform](https://slapform.com)
* [StudyMonkey](https://studymonkey.ai)
* [DashQR](https://dashqr.com)
* [Replyify](https://replyify.app)
* [SoundGrail](https://soundgrail.com)
* [Trusteroo](https://trusteroo.com)

Ask us to have your project listed! :)
