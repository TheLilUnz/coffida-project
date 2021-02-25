import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

class User extends Component {

    constructor(props){
        super(props);

    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        });
    }
    
    componentWillUnmount() {
        this.unsubscribe();
    }
    
    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if(value == null) {
            this.props.navigation.navigate('Login');
        }
    }

    logout = () => {
        AsyncStorage.removeItem('@session_token');
        this.props.navigation.navigate("Home");
    }
    render(){
    return(
        <View style={styles.container}>
            <Text style={styles.text}>User</Text>
            <TouchableOpacity
            style={styles.button}
            onPress={() => this.logout()}>
                <Text>Log out</Text>
            </TouchableOpacity>
        </View>
    );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'mintcream'
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

export default User;