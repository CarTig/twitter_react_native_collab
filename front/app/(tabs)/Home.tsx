import React, { useEffect, useState } from "react";
import axios from "axios";
import { View, Text, Button, StyleSheet, Animated } from "react-native";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animation, setAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    axios
      .get("http://localhost:4000/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Erreur:", err));
  }, []);

  const handleDislike = () => {
    Animated.timing(animation, {
      toValue: -500,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setAnimation(new Animated.Value(0));
      setCurrentIndex((prev) => prev + 1);
    });
  };

  const handleLike = () => {
    Animated.timing(animation, {
      toValue: 500,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setAnimation(new Animated.Value(0));
      setCurrentIndex((prev) => prev + 1);
    });
  };

  if (!users.length || currentIndex >= users.length) {
    return (
      <View style={styles.container}>
        <Text>No profile</Text>
      </View>
    );
  }

  const user = users[currentIndex];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, { transform: [{ translateX: animation }] }]}>
        <Text>{user.email}</Text>
      </Animated.View>
      <View style={styles.buttons}>
        <Button title="Dislike" onPress={handleDislike} />
        <Button title="Like" onPress={handleLike} />
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
    marginBottom: 16,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default Home;