let started = false;
let startTime = 0;
let lastTime = 0;
let timeAccumulator = 0;
const targetFps = 40;
const timePerTick = 1000 / targetFps; // = 25 ms when target FPS is 40
let deltaTime = 0;
let isRevving = false;
let launched = false;
let soundStarted = false;
let previous_rpm = 0;

let sourceNode; // To hold the audio source
let gainNode; // To control the volume of the audio
let basePlaybackRate; // The playback rate at the minimum RPM

function handleThrottlePress(event) {
    if (event.code === "ArrowUp") {
        event.preventDefault();
        isRevving = true;
    }
}

function handleThrottleRelease(event) {
    if (event.code === "ArrowUp") {
        event.preventDefault();
        isRevving = false;
    }
}

function handleThrottlePressButton(event) {
    event.preventDefault();
    isRevving = true;
}

function handleThrottleReleaseButton(event) {
    event.preventDefault();
    isRevving = false;
}

function startSimulation() {
    started = true;
}

function launchSimulation() {
    launched = true;
    startTime = performance.now();  // store the current time when simulation starts
    lastTime = startTime;  // initialize last time for delta calculation
}


function updateSimulation() {
    //console.log('started = ', started);
    if (!started) {
        return;
    }

    if (!launched) {
        updateRevDisplay(run.current_rpm);
        document.getElementById("rpm").innerText = `RPM: ${run.current_rpm.toFixed()}`;

        return;
    }

    const currentTime = performance.now();

    deltaTime = currentTime - lastTime;
    timeAccumulator += deltaTime;

    // update the simulation based on delta time if enough time has passed
    while (timeAccumulator >= timePerTick) {
        run.simulate_step();
        if (run.done) {
            finish();
        }
        timeAccumulator -= timePerTick;
        updateRevDisplay(run.current_rpm);
        updateEnginePitch(run.current_rpm);

        document.getElementById("rpm").innerText = `RPM: ${run.current_rpm.toFixed()}`;
        document.getElementById("speed").innerText = `Speed: ${(run.current_speed * 3.6).toFixed()} km/h`;
        document.getElementById("time").innerText = `Time: ${run.current_seconds.toFixed(1)} s`;
        document.getElementById("quarterMile").innerText = `Quarter Mile: ${run.to_400m}s`;
        document.getElementById("to_100km").innerText = `0-100 kmh: ${run.to_100km}s`;
    }

    // save the current time as last time for next frame
    lastTime = currentTime;
}

function shiftSimulation() {
    run.shift_call = true;
    //
}

document.getElementById("shiftButton").addEventListener("click", shiftSimulation);
document.getElementById("startButton").addEventListener("click", launchSimulation);

function gameLoop() {
    if (!started) return;
    if (started && !soundStarted && car.has_sound) {
        loadEngineSound(car.sound_url);
        soundStarted = true;
    }
    if (started && isRevving && !launched) {
        run.rev();
        updateEnginePitch(run.current_rpm);
    }
    else if (started && !isRevving && !launched) {
        run.off_throttle();
        updateEnginePitch(run.current_rpm);
    }
    updateSimulation(); // if not started, will exit immediately

    requestAnimationFrame(gameLoop);  // this calls gameLoop recursively and adjusts to the frame rate
}

function finish() {
    console.log('Simulation finished');
    if (sourceNode) {
        sourceNode.stop();
        sourceNode = null;
        soundStarted = false;
    }
    started = false;
    launched = false;
    document.getElementById('state').innerHTML = 'Finished';
}
//requestAnimationFrame(gameLoop);

//...sounds
// Web Audio API context

const audioContext = new (window.AudioContext || window.webkitAudioContext)();


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
        return;
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
            gainNode.gain.linearRampToValueAtTime(0.8, audioContext.currentTime + 0.1); // Smooth volume change
        } else {
            gainNode.gain.linearRampToValueAtTime(1.0, audioContext.currentTime + 0.1); // Smooth volume change
        }
        // Update playback rate continuously without restarting the sound
        sourceNode.playbackRate.value = playbackRate;
        previous_rpm = rpm;

    }
}
