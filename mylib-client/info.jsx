import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import axios from 'axios';
import SETTINGS from './config.json';
//import Pie from 'react-native-pie';

export default function InfoScreen() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    chartContainer: {
      alignItems: 'center',
      marginTop: 20,
    },
  });

  const [data, setData] = useState(null);

  const getAVG = async () => {
    try {
      const response = await axios.get(`http://${SETTINGS.server_address}:${SETTINGS.server_port}/api/stats`);
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error(error);
      alert(`Error getting data`);
    }
  };

  useEffect(() => {
    getAVG();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {data && (
        <>
          <Text>Average book length: {data.avg}</Text>
          <View style={styles.chartContainer}>

          </View>
        </>
      )}
    </ScrollView>
  );
}
