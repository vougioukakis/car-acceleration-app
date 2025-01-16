//TODO: refactor this file
let throttleButton = document.getElementById("throttle");

function generateCarCard(carObj) {
    const card = document.createElement('div');
    card.classList.add('car-card');

    const image = document.createElement('img');
    image.src = `images/${carObj.make}/${carObj.name}.jpg`;
    image.alt = `${carObj.make} ${carObj.model}`;
    image.style.width = '200px';
    image.style.height = '160px';
    image.style.objectFit = 'cover';

    const title = document.createElement('h3');
    title.textContent = `${carObj.model}`;

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
        const makeCard = generateMakeCard(make);
        selectionScreen.appendChild(makeCard);
    });
}

/** generate a make card */
function generateMakeCard(make) {
    const makeCard = document.createElement('div');
    makeCard.classList.add('make-card');

    const makeImage = document.createElement('img');
    makeImage.src = `images/${make}/logo.jpg`;
    makeImage.alt = `${make} logo`;
    makeImage.style.width = '200px';
    makeImage.style.height = '160px';
    makeImage.style.objectFit = 'cover';

    const makeTitle = document.createElement('h3');
    makeTitle.textContent = make;

    makeCard.appendChild(makeImage);
    makeCard.appendChild(makeTitle);

    makeCard.addEventListener('click', () => showCarsScreen(make));

    return makeCard;
}
/**
 * 
 *  */
function showSimulationScreen(carObj) {
    console.log("START SIMULATION");
    try {

        document.getElementById('carsScreen').style.display = 'none';
        document.getElementById('simulationScreen').style.display = 'block';

        console.log('defining car...');
        car = new Car(carObj.name);
        console.log('defined car');
        console.log('defining run...');
        run = new Run(car, true);
        console.log('defined run');
        resetPlot();
        console.log('resetted plot');
        startSimulation();
        requestAnimationFrame(gameLoop);
        plotTorque();
        initializeRevMeter();
        addEventListenerForThrottle();

        document.getElementById('backToCars').addEventListener('click', () => {
            document.getElementById('simulationScreen').style.display = 'none';
            document.getElementById('carsScreen').style.display = 'block';
            resetSimulation();
            resetRevMeter();
            removeEventListenersForThrottle();
        });
    } catch (error) {
        console.error('Error in startSimulation:', error);
    }
}

function resetSimulation() {
    started = false;
    launched = false;
    run = null;
    car = null;
    if (sourceNode) {
        sourceNode.stop();
        sourceNode = null;
        soundStarted = false;
    }

    document.getElementById('rpm').innerHTML = `&nbsp;`;
    document.getElementById('speed').innerHTML = 'Use the throttle to rev the car and click launch when ready!';
    document.getElementById('time').innerHTML = `&nbsp;`;
    document.getElementById('quarterMile').innerHTML = `&nbsp;`;
    document.getElementById('to_100km').innerHTML = `&nbsp;`;
    document.getElementById('state').innerHTML = `&nbsp;`;
    //document.getElementById('realTime').innerHTML = '';
}

function addEventListenerForThrottle() {
    window.addEventListener("keydown", handleThrottlePress);
    window.addEventListener("keyup", handleThrottleRelease);

    throttleButton.addEventListener("mousedown", handleThrottlePressButton);
    throttleButton.addEventListener("mouseup", handleThrottleReleaseButton);
    throttleButton.addEventListener("mouseleave", handleThrottleReleaseButton);
    // add touchstart touchend and touchcancel
    throttleButton.addEventListener("touchstart", handleThrottlePressButton);
    throttleButton.addEventListener("touchend", handleThrottleReleaseButton);
    throttleButton.addEventListener("touchcancel", handleThrottleReleaseButton);
}

function removeEventListenersForThrottle() {
    window.removeEventListener("keydown", handleThrottlePress);
    window.removeEventListener("keyup", handleThrottleRelease);

    throttleButton.removeEventListener("mousedown", handleThrottlePressButton);
    throttleButton.removeEventListener("mouseup", handleThrottleReleaseButton);
    throttleButton.removeEventListener("mouseleave", handleThrottleReleaseButton);

    throttleButton.removeEventListener("touchstart", handleThrottlePressButton);
    throttleButton.removeEventListener("touchend", handleThrottleReleaseButton);
    throttleButton.removeEventListener("touchcancel", handleThrottleReleaseButton);
}
// Initialize the manufacturers screen
generateSelectionScreen();