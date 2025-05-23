async function plotAndExportPDF() {
    const maxTime = 10;

    // Filter indices where time ≤ 5 seconds
    const indices = RUN.time.map((t, i) => (t <= maxTime ? i : -1)).filter(i => i !== -1);

    // Subset the data arrays
    const x = indices.map(i => RUN.time[i]);
    const y1 = indices.map(i => RUN.speed[i] * 3.6);
    const y2 = indices.map(i => RUN.wheel_speed[i] * RUN.car.chassis.wheel_radius * 3.6);
    // Wait for jsPDF to load
    const { jsPDF } = window.jspdf;

    // Create the chart
    const ctx = document.getElementById("chartCanvas").getContext("2d");
    const chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: x,
            datasets: [
                {
                    label: "Dataset 1",
                    data: y1,
                    borderColor: "blue",
                    fill: false,
                },
                {
                    label: "Dataset 2",
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
                title: { display: true, text: "Chart Export Example" },
            },
        },
    });

    // Wait a moment to let the chart render
    await new Promise(r => setTimeout(r, 2000));

    // Convert canvas to image
    const canvas = document.getElementById("chartCanvas");
    const imgData = canvas.toDataURL("image/png");

    // Create and save the PDF
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 180, 90);
    pdf.save("chart.pdf");
}
