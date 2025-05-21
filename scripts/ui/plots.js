const ctx = document.getElementById('torqueChart').getContext('2d');
let torqueChart;

// FIXME: Controls not aligned when i disable plot?
function plotTorque() {
    console.log("plotting torque for " + RUN.car.name);
    let N_values = [];
    let torque_values = [];
    for (let N = RUN.car.engine.idle_RPM; N <= RUN.car.engine.redline; N += 100) {
        N_values.push(N);
        torque_values.push(RUN.car.torque(N));
    }

    // Create the chart using Chart.js
    console.log(ctx);
    torqueChart = new Chart(ctx, {
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
            }, {
                label: 'Horsepower vs RPM',
                data: N_values.map((rpm, index) => (torque_values[index] * rpm / 7127)),  // Calculate HP from torque and RPM
                borderColor: 'rgba(255, 99, 132, 1)',  // Different color for horsepower
                backgroundColor: 'rgba(255, 99, 132, 0.2)',  // Same background color for consistency
                fill: true,  // Do not fill the area under the horsepower curve
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
                        text: 'Torque (Nm) / Horsepower (HP)'
                    },
                    min: 0,
                    max: Math.max(RUN.car.engine.max_torque + 20, Math.max(...torque_values))  // Adjust max y-value for torque and horsepower
                }
            }
        }
    });
}

function resetPlot() {
    if (typeof torqueChart !== 'undefined') torqueChart.destroy();
}