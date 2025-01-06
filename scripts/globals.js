// simulation state
let car;
let run;
let started = false;
let isRevving = false;
let launched = false;
let previous_rpm = 0;

//sound
let soundStarted = false;
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let sourceNode; // To hold the audio source
let gainNode; // To control the volume of the audio
let basePlaybackRate; // The playback rate at the minimum RPM

// timing
const targetFps = 40;
let startTime = 0;
let lastTime = 0;
let timeAccumulator = 0;
const timePerTick = 1000 / targetFps; // = 25 ms when target FPS is 40
let deltaTime = 0;


