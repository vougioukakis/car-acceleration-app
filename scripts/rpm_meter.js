const minRPM = 1000;
let maxRPM;
let extendedMaxRPM;
let totalMarks;
const revFill = document.getElementById('revFill');
const rpmLabelsContainer = document.querySelector('.rpm-labels');


function initializeRevMeter() {
    maxRPM = run.car.engine.redline;
    extendedMaxRPM = maxRPM + 1000;
    totalMarks = extendedMaxRPM / 1000;
    rpmLabelsContainer.style.gap = `${500 / (totalMarks)}px`; // Space labels evenly
    // 500 is the container width.

    for (let i = 1; i <= totalMarks; i++) {
        const label = document.createElement('div');
        label.classList.add('rpm-label');
        label.textContent = i;
        rpmLabelsContainer.appendChild(label);
    }
}

function resetRevMeter() {
    revFill.style.width = '0%';
    revFill.style.backgroundColor = 'rgb(255, 255, 255)';
    rpmLabelsContainer.innerHTML = '';
}

/**
 * Updates the rev meter.
 * @param {number} currentRPM - The current RPM value.
 */
function updateRevDisplay(currentRPM) {
    if (currentRPM < minRPM) currentRPM = minRPM;
    if (currentRPM > extendedMaxRPM) currentRPM = extendedMaxRPM;

    const percentage = ((currentRPM - minRPM) / (extendedMaxRPM - minRPM)) * 100;
    revFill.style.width = `${percentage}%`;

    // Adjust color to become more red as RPM approaches redline
    const redIntensity = Math.min(255, Math.floor((currentRPM / maxRPM) * 255));
    const greenIntensity = Math.max(0, 255 - redIntensity);
    revFill.style.backgroundColor = `rgb(255, ${greenIntensity}, 0)`;
}