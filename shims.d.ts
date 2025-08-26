// Auto-generated. Do not edit.

/**
 * Voice Recognition Extension for micro:bit using Edge Impulse
 */

//% color=#0fbc11 icon="\uf130" block="Voice Recognition"
declare namespace VoiceRecognition {

    /**
     * Sampling frequency options
     */
    const enum SamplingFrequency {
        //% block="8000 Hz"
        Hz8000 = 8000,
        //% block="16000 Hz" 
        Hz16000 = 16000,
        //% block="22050 Hz"
        Hz22050 = 22050,
        //% block="44100 Hz"
        Hz44100 = 44100,
    }

    /**
     * Sampling duration options in milliseconds
     */
    const enum SamplingDuration {
        //% block="500ms"
        Ms500 = 500,
        //% block="1000ms"
        Ms1000 = 1000,
        //% block="1500ms"
        Ms1500 = 1500,
        //% block="2000ms"
        Ms2000 = 2000,
        //% block="3000ms"
        Ms3000 = 3000,
    }

    /**
     * Recognition result structure
     */
    //%
    class RecognitionResult {
        public keyword: string;
        public confidence: number;
        public processingTime: number;
        
        constructor(keyword: string, confidence: number, processingTime: number);
    }

    /**
     * Initialize the voice recognition system
     * Must be called before using other functions
     */
    //% block="initialize voice recognition"
    //% weight=100 shim=VoiceRecognition::initialize
    function initialize(): void;

    /**
     * Set the sampling frequency for audio capture
     * @param frequency the sampling frequency to use
     */
    //% block="set sampling frequency to %frequency"
    //% weight=90 shim=VoiceRecognition::setSamplingFrequency
    function setSamplingFrequency(frequency: SamplingFrequency): void;

    /**
     * Set the sampling duration for audio capture
     * @param duration the sampling duration in milliseconds
     */
    //% block="set sampling duration to %duration"
    //% weight=85 shim=VoiceRecognition::setSamplingDuration
    function setSamplingDuration(duration: SamplingDuration): void;

    /**
     * Start voice recognition and return the detected keyword
     * This is a blocking operation that will capture audio and process it
     */
    //% block="recognize voice"
    //% weight=80 shim=VoiceRecognition::recognizeVoice
    function recognizeVoice(): string;

    /**
     * Get the confidence score of the last recognition result
     */
    //% block="last recognition confidence"
    //% weight=70 shim=VoiceRecognition::getLastConfidence
    function getLastConfidence(): number;

    /**
     * Get the processing time of the last recognition
     */
    //% block="last processing time (ms)"
    //% weight=65 shim=VoiceRecognition::getLastProcessingTime
    function getLastProcessingTime(): number;

    /**
     * Check if a specific keyword was detected
     * @param keyword the keyword to check for
     */
    //% block="detected keyword is %keyword"
    //% weight=60 shim=VoiceRecognition::isKeywordDetected
    function isKeywordDetected(keyword: string): boolean;

    /**
     * Get the current sampling frequency
     */
    //% block="current sampling frequency"
    //% weight=50 shim=VoiceRecognition::getCurrentSamplingFrequency
    function getCurrentSamplingFrequency(): number;

    /**
     * Get the current sampling duration
     */
    //% block="current sampling duration"
    //% weight=45 shim=VoiceRecognition::getCurrentSamplingDuration
    function getCurrentSamplingDuration(): number;


}

// C++ function declarations - these match our wrapper implementation
declare function voiceRecognitionInit(): number;
declare function voiceRecognitionDeinit(): void;
declare function voiceRecognitionSetSamplingFreq(freq: number): void;
declare function voiceRecognitionSetSamplingDuration(duration: number): void;
declare function voiceRecognitionProcess(): number;
declare function voiceRecognitionGetLastLabel(): string;
declare function voiceRecognitionGetLastConfidence(): number;
declare function voiceRecognitionGetLastProcessingTime(): number;