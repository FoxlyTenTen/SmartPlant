import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Header from '@/components/header.js';
import History from '@/components/history.js';
import HistoryCard from '@/components/historyCard.js';
import News from '@/components/news.js';

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.text}>
        <Text style={styles.textInside}>Save Your</Text>
        <Text style={styles.textInside}>Plant Future..</Text>
      </View>
      <News />
      <History />
      <HistoryCard />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: "#FFFF",
  },
  text:{
    marginLeft: 20,
    marginTop: 10,
    
  },
  textInside:{
    fontFamily: "Inter",
    color: "#325A3E",
    fontSize: 35,
    
  }
});
