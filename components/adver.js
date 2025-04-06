import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

export default function Adver() {
  return (
    <TouchableOpacity style={styles.container}>
      <Text style={styles.textTitle}>PlantsCo.</Text>
      <ImageBackground
        source={{
          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeuKWVciCv8coxTLawVGjWvsqWRUoe-whu2Q&s",
        }}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle} // Ensures rounded corners on image
      >
        {/* Example: Add text on top of the background */}
        
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({

  textTitle:{    
    fontSize: 25,
    fontWeight: "bold",

    marginBottom: 10,
},

  container: {
    marginTop: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: "hidden", // Ensures border radius applies to the background image
  },
  imageBackground: {
    width: "100%",
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  imageStyle: {
    borderRadius: 10, // Apply rounded corners to the background image
  },
  text: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Optional: Semi-transparent background for readability
    padding: 10,
    borderRadius: 5,
  },
});
