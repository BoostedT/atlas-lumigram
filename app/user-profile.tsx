import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "@/components/AuthProvider";

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const unsubProfile = onSnapshot(doc(db, "users", id), (snapshot) => {
      if (snapshot.exists()) setProfileData(snapshot.data());
      else setProfileData({ username: "Unknown User" });
    });

    const q = query(
      collection(db, "posts"),
      where("createdBy", "==", id),
      orderBy("createdAt", "desc")
    );

    const unsubPosts = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(fetched);
      setLoading(false);
    });

    return () => {
      unsubProfile();
      unsubPosts();
    };
  }, [id]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CD4B0" />
      </View>
    );

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri:
              profileData?.profileImage ||
              "https://via.placeholder.com/120?text=Profile",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{profileData?.username}</Text>

        {id === user?.uid && (
          <Text style={styles.ownerTag}>Your profile</Text>
        )}
      </View>

      {/* Posts grid */}
      <FlatList
        data={posts}
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No posts yet 😅</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#f7f7f7",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  username: { fontSize: 20, fontWeight: "600" },
  ownerTag: {
    color: "#4CD4B0",
    fontWeight: "500",
    marginTop: 6,
  },
  postImage: {
    width: "33%",
    height: 120,
    borderWidth: 1,
    borderColor: "#eee",
  },
  emptyText: { textAlign: "center", marginTop: 20, color: "#777" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
