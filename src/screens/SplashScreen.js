import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ImageBackground, Dimensions, TouchableOpacity } from "react-native";
import { mainheading } from "../constants/constants";

const { width, height } = Dimensions.get('window');

// Array of image sources for splash screen
const splashImages = [
  require('../assets/splash2.jpg'),
  require('../assets/splash1.jpg'), // Add more images as needed
  require('../assets/splash3.jpg'),
  require('../assets/splash4.jpg')
];

const SplashScreen = ({ navigation }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Set interval to change image every 30 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % splashImages.length);
    }, 3000); // 30000 milliseconds = 30 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <ImageBackground
      source={splashImages[currentImageIndex]} 
      style={styles.logo}
    >
      <View style={styles.overlay}>
        <View style={styles.textdesign}>
          <Text style={styles.text}>Welcome To MovieHub</Text>
        </View>
        <View style={styles.textdesign}>
          <Text style={styles.text}></Text>
        </View>
        <View style={styles.buttondesign}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.inner}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.inner}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: width * 1,
    height: height * 1.1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  text: {
    fontSize: mainheading,
    fontWeight: 'bold',
    color: 'white',
  },
  textdesign: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttondesign: {
    flex: 1,
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#375057',
    borderRadius: 10,
    marginBottom: 30,
    justifyContent: 'flex-end',
    width:width*0.9,
  },
  inner: {
    color: 'white',
    fontSize: 18,
    textAlign:'center',
    fontWeight: '500',
    padding: 10,
    marginHorizontal: 20
  }
});

export default SplashScreen;
