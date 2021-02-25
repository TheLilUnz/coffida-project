import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Home = (props) => {

    return(
        <View style={styles.container}>
            <Text style={styles.text}>Home</Text>
        </View>
    );
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