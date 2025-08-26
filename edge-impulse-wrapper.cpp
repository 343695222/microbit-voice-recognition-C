#include "edge-impulse-wrapper.h"
#include <iostream>
#include <cstring>
#include <cstdlib>
#include <cmath>
#include <algorithm>
#include <sstream>
#include <iomanip>

// Global instance
EdgeImpulseWrapper* g_edgeImpulseWrapper = nullptr;

// Static pointer for signal callback
static EdgeImpulseWrapper* s_currentWrapper = nullptr;

EdgeImpulseWrapper::EdgeImpulseWrapper() : initialized(false) {
    audioBuffer.reserve(MAX_AUDIO_BUFFER_SIZE);
    featureBuffer.reserve(FEATURE_BUFFER_SIZE);
}

EdgeImpulseWrapper::~EdgeImpulseWrapper() {
    deinitialize();
}

bool EdgeImpulseWrapper::initialize() {
    if (initialized) {
        return true;
    }
    
    try {
        // 简化的初始化，暂时不使用Edge Impulse的复杂功能
        updateAudioConfig();
        s_currentWrapper = this;
        initialized = true;
        return true;
    } catch (...) {
        return false;
    }
}

void EdgeImpulseWrapper::deinitialize() {
    if (initialized) {
        s_currentWrapper = nullptr;
        initialized = false;
    }
}

void EdgeImpulseWrapper::setSamplingFrequency(int frequency) {
    if (EdgeImpulseHelper::isValidSamplingFrequency(frequency)) {
        config.samplingFrequency = frequency;
        updateAudioConfig();
    }
}

void EdgeImpulseWrapper::setSamplingDuration(int durationMs) {
    if (EdgeImpulseHelper::isValidSamplingDuration(durationMs)) {
        config.samplingDurationMs = durationMs;
        updateAudioConfig();
    }
}

void EdgeImpulseWrapper::updateAudioConfig() {
    config.bufferSize = (config.samplingFrequency * config.samplingDurationMs) / 1000;
    audioBuffer.clear();
    audioBuffer.reserve(config.bufferSize);
}

bool EdgeImpulseWrapper::captureAudio() {
    if (!initialized) {
        return false;
    }
    
    // 生成模拟音频数据用于测试
    audioBuffer.clear();
    audioBuffer.resize(config.bufferSize, 0.0f);
    
    for (size_t i = 0; i < config.bufferSize; i++) {
        // 生成包含噪音的正弦波作为测试数据
        float t = (float)i / config.samplingFrequency;
        float signal = sin(2.0f * 3.14159f * 440.0f * t) * 0.5f; // 440Hz正弦波
        float noise = ((float)rand() / RAND_MAX - 0.5f) * 0.1f; // 添加少量噪音
        audioBuffer[i] = signal + noise;
    }
    
    // Apply preprocessing
    return preprocessAudioData() == 0;
}

int EdgeImpulseWrapper::preprocessAudioData() {
    if (audioBuffer.empty()) {
        return -1;
    }
    
    // 确保音频数据长度符合模型要求 (11000个样本)
    if (audioBuffer.size() != 11000) {
        if (audioBuffer.size() > 11000) {
            // 截断多余数据
            audioBuffer.resize(11000);
        } else {
            // 用零填充不足的数据
            audioBuffer.resize(11000, 0.0f);
        }
    }
    
    // Apply windowing function (Hamming window)
    EdgeImpulseHelper::applyHammingWindow(audioBuffer.data(), audioBuffer.size());
    
    // Normalize audio data
    EdgeImpulseHelper::normalizeAudioData(audioBuffer.data(), audioBuffer.size());
    
    // Apply pre-emphasis filter (optional, helps with speech recognition)
    EdgeImpulseHelper::applyPreEmphasis(audioBuffer.data(), audioBuffer.size());
    
    return 0;
}

RecognitionResult EdgeImpulseWrapper::processAudio() {
    if (!initialized) {
        return RecognitionResult("error", 0.0f, 0);
    }
    
    // 捕获音频数据
    if (!captureAudio()) {
        return RecognitionResult("error", 0.0f, 0);
    }
    
    // 简化的推理过程，返回模拟结果
    // 在实际应用中，这里会调用Edge Impulse的推理引擎
    auto start = std::chrono::high_resolution_clock::now();
    
    // 模拟推理过程
    std::this_thread::sleep_for(std::chrono::milliseconds(50));
    
    auto end = std::chrono::high_resolution_clock::now();
    int processingTime = std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count();
    
    // 返回模拟结果
    lastResult = RecognitionResult("microbit", 0.85f, processingTime);
    return lastResult;
}

