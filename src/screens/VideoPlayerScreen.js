import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, Platform } from 'react-native';
import Video from 'react-native-video'; // Import react-native-video
import Orientation from 'react-native-orientation-locker'; // Import orientation locker

const { width, height } = Dimensions.get('window');

const VideoPlayerScreen = ({ route, navigation }) => {
    const { videoUrl } = route.params; // Get video URL from params
    const [isPortrait, setIsPortrait] = useState(true);

    useEffect(() => {
        // Lock to landscape mode and listen for orientation changes
        Orientation.lockToLandscape();
        const handleOrientationChange = (orientation) => {
            setIsPortrait(orientation === 'PORTRAIT');
        };
        Orientation.addOrientationListener(handleOrientationChange);
        return () => {
            Orientation.removeOrientationListener(handleOrientationChange);
            Orientation.unlockAllOrientations(); // Unlock orientations on unmount
        };
    }, []);

    return (
        <View style={styles.container}>
            <Video
                source={{ uri: videoUrl }} // Firebase video URL
                style={styles.video}
                controls // Display video controls
                resizeMode="contain" // Adjust video resizing
                onError={(error) => console.log('Video Error:', error)}
            />
            {!isPortrait && (
                <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 10,
        borderRadius: 5,
    },
    closeText: {
        color: 'white',
        fontSize: 16,
    },
});

export default VideoPlayerScreen;
