function resetUI() {
    document.getElementById('gear').innerHTML = "N";
    document.getElementById('rpm').innerHTML = `&nbsp;`;
    document.getElementById('speed').innerHTML = '0';
    document.getElementById('time').innerHTML = `&nbsp;`;
    document.getElementById('quarterMile').innerHTML = `&nbsp;`;
    document.getElementById('to_100km').innerHTML = `&nbsp;`;
    document.getElementById('state').innerHTML = `&nbsp;`;

    const overlay = document.getElementById('vignetteOverlay');
    const opacity = 0;
    overlay.style.opacity = opacity.toFixed(2);
    document.getElementById("startButton").style.display = 'block';
    document.getElementById("throttle").style.display = 'block';
    document.getElementById("shiftButton").style.display = 'none';


    resetRevMeter();

}

function animate() {
    const div = document.getElementById("animated");
    let scale;
    if (RUN.shifting) {
        scale = 1;
    } else {
        const clampedAccel = Math.min(RUN.accel, 1.7);
        scale = 0.95 - 0.2 * (clampedAccel ** 1.7);
    }
    const jitterRange = RUN.current_speed * 3.6 / 50; // max pixels in any direction
    const jitterX = (Math.random() - 0.5) * 2 * jitterRange;
    const jitterY = (Math.random() - 0.5) * 2 * jitterRange;

    div.style.transform = `scale(${scale}) translate(${jitterX}px, ${jitterY}px)`;

    const overlay = document.getElementById('vignetteOverlay');

    const clampedSpeed = Math.min(RUN.current_speed, 300);
    const opacity = clampedSpeed / 300;

    overlay.style.opacity = opacity.toFixed(2);
}

function generateCarCard(car) {
    const card = document.createElement('div');
    card.className = 'car-card';

    card.innerHTML = `
      <img src="./assets/images/${car.make}/${car.name}.jpg" alt="${car.make} ${car.model}" />
      <h3>${car.model}</h3>
    `;

    card.onclick = async () => {
        // trying this to fix safari ios sound not starting issue
        if (AUDIO_CONTEXT.state === 'suspended') {
            await AUDIO_CONTEXT.resume();
            console.log('AUDIO_CONTEXT resumed after user interaction');
        }

        window.location.hash = `simulation-${car.make}-${car.name}`;
    };

    card.setAttribute('tabindex', '0');

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
    const uniqueMakes = [...new Set(cars.map(carObj => carObj.make))].sort();
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
    makeCard.className = 'make-card';

    makeCard.innerHTML = `
      <img src="./assets/images/${make}/logo.jpg" alt="${make} logo" />
      <h3>${make}</h3>
    `;

    makeCard.onclick = () => {
        window.location.hash = `cars-${make}`;
    };

    makeCard.setAttribute('tabindex', '0');
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