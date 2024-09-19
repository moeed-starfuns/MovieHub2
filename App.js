import { StatusBar, StyleSheet } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Signup from './src/screens/Signup'
import SplashScreen from './src/screens/SplashScreen'
import Login from './src/screens/Login'
import ForgotPassword from './src/screens/ForgotPassword'
import Home from './src/screens/Home'
import Movie from './src/screens/movie'
import Settings from './src/screens/Settings';
import SearchMovie from './src/screens/SearchMovie';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Ensure this import is correct
import AddMovie from './src/screens/Admin/AddMovie';
import AdminScreen from './src/screens/Admin/AdminScreen';
import DeleteMovie from './src/screens/Admin/DeleteMovie';
import UpdateMovie from './src/screens/Admin/UpdateMovie';
import VideoPlayerScreen from './src/screens/VideoPlayerScreen';
import SaveMovies from './src/screens/SavedMovies';
import DropdownMenu from './src/Components/DropDown';
import EditProfile from './src/screens/EditDetails';
import FacebookSignin from './src/Components/FacebookSignin';
import BottomTab from './src/screens/BottomTab';
// import GoogleSignInButton from './src/Components/GoogleSignin';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  //IMPORTANT
  //Always go to android/app/build.gradle and add
  //apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")
  //otherwise icons will not be displayed
  return (
    <Tab.Navigator tabBar={(props) => <BottomTab {...props} />} >
      <Tab.Screen name="Home" component={Home} options={{ headerRight: () => <DropdownMenu /> }} />
      <Tab.Screen name="Search" component={SearchMovie} />
      <Tab.Screen name="Saved" component={SaveMovies} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

const App = () => {
  return (
    <>
      <StatusBar
        barStyle="light-content"  // or "dark-content" depending on your design
        backgroundColor="transparent"
        translucent={true}
      />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerStyle: {
            backgroundColor: 'transparent',
            elevation: 0,
            shadowOpacity: 0
          },
          headerTransparent: true,
          headerTintColor: 'white',
          headerTitleStyle: {
            fontSize: 26,
            fontWeight: 'bold',
          },
        }} >

          {/* <Stack.Screen name='Signinn' component={GoogleSignInButton} options={{ headerShown: false }} /> */}

          <Stack.Screen name='Splash' component={SplashScreen} options={{ headerShown: false }} />

          <Stack.Screen
            name="Home"
            component={MyTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen name='Add Movie' component={AddMovie} />
          {/* headerTitle:'', */}


          <Stack.Screen name='Admin Screen' component={AdminScreen} options={{ headerTitle: '' }} />
          <Stack.Screen name='Delete Movie' component={DeleteMovie} />
          <Stack.Screen name='SignUp' component={Signup} options={{ headerTitle: '' }} />
          <Stack.Screen name='Login' component={Login} options={{ headerTitle: '' }} />
          <Stack.Screen name='Forgot Password' component={ForgotPassword} options={{ headerTitle: '' }} />
          <Stack.Screen name='Watch Now' component={Movie} />
          <Stack.Screen name='Update Movie' component={UpdateMovie} />
          <Stack.Screen name='VideoPlayer' component={VideoPlayerScreen} options={{ headerShown: false }} />
          <Stack.Screen name='DropdownMenu' component={DropdownMenu} options={{ headerShown: false }} />
          <Stack.Screen name='Edit Profile' component={EditProfile} options={{ headerTitle: '', headerTintColor: 'black' }} />
          <Stack.Screen name='Facebook' component={FacebookSignin} options={{ headerTitle: '', headerTintColor: 'black' }} />



        </Stack.Navigator>
      </NavigationContainer>
    </>
  )
}

export default App

const styles = StyleSheet.create({})
