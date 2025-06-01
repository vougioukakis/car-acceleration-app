
/**
 * Loads and decodes an audio file for a car's engine sound.
 *
 * @param {string} audioUrl - The URL of the audio file to load.
 * @returns {boolean} - 1 if the audio file is successfully loaded and decoded,
 * or 0 if an error occurs.
 *
 */
async function loadEngineSound(audioUrl) {
    console.log('Fetching engine sound for ' + CAR.name);
    let buffer;
    try {
        const response = await fetch(audioUrl);
        const data = await response.arrayBuffer();
        buffer = await AUDIO_CONTEXT.decodeAudioData(data);
    } catch (error) {
        console.log('Error fetching or decoding audio data for' + CAR.name + ',' + error);
        CAR.has_sound = false;
        SOUND_STARTED = false;
        return 0;
    }

    BASE_PLAYBACK_RATE = CAR.sound_pitch_0;

    SOURCE_NODE = AUDIO_CONTEXT.createBufferSource();
    SOURCE_NODE.buffer = buffer;
    SOURCE_NODE.loop = true;

    GAIN_NODE = AUDIO_CONTEXT.createGain();
    GAIN_NODE.gain.value = 1.0;

    SOURCE_NODE.connect(GAIN_NODE).connect(AUDIO_CONTEXT.destination);
    SOURCE_NODE.playbackRate.value = BASE_PLAYBACK_RATE;
    SOURCE_NODE.start(0); // Start playing the sound
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
    console.log('Fetching blow off sound for ' + CAR.name);

    if (CAR.engine.blow_off) {
        try {
            const response = await fetch(audioUrl);
            const data = await response.arrayBuffer();
            const buffer = await AUDIO_CONTEXT.decodeAudioData(data);

            BLOW_OFF_BUFFER = buffer;

            console.log('Blow off sound loaded successfully for ' + CAR.name);
            return true;
        } catch (error) {
            console.error('Error fetching or decoding blow-off audio data for ' + CAR.name + ':', error);
            BLOW_OFF_BUFFER = null;
            return false;
        }
    }
    BLOW_OFF_SOURCE_NODE = null;
    BLOW_OFF_BUFFER = null;
    BLOW_OFF_GAIN_NODE = null;
    return false;

}

/**
 * Plays the blow-off valve sound if available.
 * Ensures that the sound only plays if the CAR has a blow-off valve sound loaded.
 *
 * @returns {void}
 */
function playBlowOffValve() {
    if (!SOUND_STARTED) {
        //console.warn('Blow off valve sound not loaded or not available for ' + CAR.name);
        return;
    }
    BLOW_OFF_SOURCE_NODE = AUDIO_CONTEXT.createBufferSource();
    BLOW_OFF_SOURCE_NODE.buffer = BLOW_OFF_BUFFER;

    BLOW_OFF_GAIN_NODE = AUDIO_CONTEXT.createGain();
    BLOW_OFF_GAIN_NODE.gain.value = 1.0; // Default gain value

    BLOW_OFF_SOURCE_NODE.connect(BLOW_OFF_GAIN_NODE).connect(AUDIO_CONTEXT.destination);

    BLOW_OFF_SOURCE_NODE.start(0);

    console.log('Playing blow-off valve sound for ' + CAR.name);

    BLOW_OFF_SOURCE_NODE.onended = () => {

    };

    BLOW_OFF_SOURCE_NODE = null;
    BLOW_OFF_GAIN_NODE = null;

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
    if (!SOURCE_NODE) return;

    if (Math.abs(rpm - PREVIOUS_RPM) > 40) {

        // normalize RPM to a 0-1 range and map it to playback rate
        const normalizedRPM = (rpm) / (maxRPM);
        const playbackRate = BASE_PLAYBACK_RATE + normalizedRPM ** 1.2 * (CAR.sound_pitch_1 - BASE_PLAYBACK_RATE); // Adjust range


        if (PREVIOUS_RPM > rpm) {
            //GAIN_NODE.gain.value = 1.0;
            GAIN_NODE.gain.linearRampToValueAtTime(0.6, AUDIO_CONTEXT.currentTime + 0.4); // Smooth volume change
        } else {
            GAIN_NODE.gain.linearRampToValueAtTime(1.0, AUDIO_CONTEXT.currentTime + 0.4); // Smooth volume change
            //GAIN_NODE.gain.value = 1.0;
        }
        // update playback rate continuously without restarting the sound
        SOURCE_NODE.playbackRate.value = playbackRate;
        PREVIOUS_RPM = rpm;

    }
}


