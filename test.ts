/**
 * Test file for Voice Recognition Extension
 * Provides examples and test cases for the voice recognition functionality
 */

// Test 1: Basic voice recognition setup and usage
function testBasicVoiceRecognition() {
    // Initialize the voice recognition system
    VoiceRecognition.initialize();
    
    // Set sampling frequency to 16kHz
    VoiceRecognition.setSamplingFrequency(VoiceRecognition.SamplingFrequency.Hz16000);
    
    // Set sampling duration to 1 second
    VoiceRecognition.setSamplingDuration(VoiceRecognition.SamplingDuration.Ms1000);
    
    basic.showString("Ready");
    
    // Main loop - listen for voice commands
    basic.forever(function () {
        if (input.buttonIsPressed(Button.A)) {
            basic.showIcon(IconNames.Ear);
            
            // Listen for voice command
            let command = VoiceRecognition.recognizeVoice();
            
            if (command != "") {
                basic.showString(command);
                
                // Check confidence level
                let conf = VoiceRecognition.getLastConfidence();
                basic.showNumber(conf);
                
                // React to specific commands
                if (VoiceRecognition.isKeywordDetected("microbit")) {
                    basic.showIcon(IconNames.Heart);
                } else if (VoiceRecognition.isKeywordDetected("noise")) {
                    basic.showIcon(IconNames.No);
                } else {
                    basic.showIcon(IconNames.Confused);
                }
            } else {
                basic.showIcon(IconNames.Sad);
            }
            
            basic.pause(1000);
            basic.clearScreen();
        }
    });
}

// Test 2: Advanced configuration and monitoring
function testAdvancedFeatures() {
    // Initialize with advanced settings
    VoiceRecognition.initialize();
    
    // Set high quality audio
    VoiceRecognition.setSamplingFrequency(VoiceRecognition.SamplingFrequency.Hz22050);
    VoiceRecognition.setSamplingDuration(VoiceRecognition.SamplingDuration.Ms1500);
    
    basic.showString("ADV");
    
    basic.forever(function () {
        if (input.buttonIsPressed(Button.B)) {
            // Show current configuration
            basic.showString("FREQ");
            basic.showNumber(VoiceRecognition.getCurrentSamplingFrequency());
            
            basic.showString("DUR");
            basic.showNumber(VoiceRecognition.getCurrentSamplingDuration());
            
            // Perform recognition
            basic.showIcon(IconNames.Ear);
            let result = VoiceRecognition.recognizeVoice();
            
            if (result != "") {
                basic.showString(result);
                
                // Show processing time
                basic.showString("TIME");
                basic.showNumber(VoiceRecognition.getLastProcessingTime());
                
                // Show confidence
                basic.showString("CONF");
                basic.showNumber(VoiceRecognition.getLastConfidence());
            }
            
            basic.pause(2000);
            basic.clearScreen();
        }
    });
}

// Test 3: Continuous monitoring example
function testContinuousMonitoring() {
    VoiceRecognition.initialize();
    VoiceRecognition.setSamplingFrequency(VoiceRecognition.SamplingFrequency.Hz16000);
    VoiceRecognition.setSamplingDuration(VoiceRecognition.SamplingDuration.Ms1000);
    
    let isListening = false;
    
    // Toggle listening with button A
    input.onButtonPressed(Button.A, function () {
        isListening = !isListening;
        if (isListening) {
            basic.showIcon(IconNames.Yes);
        } else {
            basic.showIcon(IconNames.No);
        }
    });
    
    // Continuous listening loop
    basic.forever(function () {
        if (isListening) {
            basic.showLeds(`
                . # . # .
                . . . . .
                . . # . .
                . # . # .
                # . . . #
            `);
            
            let command = VoiceRecognition.recognizeVoice();
            
            if (command != "") {
                // Command detected - show result
                basic.showString(command);
                
                // Perform actions based on commands
                if (VoiceRecognition.isKeywordDetected("microbit")) {
                    // Light up all LEDs
                    basic.showLeds(`
                        # # # # #
                        # # # # #
                        # # # # #
                        # # # # #
                        # # # # #
                    `);
                    basic.pause(1000);
                } else if (VoiceRecognition.isKeywordDetected("noise")) {
                    // Show X pattern
                    basic.showLeds(`
                        # . . . #
                        . # . # .
                        . . # . .
                        . # . # .
                        # . . . #
                    `);
                    basic.pause(1000);
                }
                
                basic.clearScreen();
            }
            
            basic.pause(100); // Small delay between attempts
        } else {
            basic.pause(500);
        }
    });
}

// Test 4: Performance testing
function testPerformance() {
    VoiceRecognition.initialize();
    
    let testCount = 0;
    let totalTime = 0;
    
    basic.showString("PERF");
    
    input.onButtonPressed(Button.A, function () {
        basic.showIcon(IconNames.Ear);
        
        let startTime = input.runningTime();
        let result = VoiceRecognition.recognizeVoice();
        let endTime = input.runningTime();
        
        testCount++;
        totalTime += (endTime - startTime);
        
        basic.showString("T" + testCount);
        basic.showNumber(endTime - startTime);
        
        if (testCount >= 5) {
            basic.showString("AVG");
            basic.showNumber(Math.round(totalTime / testCount));
            
            // Reset for next test
            testCount = 0;
            totalTime = 0;
        }
    });
}

// Test 5: Configuration testing
function testConfiguration() {
    VoiceRecognition.initialize();
    
    basic.showString("CONFIG");
    
    input.onButtonPressed(Button.A, function () {
        // Test different sampling frequencies
        basic.showString("8K");
        VoiceRecognition.setSamplingFrequency(VoiceRecognition.SamplingFrequency.Hz8000);
        basic.showNumber(VoiceRecognition.getCurrentSamplingFrequency());
        
        basic.showString("16K");
        VoiceRecognition.setSamplingFrequency(VoiceRecognition.SamplingFrequency.Hz16000);
        basic.showNumber(VoiceRecognition.getCurrentSamplingFrequency());
        
        basic.showString("22K");
        VoiceRecognition.setSamplingFrequency(VoiceRecognition.SamplingFrequency.Hz22050);
        basic.showNumber(VoiceRecognition.getCurrentSamplingFrequency());
    });
    
    input.onButtonPressed(Button.B, function () {
        // Test different durations
        basic.showString("500");
        VoiceRecognition.setSamplingDuration(VoiceRecognition.SamplingDuration.Ms500);
        basic.showNumber(VoiceRecognition.getCurrentSamplingDuration());
        
        basic.showString("1000");
        VoiceRecognition.setSamplingDuration(VoiceRecognition.SamplingDuration.Ms1000);
        basic.showNumber(VoiceRecognition.getCurrentSamplingDuration());
        
        basic.showString("2000");
        VoiceRecognition.setSamplingDuration(VoiceRecognition.SamplingDuration.Ms2000);
        basic.showNumber(VoiceRecognition.getCurrentSamplingDuration());
    });
}

// Main test selection
input.onButtonPressed(Button.AB, function () {
    basic.showString("SELECT TEST");
    basic.showString("A=BASIC B=ADV A+B=CONT");
});

// Default: run basic test
testBasicVoiceRecognition();