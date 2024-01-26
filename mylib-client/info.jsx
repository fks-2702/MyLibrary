import { StyleSheet, Text, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import axios from 'axios'; // Import axios
import SETTINGS from './config.json';
//import PieChart from 'mui';



export default function InfoScreen() {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
        },
    });

    const [data, setData] = useState(null); // State to store the API response

    const getAVG = async () => {
        try {
            const response = await axios.get(`http://${SETTINGS.server_address}:${SETTINGS.server_port}/api/stats`);
            console.log(response.data);
            setData(response.data); // Update state with the API response
        } catch (error) {
            console.error(error);
            alert(`Error getting data`);
        }
    };

    useLayoutEffect(() => {
        getAVG();
    }, []);

    return (
        <ScrollView style={styles.container}>
            {data && (
                <>
                    <Text>Average book length: {data.avg}</Text>

                </>
            )}
        </ScrollView>
    );
}
