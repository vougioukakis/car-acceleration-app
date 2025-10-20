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

function addEventListenersForSidebar() {
    const overlay = document.getElementById('tireOverlay');
    const sidebar = document.getElementById("tireSidebar");

    document.getElementById("sidebarHandle").addEventListener("click", () => {

        sidebar.classList.toggle("closed");
        overlay.classList.toggle('active');

    });

    document.querySelectorAll(".tire-option").forEach(option => {
        option.addEventListener("click", () => {
            document.querySelectorAll(".tire-option").forEach(opt => opt.classList.remove("selected"));
            option.classList.add("selected");
            SELECTED_TIRE = option.dataset.tire;
            console.log("Tire selected:", SELECTED_TIRE);
        });
    });

    document.querySelectorAll(".tc-option").forEach(option => {
        option.addEventListener("click", () => {
            document.querySelectorAll(".tc-option").forEach(opt => opt.classList.remove("selected"));
            option.classList.add("selected");
            TC_OPTION = option.dataset.tc;
            console.log("Traction Control:", TC_OPTION);
        });
    });

    document.querySelectorAll(".unit-option").forEach(option => {
        option.addEventListener("click", () => {
            document.querySelectorAll(".unit-option").forEach(opt => opt.classList.remove("selected"));
            option.classList.add("selected");
            SPEED_IN_KMH = option.dataset.kmh;
            console.log("KMH:", SPEED_IN_KMH);
        });
    });

    // clicking overlay closes sidebar
    overlay.addEventListener('click', () => {
        sidebar.classList.add('closed');
        overlay.classList.remove('active');
    });


}

function addWindowEventListeners() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            console.log('Tab hidden: suspending audio and simulation');
            if (AUDIO_CONTEXT && AUDIO_CONTEXT.state === 'running') {
                AUDIO_CONTEXT.suspend();
            }
            STARTED = false; // pause
        } else {
            console.log('Tab visible again');
            if (AUDIO_CONTEXT && AUDIO_CONTEXT.state === 'suspended') {
                AUDIO_CONTEXT.resume();
            }
            STARTED = true; // restart

            //commenting out this line will make the simulation continue
            // as if it was never paused when u switch back to the tab
            LAST_TIME = performance.now(); // resume from the point it stopped?
            requestAnimationFrame(gameLoop);
        }
    });

}


function addEventListeners() {
    addWindowEventListeners();
    addEventListenerForThrottle();
    addEventListenerToBackToCars();
    addEventListenerToBackToManufacturers();
    addEventListenersForSidebar();
    document.getElementById("shiftButton").addEventListener("click", shiftSimulation);
    document.getElementById("startButton").addEventListener("click", launchSimulation);
    document.getElementById('exportBtn').addEventListener('click', plotAndExportPDF);
}

