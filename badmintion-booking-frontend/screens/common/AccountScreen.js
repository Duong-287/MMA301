import React, { useState } from "react";
import AccountLoggedIn from "../../components/AccountLoggedIn";
import AccountNotLoggedIn from "../../components/AccountNotLoggedIn";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const AccountScreen = () => {
  const { user, setUser, logout } = useAuth();

  const navigation = useNavigation();
  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const handleLogout = async () => {
    await logout();
    navigation.navigate("Home");
  };

  const handleRegister = () => {
    navigation.navigate("Login");
  };

  const handleBookingHistory = () => {
    console.log("Navigate to booking history");
  };

  const handleAppInfo = () => {
    console.log("Show app info");
  };

  const handleWhatsNew = () => {
    console.log("Show what's new");
  };

  const handleLanguage = () => {
    console.log("Show language settings");
  };

  // Logged-in specific handlers
  const handleNotification = () => {
    console.log("Show notifications");
  };

  const handleCalendar = () => {
    console.log("Show calendar");
  };

  const handleProfile = () => {
    console.log("Show profile");
  };

  const handlePassword = () => {
    console.log("Change password");
  };

  const handleVoucher = () => {
    console.log("Show vouchers");
  };

  const handleMembership = () => {
    console.log("Show membership");
  };

  const handleSettings = () => {
    console.log("Show settings");
  };

  if (user) {
    return (
      <AccountLoggedIn
        userName={user.name}
        userInitial={user.initial}
        onNotificationPress={handleNotification}
        onCalendarPress={handleCalendar}
        onProfilePress={handleProfile}
        onPasswordPress={handlePassword}
        onVoucherPress={handleVoucher}
        onMembershipPress={handleMembership}
        onBookingHistoryPress={handleBookingHistory}
        onAppInfoPress={handleAppInfo}
        onWhatsNewPress={handleWhatsNew}
        onLanguagePress={handleLanguage}
        onSettingsPress={handleSettings}
        onLogoutPress={handleLogout}
      />
    );
  }

  return (
    <AccountNotLoggedIn
      onLoginPress={handleLogin}
      onRegisterPress={handleRegister}
      onBookingHistoryPress={handleBookingHistory}
      onAppInfoPress={handleAppInfo}
      onWhatsNewPress={handleWhatsNew}
      onLanguagePress={handleLanguage}
    />
  );
};

export default AccountScreen;
