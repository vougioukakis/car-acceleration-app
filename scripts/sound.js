// TODO: Add blow off valve sound logic. We have the sound files.
// TODO: Make sure blow off valve doesnt sound when a car doesnt have sound

/**
 * Loads and decodes an audio file for a car's engine sound.
 *
 * @param {string} audioUrl - The URL of the audio file to load.
 * @returns {boolean} - 1 if the audio file is successfully loaded and decoded,
 * or 0 if an error occurs.
 *
 */
async function loadEngineSound(audioUrl) {
    console.log('Fetching engine sound for ' + car.name);
    let buffer;
    try {
        const response = await fetch(audioUrl);
        const data = await response.arrayBuffer();
        buffer = await audioContext.decodeAudioData(data);
    } catch (error) {
        console.log('Error fetching or decoding audio data for' + car.name + ',' + error);
        car.has_sound = false;
        soundStarted = false;
        return 0;
    }

    basePlaybackRate = car.sound_pitch_0;

    sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = buffer;
    sourceNode.loop = true;

    gainNode = audioContext.createGain();
    gainNode.gain.value = 1.0;

    sourceNode.connect(gainNode).connect(audioContext.destination);
    sourceNode.start(0); // Start playing the sound
    return 1;
}

function createSourceNode() {
    sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = buffer;
    sourceNode.loop = false;

    gainNode = audioContext.createGain();
    gainNode.gain.value = 1.0;

}


/**
 * Updates the engine sound pitch based on the current RPM, only 
 * if the difference in rpm between updates is greater than
 * a set threshold.
 * This function adjusts the playback rate and volume of the engine sound
 * to simulate changes in engine speed.
 *
 * @param {number} rpm - The current rpm.
 * @returns {void}
 */
function updateEnginePitch(rpm) {
    if (!sourceNode) return;

    if (Math.abs(rpm - previous_rpm) > 40) {

        // normalize RPM to a 0-1 range and map it to playback rate
        const normalizedRPM = (rpm) / (maxRPM);
        const playbackRate = basePlaybackRate + normalizedRPM * (car.sound_pitch_1 - basePlaybackRate); // Adjust range

        if (previous_rpm > rpm) {
            gainNode.gain.linearRampToValueAtTime(0.7, audioContext.currentTime + 0.3); // Smooth volume change
        } else {
            gainNode.gain.linearRampToValueAtTime(1.0, audioContext.currentTime + 0.3); // Smooth volume change
        }
        // Update playback rate continuously without restarting the sound
        //console.log('playback rate = ' + playbackRate);
        sourceNode.playbackRate.value = playbackRate;
        previous_rpm = rpm;

    }
}
