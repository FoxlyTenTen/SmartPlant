import { Text, TextInput, View, Alert, Button } from "react-native";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"; 
import { useState } from "react";
import { app } from "@/firebaseConfig"; 
import { useRouter } from "expo-router";

export default function Register() {
  const [username, setUsername] = useState(""); // New state for username
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const auth = getAuth(app);

  const registerHandler = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Set username in Firebase Auth
      await updateProfile(user, { displayName: username });

      Alert.alert("Success", "User registered!");
      
      router.replace("/logIn"); // Navigate to login
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Register New User
      </Text>

      {/* Username Input */}
      <TextInput
        placeholder="Enter username"
        value={username}
        onChangeText={(text) => setUsername(text)}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          width: "80%",
          padding: 10,
          marginVertical: 10,
          borderRadius: 5,
        }}
      />

      {/* Email Input */}
      <TextInput
        placeholder="Enter email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          width: "80%",
          padding: 10,
          marginVertical: 10,
          borderRadius: 5,
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <TextInput
        placeholder="Enter password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          width: "80%",
          padding: 10,
          marginVertical: 10,
          borderRadius: 5,
        }}
        secureTextEntry
      />

      {/* Register Button */}
      <View style={{ marginTop: 10, width: "80%" }}>
        <Button title="Register" onPress={registerHandler} />
      </View>

      {/* Sign In Button */}
      <View style={{ marginTop: 10, width: "80%" }}>
        <Button title="Sign In" onPress={() => router.replace("/logIn")} color="gray" />
      </View>
    </View>
  );
}
