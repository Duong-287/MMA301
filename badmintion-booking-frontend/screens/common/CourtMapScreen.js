import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { getActiveGrounds } from "../../services/grounds";
import BottomNavigation from "../../components/BottomNavigation";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const CourtMapScreen = () => {
  const [courts, setCourts] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);
  const navigation = useNavigation();
  useEffect(() => {
    fetchLocation();
    fetchCourts();
  }, []);

  const fetchLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;
    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
  };

  const fetchCourts = async () => {
    try {
      const data = await getActiveGrounds();
      setCourts(data);
    } catch (err) {
      console.error("Lỗi lấy danh sách sân:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const focusToCourt = (court) => {
    mapRef.current.animateToRegion({
      latitude: court.latitude,
      longitude: court.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  if (loading || !location) {
    return <ActivityIndicator size="large" color="green" style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          showsUserLocation
        >
          {courts.map((ground) => (
            <Marker
              key={ground._id}
              coordinate={{
                latitude: ground.latitude,
                longitude: ground.longitude,
              }}
              onPress={() => navigation.navigate("CourtDetail", { ground })}
            >
              <Image
                source={require("../../assets/images/badminton_map.png")}
                style={styles.markerIcon}
              />
              <Callout tooltip>
                <View style={styles.callout}>
                  <Text style={styles.name}>{ground.name}</Text>
                  <Text style={styles.address}>{ground.address}</Text>
                  <Text style={styles.price}>
                    Giá: {ground.pricePerHour.toLocaleString()}đ/giờ
                  </Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>

        {/* Mini card sân */}
        <View style={styles.cardContainer}>
          <FlatList
            horizontal
            data={courts}
            keyExtractor={(item) => item._id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => focusToCourt(item)}
              >
                <Image
                  source={{ uri: item.images?.[0] }}
                  style={styles.cardImage}
                />
                <View style={styles.cardContent}>
                  <Text numberOfLines={1} style={styles.cardName}>
                    {item.name}
                  </Text>
                  <Text numberOfLines={1} style={styles.cardAddress}>
                    {item.address}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        <BottomNavigation />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  markerIcon: {
    width: 36,
    height: 36,
    resizeMode: "contain",
    borderRadius: 18,
    overflow: "hidden",
  },
  callout: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    width: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  name: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 2,
  },
  address: {
    fontSize: 12,
    color: "#555",
  },
  price: {
    marginTop: 4,
    fontSize: 12,
    color: "#2e7d32",
  },
  cardContainer: {
    position: "absolute",
    bottom: 70,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 10,
    overflow: "hidden",
    width: width * 0.6,
    elevation: 3,
    flexDirection: "row",
  },
  cardImage: {
    width: 60,
    height: 60,
  },
  cardContent: {
    flex: 1,
    padding: 8,
  },
  cardName: {
    fontWeight: "bold",
    fontSize: 13,
  },
  cardAddress: {
    fontSize: 11,
    color: "#666",
  },
});

export default CourtMapScreen;
