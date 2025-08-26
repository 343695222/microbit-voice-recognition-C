@echo off
REM Build script for micro:bit Voice Recognition Extension
REM This script compiles the C++ components and prepares the extension

echo Building micro:bit Voice Recognition Extension...

REM Check if CMake is available
cmake --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: CMake is not installed or not in PATH
    echo Please install CMake and add it to your PATH
    pause
    exit /b 1
)

REM Create build directory
if not exist "build" mkdir build
cd build

REM Configure the project
echo Configuring project...
cmake .. -G "MinGW Makefiles"
if %errorlevel% neq 0 (
    echo Error: CMake configuration failed
    cd ..
    pause
    exit /b 1
)

REM Build the project
echo Building project...
cmake --build .
if %errorlevel% neq 0 (
    echo Error: Build failed
    cd ..
    pause
    exit /b 1
)

cd ..

echo Build completed successfully!
echo.
echo To test the extension:
echo 1. Run 'build\test-wrapper.exe' to test the C++ wrapper
echo 2. Import this extension into MakeCode for micro:bit
echo.
pause