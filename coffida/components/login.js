import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';

class Login extends Component {

    constructor(props){
        super(props);

        this.state = {
            email: "",
            password: ""
        }
    }

    login = async () => {
        //validate dis shit too

        return fetch("http://10.0.2.2:3333/api/1.0.0/user/login", {
            method:'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 400){
                throw 'Invalid email or password';
            }else{
                throw 'Something went wrong';
            }
        })
        .then(async (responseJson) => {
            console.log(responseJson);
            await AsyncStorage.setItem('@session_token', responseJson.token);
            await AsyncStorage.setItem('@user_id', JSON.stringify(responseJson.id));
            this.props.navigation.navigate("Home");
        })
        .catch((error) => {
            console.log(error);
            ToastAndroid.show(error, ToastAndroid.SHORT);
        })
    }

    render(){
        return(
            <View style={styles.container}>
                <Text style={styles.title}>Log in to Coffida!</Text>
                <Text style={styles.text}>Email:</Text>
                <TextInput 
                style={styles.input} 
                onChangeText={(email) => this.setState({email})}
                value={this.state.email} />
                <Text style={styles.text}>Password:</Text>
                <TextInput 
                style={styles.input} 
                onChangeText={(password) => this.setState({password})}
                value={this.state.password}
                secureTextEntry />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.login()}>
                    <Text style={styles.buttonText}>Log In!</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.button}
                onPress={() => this.props.navigation.navigate('Signup')}>
                <Text style={styles.buttonText}>Sign Up!</Text>
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
        backgroundColor: 'tan'
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

export default Login;