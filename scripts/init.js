document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('./assets/cars.json');
    cars = await response.json();
    generateSelectionScreen();
    router();
    addEventListeners();
    window.addEventListener('hashchange', router);
    window.addEventListener('load', router);
});
