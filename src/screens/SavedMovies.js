import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Dimensions, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

const SaveMovies = ({ navigation }) => {
  const [savedMovies, setSavedMovies] = useState([]);
  const user = auth().currentUser;

  const deleteMovie = (name) => {
    if (!user || !user.uid) {
      Alert.alert('User not authenticated');
      return;
    }

    firestore()
      .collection('savedmovies')
      .where('uid', '==', user.uid)
      .where('name', '==', name)
      .get()
      .then(movie => {
        if (movie.empty) {
          Alert.alert('No matching movie found for the user');
          return;
        }

        const deletePromises = movie.docs.map(doc => doc.ref.delete());

        return Promise.all(deletePromises);
      })
      .then(() => {
        Alert.alert('Movie Successfully Removed!');
      })
      .catch(err => {
        Alert.alert('Unable to Remove', err.message);
      });
  }

  useEffect(() => {
    if (user) {
      const unsubscribe = firestore()
        .collection('savedmovies')
        .where('uid', '==', user.uid)
        .onSnapshot(item => {
          const movies = item.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setSavedMovies(movies);
        }, error => {
          console.log('Error fetching saved movies:', error);
        });

      return () => unsubscribe();
    }
  }, [user]);

  return (
    <View style={styles.container}>
      {
        savedMovies.length!== 0 ?
        <FlatList
        data={savedMovies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.movieItem}>
            <Image source={{ uri: item.img }} style={styles.movieImage} />
            <View style={styles.infoContainer}>
              <Text style={styles.movieTitle}>{item.name}</Text>
              <Text style={styles.movieRating}>Rating: {item.rating}</Text>
            </View>
            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Watch Now', { item })}>
                <Icon name="play" size={20} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton,{}]} onPress={() => deleteMovie(item.name)}>
                <Icon name="trash" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      : 
      <Text style={styles.noResults}>No Saved Movies</Text>
      }
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  movieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: 'grey',
    elevation: 5,
  },
  movieImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  movieRating: {
    fontSize: 14,
    color: '#555',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    borderRadius: 10,
    padding: 10,
    // borderWidth:1,
    marginHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResults: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
},
});

export default SaveMovies;
