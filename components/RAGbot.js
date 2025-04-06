import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from "react-native-markdown-display";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, onSnapshot, updateDoc, getDoc, arrayUnion, setDoc } from "firebase/firestore";

const db = getFirestore();
const API_KEY_RAG = "AIzaSyDfB9Rro-EDDAMVt0x6npJQ-nO3r8RcRrY"; 

export default function RAGbot({ forecastData, pastWeatherData }) {
    const [retData, setretData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [text, setText] = useState("Answer will be displayed here...");
    const [isGenerating, setIsGenerating] = useState(false);
    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        if (!user) {
            Alert.alert("Sign in first to view saved conversations.");
            setLoading(false);
            return;
        }

        const userDocRef = doc(db, "summaries", user.uid);

        // Listen for real-time updates
        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setretData(data.conversations || []);
            } else {
                setretData([]);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching summaries:", error);
            Alert.alert("Failed to retrieve conversation history.");
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleRAG = async () => {
        if (!forecastData || !pastWeatherData || retData.length === 0) {
            Alert.alert("Insufficient data", "Ensure weather and conversation data are available.");
            return;
        }

        setIsGenerating(true);
        const currentTime = new Date();
        const genAI = new GoogleGenerativeAI(API_KEY_RAG);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
        You are an AI RAG Assistant for ${currentTime}. 
        Provide future disease predictions only and future preparation recommendations to save my plants based on:
        - Previous disease record: ${JSON.stringify(retData)}
        - Weather Data (Past & Forecast): ${JSON.stringify(pastWeatherData)}, ${JSON.stringify(forecastData)}
        
        Make sure your response is simple in points, meaningful, and understandable.
        `;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response.text();
            setText(response);
        } catch (error) {
            console.error("Error generating content:", error);
            Alert.alert("AI Error", "Failed to generate a response.");
        } finally {
            setIsGenerating(false);
        }
    };



    const saveRecord = async () => {
        if (!user) {
            Alert.alert("Sign in first to save records.");
            return;
        }


        const retDoc = doc(db, "summaries", user.uid);
        const retSnap = await getDoc(retDoc);

        try {
            if (retSnap.exists()) {
                await updateDoc(retDoc, {
                    conversations: arrayUnion({
                        summary: text,  // ✅ Fix: Use the actual returned summary
                        timestamp: new Date(),
                    }),
                });
            } else {
                await setDoc(retDoc, {
                    conversations: [
                        {
                            summary: text,
                            timestamp: new Date(),
                        },
                    ],
                });
            }
            Alert.alert("Your record has been saved.");
            setText('Answer will be display here...');
        } catch (error) {
            console.error("Error saving summary:", error);
            Alert.alert("Failed to save conversation. Please try again.");
        }
    };

    return (
        <View style={{ padding: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>RAGbot</Text>
            <TouchableOpacity onPress={handleRAG} style={{ backgroundColor: "#325A3E", padding: 10, borderRadius: 5, marginBottom: 10 }}>
                <Text style={{ color: "#fff", textAlign: "center" }}>Plant the Future with RAG</Text>
            </TouchableOpacity>
            {isGenerating && <ActivityIndicator size="large" color="#007AFF" />}
            <Markdown style={{backgroundColor: "#eaeaea"}}>{text}</Markdown>
            <TouchableOpacity onPress={saveRecord} style={{ backgroundColor: "#325A3E", padding: 10, borderRadius: 5, marginTop: 10 }}>
                <Text style={{ color: "#fff", textAlign: "center" }}>Save Record</Text>
            </TouchableOpacity>
        </View>
    );
}
