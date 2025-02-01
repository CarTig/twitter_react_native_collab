import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from './Register';
import LoginScreen from './Login';
import HomeScreen from './Home';
import ChatBoxScreen from './Chatbox';
import { Provider } from 'react-redux';
import { store } from '../redux/store';

const Stack = createStackNavigator();

export default function Layout() {
  return (
    <Provider store={store}>
        
    <Stack.Navigator>
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ChatBox" component={ChatBoxScreen} />
    </Stack.Navigator>
    </Provider>
  );
}

//mémo : document est propre a react web ==> non adapté a react native !