import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { TextInput, Button, List } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TREFLE_API_KEY } from "@env";

const HomeScreen = ({ onScanPress, navigation }) => {
  const [randomQuote, setRandomQuote] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    getRandomQuote();
  }, []);

  const getRandomQuote = async () => {
    try {
      const response = await fetch(
        `https://trefle.io/api/v1/plant_care_tips?token=${TREFLE_API_KEY}`
      );
      console.log(response); // Log the response content
      const data = await response.json();
      const quotes = data.data.map((tip) => tip.tip);
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setRandomQuote(quotes[randomIndex]);
    } catch (error) {
      console.error("Error fetching plant care tips:", error);
    }
  };

  const navigateToCameraScreen = () => {};

  const navigateToPlantScreen = (plantId) => {
    navigation.navigate("PlantScreen", { plantId });
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length === 0) return;
    try {
      const response = await fetch(
        `https://trefle.io/api/v1/plants/search?token=${TREFLE_API_KEY}&q=${query}`
      );
      const data = await response.json();
      setSearchResults(data.data.slice(0, 3)); // Limit to 3 results
    } catch (error) {
      console.error("Error searching plants:", error);
    }
  };

  const renderSearchResults = () => {
    if (searchResults.length === 0 || searchQuery === "") {
      return null; // Don't render anything if there are no search results or search query is empty
    }

    return (
      <View style={styles.searchResultsContainer}>
        {searchResults.map((item) => (
          <List.Item
            key={item.id}
            title={item.common_name}
            description={item.scientific_name}
            left={() => (
              <Image
                source={{ uri: item.image_url }}
                style={styles.searchResultImage}
              />
            )}
            onPress={() => navigateToPlantScreen(item.id)}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Welcome to PlantPal!</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search plants..."
          value={searchQuery}
          onChangeText={handleSearch}
          theme={{
            colors: { primary: "#519872" },
            roundness: 8,
          }}
          left={
            <TextInput.Icon
              name="magnify"
              color="#333333"
              style={styles.searchIcon}
            />
          }
        />
        {renderSearchResults()}
      </View>
      <TouchableOpacity style={styles.scanButton} onPress={onScanPress}>
        <MaterialCommunityIcons name="barcode-scan" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.quoteText}>{randomQuote}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F4F4F4",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
    color: "#333333",
  },
  scanButton: {
    backgroundColor: "#9BC88D",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 16,
    alignItems: "center",
  },
  searchContainer: {
    position: "relative",
    marginBottom: 16,
    zIndex: 20,
    width: "100%",
  },
  searchInput: {
    height: 48,
    color: "#333333",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  quoteText: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
    color: "#555555",
  },
  resultsText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
    color: "#333333",
  },
  searchResultsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    // maxHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 8,
    zIndex: 10,
    overflow: "hidden", // Clip the overflowing content
  },

  searchResultImage: {
    width: 40,
    height: 40,
    marginRight: 8,
    borderRadius: 20,
  },
});

export default HomeScreen;
