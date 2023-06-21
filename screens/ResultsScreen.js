import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { API_KEY } from "@env";

const apiKey = API_KEY;
const apiUrl = `https://my-api.plantnet.org/v2/identify/all?include-related-images=true&api-key=${apiKey}`;

const ResultsView = ({ capturedPhoto, onBack, onRetakePhoto }) => {
  const [scanResult, setScanResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (capturedPhoto) {
      performPlantScan(capturedPhoto);
    }
  }, [capturedPhoto]);

  const performPlantScan = async (photo) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    // formData.append("auto");
    formData.append("images", {
      uri: photo.uri,
      type: "image/jpeg",
      name: "photo.jpg",
    });

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();
      if (data && Array.isArray(data.results) && data.results.length > 0) {
        setScanResult(data.results);
      } else {
        setScanResult([]);
      }
    } catch (error) {
      console.error("Plant scan failed:", error);
      setError("Failed to perform plant scan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {capturedPhoto && (
        <Image
          source={{ uri: capturedPhoto.uri }}
          style={styles.capturedPhoto}
        />
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.retakeButton} onPress={onRetakePhoto}>
          <Text style={styles.buttonText}>Retake Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : scanResult && scanResult.length > 0 ? (
          <>
            <Text style={styles.scanResultText}>Scan Results:</Text>
            {scanResult.map((result, index) => (
              <View key={index} style={styles.resultItem}>
                <Image
                  source={{ uri: result?.images[0].url.o || "N/A" }}
                  style={styles.resultImage}
                  resizeMode="cover"
                />
                <Text style={styles.resultCommonName}>
                  Common Name: {result?.species?.commonNames[0] || "N/A"}
                </Text>
                <Text style={styles.resultScientificName}>
                  Scientific Name:{" "}
                  {result?.species?.scientificNameWithoutAuthor || "N/A"}
                </Text>
                <Text style={styles.resultMatch}>
                  Match: {result?.score?.toFixed(2) || "N/A"}%
                </Text>
              </View>
            ))}
          </>
        ) : (
          <Text style={styles.noResultText}>No results found.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  capturedPhoto: {
    width: "100%",
    height: 300,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  retakeButton: {
    backgroundColor: "#f9c74f",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: "#f9c74f",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 16,
  },
  loadingText: {
    fontSize: 20,
    marginTop: 16,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    marginTop: 16,
    textAlign: "center",
  },
  scanResultText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  resultItem: {
    backgroundColor: "#f3f3f3",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    width: "90%",
    alignItems: "center",
  },
  resultImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  resultCommonName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  resultScientificName: {
    fontSize: 16,
    marginBottom: 4,
  },
  resultMatch: {
    fontSize: 16,
    marginBottom: 8,
  },
  noResultText: {
    fontSize: 20,
    marginTop: 16,
  },
});

export default ResultsView;
