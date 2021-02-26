import React, {Component} from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ToastAndroid, TouchableWithoutFeedbackBase } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { roundToNearestPixel } from 'react-native/Libraries/Utilities/PixelRatio';

class LocationDetails extends Component {
    constructor(props){
        super(props);

        this.state={
            locationId: props.route.params,
            isLoading: true,
            listData: []
        }
        console.log("Received " + this.state.locationId); // debugging
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
            this.getLocationDetails();
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

    getLocationDetails = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        const locationId = this.state.locationId;
        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + locationId, {
            method:'get',
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
                listData: responseJson,
            })
        })
        .catch((error) => {
            console.log(error);
            ToastAndroid.show(error, ToastAndroid.SHORT)
        })
    }

    favouriteLocation = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        const locationId = this.state.locationId;
        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + locationId + "/favourite", {
            method:'post',
            headers: {
                'X-Authorization': value
            },
        })
        .then((response) => {
            if(response.status === 200){
                ToastAndroid.show("Added to favourites!", ToastAndroid.SHORT);
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

    unfavouriteLocation = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        const locationId = this.state.locationId;
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

    addLike = async (reviewId) => {
        const value = await AsyncStorage.getItem('@session_token');
        const locationId = this.state.locationId;
        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + locationId + "/review/" + reviewId + "/like", {
            method:'post',
            headers: {
                'X-Authorization': value
            },
        })
        .then((response) => {
            if(response.status === 200){
                ToastAndroid.show("Like added!", ToastAndroid.SHORT);
            }else if(response.status === 400){
                throw 'Failed validation';
            }else if(response.status === 401){
                throw 'Not logged in';
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

    removeLike = async (reviewId) => {
        const value = await AsyncStorage.getItem('@session_token');
        const locationId = this.state.locationId;
        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + locationId + "/review/" + reviewId + "/like", {
            method:'delete',
            headers: {
                'X-Authorization': value
            },
        })
        .then((response) => {
            if(response.status === 200){
                ToastAndroid.show("Like removed!", ToastAndroid.SHORT);
            }else if(response.status === 400){
                throw 'Failed validation';
            }else if(response.status === 401){
                throw 'Not logged in';
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

    leaveReview = async (locationId) => {
        console.log("reviewing " + locationId);
        AsyncStorage.setItem('@locationId', JSON.stringify(locationId));
        this.props.navigation.navigate("Review");
    }

    render(){
        if(this.state.isLoading){
            return(
            <View style={styles.container}>
                <Text style={styles.text}>Loading Details...</Text>
            </View>
            )
        }else{
            return(
                <View style={styles.container}>
                    <Text style={styles.title}>{this.state.listData.location_name}</Text>
                    <View style={styles.row}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => this.favouriteLocation()}>
                            <Text style={styles.buttonText}>Favourite</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => this.unfavouriteLocation()}>
                            <Text style={styles.buttonText}>Unfavourite</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>Town: </Text>
                        <Text style={styles.rating}>{this.state.listData.location_town}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>Average Overall Rating: </Text>
                        <Text style={styles.rating}>{this.state.listData.avg_overall_rating}/5</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>Average Price Rating: </Text>
                        <Text style={styles.rating}>{this.state.listData.avg_price_rating}/5</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>Average Quality Rating: </Text>
                        <Text style={styles.rating}>{this.state.listData.avg_quality_rating}/5</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>Average Cleanliness Rating: </Text>
                        <Text style={styles.rating}>{this.state.listData.avg_clenliness_rating}/5</Text>
                    </View>
                    <FlatList
                        data={this.state.listData.location_reviews}
                        renderItem={({item}) => (
                            <View style={styles.locationContainer}>
                                <Text style={styles.title}>Review</Text>
                                <View style={styles.row}>
                                    <Text style={styles.text}>Overall Rating: </Text>
                                    <Text style={styles.rating}>{item.overall_rating}/5</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.text}>Price Rating: </Text>
                                    <Text style={styles.rating}>{item.price_rating}/5</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.text}>Quality Rating: </Text>
                                    <Text style={styles.rating}>{item.quality_rating}/5</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.text}>Cleanliness Rating: </Text>
                                    <Text style={styles.rating}>{item.clenliness_rating}/5</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.text}>{item.review_body}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.text}>Likes: </Text>
                                    <Text style={styles.rating}>{item.likes}</Text>
                                </View>
                                <View style={styles.row}>
                                <TouchableOpacity
                                  style={styles.button}
                                   onPress={() => this.addLike(item.review_id)}>
                                  <Text style={styles.buttonText}>Like</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={styles.button}
                                   onPress={() => this.removeLike(item.review_id)}>
                                  <Text style={styles.buttonText}>Disike</Text>
                                </TouchableOpacity>
                                </View>
                            </View>
                        )}></FlatList>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.leaveReview(this.state.listData.location_id)}>
                        <Text style={styles.buttonText}>Leave Review</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    } 
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'wheat'
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

export default LocationDetails;