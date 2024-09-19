import { StyleSheet, Text, Modal, TextInput, View, Dimensions, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import auth from '@react-native-firebase/auth'
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import GoogleSignInButton from '../Components/GoogleSignin';
import FacebookSignin from '../Components/FacebookSignin';
const { width, height } = Dimensions.get('window')



const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [flag, setFlag] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false)

    const VerifyLogin = () => {
        if (!email || !password) {
            setError('Provide Credentials')
            setFlag(true)
            return;
        }
        setLoading(true);
        auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                setEmail('')
                setPassword('')
                setLoading(false);
                if (password === 'admin123' && email === 'admin@gmail.com') {
                    navigation.navigate('Admin Screen')
                } else {
                    navigation.navigate('Home')
                }
            })
            .catch((error) => {
                setLoading(false)
                switch (error.code) {
                    case 'auth/invalid-email':
                        setError('Invalid Email.');
                        break;
                    case 'auth/user-not-found':
                        setError('No user found with this email.');
                        break;
                    case 'auth/wrong-password':
                        setError('Incorrect Password.');
                        break;
                    default:
                        setError('The supplied auth credential is incorrect, malformed or has expired.');
                        console.log(error.message);
                        break;
                }
                setFlag(true)

            })
    }
    return (
        <SafeAreaView style={styles.overlay}>
            <ScrollView >

                <View style={{ flex: 1, marginTop: 15, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={[styles.heading, { fontSize: 30, marginBottom: 15 }]}>Login Here</Text>
                    <Image source={require('../assets/logo.jpg')} style={{ width: 110, height: 110, borderRadius: 110 }} />
                </View>
                <View style={{ flex: 2, marginTop: 20, }}>


                    <View style={[styles.input, { alignItems: 'center', alignSelf: 'center', flexDirection: 'row' }]}>
                        <Icon style={{ paddingLeft: 10 }} name="envelope" size={17} color="#555" />
                        <TextInput
                            style={{ paddingLeft: 10 }}
                            placeholder='Enter Email'
                            placeholderTextColor="grey"
                            value={email}
                            onChangeText={(text) => setEmail(text)}

                        />
                    </View>
                    <View style={[styles.input, { alignItems: 'center', alignSelf: 'center', flexDirection: 'row' }]} >
                        <Icon style={{ paddingLeft: 10 }} name="key" size={17} color="#555" />
                        {passwordVisible ?
                            <TextInput
                                style={{ paddingLeft: 10 }}
                                placeholder='Enter Password'
                                placeholderTextColor="grey"
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                            />
                            :
                            <TextInput
                                style={{ paddingLeft: 10 }}
                                placeholder='Enter Password'
                                placeholderTextColor="grey"
                                value={password}
                                onChangeText={(text) => setPassword(text)}
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


                    <View style={{ flexWrap: 'wrap-reverse', marginRight: 20 }}>
                        <TouchableOpacity onPress={() => navigation.navigate('Forgot Password')}>
                            <Text style={{ color: 'blue', fontWeight: '500', marginLeft: 10 }}>Forgot Password? </Text>
                        </TouchableOpacity>
                    </View>
                    {/* <Text style={styles.error}>{error}</Text> */}

                    <View style={{ alignItems: 'center', marginTop: 40, }}>
                        <TouchableOpacity style={styles.button} onPress={VerifyLogin}>
                            <Text style={styles.inner}>Login</Text>
                            {loading && <ActivityIndicator size="small" color="black" style={{ marginRight: 10 }} />}
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ flex: 1, height: 1, backgroundColor: '#000', marginHorizontal: 10, marginLeft: 15 }} />
                        <Text style={{ marginHorizontal: 10, }}>OR</Text>
                        <View style={{ flex: 1, height: 1, backgroundColor: '#000', marginHorizontal: 10, marginRight: 15 }} />
                    </View>

                    <GoogleSignInButton />
                    <FacebookSignin />




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
                </View>
            </ScrollView>

        </SafeAreaView >


        // </ImageBackground>
    )
}

export default Login

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 10,
        width: width * 0.9,
        margin: 10,
        color: 'black'
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white'
    },
    logo: {
        width: width * 1,
        height: height * 1.1,
    },
    overlay: {
        flex: 1,
        paddingTop: height * 0.1,
        backgroundColor: 'lightgrey',
    },
    inner: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
        padding: 10,
        // marginHorizontal: 20,
    },
    inner2: {
        color: 'gold',
        fontWeight: '600',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        borderRadius: 4,
        alignItems: 'center',
    },
    error: {
        color: 'gold',
        marginLeft: 20,
        marginBottom: 10
    },
    button: {
        backgroundColor: 'black',
        borderRadius: 10,
        flexDirection: 'row',
        marginBottom: 30,
        justifyContent: 'center',
        width: width * 0.9,
    },
    modal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    view: {
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
        backgroundColor: 'black',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15
    },
    passwordopacity: {
        flex: 1,
        marginRight: 20,
        alignItems: 'flex-end'
    },
    Modaltext: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        padding: 10,
        marginHorizontal: 20,
    },
})