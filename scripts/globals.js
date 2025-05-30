// simulation state
let CAR;
let RUN;
let STARTED = false;
let IS_REVVING = false;
let LAUNCHED = false;

//sound
let SOUND_STARTED = false;
const AUDIO_CONTEXT = new (window.AudioContext || window.webkitAudioContext)();
let SOURCE_NODE; // hold the audio source
let GAIN_NODE; // control the volume of the audio
let BASE_PLAYBACK_RATE; // playback rate at the minimum RPM
let PREVIOUS_RPM = 0;
let PREVIOUS_RPM_GEARBOX = 0;

let BLOW_OFF_BUFFER;
let BLOW_OFF_SOURCE_NODE;
let BLOW_OFF_GAIN_NODE;

let GEAR_OSCILLATOR;
let GEAR_GAIN_NODE;


// timing
const TARGET_FPS = 1000;
let START_TIME = 0;
let LAST_TIME = 0;
let TIME_ACCUMULATOR = 0;
const TIME_PER_TICK = 1000 / TARGET_FPS; // = 25 ms when target FPS is 40
let DELTA_TIME = 0;



// data
let cars;
let SELECTED_TIRE = '1.4';
let TC_OPTION = 'ON';
let UNIT_OPTION = 'ON'; //kmh on or off
function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

const IS_MOBILE = isMobileDevice();
// summer tires": 1.1
// high performance sports tires ": 1.4
// drag slicks ": 2.0
// top fuel drag slick ": 4.5
// lsd adds 0.1

//mclaren p1": 600kg at 257kmh
//m3 e92 downforce target": -33kg at 200kmh

//brians supra tires //255/30/19
//agera rs: //for wing on,485kg at 250kmh use 0.98,

//bmw z4 gt3 all final drives // all options": 3.458, 3.615, 3.917, 3.977, 4.087, 4.273, 4.476
//bmw m3 gtr // all options": 3.458, 3.615, 3.917, 3.977, 4.087, 4.273, 4.476