import "./global.css";

import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider } from "react-redux";
import { store } from "./src/app/state";
import OnboardingScreen from "./src/components/OnboardingScreen";
import { ThemeProvider } from "./src/contexts/ThemeContext";

export default function App() {
   const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    const hydrateOnboardingFlag = async () => {
      try {
        const stored = await AsyncStorage.getItem("onboardingCompleted");
        if (stored === "true") {
          setShowOnboarding(false);
        }
      } catch (error) {
      } finally {
        setIsHydrated(true);
      }
    };
    hydrateOnboardingFlag();
  }, []);

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem("onboardingCompleted", "true");
    } catch (error) {}
    setShowOnboarding(false);
  };

    if (!isHydrated) return null;


    const handleResetApp = () => {
    Alert.alert(
      "Reset App",
      "This will permanently delete all your tasks and reset the app to its initial state. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset App",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert(
                "Success",
                "App has been reset. Please restart the app."
              );
            } catch (error) {
              Alert.alert("Error", "Failed to reset app. Please try again.");
            }
          },
        },
      ]
    );
  };


  return (
    <Provider store={store}>
      <ThemeProvider>
        {showOnboarding ? (
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        ) : (
          <View className="flex-1 p-20">
            <Text>hello</Text>
            <Text onPress={handleResetApp}>Reset App</Text>
          </View>
        )}
      </ThemeProvider>
    </Provider>
  );
}
