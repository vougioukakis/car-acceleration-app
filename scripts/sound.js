
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
    sourceNode.playbackRate.value = basePlaybackRate;
    sourceNode.start(0); // Start playing the sound
    return 1;
}

/**
 * Loads and prepares a blow-off valve sound for playback.
 * This creates a dedicated audio buffer source node that can be triggered
 * to play the blow-off valve sound on demand.
 *
 * @param {string} audioUrl - The URL of the blow-off valve audio file to load.
 * @returns {Promise<boolean>} - Resolves to true if the sound is loaded successfully, false otherwise.
 */
async function loadStututu(audioUrl) {
    console.log('Fetching blow off sound for ' + car.name);

    try {
        const response = await fetch(audioUrl);
        const data = await response.arrayBuffer();
        const buffer = await audioContext.decodeAudioData(data);

        // Assign the buffer to a global blow-off valve sound buffer
        car.blowOffBuffer = buffer;

        console.log('Blow off sound loaded successfully for ' + car.name);
        return true;
    } catch (error) {
        console.error('Error fetching or decoding blow-off audio data for ' + car.name + ':', error);
        return false;
    }
}

/**
 * Plays the blow-off valve sound if available.
 * Ensures that the sound only plays if the car has a blow-off valve sound loaded.
 *
 * @returns {void}
 */
function playBlowOffValve() {
    if (!soundStarted) {
        //console.warn('Blow off valve sound not loaded or not available for ' + car.name);
        return;
    }

    // Create a new buffer source node for each playback
    blowOffSourceNode = audioContext.createBufferSource();
    blowOffSourceNode.buffer = car.blowOffBuffer;

    // Create a gain node for controlling volume (if needed)
    blowOffGainNode = audioContext.createGain();
    blowOffGainNode.gain.value = 1.0; // Default gain value

    // Connect the source node to the gain node and the audio context destination
    blowOffSourceNode.connect(blowOffGainNode).connect(audioContext.destination);

    // Start playback from the beginning of the buffer
    blowOffSourceNode.start(0);

    console.log('Playing blow-off valve sound for ' + car.name);
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
            //gainNode.gain.value = 1.0;
            gainNode.gain.linearRampToValueAtTime(0.6, audioContext.currentTime + 0.2); // Smooth volume change
        } else {
            gainNode.gain.linearRampToValueAtTime(1.0, audioContext.currentTime + 0.2); // Smooth volume change
            // gainNode.gain.value = 1.0;
        }
        // Update playback rate continuously without restarting the sound
        //console.log('playback rate = ' + playbackRate);
        sourceNode.playbackRate.value = playbackRate;
        previous_rpm = rpm;

    }
}
