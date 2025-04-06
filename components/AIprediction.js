import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";

export default function AIPrediction({ uriImage }) {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPredictionSuccessful, setIsPredictionSuccessful] = useState(false); // Track prediction success
  const router = useRouter();
  const API_KEY_PLANTID = "f4YA4kMzVgth9Vky0ZF4mMxosMkSn880C3cXHMEDlmDmxMt45d";
  const geminiPage = () => {
    router.push({
      pathname: "geminiBot",
      params: { predictions: JSON.stringify(predictions) }, // Pass predictions if successful
    });
  };

  useEffect(() => {
    const predictDisease = async () => {
      if (!uriImage) {
        return; // Do not proceed if there is no image
      }

      setLoading(true);
      setIsPredictionSuccessful(false); // Reset prediction success before making a request

      try {
        // Convert image to Base64
        const base64 = await FileSystem.readAsStringAsync(uriImage, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // API Request
        const response = await fetch("https://plant.id/api/v3/identification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Api-Key": API_KEY_PLANTID, // Store API key securely
          },
          body: JSON.stringify({
            images: [`data:image/jpeg;base64,${base64}`],
            similar_images: true,
            health: "all",
          }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();

        // Extract disease predictions
        if (result?.result?.disease?.suggestions?.length > 0) {
          setPredictions(result.result.disease.suggestions);
          setIsPredictionSuccessful(true); // Mark prediction as successful
        } else {
          setPredictions([]);
          setIsPredictionSuccessful(false); // Mark prediction as unsuccessful
        }
      } catch (error) {
        Alert.alert("Error", "Failed to get prediction");
        console.error(error);
        setPredictions([]);
        setIsPredictionSuccessful(false); // Mark prediction as unsuccessful on error
      } finally {
        setLoading(false);
      }
    };

    // Only predict if uriImage exists (i.e., image is uploaded/captured)
    if (uriImage) {
      predictDisease();
    }
  }, [uriImage]);

  return (
    <View>
      {/* Show AI Prediction and loading state */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        predictions.length > 0 && (
          <Text>
            {predictions
              .map(
                (disease, index) =>
                  `${disease.name} - ${Math.round(disease.probability * 100)}%`
              )
              .join(", ")}
          </Text>
        )
      )}

      {/* Only show "Get AI Treatment" button after prediction is successful */}
      {isPredictionSuccessful && (
        <View>
          <TouchableOpacity onPress={geminiPage} style={{ width: "100%" , backgroundColor: "#325A3E", height: 45, alignContent: "center", justifyContent:"center", marginTop:10}}>
            <Text style={{ color: "white" , alignSelf: "center"}}>
              Get AI Treatment
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
