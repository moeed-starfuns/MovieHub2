
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { GoogleSignin, statusCodes, isErrorWithCode } from '@react-native-google-signin/google-signin';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

// Configure Google Sign-In
GoogleSignin.configure({
    webClientId: '589248299431-idspm784kd9d4pcsioflei4f5hlovf31.apps.googleusercontent.com', // This should match the one in the Google API Console
    offlineAccess: false,
    hostedDomain: '', // Set to your domain if applicable
    forceCodeForRefreshToken: true,
});

const GoogleSignInButton = () => {

  const handleGoogleSignIn = async () => {
    try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        console.log(userInfo);
    } catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
            console.log('User cancelled the sign-in flow');
        } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
            console.log('Sign-in operation is in progress');
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
            console.log('Play services not available or outdated');
        } else if (error.code === statusCodes.DEVELOPER_ERROR) {
            // Check your client ID, SHA-1 fingerprint, and other configurations
            console.log('Developer Error:', error.message);
        } else {
            // some other error happened
            console.log('An error occurred during sign-in:', error.message);
        }
    }
};

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <TouchableOpacity style={styles.container} onPress={handleGoogleSignIn}>
        <Icon name="google" size={20} color="white" />
        <Text style={{ color: 'white' }}>SIGN IN WITH GOOGLE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: '#4285F4',
    width: width * 0.9,
  },
});

export default GoogleSignInButton;
