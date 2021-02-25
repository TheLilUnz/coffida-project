import React, {Component} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';

class Signup extends Component {

    constructor(props){
        super(props);

        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            password: ""
        }
    }

    signup = () => {
        // Validate dis shit

        return fetch("http://10.0.2.2:3333/api/1.0.0/user", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then((response) => {
            if(response.status === 201){
                return response.json()
            }else if(response.status === 400){
                throw 'Failed validation';
            }else{
                throw 'Something went wrong';
            }
        })
        .then(async (responseJson) => {
            console.log("User created with ID: ", responseJson);
            this.props.navigation.navigate("Login");
        })
        .catch((error) => {
            console.log(error);
            ToastAndroid.show(error, ToastAndroid.SHORT);
        })
    }

    render(){
        return(
            <View style={styles.container}>
                <Text style={styles.title}>Sign up to Coffida!</Text>
                <Text style={styles.text}>First Name:</Text>
                <TextInput 
                style={styles.input} 
                onChangeText={(first_name) => this.setState({first_name})}
                value={this.state.first_name} />
                <Text style={styles.text}>Last Name:</Text>
                <TextInput 
                style={styles.input} 
                onChangeText={(last_name) => this.setState({last_name})}
                value={this.state.last_name} />
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
                    onPress={() => this.signup()}>
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

export default Signup;