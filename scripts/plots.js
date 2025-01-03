
let N_values = [];
let torque_values = [];
for (let N = run.car.engine.idle_RPM; N <= run.car.engine.redline; N += 100) {
    N_values.push(N);
    torque_values.push(run.car.torque(N));
}

// Create the chart using Chart.js
const ctx = document.getElementById('torqueChart').getContext('2d');
const torqueChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: N_values,  // X-axis: RPM values
        datasets: [{
            label: 'Torque vs RPM',
            data: torque_values,  // Y-axis: corresponding torque values
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'RPM'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Torque (Nm)'
                },
                min: 0,
                max: run.car.engine.max_torque + 20  // Optionally set the maximum torque for the chart
            }
        }
    }
});