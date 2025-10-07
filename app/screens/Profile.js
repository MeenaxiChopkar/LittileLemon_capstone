import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import * as ImagePicker from "expo-image-picker";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import Header from "../../components/customComponent/Header";
import MyButton from "../../components/customComponent/MyButton";
import MyButtonLight from "../../components/customComponent/MyButtonLight";
import MyTextInput from "../../components/customComponent/MyTextInput";
import { showConfirmAlert } from "../../components/customComponent/alertHelper";
import { default as Colors } from '../../constants/colors';

export default function Profile({ navigation }) {
    
 // const profileUri = require("../../assets/images/profile.png"); // Replace with actual profile image
  const [profileUri, setprofileUri] = useState(null);
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
          const { profileUri,firstName,lastName, email, phone ,notificationPrefs} = JSON.parse(savedProfile);
          setprofileUri(profileUri);
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
    async function handleSaveChanges() 
    {
    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!validatePhone(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    } 

     showConfirmAlert({
      title: "Save confiramtion?",
      message: "your changes have been saved successfully!",
      cancelText: "okay",
      onCancel: () => console.log("User cancelled ❌"),
    });

     try {
      const profileData = { profileUri,firstName,lastName,email, phone ,notificationPrefs};
      await AsyncStorage.setItem("profileData", JSON.stringify(profileData));
      console.log("Profile saved!");

      showConfirmAlert({
      title: "Save confiramtion?",
      message: "your changes have been saved successfully!",
      yesText: "Okay",
      cancelText: "Cancel",
      onCancel: () => console.log("User cancelled ❌"),
      onYes:() => handleBackPress()
      });
    
    } catch (error) {
      console.log("Error saving profile:", error);
    }
  }
   // Save image
  const saveImage = async (uri) => {
    try {
      setprofileUri(uri);
    } catch (error) {
      console.log("Error saving image:", error);
    }
  };
   // Remove image
  const removeImage = () => {
    Alert.alert(
      "Remove Profile Picture",
      "Do you want to remove your profile picture?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            setprofileUri(null);
          },
        },
      ]
    );
  };
// Pick image from gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "We need access to your gallery.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) saveImage(result.assets[0].uri);
  };
   // Take photo
    const takePhoto = async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "We need access to your camera.");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) saveImage(result.assets[0].uri);
    };

  // Open menu
  const handleChangeImage = () => {
    Alert.alert(
      "Profile Picture",
      "Choose an option",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Pick from Gallery 📁", onPress: pickImage },
        { text: "Take Photo 📷", onPress: takePhoto },
        { text: "Remove Photo ❌", style: "destructive", onPress: removeImage },
      ],
      { cancelable: true }
    );
  };
  // Display initials if no image
  const getInitials = () => {
    const firstInitial = firstName?.[0]?.toUpperCase() || "";
    const lastInitial = lastName?.[0]?.toUpperCase() || "";
    return firstInitial + lastInitial;
  };



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
                        <TouchableOpacity onPress={handleChangeImage}>
                            {profileUri ? (<Image source={{ uri: profileUri }} style={styles.userImage} />
                              ) : (<View style={styles.userImage}>
                                        <Text style={styles.initialsText}>{getInitials()}</Text>
                                  </View>
                        )}
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonView}>
                       <MyButton  text="Change" onPress={handleChangeImage}/>
                    </View>
                    <View style={styles.buttonView}>
                      <MyButtonLight text="Remove" onPress={removeImage}/>
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
            <Toast />
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
    initialsText:{
        padding:20,
        fontSize: 32,
        color: Colors.white,
        fontWeight: "bold",
        textAlign: "center",
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
      borderRadius: 50,
      marginRight:20,
      backgroundColor: Colors.secondary1,
      alignItems:"center",
      justifyContent:"center",
    },
    buttonView:{
    paddingRight:10,
    paddingLeft:10,
    marginTop:10,

    }
});
