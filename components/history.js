import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

export default function History() {
  return (
    <TouchableOpacity style={styles.bigCon}>
      <View style={styles.textCont}>
        <Text style={styles.text}>Your Saved Record</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bigCon: {
    alignItems: "center",  // Centers children horizontally
    width: "100%",
    marginBottom: 20,
  },
  textCont: {
    width:"95%",
    padding: 5,
    height: 45,
    backgroundColor: "#325A3E",
    elevation: 10,
    borderRadius: 7,
    justifyContent: "center",  
    alignItems: "center",  
  },
  text: {
    fontSize: 20,
    textAlign: "center", 
    color: "white",
    opacity: 0.8,
  },
});
