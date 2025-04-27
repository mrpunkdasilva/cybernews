const Tone = require('tone');
const fs = require('fs');

async function generateSounds() {
  const synth = new Tone.Synth().toDestination();
  
  // Activate sound (curto beep agudo)
  await Tone.Offline(() => {
    synth.triggerAttackRelease("C5", "16n");
  }, 0.1).then(buffer => {
    fs.writeFileSync('public/sounds/activate.mp3', buffer);
  });

  // Success sound (dois beeps ascendentes)
  await Tone.Offline(() => {
    synth.triggerAttackRelease("C4", "16n", 0);
    synth.triggerAttackRelease("E4", "16n", 0.1);
  }, 0.3).then(buffer => {
    fs.writeFileSync('public/sounds/success.mp3', buffer);
  });

  // Error sound (beep descendente)
  await Tone.Offline(() => {
    synth.triggerAttackRelease("E4", "16n", 0);
    synth.triggerAttackRelease("C4", "16n", 0.1);
  }, 0.3).then(buffer => {
    fs.writeFileSync('public/sounds/error.mp3', buffer);
  });
}

generateSounds();