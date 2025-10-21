import React, { useState } from "react";
import { View, Text, Image, Alert, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { homeFeed } from "@/placeholder";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  const [activeCaption, setActiveCaption] = useState<string | null>(null);

  const renderItem = ({ item }: any) => {
    const doubleTap = Gesture.Tap()
      .numberOfTaps(2)
      .onStart(() => Alert.alert("Liked!", item.caption))
      .runOnJS(true);

    const longPress = Gesture.LongPress()
      .onStart(() => setActiveCaption(item.id))
      .onEnd(() => setActiveCaption(null))
      .runOnJS(true);

    const combined = Gesture.Exclusive(doubleTap, longPress);

    return (
      <GestureDetector gesture={combined}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.image} />
          {activeCaption === item.id && (
            <View style={styles.captionContainer}>
              <Text style={styles.captionText}>{item.caption}</Text>
            </View>
          )}
        </View>
      </GestureDetector>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Home Feed</Text>
        <Ionicons
          name="exit-outline"
          size={28}
          color="#2BC5B4"
          onPress={() => router.replace("/login")}
        />
      </View>

      <FlashList
        data={homeFeed}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        estimatedItemSize={400}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 25,
  },
  headerText: { fontSize: 24, fontWeight: "bold" },
  imageContainer: {
    marginBottom: 10,
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 5,
  },
  image: { width: "100%", height: 300 },
  captionContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  captionText: { color: "#fff", fontSize: 16 },
});
