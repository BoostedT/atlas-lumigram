import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useAuth } from "@/components/AuthProvider";
import { db } from "@/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function EditProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    setUploading(true);
    try {
      let imageUrl = null;
      if (profileImage) {
        const storage = getStorage();
        const storageRef = ref(storage, `profileImages/${user.uid}.jpg`);
        const response = await fetch(profileImage);
        const blob = await response.blob();
        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      }

      await setDoc(
        doc(db, "users", user.uid),
        {
          username: username || user.email.split("@")[0],
          profileImage: imageUrl,
        },
        { merge: true }
      );

      Alert.alert("Profile Updated!", "Your changes have been saved.");
      router.back();
    } catch (err) {
      console.error("Error updating profile:", err);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.image} />
        ) : (
          <Text style={styles.placeholderText}>Tap to select image</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Enter new username"
        value={username}
        onChangeText={setUsername}
      />

      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveProfile}
        disabled={uploading}
      >
        <Text style={styles.saveText}>
          {uploading ? "Saving..." : "Save Changes"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", alignItems: "center", paddingTop: 40 },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  image: { width: 120, height: 120, borderRadius: 60 },
  placeholderText: { color: "#888" },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#4CD4B0",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#4CD4B0",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  saveText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
