import { StyleSheet, Text, TextInput, TouchableOpacity, ActivityIndicator, Dimensions, View, Modal, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width, height } = Dimensions.get('window')
import Icon from 'react-native-vector-icons/FontAwesome';

const Signup = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [Confirmpassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [flag, setFlag] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmpasswordVisible, setConfirmPasswordVisible] = useState(false);


    const RegisterUser = async () => {
        if (!name || !email || !password || !Confirmpassword) {
            setError('Provide Credentials')
            setFlag(true)
            return;
        }
        if (password === Confirmpassword && password.length >= 8) {
            setIsLoading(true)
            //
            try {
                // Sign up the user with Firebase Authentication
                const userCredential = await auth().createUserWithEmailAndPassword(email, password);

                // Get the user's unique ID
                const userId = userCredential.user.uid;

                // Store the user data in Firestore
                await firestore().collection('users').doc(userId).set({
                    username: name,
                    email: email,
                    password: password, // Consider not storing the password in plain text
                });
                setError('Account Created Please Login')
                setIsLoading(false)
                setName('')
                setEmail('')
                setPassword('')
                setConfirmPassword('')
                navigation.navigate('Login')
                console.log('User signed up and data stored successfully!');
            } catch (err) {
                setIsLoading(false)
                if (err.code === 'auth/email-already-in-use') {
                    setError('Email Address is already in use')
                }
                else {
                    setError('Unknown Error occured')
                }
                console.error('Error signing up: ', err);
                setFlag(true)
            }

        } else {
            if (password.length <= 7) {
                setError('Password Must be Greater than 8 Letter')
            } else {
                setError('Password not matched')

            }
            setFlag(true)
        }
    }


    return (
        <SafeAreaView style={styles.overlay}>
            <ScrollView>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={[styles.heading, { fontSize: 30, marginBottom: 15 }]}>Sign Up Page</Text>
                    <Image source={require('../assets/logo.jpg')} style={{ width: 110, height: 110, borderRadius: 110 }} />
                </View>
                <View style={{ flex: 2, marginTop: 10 }}>
                    <View style={styles.input}>
                        <Icon style={{ paddingLeft: 10 }} name="user" size={17} color="#555" />
                        <TextInput
                            style={{ paddingLeft: 10,paddingRight:100, }}
                            placeholder='Provide Name'
                            placeholderTextColor="grey"
                            value={name}
                            onChangeText={(text) => { setName(text) }}
                        />
                    </View>

                    <View style={styles.input}>
                        <Icon style={{ paddingLeft: 10 }} name="envelope" size={17} color="#555" />
                        <TextInput
                            style={{ paddingLeft: 10,paddingRight:60, }}
                            placeholder='Provide Email'
                            placeholderTextColor="grey"
                            value={email}
                            onChangeText={(text) => { setEmail(text) }}
                        />
                    </View>

                    <View style={styles.input}>
                        <Icon style={{ paddingLeft: 10 }} name="key" size={17} color="#555" />
                        {
                            passwordVisible ?
                                <TextInput
                                    style={{ paddingLeft: 10,paddingRight:60, }}
                                    placeholder='Set Password'
                                    placeholderTextColor="grey"
                                    value={password}
                                    onChangeText={(text) => { setPassword(text) }}
                                />
                                :
                                <TextInput
                                style={{ paddingLeft: 10,paddingRight:60, }}
                                    placeholder='Set Password'
                                    placeholderTextColor="grey"
                                    value={password}
                                    onChangeText={(text) => { setPassword(text) }}
                                    secureTextEntry
                                />
                        }
                        {
                            passwordVisible ?
                                <TouchableOpacity style={styles.passwordopacity} onPress={() => setPasswordVisible(!passwordVisible)}>
                                    <Icon name="eye-slash" size={17} color="#555" />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity style={styles.passwordopacity} onPress={() => setPasswordVisible(!passwordVisible)}>
                                    <Icon name="eye" size={17} color="#555" />
                                </TouchableOpacity>
                        }

                    </View>

                    <View style={styles.input}>
                        <Icon style={{ paddingLeft: 10 }} name="key" size={17} color="#555" />
                        {
                            confirmpasswordVisible ?
                                <TextInput
                                style={{ paddingLeft: 10,paddingRight:60, }}
                                    placeholder='Confirm Password'
                                    placeholderTextColor="grey"
                                    value={Confirmpassword}
                                    onChangeText={(text) => { setConfirmPassword(text) }}
                                />
                                :
                                <TextInput
                                    style={{ paddingLeft: 10,paddingRight:60, }}
                                    placeholder='Confirm Password'
                                    placeholderTextColor="grey"
                                    value={Confirmpassword}
                                    onChangeText={(text) => { setConfirmPassword(text) }}
                                    secureTextEntry
                                />
                        }
                        {
                            confirmpasswordVisible ?
                                <TouchableOpacity style={styles.passwordopacity} onPress={() => setConfirmPasswordVisible(!confirmpasswordVisible)}>
                                    <Icon name="eye-slash" size={17} color="#555" />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity style={styles.passwordopacity} onPress={() => setConfirmPasswordVisible(!confirmpasswordVisible)}>
                                    <Icon name="eye" size={17} color="#555" />
                                </TouchableOpacity>
                        }

                    </View>
                    <View style={{ alignItems: 'center', marginTop: 50, }}>
                        <TouchableOpacity style={styles.button} onPress={() => RegisterUser()}>
                            <Text style={styles.inner}>Sign up</Text>
                            {
                                isLoading && <ActivityIndicator size='small' color="black" style={{ marginRight: 8 }} />
                            }
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={{ marginTop: height * 0.15, }}>
                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center' }} onPress={() => navigation.navigate('Login')}>
                        <Text style={{ color: 'black' }}>Already have an Account?  </Text>
                        <Text style={styles.input2}>Login Here</Text>
                    </TouchableOpacity>
                </View>

                <Modal
                    transparent={true}
                    visible={flag}
                // style={{width:width*0.8}}
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

        </SafeAreaView>
        // </ImageBackground>

    )
}

export default Signup

const styles = StyleSheet.create({
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
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    logo: {
        width: width * 1,
        height: height * 1.1,
    },
    overlay: {
        flex: 1,
        paddingTop: height * 0.05,
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backgroundColor: 'lightgrey',
        justifyContent: 'center',
        //alignItems:'center'
    },
    button: {
        backgroundColor: 'black',
        width: width * 0.9,
        borderRadius: 10,
        // marginBottom: 30,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    inner: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
        padding: 10,
    },
    inner2: {
        color: 'blue',
        fontWeight: '500',
        textAlign: 'right'
    },
    error: {
        color: 'gold',
        marginLeft: 20,
        marginBottom: 10
    },
    modal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // borderWidth:1
    },
    view: {
        // borderWidth: 1,
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
    passwordopacity: {
        flex: 1,
        marginRight: 20,
        alignItems: 'flex-end'
    },
    button2: {
        backgroundColor: 'black',
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
    input2: {
        color: 'blue',
        textAlign: 'center',
        fontWeight: '500'
    }
})