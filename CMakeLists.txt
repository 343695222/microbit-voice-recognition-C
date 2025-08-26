cmake_minimum_required(VERSION 3.10)
project(edge-impulse-wrapper)

# 设置C++标准
set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 定义Edge Impulse SDK路径
set(EI_SDK_PATH "${CMAKE_CURRENT_SOURCE_DIR}/../micro_bit-live-2020-cpp-linux-v12/edge-impulse-sdk")
set(EI_MODEL_PATH "${CMAKE_CURRENT_SOURCE_DIR}/../micro_bit-live-2020-cpp-linux-v12/model-parameters")
set(EI_TFLITE_PATH "${CMAKE_CURRENT_SOURCE_DIR}/../micro_bit-live-2020-cpp-linux-v12/tflite-model")

# 检查路径是否存在
if(NOT EXISTS ${EI_SDK_PATH})
    message(FATAL_ERROR "Edge Impulse SDK not found at: ${EI_SDK_PATH}")
endif()

# 包含头文件目录
include_directories(
    ${CMAKE_CURRENT_SOURCE_DIR}/../micro_bit-live-2020-cpp-linux-v12
    ${EI_SDK_PATH}
    ${EI_SDK_PATH}/classifier
    ${EI_SDK_PATH}/dsp
    ${EI_SDK_PATH}/porting
    ${EI_SDK_PATH}/tensorflow
    ${EI_SDK_PATH}/tensorflow/lite
    ${EI_SDK_PATH}/tensorflow/lite/micro
    ${EI_SDK_PATH}/tensorflow/lite/c
    ${EI_SDK_PATH}/third_party/flatbuffers/include
    ${EI_SDK_PATH}/third_party/gemmlowp
    ${EI_SDK_PATH}/third_party/ruy
    ${EI_SDK_PATH}/CMSIS/DSP/Include
    ${EI_SDK_PATH}/CMSIS/Core/Include
    ${EI_MODEL_PATH}
    ${EI_TFLITE_PATH}
    ${CMAKE_CURRENT_SOURCE_DIR}
)

# Collect Edge Impulse SDK sources
file(GLOB_RECURSE EI_SDK_SOURCES
    "${EI_SDK_PATH}/classifier/*.cpp"
    "${EI_SDK_PATH}/dsp/*.cpp"
    "${EI_SDK_PATH}/tensorflow/lite/micro/*.cpp"
    "${EI_SDK_PATH}/tensorflow/lite/micro/*.cc"
    "${EI_SDK_PATH}/tensorflow/lite/core/*.cpp"
    "${EI_SDK_PATH}/tensorflow/lite/core/*.cc"
    "${EI_SDK_PATH}/tensorflow/lite/kernels/*.cpp"
    "${EI_SDK_PATH}/tensorflow/lite/kernels/*.cc"
    "${EI_TFLITE_PATH}/*.cpp"
    "${EI_MODEL_PATH}/*.cpp"
)

# Remove test files and unwanted sources
list(FILTER EI_SDK_SOURCES EXCLUDE REGEX ".*test.*")
list(FILTER EI_SDK_SOURCES EXCLUDE REGEX ".*_test\.cpp$")

# 添加编译定义
add_definitions(
    -DEI_CLASSIFIER_TFLITE_ENABLE_CMSIS_NN=0
    -DEIDSP_USE_CMSIS_DSP=0
    -DEI_PORTING_POSIX=1
    -DEI_CLASSIFIER_ALLOCATION_STATIC=1
    -DEIDSP_SIGNAL_C_FN_POINTER=0
    -DTF_LITE_STATIC_MEMORY=1
    -DTF_LITE_DISABLE_X86_NEON=1
)

# Create library for Edge Impulse wrapper
add_library(edge-impulse-wrapper STATIC
    edge-impulse-wrapper.cpp
    ${EI_SDK_PATH}/porting/mingw32/ei_classifier_porting.cpp
    ${EI_SDK_SOURCES}
)

# Set target properties
target_compile_features(edge-impulse-wrapper PRIVATE cxx_std_14)
target_include_directories(edge-impulse-wrapper PUBLIC .)

# For testing purposes, create a simple test executable
add_executable(test-wrapper
    test-main.cpp
)

target_link_libraries(test-wrapper edge-impulse-wrapper)

# Compiler-specific options
if(CMAKE_COMPILER_IS_GNUCXX OR CMAKE_CXX_COMPILER_ID MATCHES "Clang")
    target_compile_options(edge-impulse-wrapper PRIVATE
        -Wall -Wextra -Wno-unused-parameter -Wno-missing-field-initializers
    )
endif()

# For micro:bit specific builds, additional configurations would be needed
# This CMakeLists.txt is primarily for development and testing on desktop