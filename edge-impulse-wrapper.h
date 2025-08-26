#ifndef EDGE_IMPULSE_WRAPPER_H
#define EDGE_IMPULSE_WRAPPER_H

#include <stdint.h>
#include <string.h>
#include <cstdlib>
#include <cstring>
#include <vector>
#include <string>
#include <chrono>
#include <thread>

// Configuration constants
#define DEFAULT_SAMPLING_FREQUENCY 16000
#define DEFAULT_SAMPLING_DURATION_MS 1000
#define MAX_AUDIO_BUFFER_SIZE 48000  // 3 seconds at 16kHz
#define FEATURE_BUFFER_SIZE 1024

// Recognition result structure
struct RecognitionResult {
    std::string keyword;
    float confidence;
    int processingTimeMs;
    
    RecognitionResult() : keyword(""), confidence(0.0f), processingTimeMs(0) {}
    RecognitionResult(const std::string& kw, float conf, int time) 
        : keyword(kw), confidence(conf), processingTimeMs(time) {}
};

// Audio configuration structure
struct AudioConfig {
    int samplingFrequency;
    int samplingDurationMs;
    int bufferSize;
    
    AudioConfig() : samplingFrequency(DEFAULT_SAMPLING_FREQUENCY), 
                   samplingDurationMs(DEFAULT_SAMPLING_DURATION_MS),
                   bufferSize(DEFAULT_SAMPLING_FREQUENCY * DEFAULT_SAMPLING_DURATION_MS / 1000) {}
};

// Main wrapper class for Edge Impulse integration
class EdgeImpulseWrapper {
public:
    // Signal callback for Edge Impulse (needs to be public for external access)
    int getSignalData(size_t offset, size_t length, float *out_ptr);
    
    EdgeImpulseWrapper();
    ~EdgeImpulseWrapper();
    
    // Initialization
    bool initialize();
    void deinitialize();
    
    // Configuration methods
    void setSamplingFrequency(int frequency);
    void setSamplingDuration(int durationMs);
    int getSamplingFrequency() const { return config.samplingFrequency; }
    int getSamplingDuration() const { return config.samplingDurationMs; }
    
    // Audio capture and processing
    bool captureAudio();
    RecognitionResult processAudio();
    
    // Result access
    const RecognitionResult& getLastResult() const { return lastResult; }
    std::string getFeatureString() const;
    
    // Status
    bool isInitialized() const { return initialized; }
    
private:
    AudioConfig config;
    std::vector<float> audioBuffer;
    std::vector<float> featureBuffer;
    RecognitionResult lastResult;
    bool initialized;
    
    // Internal methods
    int preprocessAudioData();
    void updateAudioConfig();
};

// Global instance
extern EdgeImpulseWrapper* g_edgeImpulseWrapper;

// C-style interface functions for PXT integration
extern "C" {
    void initializeEdgeImpulse();
    void configureSamplingFrequency(int frequency);
    void configureSamplingDuration(int duration);
    void captureAudioData();
    const char* processAudioWithEdgeImpulse();
    const char* getFeatureString();
}

// Helper functions
namespace EdgeImpulseHelper {
    // Convert float array to feature string for debugging
    std::string floatArrayToString(const float* data, size_t length);
    
    // Validate sampling parameters
    bool isValidSamplingFrequency(int frequency);
    bool isValidSamplingDuration(int duration);
    
    // Audio processing utilities
    void normalizeAudioData(float* data, size_t length);
    void applyPreEmphasis(float* data, size_t length, float coefficient = 0.97f);
    void applyHammingWindow(float* data, size_t length);
    
    // Edge Impulse signal interface
    int getSignalData(size_t offset, size_t length, float *out_ptr);
}

#endif // EDGE_IMPULSE_WRAPPER_H