import { Alert } from "react-native";

export const showConfirmAlert = ({
  title = "Confirm",
  message = "Are you sure?",
  yesText = "Yes",
  cancelText = "Cancel",
  onYes = () => {},
  onCancel = () => {},
}) => {
  Alert.alert(title, message, [
    { text: cancelText, style: "cancel", onPress: onCancel },
    { text: yesText, style: "destructive", onPress: onYes },
  ]);
};