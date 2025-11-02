import React, { useEffect, useState, useRef } from 'react';
import { Linking, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Polyline } from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Modal,
  FlatList,
  ScrollView,
  Button,

} from 'react-native';
import * as Location from 'expo-location';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Scaling functions
const BASE_WIDTH = 375; // Reference width (e.g., iPhone 8)
const BASE_HEIGHT = 667; // Reference height (e.g., iPhone 8)
const scaleWidth = (size) => (width / BASE_WIDTH) * size;
const scaleHeight = (size) => (height / BASE_HEIGHT) * size;

// Hardcoded places
const places = [
{id: 2, name: 'Rm 26',latitude: 51.568172547493674,longitude: 0.0868942453397814},
{id: 3, name: 'Rm 25',latitude: 51.56823145571189,longitude:0.08689513960044692  },
{id: 4,name: 'Rm 27', latitude: 51.56826029831658,longitude: 0.08689678819390867},
{id: 5,name: 'Rm 28', latitude: 51.568304201545864,longitude: 0.08689678835761772},
{id: 7,name: 'Rm 29', latitude: 51.568384227566234,longitude: 0.08689857663338518},
{id: 8, name: 'Rm 24',latitude: 51.568413681519125,longitude: 0.08689678860318129},
{id: 9, name: 'Rm 30',latitude: 51.56844146824725,longitude: 0.08689768270013776},
{id: 11, name: 'Sports Hall',latitude: 51.568549280637356,longitude: 0.08690841169990637},
{id: 12, name: 'Rm 23',latitude: 51.56850037611065,longitude: 0.0870148059635456},
{id: 15, name: 'Rm 6', latitude: 51.56838978470056,longitude: 0.08657671196087069},
{id: 16, name: 'Rm 5',latitude: 51.56834754872497,longitude:0.08658028826684205 },
{id: 17, name: 'Rm 4',latitude: 51.56834588150305,longitude: 0.0864998220782498},
{id: 18, name: 'Rm 3',latitude: 51.56834365852768,longitude: 0.08635766508231502},
{id: 19, name: 'Rm 2',latitude: 51.568346992933456,longitude: 0.08623785977360132},
{id: 20, name: 'Rm 1',latitude: 51.56834254704632,longitude: 0.08609570277766654},
{id: 22, name: 'Main Reception', latitude:51.56826418811395 ,longitude: 0.08591957116149462},
{id: 28,name: 'Rm 18', latitude: 51.568353661617074,longitude: 0.08556373178688848},
{id: 29,name: 'Rm 17', latitude: 51.56835532881327,longitude:0.08540190514903845 },
{id: 30, name: 'Rm 16',latitude: 51.56835032717761,longitude: 0.08526779478014834},
{id: 33,name: 'Dining Hall', latitude: 51.5685076002505,longitude: 0.0851408367776374},
{id: 34, name: 'Rm 15',latitude:51.56839645321098 ,longitude: 0.08526868871339577},
{id: 35, name: 'Rm 19',latitude:51.568419794090715 ,longitude: 0.08526779469829382},
{id: 36, name: 'Rm 14',latitude: 51.56845202671261,longitude: 0.08527137092241066},
{id: 37, name: 'Rm 20',latitude: 51.568480924877015,longitude: 0.08527584124348397},
{id: 38,name: 'Rm 13', latitude:51.568527606495635 ,longitude: 0.08527673550414949},
{id: 39, name: 'Rm 21',latitude: 51.568551503058885,longitude: 0.08528120590707733	},
{id: 40, name: 'Rm 12',latitude: 51.568602630514086,longitude: 0.08527852369806244},
{id: 44, name: 'Boys Toilet', latitude: 51.568752122405726,longitude:0.08535094366888263 },
{id: 45, name: 'Rm 11',latitude: 51.56869988361901,longitude: 0.08549757114959977},
{id: 46, name: 'Art Tech', latitude: 51.56869988361027,longitude:0.08563436389121382 },
{id: 47, name: 'Rm 10',latitude: 51.56869599348525,longitude: 0.08573539373682326},
{id: 49, name: 'Main Hall',latitude:51.56851871458137 ,longitude: 0.08592672475569163},
{id: 52, name: 'Rm 8',latitude: 51.568693770453066,longitude: 0.08608586934823581},
{id: 53, name: 'IT2',latitude: 51.56869265897152,longitude: 0.08624233156805605},
{id: 54, name: 'IT Tech',latitude: 51.56869377043558,longitude: 0.08630491647235505},
{id: 55, name: 'IT1',latitude: 51.56868988031005,longitude:0.08641131073599428 },
{id: 57, name: 'Girls Toilet',latitude: 51.56874767637935,longitude: 0.08646942523736545},
{id: 60,name: 'Gym', latitude: 51.56891550688693,longitude:0.08638448872769988 },
{id: 61, name: 'SCI Staff',latitude: 51.56892439853998,longitude: 0.08611358569905025},
{id: 64, name: 'Astro Turf',latitude: 51.569202817912135,longitude: 0.08631296350867235},
{id: 65,name: 'Lecture Theatre',  latitude: 51.569019983695,longitude: 0.08667684983774127},
{id: 68,  name: '6th Form Common Room',latitude: 51.569051660128366,longitude: 0.08694954138772193},
{id: 70, name: 'Staff Room',latitude: 51.568599851179364,longitude: 0.08656956188641818},
{id: 72, name: 'Rm 7',latitude: 51.56844480127132,longitude:0.08657939678923032 },
{id: 73,name: 'Library', latitude:51.56854927938607 ,longitude:0.0866893672769864 }

];

