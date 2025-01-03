const needle = document.querySelector('.needle');
const dialMarks = document.querySelector('.dial-marks');
let maxRPM;
const minRPM = 1000;

function initializeNeedle() {
    maxRPM = run.car.engine.redline; // Replace with actual maxRPM value

    const totalMarks = 10; // Adjust for finer granularity
    const step = (maxRPM - minRPM + 1000) / totalMarks;

    for (let i = 0; i <= totalMarks; i++) {
        const mark = document.createElement('div');
        mark.className = 'mark';

        // Calculate rotation for each mark
        const rotation = 135 + (i / totalMarks) * 270; // Adjusted to start at 135°

        // Set the rotation and position of the mark
        mark.style.transform = `rotate(${rotation}deg) translate(0, -70px)`;
        mark.style.left = '50%';
        mark.style.top = '50%';
        mark.style.transformOrigin = 'center 70px';

        // Optionally, add labels
        const label = document.createElement('div');
        label.textContent = Math.round(minRPM + i * step);
        label.style.position = 'absolute';
        label.style.transform = 'translate(-50%, -50%)';
        label.style.fontSize = '12px';
        label.style.color = '#333';
        mark.appendChild(label);

        dialMarks.appendChild(mark);
    }
}

function updateNeedle(rpm) {
    if (rpm < minRPM || rpm > maxRPM + 1000) return;
    const angle = ((rpm - minRPM) / (maxRPM + 1000 - minRPM)) * 270; // Map to 270-degree range
    needle.style.transform = `translate(-50%, -100%) rotate(${angle + 200}deg)`;
}

// Call initializeNeedle during page load or after `run.car.engine.redline` is set.
initializeNeedle();
