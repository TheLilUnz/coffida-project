import React, {Component} from 'react';
import { View, Text, StyleSheet } from 'react-native';

class Locations extends Component {
    render(){
        return(
            <View style={styles.container}>
                <Text style={styles.text}>Locations</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'tan'
    },
    text:{
        color: 'black',
        fontSize: 16
    }
});

export default Locations;