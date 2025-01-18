const minRPM = 1000;
let maxRPM;
let extendedMaxRPM;
let totalMarks;
const revFill = document.getElementById('revFill');
const rpmLabelsContainer = document.querySelector('.rpm-labels');
let shift_points;
let perfect_shift_indicator = document.createElement('div');



// [x] TODO: Add perfect shift indicator
// TODO: Add perfect launch indicator - at max torque revs for each car. Look at TODO in the cars.js first
// [x] FIXME: Left side of rpm filling bar has corners, make them rounded.

function initializeRevMeter() {
    shift_points = run.get_shift_points();
    console.log('got shift points: ' + shift_points);
    maxRPM = run.car.engine.redline;
    extendedMaxRPM = maxRPM + (1000 - maxRPM % 1000);
    totalMarks = extendedMaxRPM / 1000;
    console.log('marks', totalMarks);
    console.log('extended', extendedMaxRPM);


    const redline = document.createElement('div');
    redline.classList.add('redline');
    redline.style.left = `calc(${(((maxRPM - minRPM) / (extendedMaxRPM - minRPM) * 100))}% - 5px)`;
    document.getElementById('revMeter').appendChild(redline);
    for (let i = 1; i <= totalMarks; i++) {
        const label = document.createElement('div');
        label.classList.add('rpm-label');
        label.textContent = i;
        rpmLabelsContainer.appendChild(label);
    }

    perfect_shift_indicator.classList.add('perfect-shift-indicator');
    perfect_shift_indicator.style.visibility = 'hidden';
}

function resetRevMeter() {
    revFill.style.width = '0%';
    revFill.style.backgroundColor = 'rgb(255, 255, 255)';
    rpmLabelsContainer.innerHTML = '';

    if (document.getElementsByClassName('redline').length > 0) {
        document.getElementsByClassName('redline')[0].remove();
    }
}

/**
 * Updates the rev meter.
 * @param {number} currentRPM - The current RPM value.
 */
function updateRevDisplay(currentRPM, currentGear) {
    if (currentRPM < minRPM) currentRPM = minRPM;
    if (currentRPM > extendedMaxRPM) currentRPM = extendedMaxRPM;

    const percentage = ((currentRPM - minRPM) / (extendedMaxRPM - minRPM)) * 100;
    revFill.style.width = `${percentage}%`;

    // Adjust color to become more red as RPM approaches redline
    const redIntensity = Math.min(255, Math.floor((currentRPM / maxRPM) * 255));
    const greenIntensity = Math.max(0, 255 - redIntensity);
    revFill.style.backgroundColor = `rgb(255, ${greenIntensity}, 0)`;

    // perfect shift indicator
    if (shift_points[currentGear]) {
        console.log('drawing perfect shift indicator');
        perfect_shift_indicator.style.visibility = 'visible';
        perfect_shift_indicator.style.left = `calc(${(((shift_points[currentGear] - minRPM) / (extendedMaxRPM - minRPM) * 100))}% - 10px)`;
        document.getElementById('revMeter').appendChild(perfect_shift_indicator);
    } else {
        if (!(perfect_shift_indicator.style.visibility === 'hidden')) {
            perfect_shift_indicator.style.visibility = 'hidden';
        }
    }

}