const nodes = [
{id:0, latitude: 51.568163655684835 ,longitude: 0.08689513935488336},
{id: 1, latitude: 51.568163655684835 ,longitude: 0.08689513935488336},
{id: 2, latitude: 51.568172547493674,longitude: 0.0868942453397814},
{id: 3, latitude: 51.56823145571189,longitude:0.08689513960044692  },
{id: 4, latitude: 51.56826029831658,longitude: 0.08689678819390867},
{id: 5, latitude: 51.568304201545864,longitude: 0.08689678835761772},
{id: 6, latitude: 51.568360886676196,longitude: 0.08689678843947224},
{id: 7, latitude: 51.568384227566234,longitude: 0.08689857663338518},
{id: 8, latitude: 51.568413681519125,longitude: 0.08689678860318129},
{id: 9, latitude: 51.56844146824725,longitude: 0.08689768270013776},
{id: 10, latitude: 51.56850259901476,longitude: 0.08690125908796364},
{id: 11, latitude: 51.568549280637356,longitude: 0.08690841169990637},
{id: 12, latitude: 51.56850037611065,longitude: 0.0870148059635456},
{id: 13, latitude: 51.568355884808206,longitude: 0.08665091979818573},
{id: 14, latitude: 51.56838533883034,longitude: 0.08665091979818573},
{id: 15, latitude: 51.56838978470056,longitude: 0.08657671196087069},
{id: 16, latitude: 51.56834754872497,longitude:0.08658028826684205 },
{id: 17, latitude: 51.56834588150305,longitude: 0.0864998220782498},
{id: 18, latitude: 51.56834365852768,longitude: 0.08635766508231502},
{id: 19, latitude: 51.568346992933456,longitude: 0.08623785977360132},
{id: 20, latitude: 51.56834254704632,longitude: 0.08609570277766654},
{id: 21, latitude: 51.5683342109861,longitude: 0.08592672369158283},
{id: 22, latitude:51.56826418811395 ,longitude: 0.08591957116149462},
{id: 23, latitude: 51.56826641106776,longitude: 0.08584446939093215},
{id: 24, latitude:51.56833309947904 ,longitude: 0.0858283761368428},
{id: 25, latitude:51.56833309947904 ,longitude: 0.0858283761368428},
{id: 26, latitude: 51.5683492158069,longitude: 0.08572377006711651},
{id: 27, latitude: 51.56835366165524,longitude: 0.08566386745368693},
{id: 28, latitude: 51.568353661617074,longitude: 0.08556373178688848},
{id: 29, latitude: 51.56835532881327,longitude:0.08540190514903845 },
{id: 30, latitude: 51.56835032717761,longitude: 0.08526779478014834},
{id: 31, latitude: 51.56834921568767,longitude: 0.08519716324880466},
{id: 32, latitude: 51.568351994369166,longitude:0.08515067159859502 },
{id: 33, latitude: 51.5685076002505,longitude: 0.0851408367776374},
{id: 34, latitude:51.56839645321098 ,longitude: 0.08526868871339577},
{id: 35, latitude:51.568419794090715 ,longitude: 0.08526779469829382},
{id: 36, latitude: 51.56845202671261,longitude: 0.08527137092241066},
{id: 37, latitude: 51.568480924877015,longitude: 0.08527584124348397},
{id: 38, latitude:51.568527606495635 ,longitude: 0.08527673550414949},
{id: 39, latitude: 51.568551503058885,longitude: 0.08528120590707733	},
{id: 40, latitude: 51.568602630514086,longitude: 0.08527852369806244},
{id: 41, latitude: 51.56865987097896,longitude: 0.08528299410099027},
{id: 42, latitude: 51.568662093908664,longitude:0.08535094350517358 },
{id: 43, latitude: 51.56869988367147,longitude: 0.08535183768398458},
{id: 44, latitude: 51.568752122405726,longitude:0.08535094366888263 },
{id: 45, latitude: 51.56869988361901,longitude: 0.08549757114959977},
{id: 46, latitude: 51.56869988361027,longitude:0.08563436389121382 },
{id: 47, latitude: 51.56869599348525,longitude: 0.08573539373682326},
{id: 48, latitude:51.5687009950654 ,longitude: 0.08592851286775005},
{id: 49, latitude:51.56851871458137 ,longitude: 0.08592672475569163},
{id: 50, latitude: 51.56869599345028,longitude: 0.08604027171312811},
{id: 51, latitude: 51.568738784769636,longitude: 0.08603937769802616},
{id: 52, latitude: 51.568693770453066,longitude: 0.08608586934823581},
{id: 53, latitude: 51.56869265897152,longitude: 0.08624233156805605},
{id: 54, latitude: 51.56869377043558,longitude: 0.08630491647235505},
{id: 55, latitude: 51.56868988031005,longitude:0.08641131073599428 },
{id: 56, latitude:51.568688768828416 ,longitude: 0.08648462447635286},
{id: 57, latitude: 51.56874767637935,longitude: 0.08646942523736545},
{id: 58, latitude:51.56833309947904 ,longitude: 0.0858283761368428},
{id: 59, latitude: 51.568753233625074,longitude:0.08638627692161283 },
{id: 60, latitude: 51.56891550688693,longitude:0.08638448872769988 },
{id: 61, latitude: 51.56892439853998,longitude: 0.08611358569905025},
{id: 62, latitude: 51.569009980751396,longitude:0.08637912439152462 },
{id: 63, latitude: 51.56901275937503,longitude: 0.08630759884507899},
{id: 64, latitude: 51.569202817912135,longitude: 0.08631296350867235},
{id: 65, latitude: 51.569019983695,longitude: 0.08667684983774127},
{id: 66, latitude: 51.56901553786016,longitude:0.08681006635523847 },
{id: 67, latitude: 51.56904332421962,longitude:0.08681543085512278 },
{id: 68, latitude: 51.569051660128366,longitude: 0.08694954138772193},
{id: 69, latitude: 51.568682655383554,longitude: 0.08656956180456366},
{id: 70, latitude: 51.568599851179364,longitude: 0.08656956188641818},
{id: 71, latitude: 51.568548723669366,longitude:0.0865686677894617 },
{id: 72, latitude: 51.56844480127132,longitude:0.08657939678923032 },
{id: 73, latitude:51.56854927938607 ,longitude:0.0866893672769864 }

  
];

