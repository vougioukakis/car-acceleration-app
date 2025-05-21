
//loop
function updateSimulation() {
    //console.log('started = ', STARTED);
    if (!STARTED) {
        return;
    }

    if (!LAUNCHED) {
        updateRevDisplay(RUN.current_rpm);
        document.getElementById("rpm").innerText = `RPM: ${RUN.current_rpm.toFixed()}`;

        return;
    }

    const currentTime = performance.now();

    DELTA_TIME = currentTime - LAST_TIME;
    TIME_ACCUMULATOR += DELTA_TIME;

    // update the simulation based on delta time if enough time has passed
    while (TIME_ACCUMULATOR >= TIME_PER_TICK) {
        RUN.simulate_step();
        if (RUN.done) {
            finish();
        }
        TIME_ACCUMULATOR -= TIME_PER_TICK;
        updateRevDisplay(RUN.current_rpm, RUN.gear_index);
        updateEnginePitch(RUN.current_rpm);
        updateSyntheticGearSound(RUN.current_rpm, RUN.gear_index);


        document.getElementById("gear").innerText = `${RUN.gear_index + 1}`;
        document.getElementById("rpm").innerText = `RPM: ${RUN.current_rpm.toFixed()}`;
        document.getElementById("speed").innerText = `Speed: ${(RUN.current_speed * 3.6).toFixed()} km/h`;
        document.getElementById("time").innerText = `Time: ${RUN.current_seconds.toFixed(1)} s`;
        document.getElementById("quarterMile").innerText = `Quarter Mile: ${RUN.to_400m}s`;
        document.getElementById("to_100km").innerText = `0-100 kmh: ${RUN.to_100km}s`;

        animate();
    }

    // save the current time as last time for next frame
    LAST_TIME = currentTime;
}
function gameLoop() {
    if (!STARTED) return;

    if (STARTED && !SOUND_STARTED && CAR.has_sound) {
        let isWorking = loadEngineSound(CAR.sound_url);
        if (isWorking) {
            SOUND_STARTED = true;
            if (CAR.engine.blow_off) loadStututu('./assets/turbo_sounds/blowoff_' + CAR.engine.blow_off + '.mp3');
            if (CAR.transmission.straight_cut) generateStraightCutGearSound();
        }
    }

    if (STARTED && IS_REVVING && !LAUNCHED) {
        RUN.rev();
        updateEnginePitch(RUN.current_rpm);
        updateSyntheticGearSound(RUN.current_rpm, RUN.gear_index);
    }
    else if (STARTED && !IS_REVVING && !LAUNCHED) {
        RUN.off_throttle();
        updateEnginePitch(RUN.current_rpm);
        updateSyntheticGearSound(RUN.current_rpm, RUN.gear_index);

    }

    if (RUN.stututu) {
        playBlowOffValve();
        RUN.stututu_done();
    }

    updateSimulation(); // if not started, will exit immediately
    requestAnimationFrame(gameLoop);  // this calls gameLoop recursively and adjusts to the frame rate
}

function finish() {
    console.log('Simulation finished');
    resetSimulation();
    document.getElementById('state').innerHTML = 'Finished';
}
