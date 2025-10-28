import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// --- Placeholder user data ---
const users = [
  {
    id: "1",
    username: "testuser",
    avatar: "https://picsum.photos/id/102/100/100",
  },
  {
    id: "2",
    username: "tylerdev",
    avatar: "https://picsum.photos/id/103/100/100",
  },
  {
    id: "3",
    username: "pink-flowers23131",
    avatar: "https://picsum.photos/id/104/100/100",
  },
  {
    id: "4",
    username: "atlas-tyler",
    avatar: "https://picsum.photos/id/105/100/100",
  },
];

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(query.toLowerCase())
  );

  const handleUserPress = (user: any) => {
    router.push({
      pathname: "/user-profile",
      params: { username: user.username, avatar: user.avatar },
    });
  };

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <TextInput
        style={styles.input}
        placeholder="Search users..."
        value={query}
        onChangeText={setQuery}
      />

      {/* Results List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userRow}
            onPress={() => handleUserPress(item)}
          >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <Text style={styles.username}>{item.username}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          query.length > 0 ? (
            <Text style={styles.noResults}>No users found</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: 30,
  },
  header: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "600",
  },
  input: {
    borderColor: "#4CD4B0",
    borderWidth: 1,
    borderRadius: 5,
    width: "90%",
    alignSelf: "center",
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginHorizontal: "5%",
    borderRadius: 6,
    marginBottom: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
  },
  noResults: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 20,
  },
});
