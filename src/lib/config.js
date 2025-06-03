const jetpack = require('fs-jetpack')
const os = require('os')
const username = os.userInfo().username;

module.exports = {
  // model: 'gpt-4o',
  model: 'gpt-4.1-mini',
  apiKey: process.env.OPENAI_API_KEY || '',
  categories: {
    // Sample Packs
    'Samples': {
      path: `/Volumes/Jon Snow/Music/Libraries/Ableton/User Library/Samples/Third Party`,
      match: full => full.match(/\.(wav|aiff)$/i)
    },

    // Presets and Wavetables
    'Serum Presets': {
      path: `/Library/Audio/Presets/Xfer Records/Serum Presets/Presets/User/Third Party`,
      match: full => full.match(/serum/i) && full.match(/\.fxp$/i)
    },
    'Serum Wavetables': {
      path: `/Library/Audio/Presets/Xfer Records/Serum Presets/Tables/User/Third Party`,
      match: full => full.match(/wavetables|tables/i) && full.match(/\.wav$/i)
    },
    'Serum Noises': {
      path: `/Library/Audio/Presets/Xfer Records/Serum Presets/Noises/User/Third Party`,
      match: full => full.match(/noises/i) && full.match(/\.wav$/i)
    },
    'Massive Presets': {
      path: `/Users/${username}/Documents/Native Instruments/Massive/Sounds/Third Party`,
      match: full => full.match(/massive/i) && full.match(/\.nmsv$/i)
    },
    'Sylenth1 Presets': {
      path: `/Users/${username}/Library/Application Support/LennarDigital/Sylenth1/Presets/Third Party`,
      match: full => full.match(/sylenth/i) && full.match(/\.fxp$/i)
    },
    'Diva Presets': {
      path: `/Users/${username}/Library/Audio/Presets/u-he/Diva/Third Party`,
      match: full => full.match(/diva/i) && full.match(/\.h2p$/i)
    },
    'Strobe2 Presets': {
      path: `/Library/Application Support/FXpansion/Strobe2/Presets/Third Party`,
      match: full => full.match(/\.strobe2/i)
    },
    'Cthulhu Presets': {
      path: `/Users/${username}/Library/Application Support/Xfer Records/Cthulhu Presets/Third Party`,
      match: full => full.match(/cthulhu/i) && full.match(/\.fxp$/i)
    },
    'Kontakt Libraries': {
      path: `/Volumes/Jon Snow/Music/Libraries/Kontakt/Third Party`,
      match: full => full.match(/\.nki$/i) || full.match(/\.nkm$/i) || full.match(/\.nkr$/i)
    },

    // MIDI Clips
    'MIDI Clips': {
      path: `/Volumes/Jon Snow/Music/Libraries/Ableton/User Library/Clips/MIDI/Third Party`,
      match: full => full.match(/\.mid$/i)
    },

    // Ableton Projects
    'Ableton Projects': {
      path: `/Volumes/Jon Snow/Music/Project Files/Third Party`,
      match: full => full.match(/\.(als|alp)$/i),
      skipInside: folder => {
        const files = jetpack.list(folder) || []
        return files.some(f => f.toLowerCase().endsWith('.als'))
      }
    },

    // Logic Projects
    'Logic Projects': {
      path: `/Volumes/Jon Snow/Music/Project Files/Third Party`,
      match: full => full.match(/\.logicx$/i),
      skipInside: folder => {
        const files = jetpack.list(folder) || []
        return files.some(f => f.toLowerCase().endsWith('.logicx'))
      }
    },

    // FL Studio Projects
    'FL Studio Projects': {
      path: `/Volumes/Jon Snow/Music/Project Files/Third Party`,
      match: full => full.match(/\.flp$/i),
      skipInside: folder => {
        const files = jetpack.list(folder) || []
        return files.some(f => f.toLowerCase().endsWith('.flp'))
      }
    },

    // Racks and Presets
    'Ableton Effect Racks': {
      path: `/Volumes/Jon Snow/Music/Libraries/Ableton/User Library/Presets/Audio Effects/Audio Effect Rack/Third Party`,
      match: full => full.match(/\.adg$/i)
    },
    'Ableton Instrument Racks': {
      path: `/Volumes/Jon Snow/Music/Libraries/Ableton/User Library/Presets/Instruments/Instrument Rack/Third Party`,
      match: full => full.match(/\.adi$/i)
    },
  }
}
