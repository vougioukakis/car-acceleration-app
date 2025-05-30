async function plotAndExportPDF() {
    const maxTime = 10;

    // Filter indices where time ≤ maxTime
    const indices = RUN.time.map((t, i) => (t <= maxTime ? i : -1)).filter(i => i !== -1);

    const x = indices.map(i => RUN.time[i]);
    const y1 = indices.map(i => RUN.speed[i] * 3.6);
    const y2 = indices.map(i => RUN.wheel_speed[i] * RUN.car.chassis.wheel_radius * 3.6);
    const slip = indices.map(i => RUN.slip_ratios[i]);

    const { jsPDF } = window.jspdf;

    // === Chart 1: Car vs. Wheel Speed ===
    const ctx1 = document.getElementById("chartCanvas").getContext("2d");
    const chart1 = new Chart(ctx1, {
        type: "line",
        data: {
            labels: x,
            datasets: [
                {
                    label: "Car speed (km/h)",
                    data: y1,
                    borderColor: "blue",
                    fill: false,
                },
                {
                    label: "Wheel speed (km/h)",
                    data: y2,
                    borderColor: "red",
                    fill: false,
                },
            ],
        },
        options: {
            responsive: false,
            plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Speed vs Wheel Speed" },
            },
        },
    });

    // === Chart 2: Slip Ratios ===
    const ctx2 = document.getElementById("slipCanvas").getContext("2d");
    const chart2 = new Chart(ctx2, {
        type: "line",
        data: {
            labels: x,
            datasets: [
                {
                    label: "Slip Ratio",
                    data: slip,
                    borderColor: "green",
                    fill: false,
                },
            ],
        },
        options: {
            responsive: false,
            plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Slip Ratio Over Time" },
            },
        },
    });

    // Wait for both charts to render
    await new Promise(r => setTimeout(r, 2000));

    // Convert both canvases to images
    const canvas1 = document.getElementById("chartCanvas");
    const canvas2 = document.getElementById("slipCanvas");
    const img1 = canvas1.toDataURL("image/png");
    const img2 = canvas2.toDataURL("image/png");

    // Create PDF with both charts
    const pdf = new jsPDF();
    pdf.addImage(img1, "PNG", 10, 10, 180, 130);
    pdf.addImage(img2, "PNG", 10, 150, 180, 100);
    pdf.save("charts.pdf");
}
