import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const screenWidth = Dimensions.get("window").width;
const numColumns = screenWidth > 900 ? 6 : screenWidth > 600 ? 3 : 3;
const imageSize = screenWidth / numColumns;

const user = {
  username: "pink-flowers23131",
  profileImage: "https://picsum.photos/id/102/200/200",
};

const userPosts = [
  { id: "1", uri: "https://picsum.photos/id/1018/800/600" },
  { id: "2", uri: "https://picsum.photos/id/102/800/600" },
  { id: "3", uri: "https://picsum.photos/id/1019/800/600" },
  { id: "4", uri: "https://picsum.photos/id/103/800/600" },
];

export default function ProfileScreen() {
  const router = useRouter();

  const renderPost = ({ item }: any) => (
    <Image source={{ uri: item.uri }} style={styles.postImage} />
  );

  return (
    <View style={styles.container}>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={() => router.push("/edit-profile")}>
          <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
        </TouchableOpacity>
        <Text style={styles.username}>{user.username}</Text>
      </View>

      {/* Grid */}
      <FlatList
        data={userPosts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: "flex-start" }}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },
  profileSection: {
    width: "100%",
    backgroundColor: "#ededed",
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 0,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "500",
  },
  grid: {
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  postImage: {
    width: imageSize,
    height: imageSize,
    borderRadius: 0,
    margin: 0,
  },
});
