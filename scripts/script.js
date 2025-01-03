// Interval in milliseconds for throttling (40 FPS -> 1000ms / 40 = 25ms)
const updateInterval = 22;
let started = false;
let startTime = 0;  // Track the start time to calculate elapsed real time

console.log(run.time);
console.log(run.max_steps);
console.log(run.speed);
console.log(run.speed);

function startSimulation() {
    started = true;
    startTime = Date.now();  // Store the current time when simulation starts
}

function updateSimulation() {
    if (!started) {
        return;
    }

    run.simulate_step();  // Run the simulation step

    // Update the simulation time and other elements
    document.getElementById("rpm").innerText = `RPM: ${run.current_rpm}`;
    document.getElementById("speed").innerText = `Speed: ${run.current_speed * 3.6} km/h`;
    document.getElementById("time").innerText = `Time: ${run.current_seconds} s`;

    // Update the real-time clock (seconds and milliseconds only)
    const elapsedTime = Date.now() - startTime;  // Get the elapsed time in ms
    const seconds = Math.floor(elapsedTime / 1000);  // Get total seconds
    const milliseconds = elapsedTime % 1000;  // Get the remaining milliseconds

    // Display real-time seconds and milliseconds
    document.getElementById("realTime").innerText = `Real Time: ${seconds}s ${milliseconds}ms`;
}

function shiftSimulation() {
    run.shift_call = true;
}

// Add event listeners for buttons
document.getElementById("shiftButton").addEventListener("click", shiftSimulation);
document.getElementById("startButton").addEventListener("click", startSimulation);

// Start the simulation update loop
setInterval(updateSimulation, updateInterval);
