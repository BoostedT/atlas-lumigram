import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "@/components/AuthProvider";

export default function FavoritesScreen() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeCaption, setActiveCaption] = useState<string | null>(null);

  const PAGE_SIZE = 10;

  // 🔹 Load first batch of favorites
  const loadFavorites = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "favorites", user.uid, "posts"),
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFavorites(fetched);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length >= PAGE_SIZE);
      } else {
        setFavorites([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error loading favorites:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 🔹 Load more (pagination)
  const loadMore = async () => {
    if (loading || !hasMore || !lastVisible || !user) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "favorites", user.uid, "posts"),
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
        setFavorites((prev) => [...prev, ...fetched]);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length >= PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error loading more favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  useEffect(() => {
    loadFavorites();
  }, [user]);

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Please log in to view favorites.</Text>
      </View>
    );
  }

  if (loading && favorites.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CD4B0" />
      </View>
    );
  }

  if (!loading && favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No favorites yet 💔</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={styles.imageContainer}
            onTouchStart={() =>
              setActiveCaption(activeCaption === item.id ? null : item.id)
            }
          >
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            {activeCaption === item.id && (
              <View style={styles.captionOverlay}>
                <Text style={styles.captionText}>{item.caption}</Text>
              </View>
            )}
          </View>
        )}
        estimatedItemSize={400}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={
          loading && favorites.length > 0 ? (
            <ActivityIndicator style={{ marginVertical: 16 }} color="#4CD4B0" />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  imageContainer: {
    marginBottom: 10,
    borderRadius: 20,
    overflow: "hidden",
    marginHorizontal: 5,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 300,
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#777",
    fontSize: 16,
  },
});
