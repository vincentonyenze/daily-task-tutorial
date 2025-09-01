import "./global.css";

import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "./src/app/state";

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaView>
        <View>
          <Text className="text-red-500">
            Helloo
          </Text>
          <StatusBar style="auto" />
        </View>
      </SafeAreaView>
    </Provider>
  );
}
