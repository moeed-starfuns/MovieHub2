// //Go to facebook developer website 
// // Login with your app
// //Create App for your Application
//Youtube Engineer Chaiwala 

// This is the main thing to DEAL WITH (WASTE 5 HOURS)
// GENERATING HASH for FACEBOOK DEVELOPER
//C:\>keytool -exportcert -alias androiddebugkey -keystore "C:\Users\moied\Desktop\MovieHub\android\app\debug.keystore" | "C:\Users\moied\Downloads\bin\openssl" sha1 -binary | "C:\Users\moied\Downloads\bin\openssl" base64
//Enter keystore password:  android


// import React from 'react';
// import { View } from 'react-native';
// import { LoginButton, AccessToken, Profile } from 'react-native-fbsdk-next';

// const FacebookSignin = ({ navigation }) => {
//     return (
//         <View style={{ justifyContent: 'center', alignItems: 'center' }}>
//             <LoginButton
//                 onLoginFinished={
//                     (error, result) => {
//                         if (error) {
//                             console.log("login has error: " + result.error);
//                         } else if (result.isCancelled) {
//                             console.log("login is cancelled.");
//                         } else {
//                             AccessToken.getCurrentAccessToken().then(
//                                 (data) => {
//                                     console.log(data.accessToken.toString())
//                                 }
//                             )
//                         }
//                         const currentProfile = Profile.getCurrentProfile().then(
//                             function (currentProfile) {
//                                 if (currentProfile) {
//                                     console.log("The current logged user is: " +
//                                         currentProfile.name
//                                         + ". His profile id is: " +
//                                         currentProfile.userID +
//                                         {currentProfile}
//                                     );
//                                     console.log('HELLO')
//                                     navigation.navigate('Delete Movie')
//                                 }
                                

//                             }
//                         );
//                     }
//                 }
//                 onLogoutFinished={() => console.log("logout.")} />
//         </View>
//     );
// }

// export default FacebookSignin

import React from 'react';
import { TouchableOpacity, Text, View, Image, Dimensions, StyleSheet } from 'react-native';
import { LoginManager, AccessToken, Profile } from 'react-native-fbsdk-next';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

const FacebookSignin = () => {
    const navigation = useNavigation();

    const handleLogin = async () => {
        try {
            // Log in with Facebook
            const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

            if (result.isCancelled) {
                console.log("Login is cancelled.");
                return;
            }

            // Get the access token
            const data = await AccessToken.getCurrentAccessToken();
            if (data) {
                console.log("Access Token: " + data.accessToken.toString());
            }

            // Get the user profile
            const currentProfile = await Profile.getCurrentProfile();
            if (currentProfile) {
                console.log("The current logged user is: " + currentProfile.name);
                console.log("Profile ID: " + currentProfile.userID);
                console.log("First Name: " + currentProfile.firstName);
                console.log("Last Name: " + currentProfile.lastName);

                // Navigate to the Home screen
                navigation.navigate('Home');
            } else {
                console.log("No profile found.");
            }
        } catch (e) {
            console.error("Error during Facebook login: ", e);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
        <TouchableOpacity style={styles.container} onPress={handleLogin}>
          <Icon name="facebook" size={20} color="white" />
          <Text style={{ color: 'white' }}>SIGN IN WITH FACEBOOK</Text>
        </TouchableOpacity>
      </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
        padding: 10,
        borderRadius: 10,
        alignSelf: 'center',
        backgroundColor: '#1877F2',
        width: width * 0.9,
      },
    button: {
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#1877F2',
        width: width * 0.9,
        margin: 10,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default FacebookSignin;
