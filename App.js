import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../SchoolNav/screens/LoginScreen";
import RegisterScreen from "../SchoolNav/screens/RegisterScreen";
import MainMenu from "../SchoolNav/screens/MainMenu";
import Settings from "../SchoolNav/screens/SettingsScreen";

const Stack = createNativeStackNavigator()


export default function App() {
  return(
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ animationEnabled: true }}>
        <Stack.Screen 
        name="Login Page" 
        component={LoginScreen} 
        options={{ headerShown: false }} // Hide the header
        />
        <Stack.Screen 
        name="Register Page" 
        component={RegisterScreen}
        options={{ headerShown: false }} // Show the header
        initialParams={{
          
        }}
        />
        <Stack.Screen 
        name="Main Menu" 
        component={MainMenu} 
        options={{ headerShown: false }} // Hide the header
        initialParams={{
          name: 'Guest',
        }}
        />
        <Stack.Screen 
        name="Settings Page" 
        component={Settings} 
        options={{ headerShown: false }} // Hide the header
        initialParams={{
          name: 'Guest',
        }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}