// router state
let selectedMake = null;
let selectedCar = null;

function showManufacturers() {
    updateAudioStatusUI();

    selectedMake = null;
    selectedCar = null;
    document.getElementById('tireSidebar').style.display = 'block';

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
    document.getElementById('tireSidebar').style.display = 'block';
    document.getElementById('manufacturersScreen').style.display = 'none';
    document.getElementById('carsScreen').style.display = 'block';
    document.getElementById('simulationScreen').style.display = 'none';
}

function showSimulation(CAR) {
    if (!CAR) {
        showCars(selectedMake);
        return;
    }

    selectedCar = CAR;
    updateAudioStatusUI();
    startSimulation(CAR);

    document.getElementById('tireSidebar').style.display = 'none';
    document.getElementById('manufacturersScreen').style.display = 'none';
    document.getElementById('carsScreen').style.display = 'none';
    document.getElementById('simulationScreen').style.display = 'block';
}

function router() {
    reset();
    const hash = window.location.hash.slice(1); // remove #

    if (!hash || hash === 'manufacturers') {
        showManufacturers();
        return;
    }

    // Example hash formats:
    // #cars-Toyota
    // #simulation-Toyota-Toyota_Corolla

    const parts = hash.split('-');

    if (parts[0] === 'cars' && parts[1]) {
        showCars(parts[1]);
    } else if (parts[0] === 'simulation' && parts[1] && parts[2]) {
        const carObj = cars.find(c => c.make === parts[1] && c.name === parts[2]);
        if (carObj && selectedMake) {
            showSimulation(carObj);
        } else {
            showManufacturers();

        }
    } else {
        showManufacturers();
    }

    // NOTE: if someone enters the car immediately from the address bar, we kept the selectedMake variable
    // undefined. if its found undefined, show manufacturers
}