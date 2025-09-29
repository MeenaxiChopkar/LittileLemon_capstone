/* create a pressable component with custom styles 
    and use it in the onboarding screen 
    create a prassable with text disable/ enable  property set color to primarycolor1 from assests color file*/
import { Pressable, Text } from "react-native";
import Colors from "../../constants/colors";

export default function MyButton({ onPress, text, disabled,backgroundColor }) {

    // Determine text color based on backgroundColor
    const isPrimary1 = (backgroundColor || Colors.primary1) === Colors.primary1;
    const textColor = isPrimary1 ? "white" : "black";

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                {
                    backgroundColor: disabled
                        ? Colors.dark_gray
                        : pressed
                            ? (backgroundColor || Colors.primary2_yellow)
                            : (backgroundColor || Colors.primary1),
                },
                {
                    paddingHorizontal: 15,
                    height: 40,
                    alignSelf: "flex-start",
                    alignItems: "center",
                    justifyContent: "center",
                    marginVertical: 5,
                    borderRadius: 8,
                },
            ]}
            disabled={disabled}
        >
            <Text style={{ color: textColor, fontSize: 18, fontWeight: "bold", fontFamily: "Karla" }}>{text}</Text>
        </Pressable>
    );
}
// usage of this component in onboarding screen
// <MyButton text="Next" onPress={()=> navigation.navigate("Home")} disabled={firstName.trim().length === 0 || lastName.trim().length === 0}/>
// import MyButton from "../components/customComponent/MyButton";
