let selectedMake = null;
let selectedCar = null;

function showManufacturers() {
    selectedMake = null;
    selectedCar = null;
    document.getElementById('manufacturersScreen').style.display = 'block';
    document.getElementById('carsScreen').style.display = 'none';
    document.getElementById('simulationScreen').style.display = 'none';
}

function showCars(make) {
    if (!make) {
        showManufacturers();
        return;
    }
    selectedMake = make;
    selectedCar = null;

    // call your existing function to generate car cards for this make
    showCarsScreen(make);

    document.getElementById('manufacturersScreen').style.display = 'none';
    document.getElementById('carsScreen').style.display = 'block';
    document.getElementById('simulationScreen').style.display = 'none';
}

function showSimulation(car) {
    if (!car) {
        showCars(selectedMake);
        return;
    }
    selectedCar = car;

    // call your existing simulation function
    showSimulationScreen(car);

    document.getElementById('manufacturersScreen').style.display = 'none';
    document.getElementById('carsScreen').style.display = 'none';
    document.getElementById('simulationScreen').style.display = 'block';
}

function router() {
    const hash = window.location.hash.slice(1); // remove #

    if (!hash || hash === 'manufacturers') {
        showManufacturers();
        return;
    }

    // every time, reset stuff
    resetSimulation();
    resetRevMeter();
    removeEventListenersForThrottle();
    // Example hash formats:
    // #cars-Toyota
    // #simulation-Toyota-Corolla

    const parts = hash.split('-');

    if (parts[0] === 'cars' && parts[1]) {
        showCars(parts[1]);
    } else if (parts[0] === 'simulation' && parts[1] && parts[2]) {
        const carObj = cars.find(c => c.make === parts[1] && c.name === parts[2]);
        if (carObj) {
            selectedMake = parts[1];
            showSimulation(carObj);
        } else {
            showManufacturers();
        }
    } else {
        showManufacturers();
    }
}

// Listen for URL hash changes
window.addEventListener('hashchange', router);

// On initial load
window.addEventListener('load', router);
