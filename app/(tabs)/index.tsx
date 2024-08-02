import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Checkbox } from "react-native-paper";

const Index = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [dontAskAgain, setDontAskAgain] = useState(false);

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        setUserLocation(currentLocation.coords);
      } catch (error) {
        setErrorMsg("Error retrieving location");
        console.error("Error retrieving location:", error);
      }
    };

    requestLocationPermission();
  }, []);

  useEffect(() => {
    const checkShowModal = async () => {
      const shouldShow = await AsyncStorage.getItem("showModal");
      if (shouldShow === null) {
        setShowModal(true);
      } else {
        setShowModal(false);
      }
    };

    checkShowModal();
  }, []);

  const handlePlayNow = async () => {
    if (userLocation) {
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Playing at the Park",
            body: "I'm currently playing soccer at this location!",
            data: { location: userLocation },
          },
          trigger: null,
        });
        console.log("Notification sent");
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    } else {
      setErrorMsg("Unable to send notification. Please try again.");
    }
  };

  const handleCloseModal = async () => {
    setShowModal(false);
    if (dontAskAgain) {
      await AsyncStorage.setItem("showModal", "false");
    }
  };

  return (
    <View style={styles.container}>
      {userLocation ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={userLocation} title="You are here" />
        </MapView>
      ) : (
        <View style={styles.map}>
          <Text>Loading map...</Text>
          {errorMsg && <Text style={styles.errorMsg}>{errorMsg}</Text>}
        </View>
      )}
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.button} onPress={handlePlayNow}>
          <Text style={styles.buttonText}>I'm Playing Now!</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Welcome to Kickoff!</Text>
            <Text style={styles.modalText}>1. Select your location</Text>
            <Text style={styles.modalText}>
              2. Tap "I'm Playing Now!" to send a notification
            </Text>
            <View style={styles.modalCheckboxContainer}>
              <Checkbox
                status={dontAskAgain ? "checked" : "unchecked"}
                onPress={() => setDontAskAgain(!dontAskAgain)}
              />
              <Text style={styles.modalCheckboxLabel}>Don't ask me again</Text>
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.modalButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  errorMsg: {
    color: "red",
    fontSize: 16,
    marginTop: 10,
  },
  overlay: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#2E8B57",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  modalCheckboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  modalCheckboxLabel: {
    fontSize: 16,
    marginLeft: 10,
  },
  modalButton: {
    backgroundColor: "#2E8B57",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Index;
