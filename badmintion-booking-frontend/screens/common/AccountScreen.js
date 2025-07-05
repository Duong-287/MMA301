import React, { useState } from "react";
import AccountLoggedIn from "../../components/AccountLoggedIn";
import AccountNotLoggedIn from "../../components/AccountNotLoggedIn";


const AccountScreen = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = () => {
    // Simulate login
    setUser({
      name: "Phong Nguyễn Nam",
      initial: "P",
    });
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  const handleRegister = () => {
    console.log("Navigate to register screen");
  };

  // Common handlers
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

  if (isLoggedIn && user) {
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
