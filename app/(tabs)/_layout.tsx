import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Header from "@/components/Header";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Header />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
        }}
        sceneContainerStyle={styles.sceneContainer}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: "Chat",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "chatbubble" : "chatbubble-outline"}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  sceneContainer: {
    flex: 1,
    marginTop: 0, // Adjust this value based on the desired header height
  },
});
