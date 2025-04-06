// screens/ChatBot.js
import { useState } from "react";
import { 
  View, Text, SafeAreaView, TouchableOpacity, 
  StyleSheet, Image, Alert 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AIPrediction from "@/components/AIprediction";

export default function ChatBot() {
  const [selectedImage, setSelectedImage] = useState(null);

  // Request camera & gallery permissions
  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || galleryStatus !== "granted") {
      Alert.alert("Permission Required", "Please allow camera and gallery access.");
      return false;
    }
    return true;
  };

  // Capture image from camera
  const captureImage = async () => {
    const permissionGranted = await requestPermissions();
    if (!permissionGranted) return;

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Pick image from gallery
  const pickImage = async () => {
    const permissionGranted = await requestPermissions();
    if (!permissionGranted) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{justifyContent: "flex-start", marginLeft: 30, marginTop: 10, marginBottom: 20}}>
        <Text style={styles.title}>Predict Your</Text>
        <Text style={styles.title}>Plant Disease..</Text>
      </View>

      <View style={styles.buttonsCont}>
        <TouchableOpacity style={styles.button} onPress={captureImage}>
          <Text style={{ color: "white" }}>Capture Image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={{ color: "white" }}>Upload Image</Text>
        </TouchableOpacity>
      </View>

      {/* Show Selected Image */}
      {selectedImage && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: selectedImage }} style={styles.image} />
          <Text style={styles.imageText}>Image Selected</Text>

          {/* Pass selected image URI to AIPrediction */}
          <AIPrediction uriImage={selectedImage} />
        </View>
      )}
    </SafeAreaView>
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    marginTop: 20,
  },
  title: {
    fontSize: 35,
    color: "#325A3E",
  },
  buttonsCont: {
    gap: 20,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "90%",
    fontSize: 20,
    borderRadius: 7,
    padding: 20,
    backgroundColor: "#325A3E",
    alignItems: "center",
  },
  previewContainer: {
    marginTop: 20,
    alignItems: "center",
    marginLeft: 10,
    marginRight: 10,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10,
  },
  imageText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
});
