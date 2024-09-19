import { StyleSheet, Text, Modal, TextInput, View, ImageBackground, Dimensions, TouchableOpacity, Alert, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';


const { width, height } = Dimensions.get('window')

const splashImages = [
    require('../../assets/splash2.jpg'),
    require('../../assets/splash1.jpg'), // Add more images as needed
    require('../../assets/splash3.jpg'),
    require('../../assets/splash4.jpg')
  ];

const AdminScreen = ({ navigation }) => {
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
            <SafeAreaView style={styles.overlay}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={styles.heading}>Admin Screen</Text>
                </View>
                <View style={{ flex: 6, justifyContent: 'center' }}>
                    <View style={{ alignItems: 'center', marginTop: 15 }}>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Add Movie')}>
                            <Text style={styles.inner}>Add Movie</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: 15 }}>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Delete Movie')}>
                            <Text style={styles.inner}>Delete Movie</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: 15 }}>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Update Movie')}>
                            <Text style={styles.inner}>Update Movie</Text>
                        </TouchableOpacity>
                    </View>
                </View>


            </SafeAreaView>

        </ImageBackground>
    )
}

export default AdminScreen

const styles = StyleSheet.create({

    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white'
    },
    logo: {
        width: width * 1,
        height: height * 1.1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        // justifyContent: 'center',
    },
    inner: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
        padding: 15,
        marginHorizontal: 20,
    },
    button: {
        backgroundColor: '#375057',
        width:width*0.9,
        borderRadius: 20,
        flexDirection: 'row',
        marginBottom: 30,
        justifyContent: 'center',
    },
})