/**
 * C++ binding file for Voice Recognition Extension
 * This file exposes the EdgeImpulseWrapper functions to MakeCode TypeScript
 */

#include "pxt.h"
#include "edge-impulse-wrapper.h"

using namespace pxt;

// Global wrapper instance
static EdgeImpulseWrapper* g_wrapper = nullptr;

/**
 * Initialize the voice recognition system
 * Returns 0 on success, -1 on failure
 */
//% 
int voiceRecognitionInit() {
    if (g_wrapper == nullptr) {
        g_wrapper = new EdgeImpulseWrapper();
    }
    
    if (g_wrapper != nullptr) {
        bool success = g_wrapper->initialize();
        return success ? 0 : -1;
    }
    
    return -1;
}

/**
 * Deinitialize the voice recognition system
 */
//% 
void voiceRecognitionDeinit() {
    if (g_wrapper != nullptr) {
        g_wrapper->deinitialize();
        delete g_wrapper;
        g_wrapper = nullptr;
    }
}

/**
 * Set sampling frequency
 * @param freq sampling frequency in Hz
 */
//% 
void voiceRecognitionSetSamplingFreq(int freq) {
    if (g_wrapper != nullptr) {
        g_wrapper->setSamplingFrequency(freq);
    }
}

/**
 * Set sampling duration
 * @param duration sampling duration in milliseconds
 */
//% 
void voiceRecognitionSetSamplingDuration(int duration) {
    if (g_wrapper != nullptr) {
        g_wrapper->setSamplingDuration(duration);
    }
}

/**
 * Process audio and run voice recognition
 * Returns 0 on success, -1 on failure
 */
//% 
int voiceRecognitionProcess() {
    if (g_wrapper == nullptr) {
        return -1;
    }
    
    RecognitionResult result = g_wrapper->processAudio();
    
    // Return 0 if recognition was successful (any result obtained)
    return (result.processingTimeMs >= 0) ? 0 : -1;
}

/**
 * Get the last recognized label
 * Returns the detected keyword as a string
 */
//% 
String voiceRecognitionGetLastLabel() {
    if (g_wrapper == nullptr) {
        return mkString("unknown");
    }
    
    RecognitionResult result = g_wrapper->getLastResult();
    return mkString(result.label.c_str());
}

/**
 * Get the confidence of the last recognition
 * Returns confidence as a float between 0.0 and 1.0
 */
//% 
TNumber voiceRecognitionGetLastConfidence() {
    if (g_wrapper == nullptr) {
        return fromDouble(0.0);
    }
    
    RecognitionResult result = g_wrapper->getLastResult();
    return fromDouble(result.confidence);
}

/**
 * Get the processing time of the last recognition
 * Returns processing time in milliseconds
 */
//% 
TNumber voiceRecognitionGetLastProcessingTime() {
    if (g_wrapper == nullptr) {
        return fromInt(0);
    }
    
    RecognitionResult result = g_wrapper->getLastResult();
    return fromInt(result.processingTimeMs);
}

// Register the functions with the MakeCode runtime
namespace VoiceRecognitionBinding {
    //%
    void init() {
        // This function is called when the extension is loaded
        // Any initialization code can go here
    }
}