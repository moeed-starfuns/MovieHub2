import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, ActivityIndicator, Modal, TextInput, View, Dimensions, ImageBackground, TouchableOpacity, Image, Alert, PermissionsAndroid, Platform, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useRoute } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const splashImages = [
    require('../../assets/splash2.jpg'),
    require('../../assets/splash1.jpg'),
    require('../../assets/splash3.jpg'),
    require('../../assets/splash4.jpg')
];

const AddMovie = ({ navigation }) => {
    const { params } = useRoute();
    const IS_EDIT = params?.isEdit;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [name, setName] = useState(IS_EDIT ? params.name : '');
    const [rating, setRating] = useState(IS_EDIT ? String(params?.rating) : '');
    const [img, setImg] = useState(IS_EDIT ? params.img : '');
    const [videoUrl, setVideoUrl] = useState(IS_EDIT ? params.videoUrl : '');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [flag, setFlag] = useState(false);

    // Request permissions for Android
    const requestStoragePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    {
                        title: "Storage Permission",
                        message:
                            "This app needs access to your storage to select pictures.",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("You can use the storage");
                } else {
                    console.log("Storage permission denied");
                }
            } catch (err) {
                console.warn(err);
            }
        }
    };

    useEffect(() => {
        requestStoragePermission();
    }, []);

    const pickImage = () => {
        const options = {
            mediaType: 'photo',
            quality: 1,
        };

        launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('Image Picker Error: ', response.errorMessage);
            } else {
                const uri = response.assets[0]?.uri;
                if (uri) {
                    console.log('Selected Image URI: ', uri); // Log URI for debugging
                    setImg(uri);
                } else {
                    console.log('Image URI is not available');
                }
            }
        });
    };

    const Add = async () => {
        if (!name || !rating || !img || !videoUrl) {
            setFlag(true);
            setError('Provide All Details');
            return;
        }
        setLoading(true);
        try {
            await firestore().collection('movies').add({
                name: name,
                img: img,
                rating: rating,
                videoUrl: videoUrl,
            });
            setError('Added');
            setFlag(true);
            setLoading(false);
            setName('');
            setImg('');
            setRating('');
            setVideoUrl('');
        } catch (err) {
            console.warn(err);
            setLoading(false);
            setError(err.message);
            setFlag(true);
        }
    };

    const EditMovie = async () => {
        if (!name || !rating || !img || !videoUrl) {
            setFlag(true);
            setError('Provide All Details');
            return;
        }
        setLoading(true);
        try {
            await firestore().collection('movies')
                .doc(params.key)
                .update({
                    name: name,
                    rating: rating,
                    img: img,
                    videoUrl: videoUrl,
                });
            setError('Updated Successfully');
            navigation.navigate('Admin Screen');
            setFlag(true);
            setLoading(false);
            setName('');
            setImg('');
            setRating('');
            setVideoUrl('');
        } catch (err) {
            console.warn(err);
            setLoading(false);
            setError(err.message);
            setFlag(true);
        }
    };

    useEffect(() => {
        // Set interval to change image every 3 seconds
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % splashImages.length);
        }, 3000); // 3000 milliseconds = 3 seconds

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    return (
        <ImageBackground
            source={splashImages[currentImageIndex]}
            style={styles.logo}
        >
            <ScrollView contentContainerStyle={styles.overlay}>

                {img ?
                    <View style={{ alignSelf: 'center', alignItems: 'center', }}>
                        <Image source={{ uri: img }} style={styles.circularImage} />
                        <TouchableOpacity onPress={pickImage} style={[styles.selectbutton, { position: 'absolute', bottom: 30 }]}>
                            <Icon name="add" size={25} color="white" />
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={[styles.circleButton, { alignSelf: 'center', alignItems: 'center' }]}>
                        {/* <Icon name="image" size={80} color="white" /> */}
                        <TouchableOpacity onPress={pickImage} style={styles.selectbutton}>
                            <Icon name="add" size={25} color="white" />
                        </TouchableOpacity>
                        {/* <Text style={{color:'white',marginBottom:10}}>Pick Image</Text> */}
                    </View>
                }

                <TextInput
                    placeholder='Provide Movie Name'
                    placeholderTextColor={'grey'}
                    value={name}
                    onChangeText={(text) => setName(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder='Global Rating'
                    placeholderTextColor={'grey'}
                    value={rating}
                    onChangeText={(text) => setRating(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder='Video URL'
                    placeholderTextColor={'grey'}
                    value={videoUrl}
                    onChangeText={(text) => setVideoUrl(text)}
                    style={styles.input}
                />

                {IS_EDIT ?
                    <View style={{ alignItems: 'center', marginTop: 15 }}>
                        <TouchableOpacity style={styles.button} onPress={EditMovie}>
                            <Text style={styles.inner}>Update</Text>
                            {loading && <ActivityIndicator size="small" color="black" style={{ marginRight: 10 }} />}
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={{ alignItems: 'center', marginTop: 15 }}>
                        <TouchableOpacity style={styles.button} onPress={Add}>
                            <Text style={styles.inner}>Add</Text>
                            {loading && <ActivityIndicator size="small" color="black" style={{ marginRight: 10 }} />}
                        </TouchableOpacity>
                    </View>
                }

                <Modal
                    transparent={true}
                    visible={flag}
                >
                    <View style={styles.modal} >
                        <View style={styles.view}>
                            <Text style={styles.text}>{error}</Text>
                            <TouchableOpacity style={styles.button2} onPress={() => setFlag(false)}>
                                <Text style={styles.Modaltext}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center'
    },
    logo: {
        width: width * 1,
        height: height * 1.1,
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        margin: 20,
        padding: 10,
        borderColor: 'lightgrey',
        color: 'white'
    },
    button: {
        backgroundColor: '#375057',
        borderRadius: 10,
        flexDirection: 'row',
        width: width * 0.9,
        marginBottom: 30,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        paddingHorizontal: 30
    },
    selectbutton: {
        alignSelf: 'flex-end',
        borderWidth: 1,
        backgroundColor: 'green',
        borderRadius: 60
    },
    inner: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
    },
    circleButton: {
        width: 150,
        height: 150,
        borderRadius: 40,
        backgroundColor: 'grey',
        justifyContent: 'flex-end',
    },
    circularImage: {
        width: 150,
        height: 150,
        borderRadius: 100,
        marginBottom: 20,
        resizeMode: 'cover',
    },
    modal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    view: {
        width: width * 0.8,
        backgroundColor: 'white',
        elevation: 5,
        borderRadius: 20,
        shadowColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        padding: 10,
        fontSize: 20,
        color: 'red',
        padding: 50,
    },
    button2: {
        backgroundColor: '#375057',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15
    },
    Modaltext: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        padding: 10,
        marginHorizontal: 20,
    },
});

export default AddMovie;
