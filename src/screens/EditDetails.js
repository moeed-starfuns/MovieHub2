import { StyleSheet, Text, TextInput, Modal, TouchableOpacity, View, Dimensions, Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth'; // Ensure this is installed and configured
import firestore from '@react-native-firebase/firestore'; // Ensure this is installed and configured

const { width, height } = Dimensions.get('window');

const EditProfile = ({ route }) => {
    const { userData } = route.params;
    const [flag, setFlag] = useState(false);
    const [username, setUserName] = useState(userData.username);
    const [previouspassword, setPreviousPassword] = useState('');
    const [newpassword, setNewPassword] = useState('');
    const [confirmnewpassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    const verifyCredentials = () => {
        setFlag(true);

        if (!newpassword || !confirmnewpassword) {
            setError('Provide Credentials');
            return;
        }

        if (newpassword.length < 7 || confirmnewpassword.length < 7) {
            setError('Password must be greater than 7 characters');
            return;
        }

        if (newpassword !== confirmnewpassword) {
            setError('Passwords do not match');
            return;
        }
        setError('');
    };

    const updateUser = async () => {
        setLoading(true);
if(!previouspassword){
    setError('Provide Password')
    setFlag(true)
    setLoading(false)
    return
}

        const user = auth().currentUser;

        // Reauthenticate user with current password
        const credential = auth.EmailAuthProvider.credential(user.email, previouspassword);

        try {
            await user.reauthenticateWithCredential(credential); // Reauthenticate user

            // Update username in Firestore
            await firestore().collection('users').doc(user.uid).update({
                username: username || userData.username, // Update only if new username is provided
                password: newpassword,
            });

            // Update password in Firebase Authentication
            await user.updatePassword(newpassword);

            setFlag(false); // Close modal after successful update
            Alert.alert('Success', 'Your details have been updated!');
        } catch (error) {
            if (error.code === 'auth/wrong-password') {
                setError('The old password is incorrect.');
            } else {
                setError('Old Password is incorrect.');
            }
            setFlag(true); // Display error in modal
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.view}>
                <Text style={styles.text}>Update User Details</Text>

                <View style={[styles.input, {}]}>
                    <Icon style={{ paddingLeft: 10 }} name="envelope" size={17} color="#555" />
                    <Text style={{ paddingLeft: 10, padding: 10, color: 'darkred' }}>{userData.email}</Text>
                </View>

                <View style={styles.input}>
                    <Icon style={{ paddingLeft: 10 }} name="user" size={17} color="#555" />
                    <TextInput
                        style={{ paddingLeft: 10, paddingRight: 60 }}
                        placeholder='Update Username'
                        placeholderTextColor="grey"
                        value={username}
                        onChangeText={(text) => setUserName(text)}
                    />
                </View>
                <View style={styles.input}>
                    <Icon style={{ paddingLeft: 10 }} name="key" size={17} color="#555" />
                    <TextInput
                        style={{ paddingLeft: 10, paddingRight: 60 }}
                        placeholder='New Password'
                        placeholderTextColor="grey"
                        secureTextEntry
                        value={newpassword}
                        onChangeText={(text) => setNewPassword(text)}
                    />
                </View>
                <View style={styles.input}>
                    <Icon style={{ paddingLeft: 10 }} name="key" size={17} color="#555" />
                    <TextInput
                        style={{ paddingLeft: 10, paddingRight: 60 }}
                        placeholder='Confirm New Password'
                        placeholderTextColor="grey"
                        secureTextEntry
                        value={confirmnewpassword}
                        onChangeText={(text) => setConfirmNewPassword(text)}
                    />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={styles.button2} onPress={verifyCredentials}>
                        <Text style={styles.Modaltext}>Update</Text>
                    </TouchableOpacity>
                </View>

                <Modal
                    transparent={true}
                    visible={flag}
                >
                    {error ? (
                        <View style={styles.modal}>
                            <View style={styles.view2}>
                                <Text style={styles.text2}>{error}</Text>
                                <TouchableOpacity style={styles.button3} onPress={() => setFlag(false)}>
                                    <Text style={styles.Modaltext}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.modal}>
                            <View style={styles.view2}>
                                <View style={[styles.input,{marginTop:20}]}>
                                    <Icon style={{ paddingLeft: 10 }} name="key" size={17} color="#555" />
                                    <TextInput
                                        style={{ paddingLeft: 10, paddingRight: 60 }}
                                        placeholder='Provide old Password'
                                        placeholderTextColor="grey"
                                        secureTextEntry
                                        value={previouspassword}
                                        onChangeText={(text) => setPreviousPassword(text)}
                                    />
                                </View>
                                <TouchableOpacity style={styles.button3} onPress={updateUser}>
                                    <Text style={styles.Modaltext}>Submit</Text>
                                    {loading && <ActivityIndicator size='small' color='white' />}
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </Modal>
            </View>
        </View>
    );
};

export default EditProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightgrey',
    },
    view: {
        alignItems: 'center',
    },
    text: {
        fontSize: 25,
        marginTop: height * 0.1,
        marginBottom: height * 0.1,
        fontWeight: 'bold',
        justifyContent: 'center',
        color: 'black',
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
    text2: {
        padding: 10,
        fontSize: 20,
        color: 'red',
        padding: 50,
    },
    button2: {
        margin: 10,
        backgroundColor: 'black',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: width * 0.9,
        marginBottom: 15,
    },
    button3: {
        margin: 10,
        backgroundColor: 'black',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: width * 0.4,
        marginBottom: 15,
        flexDirection:'row'
    },
    modal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    Modaltext: {
        color: 'white',
        fontSize: 15,
        fontWeight: '500',
        padding: 10,
        marginHorizontal: 20,
    },
    view2: {
        backgroundColor: 'white',
        elevation: 5,
        borderRadius: 20,
        shadowColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
