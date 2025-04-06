import { 
  View, Text, Image, ScrollView, SafeAreaView, TextInput, Button, 
  StyleSheet, TouchableOpacity, Alert, ActivityIndicator
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from 'react-native-markdown-display';
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";

const db = getFirestore();

export default function GeminiBot() {
  const { predictions } = useLocalSearchParams();
  const API_KEY_GEMINI = "AIzaSyDfB9Rro-EDDAMVt0x6npJQ-nO3r8RcRrY"; 

  const [messages, setMessages] = useState([]); // Messages visible in the chat interface
  const [conversationHistory, setConversationHistory] = useState([]); // Internal full conversation history
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const genAI = new GoogleGenerativeAI(API_KEY_GEMINI);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  // Initialize chat with first AI response (hidden from UI)
  useEffect(() => {
    const initialPrompt = `You are an AI assistant. Provide the best treatment in simple points for this plant disease prediction: ${predictions}. 
    Also, answer any follow-up questions the user may have.`;

    sendMessage(initialPrompt, false, true); // Third parameter ensures it's hidden
  }, []);

  const sendMessage = async (message, isUser, hideMessage = false) => {
    setIsTyping(true);

    // Update the internal conversation history
    const updatedConversationHistory = [...conversationHistory, { sender: isUser ? "User" : "AI", text: message }];
    setConversationHistory(updatedConversationHistory);

    try {
      // Format the full conversation history
      const formattedHistory = updatedConversationHistory
        .map((msg) => `${msg.sender}: ${msg.text}`)
        .join("\n");

      // Send full history to Gemini for better context
      const result = await model.generateContent(formattedHistory);
      const responseText = result.response ? await result.response.text() : "I'm unable to generate a response.";

      // Append AI response to internal conversation history
      setConversationHistory([...updatedConversationHistory, { sender: "AI", text: responseText }]);

      // Update visible messages in the UI (skip if hideMessage is true)
      if (!hideMessage) {
        setMessages([...messages, { sender: isUser ? "User" : "AI", text: message }]);
      }

      // Add AI response to visible messages (always visible)
      setMessages((prevMessages) => [...prevMessages, { sender: "AI", text: responseText }]);
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages([...messages, { sender: "AI", text: "Error generating response. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    if (userInput.trim()) {
      sendMessage(userInput, true);
      setUserInput("");
    }
  };

  const genAISummary = new GoogleGenerativeAI(API_KEY_GEMINI);
  const modelSummary = genAISummary.getGenerativeModel({ model: "gemini-2.0-flash" });

  const handlerAISum = async () => {
    try {
      // Format entire conversation history for summarization
      const formattedMessages = conversationHistory
        .map((msg) => `${msg.sender}: ${msg.text}`)
        .join("\n");

      const promptSum = `Summarize the following conversation in a structured format:\n\n${formattedMessages}`;

      const resultSum = await modelSummary.generateContent(promptSum);
      const responseSum = resultSum.response ? await resultSum.response.text() : "No summary available.";

      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.log("No user is currently signed in.");
        Alert.alert("Sign in first to save the record.");
        return;
      }

      const userDocRef = doc(db, "summaries", user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        await updateDoc(userDocRef, {
          conversations: arrayUnion({
            summary: responseSum,
            timestamp: new Date(),
          }),
        });
      } else {
        await setDoc(userDocRef, {
          conversations: [
            {
              summary: responseSum,
              timestamp: new Date(),
            },
          ],
        });
      }

      Alert.alert("Your conversation has been saved!");

    } catch (error) {
      console.error("Error saving summary: ", error);
      Alert.alert("Failed to save conversation. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Chat with AI ✨</Text> 
      <TouchableOpacity onPress={handlerAISum} style={styles.saveButton}>
        <Text style={styles.saveText}>Save the conversation</Text>
      </TouchableOpacity>
      <ScrollView style={styles.chatContainer}>
        {messages.map((msg, index) => (
          <View key={index} style={msg.sender === "User" ? styles.userMessage : styles.aiMessage}>
            <Markdown style={styles.messageText}>{msg.text}</Markdown>
          </View>
        ))}
        {isTyping && <Text style={styles.typingIndicator}>Typing...</Text> && <ActivityIndicator size="large" color="#0000ff" />}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={userInput}
          onChangeText={setUserInput}
          placeholder="Ask something..."
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f5f5f5" },
  header: { fontSize: 35, textAlign: "flex-start", marginBottom: 30, marginLeft: 20, marginTop:10,  color:"#325A3E"},
  image: { width: 100, height: 80, borderRadius: 10, alignSelf: "center", marginBottom: 10 },
  chatContainer: { flex: 1, marginBottom: 10 },
  userMessage: { alignSelf: "flex-end", backgroundColor: "#325A3E", opacity: 0.5, padding: 10, borderRadius: 10, marginBottom: 10 },
  aiMessage: { alignSelf: "flex-start", backgroundColor: "#E5E5EA", padding: 10, borderRadius: 10, marginBottom: 10 },
  messageText: { color: "black" },
  typingIndicator: { fontStyle: "italic", color: "gray", alignSelf: "flex-start", paddingLeft: 10, marginBottom: 5 },
  inputContainer: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginRight: 5 },
  saveButton: { alignSelf: "center", padding: 10, backgroundColor: "#325A3E", borderRadius: 5, marginBottom: 30, width: "90%", height: 45},
  saveText: { color: "#fff", fontWeight: "bold", alignSelf: "center", },
});