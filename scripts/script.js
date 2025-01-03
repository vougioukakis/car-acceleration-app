// Interval in milliseconds for throttling (40 FPS -> 1000ms / 40 = 25ms)
const updateInterval = 25;
//every 29 ms call one simulation step. the simulation is made to run 30 times a second!
let started = false;

console.log(run.time);
console.log(run.max_steps);
console.log(run.speed);
console.log(run.speed);

function startSimulation() {
    started = true;
}

function updateSimulation() {
    if (!started) {
        return;
    }
    run.simulate_step();
    //update the html elements with rpm speed and time
    document.getElementById("rpm").innerText = `RPM: ${run.current_rpm}`;
    document.getElementById("speed").innerText = `Speed: ${run.current_speed * 3.6} km/h`;
    document.getElementById("time").innerText = `Time: ${run.current_seconds} s`;
}

function shiftSimulation() {
    run.shift_call = true;
}

// Add event listeners for buttons
document.getElementById("shiftButton").addEventListener("click", shiftSimulation);
document.getElementById("startButton").addEventListener("click", startSimulation);

// Start the simulation update loop
setInterval(updateSimulation, updateInterval);