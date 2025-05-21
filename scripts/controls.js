// TODO: implement a debug mode that enables torque plots, console logs and other test stuff. (disable console logs by redefining console log)

// controls
function handleThrottlePress(event) {
    if (started && event.code === "ArrowUp") {
        event.preventDefault();
        isRevving = true;
    }
}

function handleThrottleRelease(event) {
    if (started && event.code === "ArrowUp") {
        event.preventDefault();
        isRevving = false;
    }
}

function handleThrottlePressButton(event) {
    if (started) {
        event.preventDefault();
        isRevving = true;
    }
}

function handleThrottleReleaseButton(event) {
    if (started) {
        event.preventDefault();
        isRevving = false;
    }
}

// sim state
function resetSimulation() {
    //state
    started = false;
    launched = false;
    run = null;
    car = null;

    //sound
    if (sourceNode) {
        sourceNode.stop();
        sourceNode = null;
        soundStarted = false;
    }
    stopSyntheticGearSound();
}

function startSimulation(carObj) {
    try {
        car = new Car(carObj.name);
        run = new Run(car, true);
        resetPlot();
        started = true;
        requestAnimationFrame(gameLoop);
        plotTorque();
        initializeRevMeter();
    } catch (error) {
        console.error('Error in startSimulation:', error);
    }
}

function launchSimulation() {
    launched = true;
    startTime = performance.now();  // store the current time when simulation starts
    lastTime = startTime;  // initialize last time for delta calculation
}

function shiftSimulation() {
    run.shift_call = true;
}