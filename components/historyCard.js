import { View, Text, FlatList, SafeAreaView, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, onSnapshot } from "firebase/firestore"; 
import Markdown from "react-native-markdown-display";

const db = getFirestore();

export default function ConversationHistory() {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Sign in first to view saved conversations.");
      setLoading(false);
      return;
    }

    const userDocRef = doc(db, "summaries", user.uid);

    // 🔄 Listen for real-time updates
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSummaries(data.conversations || []); // ✅ Update state in real-time
      } else {
        console.log("No conversation history found.");
        setSummaries([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching summaries:", error);
      Alert.alert("Failed to retrieve conversation history.");
      setLoading(false);
    });

    // Cleanup the listener when component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.container}>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : summaries.length === 0 ? (
        <Text style={styles.noDataText}>No conversation history available.</Text>
      ) : (
        <FlatList
          data={summaries.reverse()} 
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => Alert.alert("Summary", item.summary)}
            >
              {/* Constrain the height of the Markdown content */}
              <View style={styles.markdownContainer}>
                <Markdown style={markdownStyles}>
                  {item.summary}
                </Markdown>
              </View>
              <Text style={styles.timestamp}>
               📅 {item.timestamp ? new Date(item.timestamp.seconds * 1000).toLocaleString() : "No timestamp"}
              </Text>

            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

// Styles for the Markdown content
const markdownStyles = {
  body: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    padding: 0,
  },
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f5f5f5" },
  header: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  noDataText: { textAlign: "center", fontSize: 16, color: "gray", marginTop: 20 },
  card: { 
    backgroundColor: "white", 
    padding: 10, 
    borderRadius: 10, 
    marginBottom: 10, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  markdownContainer: {
    maxHeight: 70, // Limit the height of the Markdown content
    overflow: "hidden", // Hide overflowing content
  },
  timestamp: { fontSize: 12, color: "gray", marginTop: 5 },
});