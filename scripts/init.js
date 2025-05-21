document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('./assets/cars.json');
    cars = await response.json();
    generateSelectionScreen();
    addEventListeners();
});
