function addEventListenerToBackToCars() {
    document.getElementById('backToCars').addEventListener('click', () => {
        window.location.hash = `cars-${selectedMake}`;
    });
}

function addEventListenerToBackToManufacturers() {
    document.getElementById('backToManufacturers').addEventListener('click', () => {
        window.location.hash = 'manufacturers';
    });
}

function addEventListenerForThrottle() {
    let throttleButton = document.getElementById("throttle");

    window.addEventListener("keydown", handleThrottlePress);
    window.addEventListener("keyup", handleThrottleRelease);

    throttleButton.addEventListener("mousedown", handleThrottlePressButton);
    throttleButton.addEventListener("mouseup", handleThrottleReleaseButton);
    throttleButton.addEventListener("mouseleave", handleThrottleReleaseButton);
    // add touchstart touchend and touchcancel
    throttleButton.addEventListener("touchstart", handleThrottlePressButton);
    throttleButton.addEventListener("touchend", handleThrottleReleaseButton);
    throttleButton.addEventListener("touchcancel", handleThrottleReleaseButton);
}

function addEventListeners() {
    addEventListenerForThrottle();
    addEventListenerToBackToCars();
    addEventListenerToBackToManufacturers();
    document.getElementById("shiftButton").addEventListener("click", shiftSimulation);
    document.getElementById("startButton").addEventListener("click", launchSimulation);
}

