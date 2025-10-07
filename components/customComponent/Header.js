import { Ionicons } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';


import colors from '../../constants/colors';
import ProfileAvatar from "./ProfileAvatar";

const Header = ({ showBack, onBackPress, showProfileImage }) => {


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
                    <ProfileAvatar size={50} />
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
    
});

export default Header;
