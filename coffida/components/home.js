import React, {Component} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ASyncStorage from '@react-native-async-storage/async-storage'
import AsyncStorage from '@react-native-async-storage/async-storage';

class Home extends Component {

    render(){
        return(
            <View style={styles.container}>
                <Text style={styles.text}>Home</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'wheat'
    },
    text:{
        color: 'black',
        fontSize: 16
    }
});

export default Home;