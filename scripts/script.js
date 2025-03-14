// TODO: implement a debug mode that enables torque plots, console logs and other test stuff. (disable console logs by redefining console log)


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
        updateRevDisplay(run.current_rpm, run.gear_index);
        updateEnginePitch(run.current_rpm);
        updateSyntheticGearSound(run.current_rpm, run.gear_index);


        document.getElementById("gear").innerText = `${run.gear_index + 1}`;
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
        let isWorking = loadEngineSound(car.sound_url);
        if (isWorking) {
            soundStarted = true;
            loadStututu('./turbo_sounds/blowoff_' + car.engine.blow_off + '.mp3');
            if (car.transmission.straight_cut) generateStraightCutGearSound();
        }
    }

    if (started && isRevving && !launched) {
        run.rev();
        updateEnginePitch(run.current_rpm);
        updateSyntheticGearSound(run.current_rpm, run.gear_index);
    }
    else if (started && !isRevving && !launched) {
        run.off_throttle();
        updateEnginePitch(run.current_rpm);
        updateSyntheticGearSound(run.current_rpm, run.gear_index);

    }

    if (run.stututu) {
        playBlowOffValve();
        run.stututu_done();
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
    stopSyntheticGearSound();
    started = false;
    launched = false;
    document.getElementById('state').innerHTML = 'Finished';
}
