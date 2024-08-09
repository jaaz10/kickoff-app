import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Checkbox } from "react-native-paper";

const GOOGLE_PLACES_API_KEY = "AIzaSyDsPtpQBt8fTsYdBrLJj3IDKZ5gkLAl6m0";

interface Park {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

const Index = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [dontAskAgain, setDontAskAgain] = useState(false);
  const [nearbyParks, setNearbyParks] = useState<Park[]>([]);
  const [selectedPark, setSelectedPark] = useState<Park | null>(null);
  const [showReadyModal, setShowReadyModal] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied.");
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setUserLocation(currentLocation);

        fetchNearbyParks(currentLocation);
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

  useEffect(() => {
    if (userLocation && nearbyParks.length > 0) {
      const coordinates = [
        {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
        },
        ...nearbyParks.map((park) => ({
          latitude: park.latitude,
          longitude: park.longitude,
        })),
      ];

      mapRef.current?.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [userLocation, nearbyParks]);

  const fetchNearbyParks = async (location) => {
    try {
      const { latitude, longitude } = location.coords;
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=park&key=${GOOGLE_PLACES_API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK") {
        const parks: Park[] = data.results.map((result) => ({
          id: result.place_id,
          name: result.name,
          latitude: result.geometry.location.lat,
          longitude: result.geometry.location.lng,
        }));

        setNearbyParks(parks);
      } else {
        console.error("Error fetching nearby parks:", data.status);
      }
    } catch (error) {
      console.error("Error fetching nearby parks:", error);
    }
  };

  const handleCloseModal = async () => {
    setShowModal(false);
    if (dontAskAgain) {
      await AsyncStorage.setItem("showModal", "false");
    }
  };

  const handleMarkerPress = (park: Park) => {
    setSelectedPark(park);
    setShowReadyModal(true);
  };

  const handleReadyModalClose = () => {
    setSelectedPark(null);
    setShowReadyModal(false);
  };

  const handleReadyToPlay = () => {
    // Perform actions when the user is ready to play
    console.log(`User is ready to play at ${selectedPark?.name}`);
    handleReadyModalClose();
  };

  return (
    <View style={styles.container}>
      {userLocation ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: userLocation.coords.latitude,
            longitude: userLocation.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            }}
            pinColor="#2E8B57"
            title="You are here"
          >
            <Callout>
              <Text>You are here</Text>
            </Callout>
          </Marker>
          {nearbyParks.map((park) => (
            <Marker
              key={park.id}
              coordinate={{
                latitude: park.latitude,
                longitude: park.longitude,
              }}
              pinColor="#2E8B57"
              onPress={() => handleMarkerPress(park)}
            >
              <Callout>
                <Text>{park.name}</Text>
              </Callout>
            </Marker>
          ))}
        </MapView>
      ) : (
        <View style={styles.map}>
          <Text>Loading map...</Text>
          {errorMsg && <Text style={styles.errorMsg}>{errorMsg}</Text>}
        </View>
      )}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Welcome to Kickoff!</Text>
            <Text style={styles.modalText}>
              1. Find a nearby park on the map
            </Text>
            <Text style={styles.modalText}>
              2. Tap on a park marker to see its name
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
      <Modal visible={showReadyModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ready to Play?</Text>
            <Text style={styles.modalText}>
              Are you at {selectedPark?.name} and ready to play?
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleReadyToPlay}
            >
              <Text style={styles.modalButtonText}>I'm Ready!</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalCancelButton]}
              onPress={handleReadyModalClose}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
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
  modalCancelButton: {
    backgroundColor: "#ccc",
    marginTop: 10,
  },
});

export default Index;
