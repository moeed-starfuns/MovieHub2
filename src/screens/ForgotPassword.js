import { StyleSheet, Text, TextInput, View, Modal, Dimensions, ActivityIndicator, ImageBackground, TouchableOpacity, Alert, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import auth from '@react-native-firebase/auth'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/FontAwesome';


const { width, height } = Dimensions.get('window')


const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [flag, setFlag] = useState(false);
    const [loading, setLoading] = useState(false);

    const isValidEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const RecoverAccount = () => {
        if (!email) {
            setError('Please Provide Email')
            setFlag(true)
            return;
        }
        if (!isValidEmail(email)) {
            setError('Invalid Email Format');
            setFlag(true)
            return;
        }
        setLoading(true)
        auth().sendPasswordResetEmail(email)
            .then(() => {
                setLoading(false)
                Alert.alert('Check Your Email', 'If You are not already Registered then you will not receive a link');
                setEmail('');
            })
            .catch((error) => {
                setLoading(false)
                setError(error.message);
                setFlag(true)
            });
    }
    return (
        <SafeAreaView style={styles.overlay}>
            <ScrollView contentContainerStyle={{ marginTop: height * 0.1 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={[styles.heading, { fontSize: 30, margin: 15 }]}>Recover Account</Text>
                    <Image source={require('../assets/logo.jpg')} style={{ width: 110, height: 110, borderRadius: 110 }} />
                </View>
                <View style={{ flex: 2, marginTop: 80, alignItems: 'center' }}>
                    <View style={styles.input}>
                    <Icon style={{ paddingLeft: 10 }} name="envelope" size={17} color="#555" />
                        <TextInput
                            style={{ paddingLeft: 10,paddingRight:60, }}
                            placeholder='Provide Email'
                            placeholderTextColor="grey"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                        />
                    </View>


                    <View style={{ alignItems: 'center', marginTop: 15 }}>
                        <TouchableOpacity style={styles.button} onPress={RecoverAccount}>
                            <Text style={styles.inner}>Recover</Text>
                            {loading && <ActivityIndicator size="small" color="gold" style={{ marginRight: 10 }} />}
                        </TouchableOpacity>
                    </View>
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
    )
}

export default ForgotPassword

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
        color: 'white'
    },
    text: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white'
    },
    logo: {
        width: width * 1,
        height: height * 1.1,
    },
    overlay: {
        flex: 1,
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backgroundColor: 'lightgrey',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: 'black',
        borderRadius: 10,
        width: width * 0.9,
        marginBottom: 30,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    inner: {
        color: 'white',

        fontSize: 18,
        fontWeight: '500',
        padding: 10,
        marginHorizontal: 20,
        textAlign: 'center'
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
})