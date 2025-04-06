import React, { useState, useEffect } from "react";
import RAG from "@/components/RAGbot";
import * as Location from "expo-location";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const WeatherScreen = () => {
  const [location, setLocation] = useState("Kota Bharu");
  const [forecastData, setForecastData] = useState([]);
  const [pastWeatherData, setPastWeatherData] = useState([]);
  const [loading, setLoading] = useState(false);

  // const API_KEY_WEATHER = process.env.EXPO_PUBLIC_API_KEY_WEATHER;
  const API_KEY_WEATHER = "3aa3a414a9134ebf86e103440251302"; // WeatherAPI
  const API_KEY_GOOGLE_MAP = "AIzaSyCM44BLQnnma6HSzo3JM4onKyo9U_1Lr7Q"; // Replace with your Google Maps API key

  useEffect(() => {
    fetchWeatherData(location);
  }, []);

  const fetchWeatherData = async (customLocation) => {
    setLoading(true);
    try {
      const city = customLocation || location;

      const forecastResponse = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY_WEATHER}&q=${city}&days=3&aqi=no&alerts=no`
      );
      const forecastResult = await forecastResponse.json();

      if (forecastResult.forecast?.forecastday) {
        setForecastData(forecastResult.forecast.forecastday);
      }

      const pastData = [];
      for (let i = 7; i >= 1; i--) {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - i);
        const formattedDate = pastDate.toISOString().split("T")[0];

        const historyResponse = await fetch(
          `http://api.weatherapi.com/v1/history.json?key=${API_KEY_WEATHER}&q=${city}&dt=${formattedDate}`
        );
        const historyResult = await historyResponse.json();

        if (historyResult.forecast?.forecastday) {
          pastData.push(historyResult.forecast.forecastday[0]);
        }
      }

      setPastWeatherData(pastData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLocation = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        setLoading(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY_GOOGLE_MAP}`
      );
      const data = await response.json();

      if (data.status === "OK") {
        const addressComponents = data.results[0].address_components;
        const cityComponent = addressComponents.find(component =>
          component.types.includes("locality")
        );
        const city = cityComponent ? cityComponent.long_name : "Unknown city";
        setLocation(city);
        fetchWeatherData(city);
      } else {
        alert("Unable to get city name");
      }
    } catch (error) {
      console.error("Error getting location:", error);
      alert("Error getting location");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Search Input and Map Icon */}
        <View style={{ marginLeft: 20, marginTop:10, marginBottom:20}}>
          <Text style={{alignSelf: "flex-start", fontSize:35, color:"#325A3E" }}>Plan Your </Text>
          <Text style={{alignSelf: "flex-start", fontSize:35, color:"#325A3E" }}>Plant Future..</Text>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter location"
            value={location}
            onChangeText={setLocation}
          />
          <TouchableOpacity style={styles.searchButton} onPress={() => fetchWeatherData(location)}>
          <Image
              source={{ uri: "https://img.icons8.com/?size=100&id=59878&format=png&color=000000" }}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={getLocation} style={{ justifyContent: "center", paddingHorizontal: 10 }}>
            <Image
              source={{ uri: "https://img.icons8.com/ios-filled/50/000000/marker.png" }}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.locationText}>Today in {location}📍</Text>

        {/* Current Weather */}
        {forecastData.length > 0 && (
          <View style={styles.currentWeatherCard}>
            <Image source={{ uri: `https:${forecastData[0].day.condition.icon}` }} style={styles.weatherIcon} />
            <Text style={styles.date}>Today</Text>
            <Text style={styles.condition}>{forecastData[0].day.condition.text}</Text>
            <Text>🌡 {forecastData[0].day.avgtemp_c}°C</Text>
            <Text>💧 {forecastData[0].day.avghumidity}% Humidity</Text>
            <Text>🌧 {forecastData[0].day.daily_chance_of_rain}% Rain</Text>
          </View>
        )}

        {/* Next 2 Days Forecast */}
        <Text style={styles.sectionTitle}>Next 2 Days Forecast</Text>
        <FlatList
          data={forecastData.slice(1)}
          keyExtractor={(item) => item.date}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          renderItem={({ item }) => (
            <View style={styles.weatherCard}>
              <Image source={{ uri: `https:${item.day.condition.icon}` }} style={styles.weatherIcon} />
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.condition}>{item.day.condition.text}</Text>
              <Text>🌡 {item.day.avgtemp_c}°C</Text>
            </View>
          )}
        />

        {/* Past 7 Days Weather */}
        <Text style={styles.sectionTitle}>Past 7 Days Weather</Text>
        <FlatList
          data={pastWeatherData}
          keyExtractor={(item) => item.date}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          renderItem={({ item }) => (
            <View style={styles.weatherCard}>
              <Image source={{ uri: `https:${item.day.condition.icon}` }} style={styles.weatherIcon} />
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.condition}>{item.day.condition.text}</Text>
              <Text>🌡 {item.day.avgtemp_c}°C</Text>
            </View>
          )}
        />

        {/* Pass to RAG Assistant */}
        <RAG forecastData={forecastData} pastWeatherData={pastWeatherData} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#ffff",
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: "#eaeaea",
    borderRadius: 5,
    padding: 5,
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 5,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  locationText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#007AFF",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#007AFF",
  },
  currentWeatherCard: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    alignSelf: "center",
    width: "90%",
    marginBottom: 20,
  },
  weatherCard: {
    backgroundColor: "#fff",
    padding: 10,
    marginHorizontal: 5,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: "center",
    minWidth: 140,
    maxWidth: 180,
  },
  weatherIcon: {
    width: 50,
    height: 50,
    marginVertical: 5,
  },
  date: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  condition: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default WeatherScreen;