const edges = [
  {from: 1,to: 2,weight: calculateDistance(nodes[1], nodes[2]) },
  {from: 2,to: 3,weight: calculateDistance(nodes[ 2], nodes[ 3]) },
  {from: 3,to: 4,weight: calculateDistance(nodes[3 ], nodes[ 4]) },
  {from: 4,to: 5,weight: calculateDistance(nodes[ 4], nodes[ 5]) },
  {from: 5,to: 6,weight: calculateDistance(nodes[5 ], nodes[ 6]) },
  {from: 6,to: 7,weight: calculateDistance(nodes[6 ], nodes[7 ]) },
  {from: 7,to: 8,weight: calculateDistance(nodes[7], nodes[ 8]) },
  {from: 8,to: 9,weight: calculateDistance(nodes[ 8], nodes[9 ]) },
  {from: 9,to: 10,weight: calculateDistance(nodes[ 9], nodes[10 ]) },
  {from: 10,to: 11,weight: calculateDistance(nodes[ 10], nodes[11 ]) },
  {from:10 ,to: 12,weight: calculateDistance(nodes[10 ], nodes[12 ]) },
  {from: 6,to: 13,weight: calculateDistance(nodes[6 ], nodes[13 ]) },
  {from: 13,to: 14,weight: calculateDistance(nodes[ 13], nodes[14 ]) },
  {from: 14,to: 15,weight: calculateDistance(nodes[ 14], nodes[15 ]) },
  {from: 15,to:16 ,weight: calculateDistance(nodes[15 ], nodes[16 ]) },
  {from:16 ,to: 17,weight: calculateDistance(nodes[ 16], nodes[ 17]) },
  {from:17 ,to: 18,weight: calculateDistance(nodes[ 17], nodes[ 18]) },
  {from: 18,to:19 ,weight: calculateDistance(nodes[18 ], nodes[19 ]) },
  {from: 19,to:20 ,weight: calculateDistance(nodes[ 19], nodes[20 ]) },
  {from: 20,to: 21,weight: calculateDistance(nodes[ 20], nodes[21 ]) },
  {from: 21,to: 22,weight: calculateDistance(nodes[ 21], nodes[22 ]) },
  {from: 21,to: 24,weight: calculateDistance(nodes[21 ], nodes[24 ]) },
  {from: 22,to: 23,weight: calculateDistance(nodes[ 22], nodes[23 ]) },
  {from: 24,to: 26,weight: calculateDistance(nodes[ 24], nodes[ 26]) },
  {from: 27,to: 26,weight: calculateDistance(nodes[ 27], nodes[ 26]) },
  {from: 27,to: 28,weight: calculateDistance(nodes[ 27], nodes[28 ]) },
  {from: 28,to: 29,weight: calculateDistance(nodes[28 ], nodes[29 ]) },
  {from: 29,to: 30,weight: calculateDistance(nodes[29 ], nodes[ 30]) },
  {from: 30,to: 31,weight: calculateDistance(nodes[ 30], nodes[31 ]) },
  {from: 31,to: 32,weight: calculateDistance(nodes[31 ], nodes[32 ]) },
  {from: 32,to: 33,weight: calculateDistance(nodes[ 32], nodes[33 ]) },
  {from: 30,to: 34,weight: calculateDistance(nodes[30 ], nodes[34 ]) },
  {from: 34,to: 35,weight: calculateDistance(nodes[34 ], nodes[35 ]) },
  {from: 35,to: 36,weight: calculateDistance(nodes[ 35], nodes[ 36]) },
  {from: 36,to: 37,weight: calculateDistance(nodes[36 ], nodes[ 37]) },
  {from: 38,to:37 ,weight: calculateDistance(nodes[37 ], nodes[38 ]) },
  {from: 38,to: 39,weight: calculateDistance(nodes[ 38], nodes[ 39]) },
  {from: 39,to: 40,weight: calculateDistance(nodes[ 39], nodes[ 40]) },
  {from: 40,to: 41,weight: calculateDistance(nodes[40 ], nodes[ 41]) },
  {from: 41,to: 42,weight: calculateDistance(nodes[ 41], nodes[42 ]) },
  {from: 42,to: 43,weight: calculateDistance(nodes[42 ], nodes[43 ]) },
  {from: 43,to:44 ,weight: calculateDistance(nodes[ 43], nodes[44 ]) },
  {from: 43,to: 45,weight: calculateDistance(nodes[43 ], nodes[45 ]) },
  {from: 45,to: 46,weight: calculateDistance(nodes[ 45], nodes[46 ]) },
  {from: 46,to: 47,weight: calculateDistance(nodes[46 ], nodes[47 ]) },
  {from: 47,to: 48,weight: calculateDistance(nodes[47 ], nodes[48 ]) },
  {from: 48,to: 49,weight: calculateDistance(nodes[48 ], nodes[ 49]) },
  {from: 49,to: 21,weight: calculateDistance(nodes[49 ], nodes[21 ]) },
  {from: 48,to: 50,weight: calculateDistance(nodes[48 ], nodes[50 ]) },
  {from: 50,to: 51,weight: calculateDistance(nodes[50 ], nodes[51 ]) },
  {from: 50,to: 52,weight: calculateDistance(nodes[50 ], nodes[52 ]) },
  {from: 52,to: 53,weight: calculateDistance(nodes[52 ], nodes[53 ]) },
  {from: 53,to: 54,weight: calculateDistance(nodes[ 53], nodes[ 54]) },
  {from: 54,to: 55,weight: calculateDistance(nodes[ 54], nodes[55 ]) },
  {from: 55,to: 56,weight: calculateDistance(nodes[ 55], nodes[ 56]) },
  {from: 57,to: 56,weight: calculateDistance(nodes[ 57], nodes[ 56]) },
  {from: 57,to: 59,weight: calculateDistance(nodes[ 57], nodes[59 ]) },
  {from: 59,to: 60,weight: calculateDistance(nodes[59 ], nodes[ 60]) },
  {from: 60,to:61 ,weight: calculateDistance(nodes[60 ], nodes[61 ]) },
  {from: 60,to:62 ,weight: calculateDistance(nodes[60 ], nodes[62 ]) },
  {from: 62,to: 63,weight: calculateDistance(nodes[62], nodes[63]) },
  {from: 63,to:64 ,weight: calculateDistance(nodes[63], nodes[64]) },
  {from: 62,to: 65,weight: calculateDistance(nodes[62], nodes[65]) },
  {from: 65,to:66 ,weight: calculateDistance(nodes[65], nodes[66]) },
  {from:66 ,to: 67,weight: calculateDistance(nodes[66], nodes[67]) },
  {from:67 ,to:68 ,weight: calculateDistance(nodes[67], nodes[68]) },
  {from: 56,to: 69,weight: calculateDistance(nodes[56], nodes[69]) },
  {from: 70,to: 69,weight: calculateDistance(nodes[70], nodes[69]) },
  {from: 70,to: 71,weight: calculateDistance(nodes[70], nodes[71]) },
  {from: 71,to: 72,weight: calculateDistance(nodes[71], nodes[72]) },
  {from: 72,to: 15,weight: calculateDistance(nodes[72], nodes[15]) },
  {from: 71,to: 73,weight: calculateDistance(nodes[71], nodes[73]) },
  {from: 73,to: 11,weight: calculateDistance(nodes[73], nodes[11]) },
  {from: 59,to: 51,weight: calculateDistance(nodes[59], nodes[51]) },
  {from: 51,to: 60,weight: calculateDistance(nodes[51], nodes[60]) },
  //{from: ,to: ,weight: calculateDistance(nodes[ ], nodes[ ]) },
  
  
];

