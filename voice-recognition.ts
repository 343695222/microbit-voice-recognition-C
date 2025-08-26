/**
 * Voice Recognition Extension for micro:bit using Edge Impulse
 * Provides voice recognition capabilities with configurable sampling parameters
 */

//% color=#0fbc11 icon="\uf130" block="Voice Recognition"
namespace VoiceRecognition {
    
    /**
     * Sampling frequency options
     */
    export enum SamplingFrequency {
        //% block="8000 Hz"
        Hz8000 = 8000,
        //% block="16000 Hz" 
        Hz16000 = 16000,
        //% block="22050 Hz"
        Hz22050 = 22050,
        //% block="44100 Hz"
        Hz44100 = 44100
    }

    /**
     * Sampling duration options in milliseconds
     */
    export enum SamplingDuration {
        //% block="500ms"
        Ms500 = 500,
        //% block="1000ms"
        Ms1000 = 1000,
        //% block="1500ms"
        Ms1500 = 1500,
        //% block="2000ms"
        Ms2000 = 2000,
        //% block="3000ms"
        Ms3000 = 3000
    }

    /**
     * Recognition result structure
     */
    export class RecognitionResult {
        public keyword: string;
        public confidence: number;
        public processingTime: number;
        
        constructor(keyword: string, confidence: number, processingTime: number) {
            this.keyword = keyword;
            this.confidence = confidence;
            this.processingTime = processingTime;
        }
    }

    let currentSamplingFreq: number = 16000;
    let currentSamplingDuration: number = 1000;
    let isInitialized: boolean = false;
    let audioBuffer: number[] = [];
    let lastRecognitionResult: RecognitionResult = null;

    /**
     * Initialize the voice recognition system
     * Must be called before using other functions
     */
    //% block="initialize voice recognition"
    //% weight=100
    export function initialize(): void {
        let result = voiceRecognitionInit();
        isInitialized = (result === 0);
        if (isInitialized) {
            basic.showIcon(IconNames.Yes);
        } else {
            basic.showIcon(IconNames.No);
        }
    }

    /**
     * Set the sampling frequency for audio capture
     * @param frequency the sampling frequency to use
     */
    //% block="set sampling frequency to %frequency"
    //% weight=90
    export function setSamplingFrequency(frequency: SamplingFrequency): void {
        currentSamplingFreq = frequency;
        voiceRecognitionSetSamplingFreq(frequency);
    }

    /**
     * Set the sampling duration for audio capture
     * @param duration the sampling duration in milliseconds
     */
    //% block="set sampling duration to %duration"
    //% weight=85
    export function setSamplingDuration(duration: SamplingDuration): void {
        currentSamplingDuration = duration;
        voiceRecognitionSetSamplingDuration(duration);
    }

    /**
     * Start voice recognition and return the detected keyword
     * This is a blocking operation that will capture audio and process it
     */
    //% block="recognize voice"
    //% weight=80
    export function recognizeVoice(): string {
        if (!isInitialized) {
            basic.showString("INIT");
            return "";
        }
        
        basic.showIcon(IconNames.Ear);
        
        // Process audio with voice recognition
        let processResult = voiceRecognitionProcess();
        
        if (processResult === 0) {
            // Get recognition results
            let keyword = voiceRecognitionGetLastLabel();
            let confidence = voiceRecognitionGetLastConfidence();
            let processingTime = voiceRecognitionGetLastProcessingTime();
            
            lastRecognitionResult = new RecognitionResult(keyword, confidence, processingTime);
            basic.showString(keyword);
            return keyword;
        }
        
        basic.showIcon(IconNames.No);
        return "";
    }

    /**
     * Get the confidence score of the last recognition result
     */
    //% block="last recognition confidence"
    //% weight=70
    export function getLastConfidence(): number {
        if (lastRecognitionResult) {
            return Math.round(lastRecognitionResult.confidence * 100);
        }
        return 0;
    }

    /**
     * Get the processing time of the last recognition
     */
    //% block="last processing time (ms)"
    //% weight=65
    export function getLastProcessingTime(): number {
        if (lastRecognitionResult) {
            return lastRecognitionResult.processingTime;
        }
        return 0;
    }

    /**
     * Check if a specific keyword was detected
     * @param keyword the keyword to check for
     */
    //% block="detected keyword is %keyword"
    //% weight=60
    export function isKeywordDetected(keyword: string): boolean {
        if (lastRecognitionResult) {
            return lastRecognitionResult.keyword === keyword;
        }
        return false;
    }

    /**
     * Get the current sampling frequency
     */
    //% block="current sampling frequency"
    //% weight=50
    export function getCurrentSamplingFrequency(): number {
        return currentSamplingFreq;
    }

    /**
     * Get the current sampling duration
     */
    //% block="current sampling duration"
    //% weight=45
    export function getCurrentSamplingDuration(): number {
        return currentSamplingDuration;
    }



    // C++ function declarations (implemented in voice-recognition-binding.cpp)
    declare function voiceRecognitionInit(): number;
    declare function voiceRecognitionDeinit(): void;
    declare function voiceRecognitionSetSamplingFreq(freq: number): void;
    declare function voiceRecognitionSetSamplingDuration(duration: number): void;
    declare function voiceRecognitionProcess(): number;
    declare function voiceRecognitionGetLastLabel(): string;
    declare function voiceRecognitionGetLastConfidence(): number;
    declare function voiceRecognitionGetLastProcessingTime(): number;
}