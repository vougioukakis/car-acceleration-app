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
const TARGET_FPS = 40;
let START_TIME = 0;
let LAST_TIME = 0;
let TIME_ACCUMULATOR = 0;
const TIME_PER_TICK = 1000 / TARGET_FPS; // = 25 ms when target FPS is 40
let DELTA_TIME = 0;


