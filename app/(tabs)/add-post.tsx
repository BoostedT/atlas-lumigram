import { View, Text, StyleSheet } from "react-native";

export default function AddPostScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Add Post Screen (placeholder)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20 },
});
