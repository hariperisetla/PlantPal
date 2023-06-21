import React, { useState } from "react";
import HomeScreen from "./screens/HomeScreen";
import CameraScreen from "./screens/CameraScreen";
import ResultsScreen from "./screens/ResultsScreen";

const App = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [scanResult, setScanResult] = useState(null);

  const handleScanPress = () => {
    setShowCamera(true);
  };

  const handleBack = () => {
    setShowCamera(false);
    setCapturedPhoto(null);
    setScanResult(null);
  };

  const handleCapture = (photo) => {
    setCapturedPhoto(photo);
    setShowCamera(false);
    performPlantScan(photo);
  };

  const handleRetakePhoto = () => {
    setCapturedPhoto(null);
    setScanResult(null);
    setShowCamera(true);
  };

  const performPlantScan = async (photo) => {
    // Perform the plant scan logic here
    // Update the scan result using setScanResult
  };

  return (
    <>
      {!showCamera && !capturedPhoto && !scanResult ? (
        <HomeScreen onScanPress={handleScanPress} />
      ) : showCamera && !scanResult ? (
        <CameraScreen onBack={handleBack} onCapture={handleCapture} />
      ) : (
        <ResultsScreen
          capturedPhoto={capturedPhoto}
          scanResult={scanResult}
          onBack={handleBack}
          onRetakePhoto={handleRetakePhoto}
        />
      )}
    </>
  );
};

export default App;
