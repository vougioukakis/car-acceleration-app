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
    document.getElementById("sidebarHandle").addEventListener("click", () => {
        const sidebar = document.getElementById("tireSidebar");
        sidebar.classList.toggle("closed");
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

}



function addEventListeners() {
    addEventListenerForThrottle();
    addEventListenerToBackToCars();
    addEventListenerToBackToManufacturers();
    addEventListenersForSidebar();
    document.getElementById("shiftButton").addEventListener("click", shiftSimulation);
    document.getElementById("startButton").addEventListener("click", launchSimulation);
    document.getElementById('exportBtn').addEventListener('click', plotAndExportPDF);
}

