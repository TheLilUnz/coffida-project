import React, {Component} from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, ToastAndroid, TouchableWithoutFeedbackBase } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Review extends Component {
    constructor(props){
        super(props);

        this.state={
            overall_rating: 0,
            price_rating: 0,
            quality_rating: 0,
            clenliness_rating: 0,
            review_body: ""
        }
    }

    checkProfanity = () => { // Check for off-topic reviews so they may be avoided
        console.log("checking")
        this.state.review_body.split(" ").map(text => {
            if(text == "tea" ||text ==  "Tea" ||text ==  "cake" ||text ==  "Cake" ||text ==  "cakes" ||text ==  "Cakes" ||text ==  "pastry" ||text ==  "Pastry" ||text ==  "pastries" ||text ==  "Pastries"){
                this.setState({review_body:"invalid"})
            }
        })
    }

    postReview = async () => {
        console.log(this.state)
        const value = await AsyncStorage.getItem('@session_token');
        const id = await AsyncStorage.getItem('@locationId');
        this.checkProfanity();
        if(this.state.review_body == "invalid"){
            ToastAndroid.show("Please keep reviews about coffee only!", ToastAndroid.SHORT);
        }else{
            return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + id + "/review", {
                method:'post',
                headers: {
                    'X-Authorization': value,
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(this.state)
            })
            .then((response) => {
                if(response.status === 201){
                    ToastAndroid.show("Review posted!", ToastAndroid.SHORT);
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
    }
    
    render(){
        return(
            <View style={styles.container}>
                <Text style={styles.title}>Leave a Review</Text>
                <View style={styles.row}>
                <Text style={styles.text}>Overall Rating:</Text>
                <TextInput 
                style={styles.inputSmall} 
                keyboardType="numeric" 
                onChangeText={(overall_temp) => this.setState({overall_rating:parseInt(overall_temp)})}
                value={this.state.overall_rating} />
                </View>
                <View style={styles.row}>
                <Text style={styles.text}>Price Rating:</Text>
                <TextInput 
                style={styles.inputSmall} 
                keyboardType="numeric" 
                onChangeText={(price_temp) => this.setState({price_rating:parseInt(price_temp)})}
                value={this.state.price_rating} />
                </View>
                <View style={styles.row}>
                <Text style={styles.text}>Quality Rating:</Text>
                <TextInput 
                style={styles.inputSmall}
                keyboardType="numeric" 
                onChangeText={(quality_temp) => this.setState({quality_rating:parseInt(quality_temp)})}
                value={this.state.quality_rating} />
                </View>
                <View style={styles.row}>
                <Text style={styles.text}>Cleanliness Rating:</Text>
                <TextInput 
                style={styles.inputSmall} 
                keyboardType="numeric" 
                onChangeText={(clenliness_temp) => this.setState({clenliness_rating:parseInt(clenliness_temp)})}
                value={this.state.clenliness_rating} />
                </View>
                <Text style={styles.text}>Review body: </Text>
                <TextInput 
                style={styles.input}  
                onChangeText={(review_body) => this.setState({review_body})}
                value={this.state.review_body} />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.postReview()}>
                    <Text style={styles.buttonText}>Leave Review!</Text>
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
        backgroundColor: 'wheat'
    },
    row:{
        flexDirection: 'row'
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
    inputSmall:{
        height:40,
        borderColor: 'black',
        backgroundColor:'snow',
        borderWidth: 1,
        padding:2,
        width:40
    },
    button:{
        backgroundColor:'sienna',
        padding:10
    },
    buttonText:{
        color:'white'
    }
});

export default Review;