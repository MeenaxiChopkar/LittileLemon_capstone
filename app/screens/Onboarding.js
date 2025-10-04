import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import Header from "../../components/customComponent/Header";
import MyButton from "../../components/customComponent/MyButton";
import MyTextInput from "../../components/customComponent/MyTextInput";
import Colors from '../../constants/colors';

export default function Onboarding({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [registeredUser, setRegisteredUser] = useState(null);

  // Load stored user on mount
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("profileData");
      console.log("Stored user data:", storedUser);
      if (storedUser) {
        const { firstName, email} = JSON.parse(storedUser);
        setFirstName(firstName || "");
        setEmail(email || "");
        setRegisteredUser(JSON.parse(storedUser));
      }
    };
    loadUser();
  }, []);

  function handleFirstNameChange(text) {
    // Accept only letters
    const filtered = text.replace(/[^a-zA-Z]/g, "");
    setFirstName(filtered);
  }

  function handleEmailChange(text) {
    setEmail(text);
  }

  function validateEmail(email) {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleNext() {
    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    
    try 
    {
      if (!registeredUser) {
        const newUser = { firstName, email };
        await AsyncStorage.setItem("profileData", JSON.stringify(newUser));
        navigation.replace("HomeTest");
        return;
      }
    // If user exists → validate
      if (
        firstName === registeredUser.firstName &&
        email === registeredUser.email) 
      {
        console.log("First name= "  + firstName + " Email= " + email);
        navigation.replace("HomeTest");
      } else {
        console.log("First name= "  + firstName + " Email= " + email);
        console.log("registeredUser.firstName= "  + registeredUser.firstName +
           " registeredUser.email= " + registeredUser.email);
        Alert.alert("Login Failed", "Invalid firstname or email");
      }

    } catch (error) {
      console.log("Error saving user data:", error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
 
      <Header onBackPress={false} showProfileImage={false}></Header>
     
      <View style={styles.heroView}>
          <Text style={styles.heading}> Littile Lemon </Text>
          <View  style={{ flexDirection: "row",justifyContent: "space-between", alignItems: "flex-start",  }}>
           <View style={{ width: "50%"}}>
             <Text style={styles.subHeading}> Chicago </Text>
             <Text
              style={styles.paraText}
              numberOfLines={6}
              ellipsizeMode="tail">
              We are family owened Mediterranean restaurant,foucused on traditional recipes served with a modern twist.
             </Text>
           </View>
            <Image style={styles.heroImage} source={require("../../assets/images/hero.png")} />
          </View>
      </View>

      <View style={styles.InputView}>
         <MyTextInput label="Name *" value={firstName} onChangeText={handleFirstNameChange} 
          placeholder="Enter your first name" keyboardType="default" />
        <MyTextInput label="Email *" value={email} onChangeText={handleEmailChange} 
          placeholder="Enter your email" keyboardType="email-address" />
      </View>

      <View style={styles.ButtonContainer}>
        <View style={{ width: "30%" }}>
          <MyButton
            text="  Next  "
            onPress={handleNext}
            disabled={
              firstName.trim().length === 0 || email.trim().length === 0
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.bg_color,
  },
  heroView: {
    flex: 1,
    width: "100%",
    padding: 20,
    backgroundColor: Colors.primary1,
  },
  heading:{
    fontSize: 42,
    marginLeft:-7,
    color: Colors.primary2_yellow,
    fontWeight: "bold",
    fontFamily: "Karla", // Apply Karla font
  },
  subHeading:{
    fontSize: 30,
    marginLeft:-7,
    color: Colors.white,
  },
  paraText:{
    color: Colors.white,
     fontSize: 18,
      marginTop: 10 
  },
  heroImage:{
    width: 180,
    height: 180,
    borderRadius: 10,
    marginTop: 10,
  },
  InputView:{
    width: "100%",
    flex: 0.3,
    alignItems: "flex-start",
    padding: 30,
  },
  
  ButtonContainer: {
    flex: 1,
    padding: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop:30,
  },
  Button: {
    width: "30%",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#c9caccff",
    borderRadius: 8,
    alignItems: "center",
  },
  ButtonText: {
    fontSize: 20,
    color: Colors.primary1,
    fontWeight: "bold",
  },
});
