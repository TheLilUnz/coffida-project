import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ToastAndroid, TouchableWithoutFeedbackBase } from 'react-native';

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

    unfavouriteLocation = async (locationId) => {
        const value = await AsyncStorage.getItem('@session_token');
        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + locationId + "/favourite", {
            method:'delete',
            headers: {
                'X-Authorization': value
            },
        })
        .then((response) => {
            if(response.status === 200){
                ToastAndroid.show("Removed from favourites!", ToastAndroid.SHORT);
            }else if(response.status === 400){
                throw 'Failed validation';
            }else if(response.status === 401){
                throw 'Not logged in';
            }else if(response.status === 404){
                throw 'Location not found';
            } else{
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
            console.log(error);
            ToastAndroid.show(error, ToastAndroid.SHORT);
        })
    }

    deleteReview = async (locationId, reviewId) => {
        const value = await AsyncStorage.getItem('@session_token');
        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + locationId + "/review/" + reviewId, {
            method:'delete',
            headers: {
                'X-Authorization': value,
                'Content-Type':'application/json'
            }
        })
        .then((response) => {
            if(response.status === 200){
                ToastAndroid.show("Review deleted!", ToastAndroid.SHORT);
            }else if(response.status === 400){
                throw 'Failed validation';
            }else if(response.status === 401){
                throw 'Not logged in';
            }else if(response.status === 403){
                throw 'Forbidden';
            }else if(response.status === 404){
                throw 'Review not found';
            } else{
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
            console.log(error);
            ToastAndroid.show(error, ToastAndroid.SHORT);
        })
    }

    editReview = (locationId, reviewId) => {
        AsyncStorage.setItem('@locationId', locationId);
        AsyncStorage.setItem('@reviewId', JSON.stringify(reviewId));
        this.props.navigation.navigate("Update Review");
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
                        <Text style={styles.buttonText}>Log out</Text>
                    </TouchableOpacity>
                </View>
            );
         }else{
             return(
                <View style={styles.container}>
                    <Text style={styles.text}>{this.state.userData.first_name} {this.state.userData.last_name}</Text>
                    <Text style={styles.text}>{this.state.userData.email}</Text>
                    <Text style={styles.title}>Your Favourites</Text>
                    <FlatList
                        data={this.state.userData.favourite_locations}
                        renderItem={({item}) => (
                            <View style={styles.locationContainer}>
                                <View style={styles.row}>
                                    <Text style={styles.title}>{item.location_name}</Text>  
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.text}>{item.location_town}</Text>  
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.text}>Overall Rating: </Text>
                                    <Text style={styles.rating}>{item.avg_overall_rating}/5</Text>
                                </View>
                                <View style={styles.row}>
                                <TouchableOpacity
                                  style={styles.button}
                                   onPress={() => this.unfavouriteLocation(item.location_id)}>
                                  <Text style={styles.buttonText}>Unfavourite</Text>
                                </TouchableOpacity>
                                </View>
                            </View>
                        )}></FlatList>
                    <Text style={styles.title}>Your Reviews</Text>
                        <FlatList
                            data={this.state.userData.reviews}
                            renderItem={({item}) => (
                                <View style={styles.locationContainer}>
                                    <View style={styles.row}>
                                        <Text style={styles.title}>{item.location.location_name}</Text>  
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.text}>Overall Rating: </Text>
                                        <Text style={styles.rating}>{item.review.overall_rating}/5</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.text}>Price Rating: </Text>
                                        <Text style={styles.rating}>{item.review.price_rating}/5</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.text}>Quality Rating: </Text>
                                        <Text style={styles.rating}>{item.review.quality_rating}/5</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.text}>Cleanliness Rating: </Text>
                                        <Text style={styles.rating}>{item.review.clenliness_rating}/5</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.text}>{item.review.review_body}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.text}>Likes: </Text>
                                        <Text style={styles.rating}>{item.likes}</Text>
                                    </View>
                                    <View style={styles.row}>
                                    <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => this.editReview(item.location.location_id, item.review.review_id)}>
                                    <Text style={styles.buttonText}>Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => this.deleteReview(item.location.location_id, item.review.review_id)}>
                                    <Text style={styles.buttonText}>Delete</Text>
                                    </TouchableOpacity>
                                    </View>
                                </View>
                            )}></FlatList>
                <TouchableOpacity
                style={styles.button}
                onPress={() => this.logout()}>
                    <Text style={styles.buttonText}>Log out</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.button}
                onPress={() => this.props.navigation.navigate("Update")}>
                    <Text style={styles.buttonText}>Edit Account</Text>
                </TouchableOpacity>
            </View>
             )
         }
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'navajowhite'
    },
    row:{
        flexDirection: 'row'
    },
    locationContainer:{
        width:300,
        borderColor: 'black',
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

export default User;