function calculateDistance(node1, node2) {
  const R = 6371; // Earth's radius in km
  const dLat = (node2.latitude - node1.latitude) * (Math.PI / 180);
  const dLon = (node2.longitude - node1.longitude) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(node1.latitude * (Math.PI / 180)) *
      Math.cos(node2.latitude * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// A* Algorithm to find the shortest path
function findPath(startId, endId) {
  const openSet = [startId]; // Nodes to be evaluated
  const cameFrom = {}; // Map to store the best path
  const gScore = {}; // Cost from start to a node
  const fScore = {}; // Total cost (gScore + heuristic)

  nodes.forEach((node) => {
    gScore[node.id] = Infinity;
    fScore[node.id] = Infinity;
  });

  gScore[startId] = 0;
  fScore[startId] = heuristic(startId, endId);

  while (openSet.length > 0) {
    // Get node with the lowest fScore
    const current = openSet.sort((a, b) => fScore[a] - fScore[b])[0];
    if (current === endId) break; // Found the target

    // Remove current from openSet
    openSet.splice(openSet.indexOf(current), 1);

    // Get neighbors of the current node
    edges
      .filter((edge) => edge.from === current || edge.to === current)
      .forEach((edge) => {
        const neighbor = edge.from === current ? edge.to : edge.from;
        const tentativeGScore = gScore[current] + edge.weight;

        if (tentativeGScore < gScore[neighbor]) {
          cameFrom[neighbor] = current;
          gScore[neighbor] = tentativeGScore;
          fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, endId);

          if (!openSet.includes(neighbor)) openSet.push(neighbor);
        }
      });
  }

  // Reconstruct path
  const path = [];
  let current = endId;
  while (current) {
    path.unshift(current);
    current = cameFrom[current];
  }

  return path;
}

// Heuristic function (straight-line distance to end node)
function heuristic(nodeId, endId) {
  const node = nodes.find((n) => n.id === nodeId);
  const endNode = nodes.find((n) => n.id === endId);
  return calculateDistance(node, endNode);
}

function openExternalLink(url) {
  // Validate the URL
  if (!url) {
    Alert.alert("Error", "No URL provided.");
    return;
  }

  // Check if the URL is valid
  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        // Open the URL if it's valid
        Linking.openURL(url)
          .catch((err) => {
            console.error("Failed to open URL:", err);
            Alert.alert("Error", "Something went wrong while opening the link.");
          });
      } else {
        Alert.alert("Error", "This URL cannot be opened.");
      }
    })
    .catch((err) => {
      console.error("Error checking URL:", err);
      Alert.alert("Error", "Something went wrong.");
    });
}

