import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EntryScreen from "./screens/EntryScreen";
import HomeScreen from "./screens/HomeScreen";
import MainScreen from "./screens/MainScreen";
import { COLORS } from "./lib/constants";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Entry"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.bg },
          animation: "fade",
        }}
      >
        <Stack.Screen name="Entry" component={EntryScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}