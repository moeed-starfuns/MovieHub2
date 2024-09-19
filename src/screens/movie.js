import { Alert, Image, StyleSheet, Text, TouchableOpacity, Dimensions, View, ImageBackground } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation for navigation
import { useState } from 'react';
import firestore  from '@react-native-firebase/firestore';
import auth  from '@react-native-firebase/auth';
const { width, height } = Dimensions.get('window');

const Movie = ({ route }) => {
    const { item } = route.params;
    const navigation = useNavigation(); // Initialize useNavigation
    const [isModalVisible, setIsModalVisible] = useState(false); // State to handle modal visibility

    const handlePlayPress = () => {
        if (item.videoUrl) {
            navigation.navigate('VideoPlayer', { videoUrl: item.videoUrl }); // Navigate to VideoPlayerScreen with videoUrl
        } else {
            Alert.alert('Video not available');
        }
    };
    const saveMovie = () => {
        const user = auth().currentUser; 
    
        if (user) {
            firestore()
                .collection('savedmovies')
                .where('uid', '==', user.uid)
                .where('name', '==', item.name) 
                .get()
                .then(movie => {
                    if (!movie.empty) {
                        Alert.alert('Movie already added!');
                    } else {
                        firestore()
                            .collection('savedmovies')
                            .add({
                                uid: user.uid, // Add the user's UID
                                name: item.name,
                                img: item.img,
                                rating: item.rating,
                                videoUrl: item.videoUrl,
                            })
                            .then(() => {
                                console.log('Added:', item.name);
                                Alert.alert('Movie added to Watch Later!');
                                navigation.navigate('Home')
                            })
                            .catch(err => {
                                Alert.alert('Unknown Error Occurred: ' + err);
                            });
                    }
                })
                .catch(err => {
                    Alert.alert('Error checking saved movies: ' + err);
                });
        } else {
            Alert.alert('User not authenticated!');
        }
    };

    return (
        <ImageBackground
            source={{ uri: item.img }}
            style={styles.img}
        >
            <View style={styles.overlay}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.rating}>Rating: {item.rating}</Text>

                <TouchableOpacity style={styles.button} onPress={handlePlayPress}>
                    <Text style={styles.text}>▶ Play</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={saveMovie}>
                    <Text style={styles.text}>👁️ Add to Watch Later</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default Movie;

const styles = StyleSheet.create({
    img: {
        width: width*1,
        height: height*1.1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
    },
    rating: {
        marginTop: 10,
        fontSize: 16,
        color: 'white',
    },
    button: {
        backgroundColor: '#375057',
        padding: 10,
        borderRadius: 20,
        marginTop: 10,
        paddingHorizontal: 20,
    },
    text: {
        color: 'white',
    },
});
