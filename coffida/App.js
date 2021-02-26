import 'react-native-gesture-handler';
import React, {Component} from 'react';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from './components/home';
import Locations from './components/locations';
import User from './components/user';
import Login from './components/login';
import Signup from './components/signup';
import LocationDetails from './components/locationdetails';

import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, BackHandler, FlatList, ActivityIndicator } from 'react-native';

import { Header, LearnMoreLinks, Colors, DebugInstructions, ReloadInstructions } from 'react-native/Libraries/NewAppScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeTabs() {
  return(
    <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home'){
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Locations') {
              iconName = focused ? 'cafe' : 'cafe-outline';
            } else if (route.name === 'User') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />
          },
        })}
        tabBarOptions={{
          activeTintColor: 'sienna',
          inactiveTintColor: 'gray',
        }}
        >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Locations" component={Locations} />
        <Tab.Screen name="User" component={User} />
      </Tab.Navigator>
  );
}

class App extends Component {
  render(){
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeTabs} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Details" component={LocationDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
      }
};



const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
