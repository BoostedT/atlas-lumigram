import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// --- Placeholder image data (placeholder.tsx equivalent) ---
const placeholderImages = [
  {
    id: 1,
    uri: "https://picsum.photos/id/1018/800/600",
    caption: "Waterfall in Iceland",
  },
  {
    id: 2,
    uri: "https://picsum.photos/id/1025/800/600",
    caption: "Beautiful Golden Retriever",
  },
  {
    id: 3,
    uri: "https://picsum.photos/id/1043/800/600",
    caption: "Mountain view with snow",
  },
  {
    id: 4,
    uri: "https://picsum.photos/id/1041/800/600",
    caption: "Forest with fog",
  },
];

export default function FavoritesScreen() {
  const [showCaption, setShowCaption] = useState(null);

  // Handle double tap
  const handleDoubleTap = (caption) => {
    Alert.alert("Favorited!", `You double-tapped: ${caption}`);
  };

  // Handle long press
  const handleLongPress = (id) => {
    setShowCaption(showCaption === id ? null : id);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Favorites</Text>
        <Ionicons name="exit-outline" size={24} color="#4CD4B0" />
      </View>

      {/* Scrollable list */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {placeholderImages.map((item) => (
          <TouchableWithoutFeedback
            key={item.id}
            onLongPress={() => handleLongPress(item.id)}
            delayLongPress={300}
            onPress={() => handleDoubleTap(item.caption)}
          >
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.uri }} style={styles.image} />
              {showCaption === item.id && (
                <View style={styles.captionOverlay}>
                  <Text style={styles.captionText}>{item.caption}</Text>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: 60,
    alignItems: "center",
  },
  header: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "600",
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 50,
  },
  imageContainer: {
    width: "90%",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 20,
  },
  captionOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 8,
    alignItems: "center",
  },
  captionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
