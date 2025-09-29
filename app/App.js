import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";

import Home from "./screens/Home";
import Onboarding from "./screens/Onboarding";
import Profile from "./screens/Profile";

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState("Onboarding");

  useEffect(() => {
    const checkLogin = async () => {
      const isLogin = await AsyncStorage.getItem("isLogin");
      setInitialRoute(isLogin === "true" ? "Home" : "Onboarding");
    };
    checkLogin();
    // Only run on app mount, not on every render
    }, []);

  useEffect(() => {
    const checkLogin = async () => {
      const userData = await AsyncStorage.getItem("profileData");
      if (userData) {
        setInitialRoute("Home"); // If logged in, go directly to Home
      }
    };
    checkLogin();
  }, []);

  return (
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
  );
}