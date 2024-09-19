import { StyleSheet, Text, View, Dimensions, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'

const { width, height } = Dimensions.get('window')

const Home = ({ navigation }) => {

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true)

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
                setLoading(false);
            });

        // Unsubscribe from events when no longer in use
        return () => subscriber();
    }, []);

    if (loading) {
        return <ActivityIndicator size={'small'} color={'red'} />
    }
    return (
        <View style={styles.container}>
            {/* <Text style={styles.heading}>All Time Blockbuster Movies</Text> */}

            <FlatList
                data={movies}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image
                            source={{ uri: item.img }}
                            style={styles.img}
                        />
                        <Text style={styles.title}>{item.name}</Text>
                        <Text style={styles.rating}>Rating: {item.rating}</Text>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Watch Now', { item })} >
                            <Text style={styles.text}>Watch Now</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    heading: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: "black"
    },
    img: {
        width: width * 1,
        height: height * 0.6,
        // borderRadius:30
    },
    container: {
        // marginTop: 40,
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        justifyContent: 'center',
    },
    card: {
        marginBottom: 20,
        backgroundColor: 'lightgrey',
        // borderBottomWidth:2,
        borderRadius: 20,
        paddingBottom: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'black'
    },
    image: {
        width: 200,
        height: 300,
        borderRadius: 10,
    },
    rating: {
        marginTop: 10,
        fontSize: 16,
        color: 'black',
    },
    button: {
        backgroundColor: '#375057',
        padding: 10,
        borderRadius: 20,
        marginTop: 10
    },
    text: {
        color: 'white'
    }
})