const filterPlacesByRoomNumber = (formRoom, places) => {
  return places.find(place => {
    const match = place.name.match(/\d+/); // Extract numeric part from name
    return match && parseInt(match[0], 10) === formRoom;
  });
};

const updateCommonPlaces = (formRoom, places, commonPlaces) => {
  const matchedPlace = filterPlacesByRoomNumber(formRoom, places);
  if (matchedPlace) {
    const updatedCommonPlaces = [{ id: matchedPlace.id, name: 'Form Room' }, ...commonPlaces];
    return updatedCommonPlaces.filter((place, index, self) => 
      index === self.findIndex(p => p.id === place.id)); // Remove duplicates
  }
  return commonPlaces;
};

const handleOpenCommonPlacesModal = () => {
  const updatedCommonPlaces = updateCommonPlaces(formRoom, places, commonPlaces);
  setCommonPlaces(updatedCommonPlaces);
  setIsCommonPlacesModalVisible(true);
};


export default function MainMenu({ route, navigation }) {
  const { name, etaUnit} = route.params;
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showMarkers, setShowMarkers] = useState(true); // State to toggle markers
  const mapRef = useRef(null);
  const [path, setPath] = useState([]);
  const [pathCoordinates, setPathCoordinates] = useState([]);
  const [isCommonPlacesModalVisible, setIsCommonPlacesModalVisible] = useState(false);
  const [isSearchLocationModalVisible, setIsSearchLocationModalVisible] = useState(false);
  const [formRoom, setFormRoom] = useState(route.params?.formRoom || null)
  const [reportMode, setReportMode] = useState(false); // Track report mode
  const [marker, setMarker] = useState(null); // Store the reported location
  const [description, setDescription] = useState(""); // Store user input
  const [reportModalVisible, setReportModalVisible] = useState(false); // Control modal
  const [etaValue, setEtaValue] = useState("..."); // Initially show "..."
  const [commonPlaces, setCommonPlaces] = useState([
    { id: 73, name: 'Library' },
    { id: 49, name: 'Main Hall' },
    { id: 60, name: 'Gym' },
    { id: 22, name: 'Main Reception' },
    { id: 11, name: 'Sports Hall' },
    { id: 33, name: 'Dining Hall' },
    { id: 44, name: 'Boys Toilet' },
    { id: 57, name: 'Girls Toilet' },
    { id: 70, name: 'Staff Room' },
    { id: 65, name: 'Lecture Theatre' },
  ]);

  // Request location permissions and fetch user location with highest accuracy
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest, // Request highest accuracy
        });
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0004,
          longitudeDelta: 0.0004,
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (route.params?.formRoom) {
      setFormRoom(route.params.formRoom);
      setCommonPlaces(prev => updateCommonPlaces(route.params.formRoom, places, prev));
    }
  }, [route.params?.formRoom]);

  const handleOpenCommonPlacesModal = () => {
    setIsCommonPlacesModalVisible(true);
  };
  
  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    const results = places.filter((place) =>
      place.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

// Center map on selected place
 
const goToPlace = (place) => {
  if (mapRef.current) {
    mapRef.current.animateToRegion(
      {
        latitude: place.latitude,
        longitude: place.longitude,
        latitudeDelta: 0.0004,
        longitudeDelta: 0.0004,
      },
      2000
    );
  }
  setSelectedPlace(place); // Set the selected place
  setIsModalVisible(false); // Close modal
  setSearchQuery('');
  setSearchResults([]);

};


  // Function to recenter the map
  const recenterMap = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.animateToRegion(userLocation, 1000); // Smooth animation to user location
    }
  };
  const handleCalculateRoute = (id) => {
    const cNodeID = (findClosestNodeId(userLocation, nodes))
    goToPlace(nodes[cNodeID])
    console.log(cNodeID)
    const path = findPath(cNodeID, id); // Example: from node 1 to node 4
    const coordinates = path.map((id) => {
      const node = nodes.find((n) => n.id === id);
      return { latitude: node.latitude, longitude: node.longitude };
    });
    setPathCoordinates(coordinates);
    // Calculate the total weight of the path
    let totalWeight = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const fromNodeId = path[i];
    const toNodeId = path[i + 1];

    // Find the edge between these two nodes
    const edge = edges.find(
      (e) => (e.from === fromNodeId && e.to === toNodeId) || (e.from === toNodeId && e.to === fromNodeId)
    );

    if (edge) {
      totalWeight += edge.weight;
    }
  }

  console.log(`Total weight of the path: ${totalWeight}`);
  const scaleFactor = 924; 

  // Calculate ETA in seconds
  const etaValue = Math.round(totalWeight * scaleFactor);

  console.log(`ETA (in seconds): ${etaValue}`);
  // Set the etaValue to the calculated ETA (in seconds)
  setEtaValue(`${etaValue} Seconds`);

     // Rotate the map towards the target node
     setTimeout(() => {
      rotateMapToNode(nodes[cNodeID], nodes[id]);

      // Delay second rotation after first completes
      setTimeout(() => {
          rotateMaptoNode2(nodes[cNodeID], nodes[id]);
      }, 1500); 
  }, 1000);
  };


