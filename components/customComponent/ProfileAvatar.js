import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import colors from "../../constants/colors";

const ProfileAvatar = ({ size = 50 }) => {
  const [nameInitials, setNameInitials] = useState("");
  const [profileUri, setProfileUri] = useState(null);
  const navigation = useNavigation();

  // Fetch profile data whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const fetchProfileData = async () => {
        try {
          const savedProfile = await AsyncStorage.getItem("profileData");
          if (savedProfile) {
            const { profileUri, firstName, lastName } = JSON.parse(savedProfile);
            setProfileUri(profileUri);

            const firstInitial = firstName?.trim() ? firstName.charAt(0).toUpperCase() : "";
            const lastInitial = lastName?.trim() ? lastName.charAt(0).toUpperCase() : "";
            setNameInitials(`${firstInitial}${lastInitial}`);
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      };

      fetchProfileData();
    }, [])
  );

  const handlePress = () => {
    navigation.navigate("Profile"); // replace with your profile screen route
  };

  return (
    <Pressable onPress={handlePress}>
      <View
        style={[
          styles.avatarContainer,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        {profileUri ? (
          <Image
            source={{ uri: profileUri }}
            style={{ width: size, height: size, borderRadius: size / 2 }}
          />
        ) : (
          <Text style={[styles.initialsText, { fontSize: size / 2 }]}>
            {nameInitials}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    backgroundColor: colors.secondary1,
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ProfileAvatar;
