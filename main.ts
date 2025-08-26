/**
 * Main entry point for the Voice Recognition Extension
 * This file provides the primary API for users
 */

/**
 * Voice Recognition blocks for micro:bit
 */
//% weight=100 color=#0fbc11 icon="\uf130" block="Voice Recognition"
namespace voiceRecognition {
    
    let isSystemInitialized = false;
    
    /**
     * Initialize the voice recognition system
     * Call this once at the start of your program
     */
    //% block="setup voice recognition"
    //% weight=100
    export function setup(): void {
        if (!isSystemInitialized) {
            voiceRecognitionInit();
            isSystemInitialized = true;
        }
    }
    
    /**
     * Listen for voice commands and return the detected word
     * Returns empty string if no word is detected
     */
    //% block="listen for voice command"
    //% weight=90
    export function listen(): string {
        if (!isSystemInitialized) {
            setup();
        }
        return voiceRecognitionProcess() === 0 ? voiceRecognitionGetLastLabel() : "unknown";
    }
    
    /**
     * Check if a specific word was heard
     * @param word the word to check for
     */
    //% block="heard word %word"
    //% weight=80
    export function heardWord(word: string): boolean {
        let lastLabel = voiceRecognitionGetLastLabel();
        return lastLabel === word;
    }
    
    /**
     * Get how confident the system is about the last detection (0-100%)
     */
    //% block="confidence level"
    //% weight=70
    export function confidence(): number {
        return Math.round(voiceRecognitionGetLastConfidence() * 100);
    }
    
    /**
     * Set how long to listen for (in milliseconds)
     * @param duration listening duration
     */
    //% block="set listening time to %duration ms"
    //% weight=60
    //% duration.min=500 duration.max=3000 duration.defl=1000
    export function setListeningTime(duration: number): void {
        let clampedDuration = Math.max(500, Math.min(3000, duration));
        voiceRecognitionSetSamplingDuration(clampedDuration);
    }
    
    /**
     * Set the audio quality (higher = better quality but slower)
     * @param quality audio quality level
     */
    //% block="set audio quality to %quality"
    //% weight=50
    export function setAudioQuality(quality: AudioQuality): void {
        let frequency: number;
        
        switch (quality) {
            case AudioQuality.Low:
                frequency = 8000;
                break;
            case AudioQuality.Medium:
                frequency = 11000; // Optimal for our model
                break;
            case AudioQuality.High:
                frequency = 16000;
                break;
            case AudioQuality.VeryHigh:
                frequency = 22050;
                break;
            default:
                frequency = 11000; // Default to model's optimal frequency
        }
        
        voiceRecognitionSetSamplingFreq(frequency);
    }
}

/**
 * Audio quality options
 */
enum AudioQuality {
    //% block="low (fast)"
    Low = 1,
    //% block="medium (balanced)"
    Medium = 2,
    //% block="high (good)"
    High = 3,
    //% block="very high (slow)"
    VeryHigh = 4
}

/**
 * Advanced voice recognition functions
 */
//% weight=50 color=#0fbc11 icon="\uf085" block="Voice Recognition Advanced"
//% advanced=true
namespace voiceRecognitionAdvanced {
    
    /**
     * Get detailed information about the last recognition
     */
    //% block="processing time (ms)"
    //% weight=90
    export function processingTime(): number {
        return voiceRecognitionGetLastProcessingTime();
    }
    
    /**
     * Get current sampling frequency
     */
    //% block="current sample rate"
    //% weight=80
    export function sampleRate(): number {
        return 11000; // Fixed for our Edge Impulse model
    }
    
    /**
     * Get current listening duration
     */
    //% block="current listening duration"
    //% weight=70
    export function listeningDuration(): number {
        return 1000; // Fixed duration for our model
    }
    
    /**
     * Check if microbit keyword was detected
     */
    //% block="microbit detected"
    //% weight=60
    export function microbitDetected(): boolean {
        return voiceRecognitionGetLastLabel() === "microbit";
    }
    
    /**
     * Set exact sampling frequency (advanced users only)
     * @param frequency sampling frequency in Hz
     */
    //% block="set sample rate to %frequency Hz"
    //% weight=50
    //% frequency.min=8000 frequency.max=22050 frequency.defl=11000
    export function setSampleRate(frequency: number): void {
        voiceRecognitionSetSamplingFreq(frequency);
    }
    
    /**
     * Set exact listening duration (advanced users only)
     * @param duration duration in milliseconds
     */
    //% block="set exact duration to %duration ms"
    //% weight=40
    //% duration.min=500 duration.max=3000 duration.defl=1000
    export function setExactDuration(duration: number): void {
         voiceRecognitionSetSamplingDuration(duration);
     }
 }

// C++ function declarations
// These functions are implemented in the C++ wrapper
declare function voiceRecognitionInit(): number;
declare function voiceRecognitionDeinit(): void;
declare function voiceRecognitionSetSamplingFreq(freq: number): void;
declare function voiceRecognitionSetSamplingDuration(duration: number): void;
declare function voiceRecognitionProcess(): number;
declare function voiceRecognitionGetLastLabel(): string;
declare function voiceRecognitionGetLastConfidence(): number;
declare function voiceRecognitionGetLastProcessingTime(): number;