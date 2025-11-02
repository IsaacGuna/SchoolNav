// Import necessary React and React Native components
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({route, navigation }) {
  const { name } = route.params || {};  // Retrieve name from Register Screen
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State to toggle password visibility
  
  

  const validateForm = () => {
    let errors = {};
  
    // Check if email is provided and validate email format
    if (!email) {
      errors.email = "Email is required.";
    } 
  
    // Check if password is provided
    if (!password) {
      errors.password = "Password is required.";
    }
  
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };
  


  const handleLogin = async () => {
    if (validateForm()) {
      try {
        const storedUser = await AsyncStorage.getItem('userDetails');
        const parsedUser = JSON.parse(storedUser);

        if (parsedUser && parsedUser.email === email && parsedUser.password === password) {
          console.log('Logged in:', email);
          navigation.navigate('Main Menu', { name }); // Navigate to the main menu after successful login
        } else {
          setErrors({ ...errors, email: 'Invalid email or password.' });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };

  console.log("App executed");


  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={20}
        >
          <StatusBar style="light" />
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View>
              <TouchableOpacity>
                <Image
                  fadeDuration={1000}
                  source={require('./assets/SchoolNavLogo.png')}
                  style={styles.headerImg}
                  alt="Logo"
                />
              </TouchableOpacity>
              <Text style={styles.title}>Sign-in</Text>
              <Text style={styles.subtitle}>
                Discover new ways to get to your classrooms and more...
              </Text>
            </View>


            <View style={styles.form}>
              <View style={styles.input}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.inputControl}
                  placeholder="john@example.com"
                  value={email}
                  onChangeText={setEmail}
                />
                {errors.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}
              </View>


              <View style={styles.input}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    secureTextEntry={!isPasswordVisible} // Toggle visibility
                    style={[styles.inputControl, styles.passwordInput]}
                    placeholder="********"
                    value={password}
                    onChangeText={setPassword}
                  />
                  {/* Toggle eye button */}
                  <TouchableOpacity
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    style={styles.eyeButton}
                  >
                    <Text style={styles.eyeText}>
                      {isPasswordVisible ? "👁" : "🙈"}
                    </Text>
                  </TouchableOpacity>
                </View>
                {errors.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}
              </View>


              <View style={styles.formAction}>
                <TouchableOpacity onPress={handleLogin}>
                  <View style={styles.btn}>
                    <Text style={styles.btnText}>Sign-in</Text>
                  </View>
                </TouchableOpacity>


                <TouchableOpacity
                  style={{ paddingTop: 25, alignSelf: 'center' }}
                  onPress={() => {
                    navigation.navigate("Main Menu");
                  }}
                >
                  <View style={styles.btn}>
                    <Text style={styles.btnText}>Guest?</Text>
                  </View>
                </TouchableOpacity>
              </View>


              <TouchableOpacity
                style={{ marginTop: 'auto' }}
                onPress={() => {
                  navigation.navigate('Register Page', {});
                }}
              >
                <View>
                  <Text style={styles.formFooter}>
                    Don't have an account or forgotten details?{' '}
                    <Text style={{ textDecorationLine: 'underline' }}>
                      Sign-up
                    </Text>
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    flex: 1,
    backgroundColor: "#38b6ff",
  },
  headerImg: {
    marginBottom: 0,
    alignSelf: 'center',
  },
  title: {
    color: '#333333',
    fontSize: 38,
    textAlign: 'center',
    fontFamily: 'serif',
    fontWeight: 'bold',
  },
  subtitle: {
    marginVertical: 10,
    fontSize: 17,
    fontWeight: '500',
    color: '#000033',
    textAlign: 'center'
  },
  input: {
    fontSize: 12
  },
  inputLabel: {
    marginBottom: 15,
    fontSize: 20,
    fontWeight: '600',
    color: '#222'
  },
  inputControl: {
    height: 44,
    marginBottom: 15,
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222'
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
  },
  eyeButton: {
    flex: 0,
    marginLeft: 10,
    marginBottom: 15,
  },
  eyeText: {
    fontSize: 18,
  },
  form: {
    marginBottom: 24,
    flex: 1,
  },
  formAction: {
    marginVertical: 24,
  },
  btn: {
    backgroundColor: '#075eec',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0r75eec',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  btnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  formFooter: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
    paddingHorizontal: 27,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 17,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    fontWeight: '400',
    alignSelf: 'flex-start'
  },
});


