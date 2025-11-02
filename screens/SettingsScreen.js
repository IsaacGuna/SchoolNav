import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Switch, StyleSheet, Modal, FlatList,Button, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Choose any icon set
import { Picker } from "@react-native-picker/picker"; // Import Picker for dropdown
// Get screen dimensions
const { width, height } = Dimensions.get('window');


// Scaling functions
const BASE_WIDTH = 375; // Reference width (e.g., iPhone 8)
const BASE_HEIGHT = 667; // Reference height (e.g., iPhone 8)
const scaleWidth = (size) => (width / BASE_WIDTH) * size;
const scaleHeight = (size) => (height / BASE_HEIGHT) * size;

const SettingsPage = ({navigation, route }) => {
  const [name, setName] = useState(route.params?.name || "Guest");
  const [schoolInfoExpanded, setSchoolInfoExpanded] = useState(false);
  const [personalInfoExpanded, setPersonalInfoExpanded] = useState(false);
  const [additionalSettingsExpanded, setAdditionalSettingsExpanded] = useState(false);
  const [formRoom, setFormRoom] = useState("");
  const [error, setError] = useState("");
  const [accessibilityNeeds, setAccessibilityNeeds] = useState(false);
  const [theme, setTheme] = useState("Light");
  const [isSearchSchoolModalVisible, setIsSearchSchoolModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // Control modal
  const [etaUnit, setEtaUnit] = useState("Minutes"); // Default ETA unit
  const [etaDropdownVisible, setEtaDropdownVisible] = useState(false); // Control ETA picker


    const schools = [
      { id: 1, name: "Seven Kings High School" },
      { id: 2, name: "Oaks Park High School" },
      { id: 3, name: "Brampton Manor Academy" },
      { id: 4, name: "Valentines High School" },
      { id: 5, name: "NCS" },
    ];
  
    const handleSearch = (query) => {
      setSearchQuery(query);
      if (query.trim() === "") {
        setSearchResults(schools); // Reset to full list if query is empty
      } else {
        const filteredSchools = schools.filter((s) =>
          s.name.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filteredSchools);
      }
    };

  const selectSchool = (schools) => {
    setIsSearchSchoolModalVisible(false);
    console.log(`Selected School ID: ${schools.name}`);
    // Implement school selection logic here
  };
  

  const validateName = (text) => {
    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)+$/; // Ensures at least two words with only letters
    if (!nameRegex.test(text)) {
      setError("Enter a valid full name (first and last name, letters only).");
    } else {
      setError("");
    }
    setName(text);
  };
  
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>

        {/* School Information Section */}
        <TouchableOpacity onPress={() => setSchoolInfoExpanded(!schoolInfoExpanded)} style={styles.button}>
          <View style={styles.buttonInner}>
            <Text style={styles.buttonText}>School Information</Text>
            <Icon name={schoolInfoExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24} color="black" />
          </View>
        </TouchableOpacity>
        {schoolInfoExpanded && (
          <View style={styles.dropdownContent}>
            <TouchableOpacity style={styles.subButton} onPress={() => setIsSearchSchoolModalVisible(true)}>
              <Text style={styles.subButtonText} >Select School</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Enter Form Room Number"
              keyboardType="numeric"
              value={formRoom}
              onChangeText={setFormRoom}
            />
            <TouchableOpacity style={styles.subButton}>
              <Text style={styles.subButtonText}>Time-Table Information</Text>
            </TouchableOpacity>
          </View>
        )}

         {/* Modal for Searching Schools */}
         <Modal visible={isSearchSchoolModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search for a school..."
                value={searchQuery}
                onChangeText={handleSearch}
              />
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.resultItem}
                    onPress={() => selectSchool(item)}
                  >
                    <Text style={styles.resultText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity style={styles.closeButton} onPress={() => setIsSearchSchoolModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

         {/* Personal Information Section */}
         <TouchableOpacity onPress={() => setPersonalInfoExpanded(!personalInfoExpanded)} style={styles.button}>
          <View style={styles.buttonInner}>
            <Text style={styles.buttonText}>Personal Information</Text>
            <Icon name={personalInfoExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24} color="black" />
          </View>
        </TouchableOpacity>
        {personalInfoExpanded && (
          <View style={styles.dropdownContent}>
            <Text style={[styles.subButtonText, { color: "white", textAlign: "left", paddingHorizontal: 10, paddingVertical: 5,}]}>Name:</Text>
            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              placeholder={name === "Guest" ? "Enter your full name" : "Change your name?"}
              value={name}
              onChangeText={validateName}
              autoCapitalize="words"
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <View style={styles.toggleContainer}>
              <Text style={[styles.subButtonText, { color: "white" }]}>Accessibility Needs</Text>
              <Switch value={accessibilityNeeds} onValueChange={setAccessibilityNeeds} />
            </View>
          </View>
        )}
        {/* Additional Settings Section */}
        <TouchableOpacity onPress={() => setAdditionalSettingsExpanded(!additionalSettingsExpanded)} style={styles.button}>
          <View style={styles.buttonInner}>
            <Text style={styles.buttonText}>Additional Settings</Text>
            <Icon name={additionalSettingsExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24} color="black" />
          </View>
        </TouchableOpacity>
        {additionalSettingsExpanded && (
          <View style={styles.dropdownContent}>
            <TouchableOpacity onPress={() => setTheme(theme === "Light" ? "Dark" : "Light")} style={styles.subButton}>
              <Text style={styles.subButtonText}>Theme: {theme}</Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.subButton}
            onPress={() => setEtaDropdownVisible(true)} // Show dropdown on press
              >
              <Text style={styles.subButtonText}>ETA Measure</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Dropdown Modal for ETA Unit Selection */}
        <Modal visible={etaDropdownVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.searchInput}>Select ETA Unit</Text>
              <Picker selectedValue={etaUnit} onValueChange={(itemValue) => setEtaUnit(itemValue)}>
                <Picker.Item label="Hours" value="Hours" />
                <Picker.Item label="Minutes" value="Minutes" />
                <Picker.Item label="Seconds" value="Seconds" />
              </Picker>
              <Button title="Confirm" onPress={() => setEtaDropdownVisible(false)} />
            </View>
          </View>
        </Modal>

        <TouchableOpacity onPress={() => navigation.navigate('Main Menu', {name, etaUnit})}
         style={{ marginTop: 'auto', alignSelf: 'center' }}
         disabled={!!error}>   
          <View>
            <Text style={styles.formFooter}>Return to Main Menu?</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#38b6ff",
    paddingHorizontal: 16,
    paddingVertical: 40,
  },
  title: {
    color: "#333333",
    fontSize: 38,
    textAlign: "center",
    fontFamily: "serif",
    fontWeight: "bold",
    textDecorationLine: 'underline', // Underlines the text
    marginVertical: 30,
  },
  buttonContent: {
    flexDirection: "row",  // Align text and icon horizontally
    alignItems: "center",   // Center vertically
  },
  button: {
    backgroundColor: "#38b6ff",
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    marginVertical: 8,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: 'bold',
  },
  dropdownContent: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 10,
    marginVertical: 8,
  },
  subButton: {
    backgroundColor: "#38b6ff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  subButtonText: {
    textAlign: "center",
    fontSize: 18,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    borderWidth: 2,
    borderColor: "black",
    fontSize: 14,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  formFooter: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
    padding: 20,
  
  },SearchLocation: {
    height: scaleHeight(60),
    borderColor: 'black',
    borderWidth: 3,
    borderRadius: scaleWidth(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: scaleHeight(8),
  },
  SearchLabel: {
    fontSize: scaleHeight(16),
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#38b6ff',
    borderRadius: scaleWidth(10),
    padding: scaleWidth(16),
    borderWidth: 3,
    borderColor: 'black'
  },
  searchInput: {
    borderBottomWidth: 1,
    marginBottom: scaleHeight(10),
    fontSize: scaleHeight(16),
  },
  resultItem: {
    padding: scaleHeight(10),
    borderBottomWidth: 1,
  },
  resultText: {
    fontSize: scaleHeight(16),
  },
  closeButton: {
    marginTop: scaleHeight(10),
    alignSelf: 'center',
  },
  closeButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: scaleHeight(16),
  },
  inputError: { 
    borderColor: "red" 
  },
  errorText: {
     color: "red", marginTop: 5 
    },
});

export default SettingsPage;

