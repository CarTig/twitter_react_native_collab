import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authSlice";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from "react-native";

const LoginUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const auth = useSelector((state) => state.auth);

  const handleSubmit = () => {
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (auth.isAuthenticated && auth.status === "succeeded") {
      navigation.navigate("Home");
    }
  }, [auth.isAuthenticated, auth.status, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🔑 Sign In</Text>
        <Text style={styles.subtitle}>Please login to your account</Text>

        <View>
          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            required
            placeholder="yourname@example.com"
          />
        </View>

        <View>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            required
            placeholder="Enter your password"
            secureTextEntry
          />
        </View>
        <Text style={styles.loginLink}>
          You don't have an account?{" "}
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.linkText}>Register</Text>
          </TouchableOpacity>
        </Text>

        {auth.status === "failed" && (
          <Text style={styles.errorMessage}>
            {auth.error?.message || JSON.stringify(auth.error)}
          </Text>
        )}

        <Button
          title={auth.status === "loading" ? "Signing in..." : "Sign In"}
          onPress={handleSubmit}
          disabled={auth.status === "loading"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  loginLink: {
    fontSize: 14,
    marginBottom: 16,
  },
  linkText: {
    color: "#007BFF",
  },
  errorMessage: {
    color: "red",
    marginTop: 16,
  },
});

export default LoginUser;