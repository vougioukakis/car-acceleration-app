// TODO: implement a debug mode that enables torque plots, console logs and other test stuff. (disable console logs by redefining console log)

// controls
function handleThrottlePress(event) {
    if (STARTED && event.code === "ArrowUp") {
        event.preventDefault();
        IS_REVVING = true;
    }
}

function handleThrottleRelease(event) {
    if (STARTED && event.code === "ArrowUp") {
        event.preventDefault();
        IS_REVVING = false;
    }
}

function handleThrottlePressButton(event) {
    if (STARTED) {
        event.preventDefault();
        IS_REVVING = true;
    }
}

function handleThrottleReleaseButton(event) {
    if (STARTED) {
        event.preventDefault();
        IS_REVVING = false;
    }
}

// sim state
function resetSimulation() {
    //state
    STARTED = false;
    LAUNCHED = false;
    RUN = null;
    CAR = null;
}

function startSimulation(carObj) {
    try {
        CAR = new Car(carObj.name);
        RUN = new Run(CAR, true);
        RUN.setTire(SELECTED_TIRE);
        RUN.setTC(TC_OPTION);
        resetPlot();
        STARTED = true;
        requestAnimationFrame(gameLoop);
        plotTorque();
        initializeRevMeter();
    } catch (error) {
        console.error('Error in startSimulation:', error);
    }
}

function launchSimulation() {
    LAUNCHED = true;
    START_TIME = performance.now();  // store the current time when simulation starts
    LAST_TIME = START_TIME;  // initialize last time for delta calculation
}

function shiftSimulation() {
    RUN.shift_call = true;
}