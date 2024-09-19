import React, { useEffect, useState } from 'react';
import { StyleSheet, StatusBar, Text, View, TextInput, Dimensions, TouchableOpacity, FlatList, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const { width, height } = Dimensions.get('window');

const SearchMovie = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);

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
                setFilteredMovies(movie);
            });

        // Unsubscribe from events when no longer in use
        return () => subscriber();
    }, []);

    const handleSearch = (query) => {
        const lowerCaseQuery = query.toLowerCase();
        const results = movies.filter(movie =>
            movie.name.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredMovies(results);
    };

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="dark-content"  // Changed to dark-content for better visibility
                backgroundColor="#f8f8f8"
                translucent={true}
            />
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Search for a movie"
                    placeholderTextColor="grey"
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
                        <View >
                            <TouchableOpacity style={styles.movieItem} onPress={() => navigation.navigate('Watch Now', { item })}>
                                <Image source={{uri:item.img}} style={styles.movieImage} />
                                <View style={{flex:1,justifyContent:'center'}}>
                                <Text style={styles.movieTitle}>{item.name}</Text>
                                <Text style={[styles.movieTitle,{color:'#555',fontSize:14}]}>Rating: {item.rating}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

export default SearchMovie;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        padding: 15,
    },
    searchContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    input: {
        width: width * 0.9,
        height: 50,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    movieItem: {
        backgroundColor: 'white',
        flexDirection:'row',
        marginBottom: 15,
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    movieTitle: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
    },
    movieImage: {
        width: 80,
        height: 120,
        borderRadius: 8,
        marginRight: 10,
      },
    noResults: {
        fontSize: 18,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
});
