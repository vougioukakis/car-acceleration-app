/**
 *  */
function generateCarCard(carObj) {
    const card = document.createElement('div');
    card.classList.add('car-card');

    const image = document.createElement('img');
    image.src = `../images/${carObj.make}/${carObj.name}.jpg`;
    image.alt = `${carObj.make} ${carObj.model}`;
    image.style.width = '200px';
    image.style.height = '160px';
    image.style.objectFit = 'cover';

    const title = document.createElement('h3');
    title.textContent = `${carObj.make} ${carObj.model}`;

    card.appendChild(image);
    card.appendChild(title);

    card.addEventListener('click', () => {
        console.log('Card clicked:', carObj);
        console.log('Test');
        showSimulationScreen(carObj);
    });

    return card;
}

/**
 *  Function to show the cars screen for the selected make
 *  */
function showCarsScreen(make) {
    console.log("Showing cars screen");
    document.getElementById('manufacturersScreen').style.display = 'none';
    const carsScreen = document.getElementById('carsScreen');
    carsScreen.style.display = 'block';

    const carSelectionScreen = document.querySelector('.carSelectionScreen');
    carSelectionScreen.innerHTML = '';

    const filteredCars = cars.filter(carObj => carObj.make === make);
    filteredCars.forEach(carObj => {
        const carCard = generateCarCard(carObj);
        carSelectionScreen.appendChild(carCard);
    });

    // add back to manufacturers button functionality
    document.getElementById('backToManufacturers').addEventListener('click', () => {
        carsScreen.style.display = 'none';
        document.getElementById('manufacturersScreen').style.display = 'block';
    });
}

/**
 * Function to generate the selection screen with car make cards.
 *  
 * */
function generateSelectionScreen() {
    const uniqueMakes = [...new Set(cars.map(carObj => carObj.make))];
    const selectionScreen = document.querySelector('.selectionScreen');
    selectionScreen.innerHTML = '';

    uniqueMakes.forEach(make => {
        const makeCard = document.createElement('div');
        makeCard.classList.add('make-card');

        const makeImage = document.createElement('img');
        makeImage.src = `../images/${make}/logo.jpg`;
        makeImage.alt = `${make} logo`;
        makeImage.style.width = '200px';
        makeImage.style.height = '160px';
        makeImage.style.objectFit = 'cover';

        const makeTitle = document.createElement('h3');
        makeTitle.textContent = make;

        makeCard.appendChild(makeImage);
        makeCard.appendChild(makeTitle);

        makeCard.addEventListener('click', () => showCarsScreen(make));

        selectionScreen.appendChild(makeCard);
    });
}

/**
 * 
 *  */
function showSimulationScreen(carObj) {
    console.log("START SIMULATION");
    try {

        document.getElementById('carsScreen').style.display = 'none';
        document.getElementById('simulationScreen').style.display = 'block';

        car = new Car(carObj.name);
        run = new Run(car, true);
        console.log(run.car.engine.redline);
        resetPlot();
        plotTorque();

        document.getElementById('backToCars').addEventListener('click', () => {
            document.getElementById('simulationScreen').style.display = 'none';
            document.getElementById('carsScreen').style.display = 'block';
            resetSimulation();
            resetRevMeter();
        });
    } catch (error) {
        console.error('Error in startSimulation:', error);
    }
}

function resetSimulation() {
    started = false;
    run = null;
    car = null;

    document.getElementById('rpm').innerHTML = '';
    document.getElementById('speed').innerHTML = '';
    document.getElementById('time').innerHTML = '';
    document.getElementById('realTime').innerHTML = '';
}

// Initialize the manufacturers screen
generateSelectionScreen();