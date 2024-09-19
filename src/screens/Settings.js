import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, ActivityIndicator, ScrollView, TextInput, Modal, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // FontAwesome icons
import { useIsFocused } from '@react-navigation/native';
import ButtonComponent from '../Components/Button';

const { width, height } = Dimensions.get('window')

const Settings = ({navigation}) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [flag, setFlag] = useState(false)
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const isFocused = useIsFocused();

  const fetchUserData = async () => {
    try {
      const currentUser = auth().currentUser;
      if (currentUser) {
        const userId = currentUser.uid;
        const userDoc = await firestore().collection('users').doc(userId).get();

        if (userDoc.exists) {
          setUserData(userDoc.data());
        } else {
          setUserData({});
        }
      } else {
        setUserData({});
      }
    } catch (err) {
      console.log('Error fetching user data:', err);
      setUserData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
        fetchUserData();
    }
}, [isFocused]);

  // useEffect(() => {
  //   fetchUserData();
  // }, []);

  const UpdateData = () => {
    navigation.navigate('Edit Profile',{userData})
  }  
  const updateUser = async () => {
    setLoading(true);
  
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        Alert.alert('Error', 'No user is logged in.');
        setLoading(false);
        return;
      }
  
      // Update Firestore data
      const userId = currentUser.uid;
      await firestore()
        .collection('users')
        .doc(userId)
        .update({
          username: username,
          password: password, // Avoid storing plain text passwords
        }); 
      if (password) {
        await currentUser.updatePassword(password);
      }
  
      Alert.alert('Success', 'User details updated successfully! Please verify your new email if updated.');
      setFlag(false);
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to update user details.');
      console.log(err.message);
    } finally {
      setLoading(false);
      auth.signOut().then(()=>navigation.navigate('Login'))
      fetchUserData(); // Refresh user data
    }
  };
  

  const handleLogout = () => {
    auth().signOut()
    .then(() => {
        // console.log('User signed out!');
        navigation.navigate('Login'); // Make sure you have access to the navigation object
    })
    .catch(error => {
        console.error('Error logging out: ', error);
        Alert.alert('Logout Error', 'There was an issue logging out. Please try again.');
    });
};
  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>User Details</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      ) : (
        <View style={styles.card}>
          <View style={styles.item}>
            <Text style={styles.label}>Username:</Text>
            <Text style={styles.itemText}>{userData.username || 'N/A'}</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.itemText}>{userData.email || 'N/A'}</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>Password:</Text>
            <View style={styles.passwordContainer}>
              <Text style={styles.itemText}>{passwordVisible ? userData.password || 'N/A' : '••••••••'}</Text>
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                <MaterialIcons
                  name={passwordVisible ? 'visibility' : 'visibility-off'}
                  size={20}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.button} onPress={() => UpdateData()}>
              <FontAwesome name="edit" size={20} color="white" />
              <Text style={styles.buttonText}>Update Details</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
              <FontAwesome name="sign-out" size={20} color="white" />
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:height*0.1,
    backgroundColor: '#f0f0f5',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    width: width * 0.9,
    margin: 10,
    color: 'black',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  header: {
    fontSize: 26,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  loader: {
    marginTop: 50,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  item: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: 'black',
    marginBottom: 5,
    fontWeight: '600',
  },
  itemText: {
    fontSize: 16,
    color: '#444',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actions: {
    // flexDirection: 'row',
    justifyContent: 'space-around',

    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: 'green',
    paddingVertical: 10,
    marginBottom:8,
    borderRadius: 10,
  },
  logoutButton: {
    backgroundColor: '#e3483d',
  },
  buttonText: {
    marginLeft: 8,
    color: 'white',
    fontWeight: '600',

  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth:1
  },
  view: {
    // borderWidth: 1,
    // flex:1,
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: 20,
    shadowColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    padding: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    paddingTop: 30,
  },
  button2: {
    margin: 10,
    backgroundColor: 'black',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.4,
    marginBottom: 15
  },
  Modaltext: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
    padding: 10,
    marginHorizontal: 20,
  },
});
