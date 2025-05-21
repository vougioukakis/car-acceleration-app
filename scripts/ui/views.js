function resetUI() {
    document.getElementById('gear').innerHTML = "N";
    document.getElementById('rpm').innerHTML = `&nbsp;`;
    document.getElementById('speed').innerHTML = 'Use the throttle to rev the car and click launch when ready!';
    document.getElementById('time').innerHTML = `&nbsp;`;
    document.getElementById('quarterMile').innerHTML = `&nbsp;`;
    document.getElementById('to_100km').innerHTML = `&nbsp;`;
    document.getElementById('state').innerHTML = `&nbsp;`;

    const overlay = document.getElementById('vignetteOverlay');
    const opacity = 0;
    overlay.style.opacity = opacity.toFixed(2);

}

function generateCarCard(carObj) {
    const card = document.createElement('div');
    card.classList.add('car-card');

    const image = document.createElement('img');
    image.src = `./assets/images/${carObj.make}/${carObj.name}.jpg`;
    image.alt = `${carObj.make} ${carObj.model}`;

    const title = document.createElement('h3');
    title.textContent = `${carObj.model}`;

    card.appendChild(image);
    card.appendChild(title);

    card.addEventListener('click', () => {
        window.location.hash = `simulation-${carObj.make}-${carObj.name}`;
    });

    return card;
}

/**
 *  Function to show the cars screen for the selected make
 *  */
function showCarsScreen(make) {
    console.log("Showing cars screen");

    const carSelectionScreen = document.querySelector('.carSelectionScreen');
    carSelectionScreen.innerHTML = '';

    const filteredCars = cars.filter(carObj => carObj.make === make);
    filteredCars.forEach(carObj => {
        const carCard = generateCarCard(carObj);
        carSelectionScreen.appendChild(carCard);
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
    makeImage.src = `./assets/images/${make}/logo.jpg`;
    makeImage.alt = `${make} logo`;

    const makeTitle = document.createElement('h3');
    makeTitle.textContent = make;

    makeCard.appendChild(makeImage);
    makeCard.appendChild(makeTitle);

    makeCard.addEventListener('click', () => window.location.hash = `cars-${make}`);

    return makeCard;
}


/*
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
*/