
// Load and loop the audio
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
    console.log('sourcenode = ', sourceNode);
    sourceNode.loop = true;

    gainNode = audioContext.createGain();
    gainNode.gain.value = 1.0;
    sourceNode.connect(gainNode).connect(audioContext.destination);
    sourceNode.start(0); // Start playing the sound
    return 1;

}


// Update pitch based on RPM
function updateEnginePitch(rpm) {
    if (!sourceNode) return;

    if (Math.abs(rpm - previous_rpm) > 10) {
        //console.log("updating sound");

        // Normalize RPM to a 0-1 range and map it to playback rate
        const normalizedRPM = (rpm) / (maxRPM);
        const playbackRate = basePlaybackRate + normalizedRPM * (car.sound_pitch_1 - basePlaybackRate); // Adjust range

        if (previous_rpm > rpm) {
            gainNode.gain.linearRampToValueAtTime(0.6, audioContext.currentTime + 0.1); // Smooth volume change
        } else {
            gainNode.gain.linearRampToValueAtTime(1.0, audioContext.currentTime + 0.1); // Smooth volume change
        }
        // Update playback rate continuously without restarting the sound
        console.log('playback rate = ' + playbackRate);
        sourceNode.playbackRate.value = playbackRate;
        previous_rpm = rpm;

    }
}
