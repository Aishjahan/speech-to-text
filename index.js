const speech = require('@google-cloud/speech');
const record = require('node-record-lpcm16');

// Initialize the Google Cloud client
const speechClient = new speech.SpeechClient();

// Configure the request for streaming recognition
const request = {
    config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
    },
    interimResults: true, // Get interim results from the API
};

// Create a recognize stream
const recognizeStream = speechClient.streamingRecognize(request)
    .on('error', console.error)
    .on('data', data => {
        console.log(data.results[0] && data.results[0].alternatives[0]
            ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
            : '\n\nReached transcription time limit, press Ctrl+C\n');
    });

// Start recording and send the microphone input to the Speech API
record
    .start({
        sampleRateHertz: 16000,
        threshold: 0, // Silence threshold
        verbose: false,
        recordProgram: 'rec', // Try also "arecord" or "sox"
    })
    .on('error', console.error)
    .pipe(recognizeStream);

console.log('Listening, press Ctrl+C to stop.');


