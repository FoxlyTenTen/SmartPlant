import { useEffect, useState } from 'react';
import { View, FlatList, ImageBackground, TouchableOpacity, Text, StyleSheet, Linking, TextInput,  Image} from 'react-native';

const API_KEY_NEWS = 'e173139bb8d749138531a3eaca3a0c58';

export default function NewsScreen() {
  const [news, setNews] = useState([]);
  const [inputUs, setInputUs] = useState("agriculture");

  const fetchNews = async () => {
    const NEWS_API_URL = `https://newsapi.org/v2/everything?qInTitle=${inputUs}&apiKey=${API_KEY_NEWS}`;

    try {
      const response = await fetch(NEWS_API_URL);
      const data = await response.json();
      setNews(data.articles);
      setInputUs("");
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <View style={styles.container}>
      {/* Input & Button Section */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter news keyword..."
          onChangeText={setInputUs}
          value={inputUs}
        />
        <TouchableOpacity style={styles.button} onPress={fetchNews}>
          <Image
                source={{ uri: "https://img.icons8.com/?size=100&id=59878&format=png&color=000000" }}
                style={{ width: 24, height: 24 }}
              />
        </TouchableOpacity>
      </View>

      {/* News List */}
      <FlatList
        data={news}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => Linking.openURL(item.url)}>
            <ImageBackground source={{ uri: item.urlToImage }} style={styles.image} imageStyle={{ borderRadius: 10 }}>
              <View style={styles.overlay}>
                <Text style={styles.title}>{item.title}</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 30,
    paddingVertical: 5,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#eaeaea",
    flex: 1,
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
  button: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    width: 250,
    height: 150,
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  title: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
