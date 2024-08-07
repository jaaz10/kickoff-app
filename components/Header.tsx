import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

const Header = () => {
  return (
    <BlurView intensity={100} tint="light" style={styles.header}>
      <TouchableOpacity style={styles.appIcon}>
        {/* Replace with your app icon */}
        <Ionicons name="football" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Kickoff</Text>
      <TouchableOpacity style={styles.profileIcon}>
        <Ionicons name="person-circle-outline" size={24} color="#000" />
      </TouchableOpacity>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 110,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  appIcon: {
    marginRight: 8,
  },
  headerTitle: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
  },
  profileIcon: {
    marginLeft: 8,
  },
});

export default Header;
