import React, { useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let errors = {};
    if (!name) errors.name = 'Name is required.';
    if (!email) {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!password) errors.password = 'Password is required.';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        // Save user data to AsyncStorage
        await AsyncStorage.setItem('userDetails', JSON.stringify({ name, email, password }));
        console.log('Registered:', email, password);

        // Clear the form fields
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setErrors({});

        // Navigate to Login page
        navigation.navigate('Login Page', {name}); //Pass name as a parameter
        
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} keyboardVerticalOffset={20}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View>
              <Text style={styles.title}>Register your account</Text>
              <Text style={styles.subtitle}>Create an account to access SchoolNav features.</Text>
            </View>

            <View style={styles.form}>
              {/* Name Input */}
              <View style={styles.input}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput autoCapitalize="True" autoCorrect={false} style={styles.inputControl} placeholder="John Smith" value={name} onChangeText={setName} />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              {/* Email Input */}
              <View style={styles.input}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput autoCapitalize="none" autoCorrect={false} style={styles.inputControl} placeholder="john@example.com" value={email} onChangeText={setEmail} />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              {/* Password Input */}
              <View style={styles.input}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput secureTextEntry style={styles.inputControl} placeholder="********" value={password} onChangeText={setPassword} />
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>

              {/* Confirm Password Input */}
              <View style={styles.input}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <TextInput secureTextEntry style={styles.inputControl} placeholder="********" value={confirmPassword} onChangeText={setConfirmPassword} />
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
              </View>

              {/* Submit Button */}
              <View style={styles.formAction}>
                <TouchableOpacity onPress={handleSubmit}>
                  <View style={styles.btn}>
                    <Text style={styles.btnText}>Register</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => navigation.navigate('Login Page')} style={{ marginTop: 'auto', alignSelf: 'center' }}>
                <View>
                  <Text style={styles.formFooter}>Already have an account? <Text style={{ textDecorationLine: 'underline' }}>Sign in</Text></Text>
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
    backgroundColor: '#38b6ff',
    paddingVertical: '70%',
  },
  title: {
    color: '#333333',
    fontSize: 38,
    textAlign: 'center',
    fontFamily: 'serif',
    fontWeight: 'bold',
    paddingBottom: 30,
  },
  subtitle: {
    marginVertical: 10,
    fontSize: 17,
    fontWeight: '500',
    color: '#000033',
    textAlign: 'center',
  },
  input: {
    fontSize: 12,
  },
  inputLabel: {
    marginBottom: 15,
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
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
    color: '#222',
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
    borderColor: '#075eec',
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
    alignSelf: 'flex-start',
  },
  
});
