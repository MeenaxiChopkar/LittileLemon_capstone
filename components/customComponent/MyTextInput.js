/** create a custom component MyTextInput with 
 * Text 
 * fontSize: 20,
     fontcolo: Colors.light_gray,
     padding: 10,
     fontWeight: "bold",
     fontFamily: "Karla",
     accept text value and onChangeText as props
 *   TextInput  
     width: "100%",
    borderWidth: 2,
    borderColor: Colors.primary1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 18, accept keyboardtype,secureTextEntry as props   */

import { Text, TextInput, View } from "react-native";
import Colors from "../../constants/colors";
export default function MyTextInput({ label, value, onChangeText, placeholder, keyboardType, secureTextEntry })
 {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                style={styles.input}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
            />
        </View>
    );
}

const styles = {
    container: {
        width: "100%",
    },
    label: {
        fontSize: 18,
        color: Colors.light_gray,
        paddingBottom: 5,
        fontWeight: "bold",
        fontFamily: "Karla",
    },
    input: {
        width: "100%",
        borderWidth: 2,
        borderColor: Colors.primary1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
        fontSize: 18,
        fontFamily: "Karla",
    },
};

// usage of this component in onboarding 
// <MyTextInput label="First Name" value={firstName} onChangeText={setFirstName} 
// placeholder="Enter your first name" keyboardType="default" />
// <MyTextInput label="Email" value={email} onChangeText={setEmail} placeh
// older="Enter your email" keyboardType="email-address" />
// import MyTextInput from "../components/customComponent/MyTextInput";
