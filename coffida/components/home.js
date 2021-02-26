import React, {Component} from 'react';
import { View, Text, StyleSheet } from 'react-native';

class Home extends Component {

    render(){
        return(
            <View style={styles.container}>
                <Text style={styles.text}>Welcome to Coffida!</Text>
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
    title:{
        color: 'black',
        fontSize: 24,
        padding: 20,
        justifyContent:'flex-start'
    },
    text:{
        color: 'black',
        fontSize: 16,
        padding: 2
    },
    input:{
        height:40,
        borderColor: 'black',
        backgroundColor:'snow',
        borderWidth: 1,
        padding:2,
        width:200
    },    
    button:{
        backgroundColor:'sienna',
        padding:10
    },
    buttonText:{
        color:'white'
    }
});

export default Home;