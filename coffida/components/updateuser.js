import React, {Component} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UpdateUser extends Component {
    constructor(props){
        super(props);

        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            password: ""
        }
    }

    updateUserInfo = async () => {
        // Validate
        const value = await AsyncStorage.getItem('@session_token');
        const id = await AsyncStorage.getItem('@user_id');
    
        return fetch("http://10.0.2.2:3333/api/1.0.0/user/" + id, {
            method: 'patch',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization' : value
            },
            body: JSON.stringify(this.state)
        })
        .then((response) => {
            if(response.status === 200){
                ToastAndroid.show("Account updated!", ToastAndroid.SHORT)
            }else if(response.status === 400){
                throw 'Failed validation';
            }else if(response.status === 401){
                throw 'Not logged in';
            }else if(response.status === 403){
                throw 'Forbidden'
            }else if(response.status === 404){
                throw 'Account not found';
            } else{
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
            console.log(error);
            ToastAndroid.show(error, ToastAndroid.SHORT);
        })
    }

    render(){
        return(
            <View style={styles.container}>
                <Text style={styles.title}>Edit account details</Text>
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
                    onPress={() => this.updateUserInfo()}>
                    <Text style={styles.buttonText}>Update</Text>
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
        backgroundColor: 'navajowhite'
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

export default UpdateUser;