int EdgeImpulseWrapper::getSignalData(size_t offset, size_t length, float *out_ptr) {
    if (offset + length > audioBuffer.size()) {
        return -1;
    }
    
    memcpy(out_ptr, &audioBuffer[offset], length * sizeof(float));
    return 0;
}

std::string EdgeImpulseWrapper::getFeatureString() const {
    std::stringstream ss;
    ss << "[";
    for (size_t i = 0; i < std::min(audioBuffer.size(), (size_t)10); i++) {
        if (i > 0) ss << ", ";
        ss << std::fixed << std::setprecision(4) << audioBuffer[i];
    }
    if (audioBuffer.size() > 10) {
        ss << ", ...";
    }
    ss << "]";
    return ss.str();
}

// C-style interface functions
extern "C" {
    void initializeEdgeImpulse() {
        if (g_edgeImpulseWrapper == nullptr) {
            g_edgeImpulseWrapper = new EdgeImpulseWrapper();
        }
        g_edgeImpulseWrapper->initialize();
    }
    
    void configureSamplingFrequency(int frequency) {
        if (g_edgeImpulseWrapper != nullptr) {
            g_edgeImpulseWrapper->setSamplingFrequency(frequency);
        }
    }
    
    void configureSamplingDuration(int duration) {
        if (g_edgeImpulseWrapper != nullptr) {
            g_edgeImpulseWrapper->setSamplingDuration(duration);
        }
    }
    
    void captureAudioData() {
        if (g_edgeImpulseWrapper != nullptr) {
            g_edgeImpulseWrapper->captureAudio();
        }
    }
    
    const char* processAudioWithEdgeImpulse() {
        if (g_edgeImpulseWrapper == nullptr) {
            return "error";
        }
        
        RecognitionResult result = g_edgeImpulseWrapper->processAudio();
        static std::string resultStr;
        resultStr = result.keyword;
        return resultStr.c_str();
    }
    
    const char* getFeatureString() {
        if (g_edgeImpulseWrapper == nullptr) {
            return "[]";
        }
        
        static std::string featureStr;
        featureStr = g_edgeImpulseWrapper->getFeatureString();
        return featureStr.c_str();
    }
}

// Helper functions implementation
namespace EdgeImpulseHelper {
    std::string floatArrayToString(const float* data, size_t length) {
        std::stringstream ss;
        ss << "[";
        for (size_t i = 0; i < length; i++) {
            if (i > 0) ss << ", ";
            ss << std::fixed << std::setprecision(4) << data[i];
        }
        ss << "]";
        return ss.str();
    }
    
    bool isValidSamplingFrequency(int frequency) {
        return frequency >= 8000 && frequency <= 48000;
    }
    
    bool isValidSamplingDuration(int duration) {
        return duration >= 100 && duration <= 5000;
    }
    
    void normalizeAudioData(float* data, size_t length) {
        if (length == 0) return;
        
        // Find max absolute value
        float maxVal = 0.0f;
        for (size_t i = 0; i < length; i++) {
            maxVal = std::max(maxVal, std::abs(data[i]));
        }
        
        // Normalize if max value is not zero
        if (maxVal > 0.0f) {
            for (size_t i = 0; i < length; i++) {
                data[i] /= maxVal;
            }
        }
    }
    
    void applyPreEmphasis(float* data, size_t length, float coefficient) {
        if (length <= 1) return;
        
        for (size_t i = length - 1; i > 0; i--) {
            data[i] = data[i] - coefficient * data[i - 1];
        }
    }
    
    void applyHammingWindow(float* data, size_t length) {
        if (length == 0) return;
        
        for (size_t i = 0; i < length; i++) {
            float window = 0.54f - 0.46f * cos(2.0f * 3.14159f * i / (length - 1));
            data[i] *= window;
        }
    }
    
    int getSignalData(size_t offset, size_t length, float *out_ptr) {
        if (s_currentWrapper != nullptr) {
            return s_currentWrapper->getSignalData(offset, length, out_ptr);
        }
        return -1;
    }
}