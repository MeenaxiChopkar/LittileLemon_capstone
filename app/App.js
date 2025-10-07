import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStackNavigator } from "@react-navigation/stack";
import { Video } from "expo-av";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import Home from "./screens/Home";
import Onboarding from "./screens/Onboarding";
import Profile from "./screens/Profile";

const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkUserData = async () => {
      try {
        const userDataPromise  = await AsyncStorage.getItem("profileData");

        const timerPromise = new Promise((resolve) => setTimeout(resolve, 5000)); // 5 seconds
        const [userData] = await Promise.all([userDataPromise, timerPromise]);

        console.log("User Data on onboarding screen:", userData);
        setInitialRoute(userData ? "Home" : "Onboarding");
        console.log("initialRoute==",initialRoute);
        
      } catch (error) {
        console.error("Error fetching user data:", error);
        setInitialRoute("Onboarding");
      }
    };

    checkUserData();
  }, []);

  // Wait until AsyncStorage check is done
  if (!initialRoute ) {
    return (
      <View style={styles.container}>
        <Video
          source={require("../assets/video/splashScreenVideo.mp4")} // put your file in assets
          style={styles.video}
          resizeMode="cover"
          shouldPlay
          isLooping={true}
          
        />
      </View>
    );
  }

  // Render navigator only after route is known
  return (
   
      <Stack.Navigator initialRouteName={initialRoute}
         screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    
  );
}

// export default function App() {
//   const [initialRoute, setInitialRoute] = useState("Onboarding");

//   useEffect(() => {
//     (async () => {
//       try {
//         const userData = await AsyncStorage.getItem("profileData");
//         console.log("User Data on onboarding screen:", userData);
//         setInitialRoute(userData ? "HomeTest" : "Onboarding");
//         console.log("Initial Route:", userData ? "HomeTest" : "Onboarding");
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     })();
//   }, []);

//   return (
//       <Stack.Navigator
//         initialRouteName={initialRoute}
//         screenOptions={{ headerShown: false }}
//       >
//         <Stack.Screen name="Onboarding" component={Onboarding} />
//         <Stack.Screen name="HomeTest" component={HomeTest} />
//         <Stack.Screen name="Profile" component={Profile} />
//       </Stack.Navigator>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});