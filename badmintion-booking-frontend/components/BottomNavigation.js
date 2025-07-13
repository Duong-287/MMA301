import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function BottomNavigation({ activeTab }) {
  const navigation = useNavigation();
  return (
    <View style={styles.bottomNavigation}>
      <View style={styles.navIndicator} />
      <View style={styles.navContainer}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Home")}
        >
          <View style={activeTab === "Home" ? styles.navItemActive : null}>
            <Text
              style={
                activeTab === "Home" ? styles.navIconActive : styles.navIcon
              }
            >
              🏠
            </Text>
            {activeTab === "Home" && <View style={styles.navActiveGlow} />}
          </View>
          <Text
            style={activeTab === "Home" ? styles.navTextActive : styles.navText}
          >
            Trang chủ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("CourtMapScreen")}
        >
          <Text style={styles.navIcon}>🗺️</Text>
          <Text style={styles.navText}>Bản đồ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>⭐</Text>
          <Text style={styles.navText}>Nổi bật</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Account")}
        >
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Tài khoản</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNavigation: {
    height: 70,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    justifyContent: "flex-end",
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  navItem: {
    alignItems: "center",
  },
  navItemActive: {
    alignItems: "center",
  },
  navIcon: {
    fontSize: 20,
    color: "#999",
  },
  navIconActive: {
    fontSize: 20,
    color: "#00c58d",
    fontWeight: "bold",
  },
  navText: {
    fontSize: 12,
    color: "#999",
  },
  navTextActive: {
    fontSize: 12,
    color: "#00c58d",
    fontWeight: "bold",
  },
  navActiveGlow: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#00c58d",
    marginTop: 4,
  },
});
