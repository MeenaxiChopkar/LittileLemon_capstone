import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/customComponent/Header";

export default function Home({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
    <Header showBack={false}  showProfileImage={true} />
          <View style={styles.logoContainer}>
          </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

})