//straight cut gears
/**
 * Generates a synthetic straight-cut gear sound using an oscillator.
 * This sound dynamically changes its pitch based on RPM and gear.
 *
 * @returns {void}
 */
function generateStraightCutGearSound() {
    if (!AUDIO_CONTEXT) {
        console.error('AudioContext is not initialized.');
        return;
    }

    // create an oscillator for the synthetic sound
    GEAR_OSCILLATOR = AUDIO_CONTEXT.createOscillator();
    GEAR_GAIN_NODE = AUDIO_CONTEXT.createGain();

    GEAR_OSCILLATOR.type = 'sawtooth';
    GEAR_GAIN_NODE.gain.value = 0.021;

    GEAR_OSCILLATOR.connect(GEAR_GAIN_NODE).connect(AUDIO_CONTEXT.destination);
    GEAR_OSCILLATOR.start();
    console.log('Synthetic straight-cut gear sound generated.');
}

/**
 * Updates the pitch of the synthetic straight-cut gear sound based on RPM and gear.
 *
 * @param {number} rpm - The current RPM of the car.
 * @param {number} gear - The current gear index of the car.
 * @returns {void}
 */
function updateSyntheticGearSound(rpm, gear) {
    if (!GEAR_OSCILLATOR) {
        //console.warn('Straight-cut gear sound has not been generated.');
        return;
    }

    if (Math.abs(rpm - PREVIOUS_RPM_GEARBOX) > 40) {
        const normalizedRPM = rpm / maxRPM; // normalize RPM
        const baseFrequency = 500; // base frequency
        const gearFactor = 1 + (gear / 3) ** 3; // freq increased based on gear index
        const frequency = baseFrequency + normalizedRPM * baseFrequency * gearFactor;

        GEAR_OSCILLATOR.frequency.setValueAtTime(frequency, AUDIO_CONTEXT.currentTime);

        console.log(`Synthetic gear sound updated: RPM=${rpm}, Gear=${gear}, Frequency=${frequency.toFixed(2)}Hz`);

        if (PREVIOUS_RPM_GEARBOX > rpm) {
            GEAR_GAIN_NODE.gain.value = 0.01;
        } else {
            GEAR_GAIN_NODE.gain.value = 0.021;
        }

        PREVIOUS_RPM_GEARBOX = rpm;
    }
}

/**
 * Stops the synthetic straight-cut gear sound.
 *
 * @returns {void}
 */
function stopSyntheticGearSound() {
    if (GEAR_OSCILLATOR) {
        GEAR_OSCILLATOR.stop();
        GEAR_OSCILLATOR.disconnect();
        GEAR_OSCILLATOR = null;
        GEAR_GAIN_NODE = null;

        console.log('Synthetic straight-cut gear sound stopped.');
    }
}

function resetSound() {
    if (SOURCE_NODE) {
        SOURCE_NODE.stop();
        SOURCE_NODE = null;
        SOUND_STARTED = false;
    }
    if (BLOW_OFF_SOURCE_NODE) {
        BLOW_OFF_SOURCE_NODE.stop();
        BLOW_OFF_GAIN_NODE.stop();
        BLOW_OFF_SOURCE_NODE.disconnect();
        BLOW_OFF_GAIN_NODE.disconnect();
        BLOW_OFF_SOURCE_NODE = null;
        BLOW_OFF_BUFFER = null;
        BLOW_OFF_GAIN_NODE = null;
    }
    stopSyntheticGearSound();
}