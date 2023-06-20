import React, { useState, useEffect } from "react";
import { API_KEY } from "@env";

import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
} from "react-native";
import { Camera } from "expo-camera";
import { Searchbar, Button, Card, Title, Paragraph } from "react-native-paper";

// Function to perform plant identification using PlantNet API
const identifyPlant = async (imageUri) => {
  const apiKey = API_KEY; // Replace with your actual API key
  const response = await fetch(
    `https://my-api.plantnet.org/v2/identify/all?api-key=${apiKey}`
  );

  const result = await response.json();
  console.log(result);
  return result;
};

// Helper function to create form data for image upload
const createFormData = (uri) => {
  const formData = new FormData();
  formData.append("organs", "leaf");
  formData.append("images", {
    uri,
    type: "image/jpeg",
    name: "plant_image.jpg",
  });
  return formData;
};

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [recentScans, setRecentScans] = useState([]);
  const [featuredPlants, setFeaturedPlants] = useState([]);
  const [imageUri, setImageUri] = useState(null);
  const [identifiedPlant, setIdentifiedPlant] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const openCamera = () => {
    setCameraOpen(true);
  };

  const closeCamera = () => {
    setCameraOpen(false);
  };

  const handlePlantIdentification = async () => {
    try {
      const result = await identifyPlant(imageUri);
      if (result && result.results && result.results.length > 0) {
        setIdentifiedPlant(result.results[0]);
        setRecentScans([
          ...recentScans,
          result.results[0].species.scientificNameWithoutAuthor,
        ]);
      }
    } catch (error) {
      console.log("Error identifying plant:", error);
    }
  };

  const renderMainContent = () => {
    const greetUser = () => {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();

      if (currentHour < 12) {
        return "Good morning!";
      } else if (currentHour < 18) {
        return "Good afternoon!";
      } else {
        return "Good evening!";
      }
    };

    const motivationalQuote =
      "The earth laughs in flowers - Ralph Waldo Emerson";

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>PlantPal</Text>
        <Text style={styles.subtitle}>{greetUser()}</Text>

        <Searchbar style={styles.searchBar} placeholder="Search for a plant" />

        <Button
          mode="contained"
          style={styles.cameraButton}
          onPress={openCamera}
        >
          Scan Plant
        </Button>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recent Scans</Text>
          {recentScans.map((scan, index) => (
            <Text key={index} style={styles.recentScanItem}>
              {scan}
            </Text>
          ))}
        </View>

        {identifiedPlant && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Identified Plant</Text>
            <Card style={styles.featuredPlantContainer}>
              <Card.Cover
                source={{ uri: identifiedPlant.images[0].url }}
                style={styles.featuredPlantImage}
              />
              <Card.Content>
                <Title style={styles.featuredPlantName}>
                  {identifiedPlant.species.scientificNameWithoutAuthor}
                </Title>
                <Paragraph style={styles.featuredPlantDescription}>
                  {identifiedPlant.species.family.scientificName}
                </Paragraph>
              </Card.Content>
            </Card>
          </View>
        )}

        <Text style={styles.motivationalQuote}>{motivationalQuote}</Text>

        <StatusBar style="auto" />
      </ScrollView>
    );
  };

  const renderCamera = () => {
    if (!hasPermission) {
      return (
        <View style={styles.container}>
          <Text>No access to camera</Text>
          <Button style={styles.closeButton} onPress={closeCamera}>
            Close
          </Button>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.back}
          onPictureTaken={handlePlantIdentification}
          ref={(ref) => {
            this.camera = ref;
          }}
        >
          <View style={styles.cameraButtonsContainer}>
            <Button style={styles.captureButton} onPress={takePicture}>
              Capture
            </Button>
            <Button style={styles.closeButton} onPress={closeCamera}>
              Close
            </Button>
          </View>
        </Camera>
      </View>
    );
  };

  const takePicture = async () => {
    if (this.camera) {
      const photo = await this.camera.takePictureAsync();
      setImageUri(photo.uri);
      handlePlantIdentification();
      closeCamera();
    }
  };

  return cameraOpen ? renderCamera() : renderMainContent();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E7F3E3", // Light green background color
    paddingVertical: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#1B5E20", // Dark green title color
  },
  subtitle: {
    fontSize: 16,
    color: "#388E3C", // Green subtitle color
    marginBottom: 30,
    textAlign: "center",
  },
  searchBar: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#FFFFFF", // White search bar background color
    borderRadius: 10,
  },
  cameraButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#4CAF50", // Green scan button color
    borderRadius: 5,
  },
  sectionContainer: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    marginHorizontal: 20,
    color: "#1B5E20", // Dark green section title color
  },
  recentScanItem: {
    fontSize: 16,
    marginBottom: 5,
    marginHorizontal: 20,
    color: "#388E3C", // Green recent scan item color
  },
  featuredPlantContainer: {
    marginBottom: 20,
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF", // White featured plant card background color
    borderRadius: 10,
  },
  featuredPlantImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
  },
  featuredPlantName: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
    color: "#1B5E20", // Dark green featured plant name color
  },
  featuredPlantDescription: {
    fontSize: 14,
    color: "#388E3C", // Green featured plant description color
  },
  motivationalQuote: {
    fontSize: 16,
    color: "#388E3C", // Green motivational quote color
    textAlign: "center",
    marginTop: 30,
  },
  camera: {
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#4CAF50", // Green close button color
    borderRadius: 5,
  },
});
