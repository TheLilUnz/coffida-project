import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const User = (props) => {

    return(
        <View style={styles.container}>
            <Text style={styles.text}>User</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'whitesmoke'
    },
    text:{
        color: 'black',
        fontSize: 16
    }
});

export default User;