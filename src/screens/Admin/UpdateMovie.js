import React, { useEffect, useState } from 'react';
import { StyleSheet, Alert, Text, View, TextInput, Dimensions, ImageBackground, TouchableOpacity, FlatList, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

const splashImages = [
    require('../../assets/splash2.jpg'),
    require('../../assets/splash1.jpg'), // Add more images as needed
    require('../../assets/splash3.jpg'),
    require('../../assets/splash4.jpg')
];

const SearchMovie = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const subscriber = firestore()
            .collection('movies')
            .onSnapshot(res => {
                const movie = [];

                res.forEach(item => {
                    movie.push({
                        ...item.data(),
                        key: item.id,
                    });
                });
                setMovies(movie);
                // setLoading(false);
                setFilteredMovies(movies)
            });

        // Unsubscribe from events when no longer in use
        return () => subscriber();
    }, []);

    const UpdateMovie = (item) => {
        navigation.navigate('Add Movie', {
            isEdit: true,
            name: item.name,
            rating: item.rating,
            videoUrl: item.videoUrl,
            img: item.img,
            id: item.id,
            key: item.key
        })
    }

    const handleSearch = (query) => {
        const lowerCaseQuery = query.toLowerCase();
        const results = movies.filter(movie =>
            movie.name.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredMovies(results);
    };
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
            <SafeAreaView style={styles.container}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Search Here"
                        placeholderTextColor={'lightgrey'}
                        value={searchQuery}
                        onChangeText={(text) => {
                            setSearchQuery(text);
                            handleSearch(text);
                        }}
                    />
                </View>
                {filteredMovies.length === 0 && searchQuery.length > 0 ? (
                    <Text style={styles.noResults}>Movie not found</Text>
                ) : (
                    <FlatList
                        data={filteredMovies}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.movieItem}>
                                <View style={{ flex: 2 }}>
                                    <Text style={styles.movieTitle}>{item.name}</Text>
                                    <Text style={styles.movieTitle}>Rating: {item.rating}</Text>
                                </View>
                                <View style={styles.delete}>

                                    <TouchableOpacity onPress={() => (UpdateMovie(item))}>
                                        <Icon name="refresh" size={30} color="green" />
                                    </TouchableOpacity>
                                </View>

                            </View>
                        )}
                    />
                )}
            </SafeAreaView>
        </ImageBackground>
    );
};

export default SearchMovie;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 45,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        marginBottom: 40,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 10,
        color: 'white',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'lightgrey',
        color: 'white',
        borderRadius: 20,
        padding: 10,
        margin: 10,
    },
    movieItem: {
        backgroundColor: 'rgba(128, 128, 128, 0.6)',
        marginBottom: 20,
        margin:10,
        flex: 1,
        padding: 10,
        flexDirection: 'row',
    },
    movieTitle: {
        fontSize: 20,
        paddingLeft: 10,
        color: 'black',
        fontWeight: 'bold',
    },
    noResults: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
    },
    logo: {
        width: width * 1,
        height: height * 1.1,
    },
    delete: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: 20,
    }
});
