
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

    }
    updateRevDisplay(RUN.current_rpm, RUN.gear_index);
    updateEnginePitch(RUN.current_rpm);
    updateSyntheticGearSound(RUN.current_rpm, RUN.gear_index);

    // for the various info we try to update less frequently
    let UI_UPDATE_INTERVAL = 25;
    const now = performance.now();
    if (now - lastUIUpdateTime > UI_UPDATE_INTERVAL) {
        lastUIUpdateTime = now;


        document.getElementById("gear").innerText = `${RUN.gear_index + 1}`;
        document.getElementById("rpm").innerText = `RPM: ${RUN.current_rpm.toFixed()}`;
        let MPH_mult = 1;
        let isMPH = SPEED_IN_KMH === "OFF";
        if (isMPH) {
            MPH_mult = 0.621371;
        }
        document.getElementById("speed").innerText = `Speed: ${(RUN.current_speed * 3.6 * MPH_mult).toFixed()} ${isMPH ? 'mph' : 'kmh'}`;
        document.getElementById("time").innerText = `${RUN.current_seconds.toFixed(1)} s`;
        document.getElementById("quarterMile").innerText = `${RUN.to_400m.toFixed(2)}s`;
        document.getElementById("to_100km").innerText = `${RUN.to_100km.toFixed(2)}s`;
        document.getElementById("thousandFt").innerText = `${RUN.to_304m.toFixed(2)}s`;
        document.getElementById("g_force").innerText = `${RUN.accel.toFixed(1)} / ${RUN.max_accel.toFixed(1)}`;


        const indic = document.getElementById("wheelspinIndicator");
        RUN.spinning ? indic.style.opacity = 1 : indic.style.opacity = 0;
        if (!IS_MOBILE) {

            animate();

        }
        ui_update_counter += 1;
        console.log(`ui counter ${ui_update_counter} with ${RUN.current_seconds}`);
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
            loadStututu('./assets/turbo_sounds/blowoff_' + CAR.engine.blow_off + '.mp3');
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

    if (LAUNCHED) {
        document.getElementById("startButton").style.display = 'none';
        document.getElementById("throttle").style.display = 'none';
        document.getElementById("shiftButton").style.display = 'block';
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
    resetSound();
    document.getElementById('state').innerHTML = 'Finished';
}

function reset() {
    resetSimulation();
    resetSound();
    resetUI();
}