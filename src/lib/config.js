const jetpack = require('fs-jetpack')
const os = require('os')
const username = os.userInfo().username;

module.exports = {
  // Which model to use
  model: 'gpt-4.1',

  // The OpenAI API key
  apiKey: process.env.OPENAI_API_KEY || '',

  // Any additional parameters to pass to the OpenAI API
  prompt: '',

  // Your categories and their paths
  categories: {
    // Sample Packs
    'Samples': {
      path: `/Volumes/Jon Snow/Music/Libraries/Ableton/User Library/Samples/Third Party`,
      prompt: '',
      clean: ['Samples'],
      match: full => full.match(/\.(wav|aiff)$/i),
      copy: '**/*.{wav,aiff,flac,mp3,ogg,wavpack,opus,XXX}',
    },

    // Presets and Wavetables
    'Serum Presets': {
      path: `/Library/Audio/Presets/Xfer Records/Serum Presets/Presets/User/Third Party`,
      prompt: '',
      clean: ['Serum', 'Presets'],
      match: full => full.match(/serum/i) && full.match(/\.(fxp)$/i),
      copy: '**/*.{fxp,fxb,XXX}',
    },
    'Serum Wavetables': {
      path: `/Library/Audio/Presets/Xfer Records/Serum Presets/Tables/User/Third Party`,
      prompt: '',
      clean: ['Serum', 'Tables', 'Wavetables'],
      match: full => full.match(/wavetables|tables/i) && full.match(/\.(wav)$/i),
      copy: '**/*.{wav,XXX}',
    },
    'Serum Noises': {
      path: `/Library/Audio/Presets/Xfer Records/Serum Presets/Noises/User/Third Party`,
      prompt: '',
      clean: ['Serum', 'Noises', 'Noise'],
      match: full => full.match(/noises/i) && full.match(/\.(wav)$/i),
      copy: '**/*.{wav,XXX}',
    },
    'Massive Presets': {
      path: `/Users/${username}/Documents/Native Instruments/Massive/Sounds/Third Party`,
      prompt: '',
      clean: ['Massive', 'Presets'],
      match: full => full.match(/massive/i) && full.match(/\.(nmsv)$/i),
      copy: '**/*.{nmsv,XXX}',
    },
    'FM8 Presets': {
      path: `/Users/${username}/Documents/Native Instruments/FM8/Sounds/Third Party`,
      prompt: '',
      clean: ['FM8', 'Presets'],
      match: full => full.match(/fm8/i) && full.match(/\.(nfm8)$/i),
      copy: '**/*.{nfm8,XXX}',
    },
    'Sylenth1 Presets': {
      path: `/Users/${username}/Library/Application Support/LennarDigital/Sylenth1/Presets/Third Party`,
      prompt: '',
      clean: ['Sylenth1', 'Presets'],
      match: full => full.match(/sylenth/i) && full.match(/\.(fxp)$/i),
      copy: '**/*.{fxp,XXX}',
    },
    'Diva Presets': {
      path: `/Users/${username}/Library/Audio/Presets/u-he/Diva/Third Party`,
      prompt: '',
      clean: ['Diva', 'Presets'],
      match: full => full.match(/diva/i) && full.match(/\.(h2p)$/i),
      copy: '**/*.{h2p,XXX}',
    },
    'Strobe2 Presets': {
      path: `/Library/Application Support/FXpansion/Strobe2/Presets/Third Party`,
      prompt: '',
      clean: ['Strobe2', 'Presets'],
      match: full => full.match(/\.(strobe2)$/i),
      copy: '**/*.{strobe2,XXX}',
    },
    'Cthulhu Presets': {
      path: `/Users/${username}/Library/Application Support/Xfer Records/Cthulhu Presets/Third Party`,
      prompt: '',
      clean: ['Cthulhu', 'Presets'],
      match: full => full.match(/cthulhu/i) && full.match(/\.(fxp)$/i),
      copy: '**/*.{fxp,XXX}',
    },
    'Spire Presets': {
      path: `/Users/${username}/Documents/RevealSound/Bank/Third Party`,
      prompt: 'If the folder separates "Bank" and "Presets", YOU MUST PRESERVE THE FOLDER STRUCTURE.',
      clean: ['Spire', 'Presets'],
      match: full => full.match(/spire/i) && full.match(/\.(sbf|spf)$/i),
      copy: '**/*.{sbf,spf,XXX}',
    },

    // Libraries
    'Kontakt Libraries': {
      path: `/Volumes/Jon Snow/Music/Libraries/Kontakt/Third Party`,
      prompt: '',
      clean: ['Kontakt', 'Libraries', 'Library'],
      // match: full => full.match(/\.nki$/i) || full.match(/\.nkm$/i) || full.match(/\.nkr$/i),
      match: full => full.match(/\.(nki|nkm|nkr|nkc)$/i),
      copy: '**/*.{nki,nkm,nkr,nkc,XXX}',
    },

    // MIDI Clips
    'MIDI Clips': {
      path: `/Volumes/Jon Snow/Music/Libraries/Ableton/User Library/Clips/MIDI/Third Party`,
      prompt: '',
      clean: ['MIDI', 'Clips'],
      match: full => full.match(/\.(mid|midi)$/i),
      copy: '**/*.{mid,midi,XXX}',
    },

    // Ableton Projects
    'Ableton Projects': {
      path: `/Volumes/Jon Snow/Music/Project Files/Third Party`,
      prompt: '',
      clean: [],
      match: full => full.match(/\.(als|alp)$/i),
      copy: '**/*',
      skipInside: folder => {
        const files = jetpack.list(folder) || []
        return files.some(f => f.toLowerCase().endsWith('.als'))
      },
    },

    // Logic Projects
    'Logic Projects': {
      path: `/Volumes/Jon Snow/Music/Project Files/Third Party`,
      prompt: '',
      clean: [],
      match: full => full.match(/\.(logicx)$/i),
      copy: '**/*',
      skipInside: folder => {
        const files = jetpack.list(folder) || []
        return files.some(f => f.toLowerCase().endsWith('.logicx'))
      },
    },

    // FL Studio Projects
    'FL Studio Projects': {
      path: `/Volumes/Jon Snow/Music/Project Files/Third Party`,
      prompt: '',
      clean: [],
      match: full => full.match(/\.(flp)$/i),
      copy: '**/*',
      skipInside: folder => {
        const files = jetpack.list(folder) || []
        return files.some(f => f.toLowerCase().endsWith('.flp'))
      },
    },

    // Racks and Presets
    'Ableton Effect Racks': {
      path: `/Volumes/Jon Snow/Music/Libraries/Ableton/User Library/Presets/Audio Effects/Audio Effect Rack/Third Party`,
      prompt: '',
      clean: ['Ableton', 'Effect', 'Racks', 'Audio Effects', 'Audio Effect Rack', 'Effect Rack', 'Effect Racks'],
      match: full => full.match(/effect/i) && !full.match(/instrument/i) && full.match(/\.(adg)$/i),
      copy: '**/*.{adg,XXX}',
    },
    'Ableton Instrument Racks': {
      path: `/Volumes/Jon Snow/Music/Libraries/Ableton/User Library/Presets/Instruments/Instrument Rack/Third Party`,
      prompt: '',
      clean: ['Ableton', 'Instrument', 'Racks', 'Instruments', 'Instrument Rack', 'Instrument Racks'],
      match: full => full.match(/instrument/i) && !full.match(/effect/i)  && full.match(/\.(adg)$/i),
      copy: '**/*.{adg,XXX}',
    },
    'MIDI Effect Racks': {
      path: `/Volumes/Jon Snow/Music/Libraries/Ableton/User Library/Presets/MIDI Effects/MIDI Effect Rack/Third Party`,
      prompt: '',
      clean: ['MIDI', 'Effect', 'Racks', 'MIDI Effects', 'MIDI Effect Rack', 'MIDI Effect Racks'],
      match: full => full.match(/midi/i) && full.match(/effect/i) && full.match(/\.(adg)$/i),
      copy: '**/*.{adg,XXX}',
    },

    // Max for Live Devices
    'Max for Live Devices': {
      path: `/Volumes/Jon Snow/Music/Libraries/Ableton/User Library/Max for Live`,
      prompt: '',
      clean: ['Max for Live', 'Max', 'Live', 'Devices'],
      match: full => full.match(/\.(m4l|amxd)$/i),
      copy: '**/*.{m4l,amxd,XXX}',
    },

    // UAD Presets
    'UAD Presets': {
      path: `/Users/${username}/Documents/Universal Audio/Sessions/Third Party`,
      prompt: '',
      clean: ['UAD', 'Presets'],
      match: full => full.match(/uad/i) && full.match(/\.(uadmix)$/i),
      copy: '**/*.{uadmix,XXX}',
    },
  }
}
