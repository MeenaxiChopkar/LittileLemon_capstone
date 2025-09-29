import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../../components/customComponent/Header";
import MyButton from "../../components/customComponent/MyButton";
import MyButtonLight from "../../components/customComponent/MyButtonLight";
import MyTextInput from "../../components/customComponent/MyTextInput";
import { showConfirmAlert } from "../../components/customComponent/alertHelper";
import { default as Colors } from '../../constants/colors';

export default function Profile({ navigation }) {
    
  const profileUri = require("../../assets/images/profile.png"); // Replace with actual profile image
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notificationPrefs, setNotificationPrefs] = useState({
    orderStatuses: false,
    passwordChanges: false,
    specialOffers: false,
    newsletter: false,
  });

// Load stored values on screen mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedProfile = await AsyncStorage.getItem("profileData");
        if (savedProfile) {
          const { firstName,lastName, email, phone ,notificationPrefs} = JSON.parse(savedProfile);
          setfirstName(firstName);
          setlastName(lastName);
          setEmail(email)
          setPhone(phone);
          setNotificationPrefs(notificationPrefs || {
            orderStatuses: false,
            passwordChanges: false,
            specialOffers: false,
            newsletter: false,
          });
        }
      } catch (error) {
        console.log("Error loading profile:", error);
      }
    };

    loadProfile();
  }, []);

      const handleProfilePress = () => {
          navigation.navigate('Profile');
      };

      const handleBackPress = () => {
          navigation.goBack();
      } 

      function handleFirstNameChange(text) {
        // Accept only letters
        const filtered = text.replace(/[^a-zA-Z]/g, "");
        setfirstName(filtered);
      }
      function handleLastNameChange(text) {
        // Accept only letters
        const filtered = text.replace(/[^a-zA-Z]/g, "");
        setlastName(filtered);
      }
      function handlePhoneChange(text) {
        // Accept only numbers
        const filtered = text.replace(/[^0-9]/g, "");
        setPhone(filtered);
      }

      function validatePhone(phone) {
        // Example: valid if 10 digits
        return /^\d{10}$/.test(phone);
      }
    
      function handleEmailChange(text) {
        setEmail(text);
      }
    
      function validateEmail(email) {
        // Simple email regex
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      }
    
     // save value to storage
    async function handleSaveChanges() {
    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!validatePhone(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    } 

     try {
      const profileData = { firstName,lastName,email, phone ,notificationPrefs};
      await AsyncStorage.setItem("profileData", JSON.stringify(profileData));
      console.log("Profile saved!");
    } catch (error) {
      console.log("Error saving profile:", error);
    }
  }
  

   // Clear data + reset form
  const clearProfile = async () => {
    try {
      await AsyncStorage.removeItem("profileData");
      setfirstName("");
      setlastName("");
      setEmail("");
      setPhone("");
      setNotificationPrefs({
        orderStatuses: false,
        passwordChanges: false, 
        specialOffers: false,
        newsletter: false,
      });
      console.log("All preferences cleared!");
    } catch (error) {
      console.log("Error clearing preferences:", error);
    }
  };

  // Confirmation before clearing
   const discardChanges = () => {
    showConfirmAlert({
      title: "Discard Changes?",
      message: "This will clear all saved profile data. Are you sure?",
      yesText: "Yes, Discard",
      cancelText: "Cancel",
      onYes: clearProfile,
      onCancel: () => console.log("User cancelled ❌"),
    });
  };
  // Confirmation before clearing
   const logoutConfirmation = () => {
    showConfirmAlert({
      title: "Logout app?",
      message: "This will clear all saved profile data. Are you sure?",
      yesText: "Yes, Logout",
      cancelText: "Cancel",
      onYes: handleLogout,
      onCancel: () => console.log("User cancelled ❌"),
    });
  };

   const handleLogout = async () => {
    await AsyncStorage.removeItem("profileData");
    navigation.replace("Onboarding");
  };
   

    return (  
        <SafeAreaView style={styles.container}>
            <Header showBack={true} onBackPress={handleBackPress} showProfileImage={true}></Header>
            <ScrollView>
            <View style={styles.subContainer}>
              <Text style={styles.title}>Personal information</Text>
                <View style={styles.imageContainer}>
                    <View>
                    <Text style={styles.avtar}>Avtar</Text>
                        <TouchableOpacity onPress={handleProfilePress}>
                            <Image style={styles.userImage} source={profileUri} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonView}>
                       <MyButton  text="Change" onPress={() => {}}></MyButton>
                    </View>
                    <View style={styles.buttonView}>
                      <MyButtonLight text="Remove" onPress={() => {}}></MyButtonLight>
                    </View>
                    
                </View>

                <MyTextInput label="First name" value={firstName} onChangeText={handleFirstNameChange} 
                          placeholder="Enter your first name" keyboardType="default" />
                <MyTextInput label="Last name" value={lastName} onChangeText={handleLastNameChange} 
                          placeholder="Enter your last name" keyboardType="default" />
                <MyTextInput label="Email" value={email} onChangeText={handleEmailChange} 
                          placeholder="Enter your email" keyboardType="email-address" />
                <MyTextInput label="Phone number" value={phone} onChangeText={handlePhoneChange} 
                          placeholder="Enter your phone number" keyboardType="phone" />
                          
                <View style={{ width: '100%', marginTop: 20 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>Email notifications</Text>
                            {[
                              { key: 'orderStatuses', label: 'Order statuses' },
                              { key: 'passwordChanges', label: 'Password changes' },
                              { key: 'specialOffers', label: 'Special offers' },
                              { key: 'newsletter', label: 'Newsletter' },
                            ].map((item) => (
                              <View key={item.key} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                <TouchableOpacity
                                  onPress={async () => {
                                    const newValue = !notificationPrefs[item.key];
                                    setNotificationPrefs((prev) => ({ ...prev, [item.key]: newValue }));
                                    await AsyncStorage.setItem('notificationPrefs', JSON.stringify({ ...notificationPrefs, [item.key]: newValue }));
                                  }}
                                  style={{
                                    height: 24,
                                    width: 24,
                                    borderRadius: 4,
                                    borderWidth: 2,
                                    borderColor: Colors.primary1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 12,
                                  }}
                                >
                                  {notificationPrefs[item.key] ? (
                                    <View style={{
                                      height: 14,
                                      width: 14,
                                      backgroundColor: Colors.primary1,
                                      borderRadius: 2,
                                    }} />
                                  ) : null}
                                </TouchableOpacity>
                                <Text style={{ fontSize: 15 }}>{item.label}</Text>
                              </View>
                            ))}
                          </View>
              <View style={{marginTop: 10, marginBottom: 10,width:'100%'}}>
                <Pressable onPress={logoutConfirmation}
                            style={({ pressed }) => [
                                {
                                    backgroundColor: pressed
                                            ? (Colors.primary1)
                                            : (Colors.primary2_yellow),
                                },
                                {
                                    paddingHorizontal: 15,
                                    height: 40,
                                    width: '100%',
                                    alignSelf: "stretch",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginVertical: 5,
                                    borderRadius: 8,
                                },
                            ]}               
                        >
                            <Text style={{ color: 'black', fontSize: 18, fontWeight: "bold", fontFamily: "Karla" }}>Log out</Text>
                        </Pressable>
              </View>

            <View style={{ flexDirection: "row" , justifyContent:"space-around", width:'100%', marginTop:10}}>
               <MyButtonLight  text="Discard changes" onPress={discardChanges}></MyButtonLight>
               <MyButton text="Save changes" onPress={handleSaveChanges}></MyButton>
            </View>
            </View>
            </ScrollView>
        </SafeAreaView>
        
    );
}


const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: Colors.bg_color,
    },
    subContainer:{
      flex: 1,
      alignItems: "flex-start",
      padding: 20,
      borderColor: Colors.light_gray2,
      borderWidth: 1,
      marginLeft: 10,
      marginRight: 10,
      borderRadius: 10,
    },
    title:{
      fontSize: 20,
      fontWeight: "bold",
      color:Colors.dark_gray,
    },
    avtar:{
      fontSize: 18,
      color:Colors.light_gray,
      fontWeight: "bold",
      fontFamily: "Karla",
    },
    imageContainer:{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      marginTop: 20,
      marginBottom: 20,
    },
    userImage:{
      height: 100,
      width: 100,
      borderRadius: 40,
      marginRight:20,
    },
    buttonView:{
    paddingRight:10,
    paddingLeft:10,
    marginTop:10,

    }
});
