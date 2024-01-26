import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import SETTINGS from './config.json';

export default function SettingsScreen() {
    const [serverAddress, setServerAddress] = useState(SETTINGS.server_address);
    const [serverPort, setServerPort] = useState(SETTINGS.server_port);

    function serverChange(address, port) {
        console.log(`Server address changed to ${address}:${port}`);
        setServerAddress(address);
        setServerPort(port);
        alert(`Server address changed to ${address}:${port}`);
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

    return (
        <View style={styles.container}>
            <Text>Server Address: {serverAddress}</Text>
            <Text>Server Port: {serverPort}</Text>
            <Button
                title="Change Server Address"
                onPress={() => serverChange(prompt("Server Address"), serverPort)}
            />
        </View>
    );
}
