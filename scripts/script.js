let started = false;
let startTime = 0;
let lastTime = 0;
let timeAccumulator = 0;
const targetFps = 40;
const timePerTick = 1000 / targetFps; // = 25 ms when target FPS is 40
let deltaTime = 0;

console.log(run.time);
console.log(run.max_steps);
console.log(run.speed);
console.log(run.speed);

function startSimulation() {
    started = true;
    startTime = performance.now();  // store the current time when simulation starts
    lastTime = startTime;  // initialize last time for delta calculation
}

function updateSimulation() {
    if (!started) {
        return;
    }

    const currentTime = performance.now();

    deltaTime = currentTime - lastTime;
    timeAccumulator += deltaTime;

    // update the simulation based on delta time if enough time has passed
    while (timeAccumulator >= timePerTick) {
        run.simulate_step();
        timeAccumulator -= timePerTick;

        document.getElementById("rpm").innerText = `RPM: ${run.current_rpm}`;
        document.getElementById("speed").innerText = `Speed: ${run.current_speed * 3.6} km/h`;
        document.getElementById("time").innerText = `Time: ${run.current_seconds.toFixed(2)} s`;
    }

    // update the real time clock
    const elapsedTime = currentTime - startTime;
    const seconds = Math.floor(elapsedTime / 1000);
    const milliseconds = elapsedTime % 1000
    document.getElementById("realTime").innerText = `Real Time: ${seconds}s ${milliseconds}ms`;

    // save the current time as last time for next frame
    lastTime = currentTime;
}

function shiftSimulation() {
    run.shift_call = true;
}

document.getElementById("shiftButton").addEventListener("click", shiftSimulation);
document.getElementById("startButton").addEventListener("click", startSimulation);

function gameLoop() {
    updateSimulation();
    requestAnimationFrame(gameLoop);  // this calls gameLoop recursively and adjusts to the frame rate
}

requestAnimationFrame(gameLoop);
