import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, query, orderBy, limit, getDocs, startAfter } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "@/components/AuthProvider";
import { setDoc, doc } from "firebase/firestore";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeCaption, setActiveCaption] = useState<string | null>(null);

  const PAGE_SIZE = 10;

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(fetched);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length >= PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error loading posts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = async () => {
    if (loading || !hasMore || !lastVisible) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(PAGE_SIZE)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts((prev) => [...prev, ...fetched]);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length >= PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error loading more posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleAddToFavorites = async (post: any) => {
    if (!user) {
      Alert.alert("Please log in to add favorites.");
      return;
    }

    try {
      const favoriteRef = doc(db, "favorites", user.uid, "posts", post.id);
      await setDoc(favoriteRef, {
        imageUrl: post.imageUrl,
        caption: post.caption,
        createdAt: new Date(),
        createdBy: user.uid,
      });
      Alert.alert("Added to favorites!");
    } catch (err) {
      console.error("Error adding to favorites:", err);
      Alert.alert("Failed to add to favorites.");
    }
  };
  const renderItem = ({ item }: any) => {
    const doubleTap = Gesture.Tap()
      .numberOfTaps(2)
      .onStart(() => handleAddToFavorites(item))
      .runOnJS(true);

    const longPress = Gesture.LongPress()
      .onStart(() => setActiveCaption(item.id))
      .onEnd(() => setActiveCaption(null))
      .runOnJS(true);

    const combined = Gesture.Exclusive(doubleTap, longPress);

    return (
      <GestureDetector gesture={combined}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
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
      {loading && posts.length === 0 ? (
        <ActivityIndicator size="large" color="#4CD4B0" style={{ marginTop: 40 }} />
      ) : (
        <FlashList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          estimatedItemSize={400}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={
            loading && posts.length > 0 ? (
              <ActivityIndicator style={{ marginVertical: 16 }} color="#4CD4B0" />
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
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
