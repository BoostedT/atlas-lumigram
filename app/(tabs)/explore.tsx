import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export default function SearchScreen() {
  const router = useRouter();
  const [queryText, setQueryText] = useState("");
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(fetched);
    });
    return () => unsub();
  }, []);

  const filtered = users.filter((u) =>
    u.username?.toLowerCase().includes(queryText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search by username..."
        value={queryText}
        onChangeText={setQueryText}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push(`/user-profile?id=${item.id}`)}
          >
            <Image
              source={{
                uri:
                  item.profileImage ||
                  "https://via.placeholder.com/100?text=User",
              }}
              style={styles.avatar}
            />
            <Text style={styles.username}>{item.username}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          queryText.length > 0 ? (
            <Text style={styles.noResults}>No users found</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 30 },
  input: {
    borderColor: "#4CD4B0",
    borderWidth: 1,
    borderRadius: 6,
    marginHorizontal: 20,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  username: { fontSize: 16, fontWeight: "500" },
  noResults: { textAlign: "center", color: "#aaa", marginTop: 20 },
});