// Function to open external link (Google Maps)
function openExternalLink(url) {
  if (!url) {
    Alert.alert("Error", "No URL provided.");
    return;
  }

  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        Linking.openURL(url)
          .catch((err) => {
            console.error("Failed to open URL:", err);
            Alert.alert("Error", "Something went wrong while opening the link.");
          });
      } else {
        Alert.alert("Error", "This URL cannot be opened.");
      }
    })
    .catch((err) => {
      console.error("Error checking URL:", err);
      Alert.alert("Error", "Something went wrong.");
    });
}

// The main function
function findClosestNodeId(userLocation, nodes, places) {
  if (!userLocation || !nodes || nodes.length === 0) {
    throw new Error("Invalid userLocation or nodes array.");
  }

  let closestNodeId = null;
  let shortestDistance = Infinity;

  // Loop through all nodes and calculate the distance to the user location
  nodes.forEach((node) => {
    const distance = calculateDistance(userLocation, node);

    // If the calculated distance is smaller than the shortestDistance, update
    if (distance < shortestDistance) {
      shortestDistance = distance;
      closestNodeId = node.id;
    }
  });

  // // After the loop, check if the shortestDistance exceeds the distance between nodes[11] and nodes[71]
  // if (shortestDistance > calculateDistance(nodes[11], nodes[71])) {
  //   console.log("done");
  //   // Trigger navigation to a specific place and open the external Google Maps link
  //   //goToPlace(places[15]);
  //   openExternalLink("https://maps.app.goo.gl/vWdmYnToUYPwMJbYA");
  //   return;
  // }

  return closestNodeId;
}

function resetRoute() {
  setPath([]);
  setPathCoordinates([])
}

const calculateBearing = (start, end) => {
  const lat1 = (Math.PI / 180) * start.latitude;
  const lat2 = (Math.PI / 180) * end.latitude;
  const lon1 = (Math.PI / 180) * start.longitude;
  const lon2 = (Math.PI / 180) * end.longitude;

  const dLon = lon2 - lon1;

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  let bearing = Math.atan2(y, x) * (180 / Math.PI);

  return (bearing + 360) % 360; // Normalize between 0-360
};

const rotateMapToNode = (currentNode, targetNode) => {
  if (!mapRef.current || !currentNode || !targetNode) return;

  const bearing = calculateBearing(currentNode, targetNode);

  mapRef.current.animateCamera({
      center: currentNode, // Keep centered on current location
      heading: bearing, // Rotate towards target node
      pitch: 45, // Slight tilt for a 3D effect
      zoom: 18, // Adjust zoom level
  }, { duration: 2500 }); // Smooth animation
};

const rotateMaptoNode2 = (currentNode, targetNode) => {
  if (!mapRef.current || !currentNode || !targetNode) return;

  const bearing = calculateBearing(currentNode, targetNode);

  mapRef.current.animateCamera({
      center: currentNode, // Keep centered on current location
      heading: bearing, // Rotate towards target node
      pitch: 0, // Reset tilt for a 3D effect
      zoom: 25, // Adjust zoom level
  }, { duration: 1000 }); // Smooth animation
};

const handleMapPress = (marker) => {
  if (reportMode) {
    setMarker({
      latitude: marker.nativeEvent.coordinate.latitude,
      longitude: marker.nativeEvent.coordinate.longitude,
    });
    setReportModalVisible(true); // Open input modal
    setReportMode(false); // Disable report mode after selection
  }
};

