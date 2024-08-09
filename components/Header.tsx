import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Header = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { height: 50 + insets.top }]}>
      <BlurView intensity={100} tint="light" style={styles.blurView}>
        <View style={[styles.headerContent, { marginTop: insets.top }]}>
          <TouchableOpacity style={styles.appIcon}>
            {/* Replace with your app icon */}
            <Ionicons name="football" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Kickoff</Text>
          <TouchableOpacity style={styles.profileIcon}>
            <Ionicons name="person-circle-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    zIndex: 1,
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 60,
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
