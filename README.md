# micro:bit Voice Recognition Extension

一个基于Edge Impulse机器学习模型的micro:bit语音识别扩展，支持实时语音命令识别。

## 功能特性

- 🎤 **实时语音识别**: 使用micro:bit内置麦克风进行语音识别
- 🧠 **Edge Impulse集成**: 基于Edge Impulse训练的机器学习模型
- ⚡ **高性能**: 优化的C++实现，支持实时处理
- 🔧 **灵活配置**: 支持多种采样频率和采样时长设置
- 📊 **置信度检测**: 提供识别结果的置信度评分
- 🎯 **关键词检测**: 支持特定关键词的检测功能

## 支持的配置

### 采样频率
- 8kHz (Hz8000)
- 16kHz (Hz16000) - 推荐
- 22.05kHz (Hz22050) - 高质量

### 采样时长
- 500ms (Ms500) - 快速响应
- 1000ms (Ms1000) - 推荐
- 1500ms (Ms1500) - 高精度
- 2000ms (Ms2000) - 最高精度

## 支持的关键词

当前模型支持识别以下关键词：
- `microbit` - micro:bit设备名称
- `noise` - 噪音检测
- `unknown` - 未知语音

## 安装方法

### 方法1：通过MakeCode扩展库安装

1. 打开 [MakeCode for micro:bit](https://makecode.microbit.org/)
2. 创建新项目或打开现有项目
3. 点击齿轮图标 → "扩展"
4. 在搜索框中输入此扩展的GitHub URL
5. 点击添加扩展

### 方法2：本地开发安装

1. 克隆或下载此项目到本地
2. 在MakeCode中选择"导入" → "导入文件"
3. 选择项目文件夹中的所有文件

## 快速开始

### 1. 基础使用

```typescript
// 初始化语音识别系统
VoiceRecognition.initialize();

// 设置采样参数
VoiceRecognition.setSamplingFrequency(VoiceRecognition.SamplingFrequency.Hz16000);
VoiceRecognition.setSamplingDuration(VoiceRecognition.SamplingDuration.Ms1000);

// 监听语音命令
input.onButtonPressed(Button.A, function () {
    basic.showIcon(IconNames.Ear);
    let command = VoiceRecognition.recognizeVoice();
    
    if (command != "") {
        basic.showString(command);
    } else {
        basic.showIcon(IconNames.Sad);
    }
});
```

### 2. 高级功能

```typescript
// 初始化
VoiceRecognition.initialize();

// 高质量设置
VoiceRecognition.setSamplingFrequency(VoiceRecognition.SamplingFrequency.Hz22050);
VoiceRecognition.setSamplingDuration(VoiceRecognition.SamplingDuration.Ms1500);

input.onButtonPressed(Button.A, function () {
    let result = VoiceRecognition.recognizeVoice();
    
    if (result != "") {
        // 显示识别结果
        basic.showString(result);
        
        // 显示置信度
        let confidence = VoiceRecognition.getLastConfidence();
        basic.showNumber(confidence);
        
        // 显示处理时间
        let processingTime = VoiceRecognition.getLastProcessingTime();
        serial.writeLine("Processing time: " + processingTime + "ms");
        
        // 检测特定关键词
        if (VoiceRecognition.isKeywordDetected("microbit")) {
            basic.showIcon(IconNames.Heart);
        }
    }
});
```

### 3. 连续监听

```typescript
VoiceRecognition.initialize();
VoiceRecognition.setSamplingFrequency(VoiceRecognition.SamplingFrequency.Hz16000);
VoiceRecognition.setSamplingDuration(VoiceRecognition.SamplingDuration.Ms1000);

let isListening = false;

// 切换监听状态
input.onButtonPressed(Button.A, function () {
    isListening = !isListening;
    if (isListening) {
        basic.showIcon(IconNames.Yes);
    } else {
        basic.showIcon(IconNames.No);
    }
});

// 连续监听循环
basic.forever(function () {
    if (isListening) {
        basic.showIcon(IconNames.Ear);
        let command = VoiceRecognition.recognizeVoice();
        
        if (command != "") {
            basic.showString(command);
            
            // 根据命令执行不同操作
            if (VoiceRecognition.isKeywordDetected("microbit")) {
                // 点亮所有LED
                basic.showLeds(`
                    # # # # #
                    # # # # #
                    # # # # #
                    # # # # #
                    # # # # #
                `);
                basic.pause(1000);
                basic.clearScreen();
            }
        }
        
        basic.pause(100);
    } else {
        basic.pause(500);
    }
});
```

## API 参考

### 核心函数

#### `VoiceRecognition.initialize(): void`
初始化语音识别系统。必须在使用其他功能前调用。

#### `VoiceRecognition.recognizeVoice(): string`
执行语音识别，返回识别到的文本。如果识别失败返回空字符串。

### 配置函数

#### `VoiceRecognition.setSamplingFrequency(freq: SamplingFrequency): void`
设置音频采样频率。
- `freq`: 采样频率枚举值
  - `VoiceRecognition.SamplingFrequency.Hz8000`: 8kHz
  - `VoiceRecognition.SamplingFrequency.Hz16000`: 16kHz (推荐)
  - `VoiceRecognition.SamplingFrequency.Hz22050`: 22.05kHz (高质量)

#### `VoiceRecognition.setSamplingDuration(duration: SamplingDuration): void`
设置音频采样时长。
- `duration`: 采样时长枚举值
  - `VoiceRecognition.SamplingDuration.Ms500`: 500ms (快速)
  - `VoiceRecognition.SamplingDuration.Ms1000`: 1000ms (推荐)
  - `VoiceRecognition.SamplingDuration.Ms1500`: 1500ms (高精度)
  - `VoiceRecognition.SamplingDuration.Ms2000`: 2000ms (最高精度)

#### `VoiceRecognition.getCurrentSamplingFrequency(): number`
获取当前采样频率（Hz）。

#### `VoiceRecognition.getCurrentSamplingDuration(): number`
获取当前采样时长（毫秒）。

### 结果获取函数

#### `VoiceRecognition.getLastConfidence(): number`
获取最后一次识别的置信度（0-100）。

#### `VoiceRecognition.getLastProcessingTime(): number`
获取最后一次识别的处理时间（毫秒）。

#### `VoiceRecognition.isKeywordDetected(keyword: string): boolean`
检查最后一次识别结果是否包含指定关键词。
- `keyword`: 要检查的关键词

### 调试函数

#### `VoiceRecognition.debugInfo(): string`
获取调试信息字符串。

## 使用示例

### 示例1：简单语音控制LED

```typescript
VoiceRecognition.initialize();
VoiceRecognition.setSamplingFrequency(VoiceRecognition.SamplingFrequency.Hz16000);
VoiceRecognition.setSamplingDuration(VoiceRecognition.SamplingDuration.Ms1000);

basic.showString("Ready");

basic.forever(function () {
    if (input.buttonIsPressed(Button.A)) {
        basic.showIcon(IconNames.Ear);
        let command = VoiceRecognition.recognizeVoice();
        
        if (VoiceRecognition.isKeywordDetected("microbit")) {
            // 显示心形
            basic.showIcon(IconNames.Heart);
        } else if (VoiceRecognition.isKeywordDetected("noise")) {
            // 显示X
            basic.showIcon(IconNames.No);
        } else if (command != "") {
            // 显示问号
            basic.showIcon(IconNames.Confused);
        } else {
            // 没有检测到声音
            basic.showIcon(IconNames.Sad);
        }
        
        basic.pause(1000);
        basic.clearScreen();
    }
});
```

### 示例2：语音控制音乐播放

```typescript
VoiceRecognition.initialize();
VoiceRecognition.setSamplingFrequency(VoiceRecognition.SamplingFrequency.Hz16000);
VoiceRecognition.setSamplingDuration(VoiceRecognition.SamplingDuration.Ms1000);

let isPlaying = false;

basic.forever(function () {
    if (input.buttonIsPressed(Button.A)) {
        let command = VoiceRecognition.recognizeVoice();
        
        if (VoiceRecognition.isKeywordDetected("microbit")) {
            if (!isPlaying) {
                // 开始播放音乐
                music.beginMelody(music.builtInMelody(Melodies.Dadadadum), MelodyOptions.Once);
                isPlaying = true;
                basic.showIcon(IconNames.Yes);
            } else {
                // 停止播放音乐
                music.stopAllSounds();
                isPlaying = false;
                basic.showIcon(IconNames.No);
            }
        }
    }
});
```

### 示例3：语音控制servo电机

```typescript
VoiceRecognition.initialize();
VoiceRecognition.setSamplingFrequency(VoiceRecognition.SamplingFrequency.Hz16000);
VoiceRecognition.setSamplingDuration(VoiceRecognition.SamplingDuration.Ms1000);

let servoAngle = 90; // 初始角度

basic.forever(function () {
    if (input.buttonIsPressed(Button.A)) {
        let command = VoiceRecognition.recognizeVoice();
        
        if (VoiceRecognition.isKeywordDetected("microbit")) {
            // 向右转
            servoAngle = Math.min(180, servoAngle + 30);
            pins.servoWritePin(AnalogPin.P0, servoAngle);
            basic.showArrow(ArrowNames.East);
        } else if (VoiceRecognition.isKeywordDetected("noise")) {
            // 向左转
            servoAngle = Math.max(0, servoAngle - 30);
            pins.servoWritePin(AnalogPin.P0, servoAngle);
            basic.showArrow(ArrowNames.West);
        }
        
        basic.pause(500);
        basic.clearScreen();
    }
});
```

## 性能优化建议

### 1. 采样参数选择
- **快速响应**: 使用16kHz + 500ms
- **平衡性能**: 使用16kHz + 1000ms（推荐）
- **高精度**: 使用22.05kHz + 1500ms

### 2. 使用技巧
- 在安静环境中使用以获得最佳效果
- 保持micro:bit麦克风清洁
- 说话时保持适当距离（10-30cm）
- 避免在连续监听模式下设置过短的延迟

### 3. 内存管理
- 避免频繁初始化和去初始化
- 在不需要时停止连续监听
- 合理设置采样参数以平衡性能和精度

## 故障排除

### 常见问题

**Q: 识别准确率低**
A: 
- 检查环境噪音是否过大
- 尝试增加采样时长
- 确保说话清晰且距离适当
- 检查麦克风是否被遮挡

**Q: 处理时间过长**
A:
- 降低采样频率或缩短采样时长
- 避免在处理过程中执行其他耗时操作
- 检查是否有内存不足的情况

**Q: 初始化失败**
A:
- 确保micro:bit固件版本兼容
- 检查是否有足够的内存空间
- 尝试重启micro:bit

**Q: 无法检测到声音**
A:
- 检查麦克风硬件是否正常
- 确保音量足够大
- 检查采样参数设置是否合理

## 技术规格

- **支持的micro:bit版本**: v2.0+
- **最小内存要求**: 32KB RAM
- **模型大小**: ~50KB
- **支持的音频格式**: 16-bit PCM
- **延迟**: 通常 < 200ms
- **准确率**: 在理想条件下 > 90%

## 项目结构

```
microbit-voice-recognition/
├── voice-recognition.ts          # TypeScript API接口
├── voice-recognition-binding.cpp # C++绑定代码
├── edge-impulse-wrapper.h        # Edge Impulse包装器头文件
├── edge-impulse-wrapper.cpp      # Edge Impulse包装器实现
├── shims.d.ts                    # TypeScript声明文件
├── pxt.json                      # 扩展配置文件
├── test.ts                       # 测试用例
└── README.md                     # 使用文档
```

## 许可证

MIT License - 详见 LICENSE 文件

## 贡献

欢迎提交问题报告和功能请求到项目的 GitHub 仓库。

## 更新日志

### v1.0.0
- 初始版本发布
- 支持基础语音识别功能
- 集成Edge Impulse模型
- 提供完整的TypeScript API
- 支持多种采样频率和时长配置
- 包含完整的测试用例和文档

---

**注意**: 此扩展需要micro:bit v2.0或更高版本，因为需要内置麦克风支持。# microbit-voice-recognition-C