const submitReport = () => {
  setReportModalVisible(false); // Close modal
};


  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
          <StatusBar style="light" />

          {/* Weather and Settings Section */}
          <View style={styles.WSContainer}>
            <TouchableOpacity style={styles.WeatherOutput}>
              <Image
                source={require('./assets/weathericonsn.png')}
                fadeDuration={500}
                style={styles.WeatherImg}
                alt="Weather"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.SettingsOutput}
            onPress={() => navigation.navigate("Settings Page", {name})}>
              <Image
                source={require('./assets/settingsiconsn.png')}
                fadeDuration={500}
                style={styles.SettingsImg}
                alt="Settings"
              />
            </TouchableOpacity>
          </View>

          {/* Greeting */}
          <View>
          <Text style={styles.Text}>Hello {name}
            
          </Text>

          </View>

          {/* Map Section */}
          <View style={styles.Map}>

            
            <MapView
              ref={mapRef} // Attach the ref to the MapView
              style={StyleSheet.absoluteFillObject}
              provider={PROVIDER_GOOGLE}
              mapType="hybrid"
              userLocationUpdateInterval={1000}
              region={userLocation} // Center the map on the user's location
              showsUserLocation={true} // Show the default blue dot
              followsUserLocation={true} // Automatically follow the user's location
              pitch={45} // Add a 3D tilt to the map
              heading={0} // Set the map's heading (0 degrees means north-up)

              onPress={handleMapPress} // Listen for user tap
            >
              {/* Render the user's location marker */}
              {userLocation && (
                <Marker 
                  coordinate={{
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                  }}
                  title="You are here!"
                />
              )}

              {/* Render all place markers */}
              {showMarkers &&
                places.map((place) => (
                  <Marker
                    key={place.id}
                    coordinate={{
                      latitude: place.latitude,
                      longitude: place.longitude,
                    }}
                    title={place.name} // Shows the name on marker click
                  />
                ))}

              {/* Render polylines for edges
              {edges.map((edge, index) => {
                const fromNode = nodes.find((node) => node.id === edge.from);
                const toNode = nodes.find((node) => node.id === edge.to);

                // Ensure both nodes exist before rendering the polyline
                if (!fromNode || !toNode) return null;

                return (
                  <Polyline
                    key={index}
                    coordinates={[
                      { latitude: fromNode.latitude, longitude: fromNode.longitude },
                      { latitude: toNode.latitude, longitude: toNode.longitude },
                    ]}
                    strokeColor="blue" // Color of the line
                    strokeWidth={7} // Thickness of the line
                  />
                );
              })} */}
              {pathCoordinates.length > 0 && (
              <Polyline
              coordinates={pathCoordinates}
              strokeColor="rgba(66, 133, 244, 0.3)" // Light blue transparent glow
              strokeWidth={20} // Bigger for a glowing effect
            />,
            <Polyline
              coordinates={pathCoordinates}
              strokeColor="white"
              strokeWidth={16} // Thicker white outline for contrast
            />,
            <Polyline
              coordinates={pathCoordinates}
              strokeColor="#4285F4" 
              strokeWidth={12} // Slightly smaller than the outline
            />
            )}

            {/* Show marker if placed */}
            {marker && (
              <Marker coordinate={marker} title="Report" description={description} />
            )}

          </MapView>

              {/* Input Modal for Report Description */}
          <Modal visible={reportModalVisible} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.searchInput}>Enter Report Details</Text>
                <TextInput
                  placeholder="Describe the issue..."
                  value={description}
                  onChangeText={setDescription}
                  style={{
                    borderWidth: 1,
                    borderColor: "black",
                    padding: 8,
                    marginBottom: 10,
                    borderRadius: 5,
                  }}
                />
                <Button title="Submit" onPress={submitReport} />
              </View>
            </View>
          </Modal>

          <TouchableOpacity style={styles.resetRoute} onPress={resetRoute}>
              <Text style={styles.RecenterButtonText}>Clear Route</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.RecenterButton} onPress={recenterMap}>
              <Text style={styles.RecenterButtonText}>Recenter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ToggleMarkersButton}
              onPress={() => setShowMarkers(!showMarkers)}
            >
              <Text style={styles.ToggleMarkersButtonText}>
                {showMarkers ? 'Hide Markers' : 'Show Markers'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Features Section */}
          <View style={styles.Features}>
            <View style={styles.RowContainer}>
            <TouchableOpacity
                onPress={() => setReportMode(true)}
              >
                <View style={styles.Box}>
                  <Text style={styles.Label}>Report</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.ETAWrap}>
                <Text style={styles.Label}>ETA</Text>
                <View style={styles.ETABox}>
                    {/* Display the ETA value or "..." if no route selected */}
                    <Text style={styles.ETA}>{etaValue}</Text>
                </View>
              </View>

              <TouchableOpacity onPress={() => setIsCommonPlacesModalVisible(true)}>
                <View style={styles.Box}>
                  <Text style={styles.Label}>Common Places</Text>
                </View>
              </TouchableOpacity>
              {/* Modal for Common Places */}
              <Modal
                visible={isCommonPlacesModalVisible}
                transparent={true}
                animationType="slide"
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                      {/* Preset buttons for each common place */}
                      {commonPlaces.map((place) => (
                        <TouchableOpacity
                          key={place.id}
                          style={styles.placeButton}
                          onPress={() => {
                            setIsCommonPlacesModalVisible(false)
                            goToPlace(nodes[place.id]);
                            setTimeout(() => {
                              console.log(`Selected Place ID: ${place.id}`);
                              setPath([]);
                              handleCalculateRoute(place.id);
                            }, 2000);
                          }}
                        >
                          <Text style={styles.placeButtonText}>{place.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setIsCommonPlacesModalVisible(false)}
                    >
                      <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
          </View>

          {/* Search Location Section */}
          <View style={styles.SearchLocation}>
            <TouchableOpacity onPress={() => setIsSearchLocationModalVisible(true)}>
              <Text style={styles.SearchLabel}>Search Location</Text>
            </TouchableOpacity>
          </View>

          {/* Modal for Searching Locations */}
          <Modal
            visible={isSearchLocationModalVisible}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TextInput
                  KeyboardAvoidingView = 'false'
                  style={styles.searchInput}
                  placeholder="Search for a place..."
                  value={searchQuery}
                  onChangeText={handleSearch}
                />
                <FlatList
                  data={searchResults}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.resultItem}
                      onPress={() => {
                        setIsSearchLocationModalVisible(false)
                        goToPlace(item);
                      
                        setTimeout(() => {
                          console.log(`Item ID: ${item.id}`)
                          setPath([])
                          handleCalculateRoute(item.id)
                          ;
                        }, 2500);
                      }}
                      
                    >
                      <Text style={styles.resultText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsSearchLocationModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#38b6ff',
    paddingHorizontal: scaleWidth(16),
  },
  WSContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: scaleHeight(16),
  },
  WeatherOutput: {
    flex: 1,
    justifyContent: 'center',
  },
  SettingsOutput: {
    flex: 1,
    alignItems: 'flex-end',
  },
  WeatherImg: {
    width: scaleWidth(70),
    height: scaleWidth(70),
    borderRadius: scaleWidth(35),
  },
  SettingsImg: {
    width: scaleWidth(60),
    height: scaleWidth(60),
    borderRadius: scaleWidth(30),
  },
  Text: {
    fontSize: scaleHeight(24),
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: scaleHeight(8),
  },
  Map: {
    flex: 1,
    marginVertical: scaleHeight(10),
    borderRadius: scaleWidth(10),
    overflow: 'hidden',
  },
  RecenterButton: {
    position: 'absolute',
    bottom: scaleHeight(40),
    right: scaleWidth(5),
    backgroundColor: '#38b6ff',
    padding: scaleHeight(5),
    borderRadius: scaleWidth(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: 'black',
    borderWidth: 2,
  },
  RecenterButtonText: {
    fontSize: scaleHeight(14),
    fontWeight: 'bold',
    color: '#000',
  },
  ToggleMarkersButton: {
    position: 'absolute',
    bottom: scaleHeight(5),
    left: scaleWidth(5),
    backgroundColor: '#38b6ff',
    padding: scaleHeight(5),
    borderRadius: scaleWidth(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: 'black',
    borderWidth: 2,
  },
  ToggleMarkersButtonText: {
    fontSize: scaleHeight(14),
    fontWeight: 'bold',
    color: '#000',
  },
  Features: {
    height: scaleHeight(120),
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: scaleWidth(10),
    justifyContent: 'center',
    marginVertical: scaleHeight(8),
  },
  RowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  Box: {
    width: scaleWidth(90),
    height: scaleHeight(100),
    borderWidth: 2,
    borderRadius: scaleWidth(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  ETAWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ETABox: {
    width: scaleWidth(110),
    height: scaleHeight(90),
    borderWidth: 2,
    borderRadius: scaleWidth(10),
    borderColor: 'black',

    marginBottom: scaleHeight(5),
    backgroundColor: 'white',
  },
  Label: {
    fontSize: scaleHeight(16),
    fontWeight: 'bold',
  },
  SearchLocation: {
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
  resetRoute: {
    position: 'absolute',
    bottom: scaleHeight(5),
    right: scaleWidth(5),
    backgroundColor: '#38b6ff',
    padding: scaleHeight(5),
    borderRadius: scaleWidth(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: 'black',
    borderWidth: 2,
  },
  scrollViewContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: scaleWidth(10),
  },
  placeButton: {
    backgroundColor: '#38b6ff',  // Blue background matching the modal content
    paddingVertical: scaleWidth(12),
    paddingHorizontal: scaleWidth(20),
    borderRadius: scaleWidth(8),
    margin: scaleWidth(8),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'black',
    fontWeight: 'bold',
  },
  placeButtonText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },CommonPlaces: {
    // Style for the section where Common Places button is
    marginTop: 20,
    fontWeight: 23,
    
  },
  ETA: {
    fontSize: 25, // Large font size for prominence
    fontWeight: 'bold', // Bold text
    fontFamily: 'serif', // Serif font style
    paddingVertical: 20, // Add padding around the text
    textAlign: 'center', // Center align the text horizontally
  },
});
