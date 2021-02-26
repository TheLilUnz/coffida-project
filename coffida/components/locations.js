import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ToastAndroid } from 'react-native';

class Locations extends Component {
    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            listData: []
        }
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
            this.getData();
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

    getData = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        return fetch("http://10.0.2.2:3333/api/1.0.0/find", {
            method:'get',
            'headers': {
                'X-Authorization': value
            }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
                ToastAndroid.show("You must be logged in to view locations", ToastAndroid.SHORT);
                this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
            this.setState({
                isLoading: false,
                listData: responseJson
            })
        })
        .catch((error) => {
            console.log(error);
            ToastAndroid.show(error, ToastAndroid.SHORT)
        })
    }

    viewLocationDetails = (locationId) => {
        console.log("viewing " + locationId);
        this.props.navigation.navigate("Details", locationId);
    }

    render(){
        if(this.state.isLoading){
            return(
            <View style={styles.container}>
                <Text style={styles.text}>Loading Locations...</Text>
            </View>
            )
        }else{
            return(
                <View style={styles.container}>
                    <FlatList
                        data={this.state.listData}
                        renderItem={({item}) => (
                            <TouchableOpacity style={styles.locationContainer}
                            onPress={() => this.viewLocationDetails(item.location_id)}>
                            <Text style={styles.title}>{item.location_name} </Text>
                            <Text style={styles.rating}>{item.avg_overall_rating}/5</Text>
                            <Text style={styles.text}>{item.location_town}</Text>
                            </TouchableOpacity>
                        )}></FlatList>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'wheat'
    },
    locationContainer:{
        width:300,
        borderColor: 'sienna',
        borderWidth: 1,
        padding: 1
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
    rating:{
        color: 'sienna',
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

export default Locations;