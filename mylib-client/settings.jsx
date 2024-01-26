import { StyleSheet, Text, View, Button} from 'react-native';
import Linking from 'expo-linking';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState, useEffect } from 'react';
import SETTINGS from './config.json';



export default function SettingsScreen() {
    function serverchange(address, port) {
        console.log(`Server address changed to ${address}:${port}`);
        SETTINGS.server_address = address;
        SETTINGS.server_port = port;
        alert(`Server address changed to ${address}:${port}`);

    };
    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        },});

    return (
        <View style={styles.container}>
            <Text>Server Address: {SETTINGS.server_address}</Text>
            <Text>Server Port: {SETTINGS.server_port}</Text>
            <Button
                title="Change Server Address"
                onPress={() => serverchange(prompt("Server Address"), SETTINGS.server_port)}></Button>
        </View>
    );


}