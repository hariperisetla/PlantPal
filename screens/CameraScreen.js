import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import {
  Button,
  Snackbar,
  Provider as PaperProvider,
} from "react-native-paper";
import { API_KEY } from "@env";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { IconButton } from "react-native-paper";

const apiKey = API_KEY;
const apiUrl = `https://my-api.plantnet.org/v2/identify/all?api-key=${apiKey}`;

const CameraScreen = ({ onBack, onCapture }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleCapture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        skipProcessing: true,
      });
      setCapturedPhoto(photo);
      onCapture(photo);
    }
  };

  const handleRetakePhoto = () => {
    setCapturedPhoto(null);
  };

  const showSnackbarMessage = () => {
    setShowSnackbar(true);
  };

  const hideSnackbarMessage = () => {
    setShowSnackbar(false);
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <View style={styles.container}>
          <Camera
            style={styles.camera}
            type={cameraType}
            ref={cameraRef}
            ratio="16:9" // Adjust the aspect ratio here
          >
            <View style={styles.overlayContainer}>
              <Text style={styles.overlayText}>
                Place your plant in the frame
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <IconButton
                icon="arrow-left"
                color="#fff"
                size={24}
                onPress={onBack}
                style={styles.backButton}
              />
            </View>
            <View style={styles.captureButtonContainer}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={handleCapture}
              />
            </View>
          </Camera>
          {capturedPhoto && (
            <View style={styles.capturedPhotoContainer}>
              <Image
                source={{ uri: capturedPhoto.uri }}
                style={styles.capturedPhoto}
              />
              <Button
                mode="contained"
                onPress={handleRetakePhoto}
                style={styles.retakeButton}
                labelStyle={styles.retakeButtonText}
              >
                Retake Photo
              </Button>
            </View>
          )}
          <Snackbar
            visible={showSnackbar}
            onDismiss={hideSnackbarMessage}
            duration={3000}
          >
            Object captured successfully!
          </Snackbar>
        </View>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
    aspectRatio: 9 / 16, // Set the desired aspect ratio
  },

  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlayText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 50,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "transparent",
  },
  backButton: {
    backgroundColor: "#f9c74f",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  captureButtonContainer: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    marginBottom: 16,
  },
  captureButton: {
    backgroundColor: "#fff",
    borderRadius: 50,
    width: 64,
    height: 64,
  },
  capturedPhotoContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
  },
  capturedPhoto: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  retakeButton: {
    backgroundColor: "#f9c74f",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  retakeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CameraScreen;
