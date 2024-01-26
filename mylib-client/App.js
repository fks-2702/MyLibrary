import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ScannerScreen from './scanner.jsx';
import SettingScreen from './settings.jsx';
import InfoScreen from './info.jsx';
import axios from 'axios';
import SETTINGS from './config.json';
import React, { useLayoutEffect, useState } from 'react';
import { Card } from 'react-native-elements';
import { ScrollView } from 'react-native';
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function HomeScreen({ navigation }) {
  const [mylist, setMyList] = useState([]);

  const getBooks = () => {
    axios
      .get(`http://${SETTINGS.server_address}:${SETTINGS.server_port}/`)
      .then((response) => {
        console.log(response.data);
        setMyList(response.data);
      })
      .catch((error) => {
        console.error(error);
      });1
  };

  useLayoutEffect(() => {
    getBooks();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.cardContainer}>
        {mylist.map((item) => (
          <Card key={item.isbn} containerStyle={styles.card}>
            <Card.Title>{item.title}</Card.Title>
            <Card.Image
              style={styles.cardImage}
              source={{ uri: `https://covers.openlibrary.org/b/isbn/${item.isbn}-M.jpg` }}
            />
            <Card.Divider />
            <Text>{item.author}</Text>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const DrawerContent = ({ navigation }) => {
  return (
    <View style={styles.drawerContainer}>
      <Button title="My Library" onPress={() => navigation.navigate('My Library')} />
      <Button title="Scan" onPress={() => navigation.navigate('Scanner')} />
      <Button title="Settings" onPress={() => navigation.navigate('Setting')} />
      <Button title="Info" onPress={() => navigation.navigate('Info')} />
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
        <Drawer.Screen
          name="My Library"
          component={HomeScreen}
          options={{
            headerShown: true,
          }}
        />
        <Drawer.Screen name="Scanner" component={ScannerScreen} />
        <Drawer.Screen name="Setting" component={SettingScreen} />
        <Drawer.Screen name="Info" component={InfoScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  card: {
    width: windowWidth <= 600 ? '100%' : '33%', // Adjust based on the desired breakpoint
    marginBottom: 20,
  },
  cardImage: {
    height: windowWidth <= 600 ? 150 : 100, // Adjust based on the desired breakpoint
    resizeMode: 'contain',
  },
  drawerContainer: {
    padding: 20,
  },
});
