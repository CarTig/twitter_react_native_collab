import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/slices/authSlice.js";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Navbar = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate("Login");
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.navbar}>
      <View style={styles.container}>
        {/* Logo / Brand */}
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text style={styles.brand}>Tindor</Text>
        </TouchableOpacity>

        {/* Hamburger */}
        <TouchableOpacity onPress={toggleNavbar} style={styles.hamburger}>
          <Text style={styles.hamburgerIcon}>☰</Text>
        </TouchableOpacity>

        {/* Links */}
        {isOpen && (
          <View style={styles.links}>
            <TouchableOpacity onPress={() => navigation.navigate("Matches")}>
              <Text style={styles.link}>Matches</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
              <Text style={styles.link}>Messages</Text>
            </TouchableOpacity>
            {auth.token && (
              <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.link}>Logout</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    fontSize: 24,
    fontWeight: "bold",
  },
  hamburger: {
    padding: 10,
  },
  hamburgerIcon: {
    fontSize: 24,
  },
  links: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  link: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 18,
  },
});

export default Navbar;
