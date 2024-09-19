import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
const DropdownMenu = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false); // State to control dropdown visibility
    const navigation = useNavigation();

    const handleDropdownToggle = () => {
        setDropdownVisible(!dropdownVisible); // Toggle dropdown visibility
    };

    const handleChangePassword = () => {
        navigation.navigate('Forgot Password')
        setDropdownVisible(false); // Close dropdown
    };

    const handleLogout = () => {
        setDropdownVisible(false); 
        
        auth().signOut()
        .then(() => {
            console.log('User signed out!');
            navigation.navigate('Login'); // Make sure you have access to the navigation object
        })
        .catch(error => {
            console.error('Error logging out: ', error);
            Alert.alert('Logout Error', 'There was an issue logging out. Please try again.');
        });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleDropdownToggle} style={styles.dropdownButton}>
                <Image source={require('../assets/dropdown.png')} style={{ width: 20, height: 20 }} />
            </TouchableOpacity>

            {/* Dropdown Menu */}
            {dropdownVisible && (
                <View style={styles.dropdown}>
                    <TouchableOpacity onPress={handleChangePassword} style={styles.option}>
                    <Icon style={{ paddingLeft: 10 }} name="key" size={17} color="#555" />
                      
                        <Text style={styles.optionText}>Change Password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLogout} style={styles.option}>
                    <Icon style={{ paddingLeft: 10 }} name="sign-out" size={17} color="#555" />
                        <Text style={styles.optionText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default DropdownMenu;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropdownButton: {
        marginRight: 10,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    dropdown: {
        position: 'absolute',
        right: 0,
        top: 50, // Position dropdown below the button
        backgroundColor: 'white',
        borderRadius: 5,
        elevation: 5,
        width: 230,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        alignItems:'center'
    },
    optionText: {
        fontSize: 16,
        color: 'black',
    },
});
