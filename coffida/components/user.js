import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

class User extends Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            userData: []
        }
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
            this.getUserData();
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

    getUserData = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        const id = await AsyncStorage.getItem('@user_id');
        return fetch("http://10.0.2.2:3333/api/1.0.0/user/" + id, {
            'headers': {
                'X-Authorization': value
            }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
                ToastAndroid.show("You must be logged in to view user data", ToastAndroid.SHORT);
                this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
            this.setState({
                isLoading: false,
                userData: responseJson
            })
        })
        .catch((error) => {
            console.log(error);
            ToastAndroid.show(error, ToastAndroid.SHORT)
        })
    }

    logout = () => {
        AsyncStorage.removeItem('@session_token');
        this.props.navigation.navigate("Home");
    }

    render(){
        if(this.state.isLoading){
            return(
                <View style={styles.container}>
                    <Text style={styles.text}>Loading User Data...</Text>
                    <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.logout()}>
                        <Text>Log out</Text>
                    </TouchableOpacity>
                </View>
            );
         }else{
             return(
                <View style={styles.container}>
                    <Text style={styles.text}>{this.state.userData.first_name} {this.state.userData.last_name}</Text>
                    <Text style={styles.text}>{this.state.userData.email}</Text>
                <TouchableOpacity
                style={styles.button}
                onPress={() => this.logout()}>
                    <Text>Log out</Text>
                </TouchableOpacity>
            </View>
             )
         }
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