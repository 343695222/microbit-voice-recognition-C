#include <iostream>
#include <vector>
#include <cmath>
#include "edge-impulse-wrapper.h"

// 生成测试音频数据（模拟"microbit"关键词的音频特征）
std::vector<float> generateTestAudio() {
    std::vector<float> audio(11000); // 11000 samples as required by the model
    
    // 生成一个简单的合成音频信号
    // 模拟语音的频率特征（基频约100-300Hz，谐波等）
    for (size_t i = 0; i < audio.size(); i++) {
        float t = static_cast<float>(i) / 11000.0f; // 时间归一化到[0,1]
        
        // 基频分量
        float fundamental = 0.3f * sin(2.0f * M_PI * 150.0f * t);
        
        // 谐波分量
        float harmonic2 = 0.2f * sin(2.0f * M_PI * 300.0f * t);
        float harmonic3 = 0.1f * sin(2.0f * M_PI * 450.0f * t);
        
        // 添加一些噪声
        float noise = 0.05f * (static_cast<float>(rand()) / RAND_MAX - 0.5f);
        
        // 应用包络（模拟语音的时域特征）
        float envelope = exp(-5.0f * fabs(t - 0.5f)); // 中心峰值
        
        audio[i] = envelope * (fundamental + harmonic2 + harmonic3) + noise;
    }
    
    return audio;
}

int main() {
    std::cout << "Testing Edge Impulse Voice Recognition Wrapper..." << std::endl;
    
    // 初始化包装器
    EdgeImpulseWrapper wrapper;
    
    if (!wrapper.initialize()) {
        std::cerr << "Failed to initialize Edge Impulse wrapper!" << std::endl;
        return -1;
    }
    
    std::cout << "Wrapper initialized successfully." << std::endl;
    
    // 设置采样参数
    wrapper.setSamplingFrequency(11000);
    wrapper.setSamplingDuration(1000); // 1 second
    
    std::cout << "Sampling parameters set." << std::endl;
    
    // 生成测试音频数据
    auto testAudio = generateTestAudio();
    std::cout << "Generated test audio with " << testAudio.size() << " samples." << std::endl;
    
    // 模拟音频捕获过程
    // 在实际的micro:bit环境中，这将通过麦克风完成
    // 这里我们直接设置音频缓冲区
    
    // 运行识别
    std::cout << "Running voice recognition..." << std::endl;
    
    // 由于我们无法直接访问内部缓冲区，我们需要通过公共接口
    // 在实际使用中，captureAndPreprocessAudio会从麦克风获取数据
    
    // 处理音频并获取结果
    RecognitionResult result = wrapper.processAudio();
    
    std::cout << "Recognition completed!" << std::endl;
    std::cout << "Detected keyword: " << result.keyword << std::endl;
    std::cout << "Confidence: " << result.confidence << std::endl;
    std::cout << "Processing time: " << result.processingTimeMs << " ms" << std::endl;
    
    // 测试其他API函数
    std::cout << "\nTesting API functions:" << std::endl;
    std::cout << "Last confidence: " << result.confidence << std::endl;
    std::cout << "Last processing time: " << result.processingTimeMs << " ms" << std::endl;
    std::cout << "Current sampling frequency: " << wrapper.getSamplingFrequency() << " Hz" << std::endl;
    std::cout << "Current sampling duration: " << wrapper.getSamplingDuration() << " ms" << std::endl;
    
    // 清理
    wrapper.deinitialize();
    std::cout << "\nWrapper deinitialized. Test completed." << std::endl;
    
    return 0;
}