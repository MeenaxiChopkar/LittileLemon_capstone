/* create a pressable component with custom styles 
   create a prassable with text disable/ enable  property set backgroundcolor to white,
   text color to primarycolor1 from assests color file,
   border 1, borderColor to primarycolor1 from assests color file,
   on button press change buttong backgroundColor to  primarycolor1 from assests color file and textColor to white */
import { Pressable, Text } from "react-native";
import Colors from "../../constants/colors";

export default function MyButtonLight({ onPress, text, disabled,backgroundColor }) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                {
                    backgroundColor: disabled

                        ? Colors.dark_gray
                        : pressed
                            ? (backgroundColor || Colors.primary1)  
                            : (backgroundColor || 'white'),
                    borderWidth: 1,
                    borderColor: Colors.primary1,
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
            {({ pressed }) => (
                <Text style={{ color: disabled ? 'white' : (pressed ? 'white' : Colors.primary1), fontSize: 18, fontWeight: "bold", fontFamily: "Karla" }}>{text}</Text>
            )}
        </Pressable>
    );
}       