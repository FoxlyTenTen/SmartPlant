import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";

const WeatherScreen = () => {
  const [forecastData, setForecastData] = useState(null);
  const [pastWeatherData, setPastWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);


  const LOCATION = "Kota Bharu";

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      // Fetch forecast data (next 6 days + today)
      const forecastResponse = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY_WEATHER}&q=${LOCATION}&days=7&aqi=no&alerts=no`
      );
      const forecastResult = await forecastResponse.json();
      setForecastData(forecastResult.forecast.forecastday);

      // Fetch past 7 days data using loop
      const pastData = [];
      for (let i = 1; i <= 7; i++) {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - i);
        const formattedDate = pastDate.toISOString().split("T")[0];

        const historyResponse = await fetch(
          `http://api.weatherapi.com/v1/history.json?key=${API_KEY_WEATHER}&q=${LOCATION}&dt=${formattedDate}`
        );
        const historyResult = await historyResponse.json();
        
        if (historyResult.forecast) {
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

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View>
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginVertical: 10 }}>
        6-Day Weather Forecast
      </Text>
      <FlatList
        data={forecastData.slice(1)} // Display only next 6 days (excluding today)
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Image source={{uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeuKWVciCv8coxTLawVGjWvsqWRUoe-whu2Q&s",
                      }} ></Image>
            <Text>Date: {item.date}</Text>
            <Text>Condition: {item.day.condition.text}</Text>
            <Text>Avg Temp: {item.day.avgtemp_c}°C</Text>
            <Text>Humidity: {item.day.avghumidity}%</Text>
            <Text>Chance of Rain: {item.day.daily_chance_of_rain}%</Text>
          </View>
        )}
      />
    </View>
  );
};

export default WeatherScreen;
