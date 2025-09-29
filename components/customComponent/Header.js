import { Ionicons } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons
import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import colors from '../../constants/colors';

const Header = ({ showBack, onBackPress, showProfileImage }) => {
    const navigation = useNavigation();
    const profileUri = require("../../assets/images/profile.png"); // Replace with actual profile image
    
    const handleProfilePress = () => {
        navigation.navigate('Profile');
    };

    return (
        <View style={styles.container}>
            <View style={styles.sideContainer}>
                {showBack ? (
                    <TouchableOpacity onPress={onBackPress}>
                        <Ionicons name="arrow-back" size={28} color="#333" />
                    </TouchableOpacity>
                ) : null}
            </View>
            <Image source={require("../../assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
            <View style={styles.sideContainer}>
                {showProfileImage ? (
                    <TouchableOpacity onPress={handleProfilePress}>
                        <Image source={profileUri} style={styles.profile} />
                    </TouchableOpacity>
                ) : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 80,
        backgroundColor: colors.bg_color,
        paddingHorizontal: 16,
        justifyContent: 'space-between',
    },
    sideContainer: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        flex: 1,
        height: 40,
        alignSelf: 'center',
    },
    profile: {
        width: 50,
        height: 50,
        borderRadius: 18,
    },
});

export default Header;
