//I HAVE JUST CREATED A BOTTOM TAB AND THEN PASSED IT AS PROPS IN TABNAVIGATION AND ALL SET


import { Alert, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const Animatedbtn = Animated.createAnimatedComponent(TouchableOpacity);

const BottomTab = ({ navigation }) => {
    const [selectedTab, setSelectedTab] = useState(1);
    const animatedX = useSharedValue(0);
    const animatedY = useSharedValue(0);

    // For icon colors
    const [color1, setcolor1] = useState('black');
    const [color2, setcolor2] = useState('black');
    const [color3, setcolor3] = useState('black');
    const [color4, setcolor4] = useState('black');


    // For moving buttons
    const animatedBtn1Y = useSharedValue(0);
    const animatedBtn2Y = useSharedValue(0);
    const animatedBtn3Y = useSharedValue(0);
    const animatedBtn4Y = useSharedValue(0);

    const Btn1onPress = () => {
        setSelectedTab(1);
        navigation.navigate('Home');
    };

    const Btn2onPress = () => {
        setSelectedTab(2);
        navigation.navigate('Search');
    };

    const Btn3onPress = () => {
        setSelectedTab(3);
        navigation.navigate('Saved');
    };

    const Btn4onPress = () => {
        setSelectedTab(4);
        navigation.navigate('Settings');
    };

    const PlusBtnOnPress = () => {
        Alert.alert('Pressed')
    };

    // Moving the orange circle
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: animatedX.value }, { translateY: animatedY.value }],
        };
    });

    // Moving the icons
    const animatedBtnStyle1 = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: animatedBtn1Y.value }],
        };
    });

    const animatedBtnStyle2 = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: animatedBtn2Y.value }],
        };
    });

    const animatedBtnStyle3 = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: animatedBtn3Y.value }],
        };
    });

    const animatedBtnStyle4 = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: animatedBtn4Y.value }],
        };
    });

    useEffect(() => {
        // Move the orange circle down
        animatedY.value = withTiming(50, { duration: 500 });

        // Adjust the position based on the selected tab
        setTimeout(() => {
            animatedX.value = withTiming((selectedTab - 1) * 85, { duration: 500 });
        }, 500);

        setTimeout(() => {
            // Move the orange circle back up and buttons up
            animatedY.value = withTiming(-50, { duration: 500 });
            if (selectedTab === 1) {
                setcolor2('black')
                setcolor4('black')
                setcolor3('black')
                animatedBtn1Y.value = withTiming(-100, { duration: 500 });
                setTimeout(() => {
                    animatedY.value = withTiming(0, { duration: 500 });
                    animatedBtn1Y.value = withTiming(0, { duration: 500 });
                    setTimeout(() => {
                        setcolor1('white');
                    }, 500);
                }, 500);
            } else if (selectedTab === 2) {
                setcolor1('black')
                setcolor3('black')
                setcolor4('black')
                animatedBtn2Y.value = withTiming(-100, { duration: 500 });
                setTimeout(() => {
                    animatedY.value = withTiming(0, { duration: 500 });
                    animatedBtn2Y.value = withTiming(0, { duration: 500 });
                    setTimeout(() => {
                        setcolor2('white');
                    }, 500);
                }, 500);
            } else if (selectedTab === 3) {
                setcolor1('black')
                setcolor2('black')
                setcolor4('black')

                animatedBtn3Y.value = withTiming(-100, { duration: 500 });
                setTimeout(() => {
                    animatedY.value = withTiming(0, { duration: 500 });
                    animatedBtn3Y.value = withTiming(0, { duration: 500 });
                    setTimeout(() => {
                        setcolor3('white');
                    }, 500);
                }, 500);
            } else {
                setcolor1('black')
                setcolor2('black')
                setcolor3('black')

                animatedBtn4Y.value = withTiming(-100, { duration: 500 });
                setTimeout(() => {
                    animatedY.value = withTiming(0, { duration: 500 });
                    animatedBtn4Y.value = withTiming(0, { duration: 500 });
                    setTimeout(() => {
                        setcolor4('white');
                    }, 500);
                }, 500);
            }
        }, 1000);
    }, [selectedTab]);


    return (
        <View >

            <View style={styles.innercontainer}>
                <Animated.View style={[{ width: 55, height: 55, borderRadius: 30, backgroundColor: 'orange', position: 'absolute' }, animatedStyle]} />

                <Animatedbtn onPress={Btn1onPress} style={[styles.button, animatedBtnStyle1]}>
                    <Icon name="home" size={20} color={color1} />
                </Animatedbtn>

                <Animatedbtn onPress={Btn2onPress} style={[styles.button, animatedBtnStyle2]}>
                    <Icon name="search" size={20} color={color2} />
                </Animatedbtn>

                <Animatedbtn onPress={Btn3onPress} style={[styles.button, animatedBtnStyle3]}>
                    <Icon name="save" size={20} color={color3} />
                </Animatedbtn>

                <Animatedbtn onPress={Btn4onPress} style={[styles.button, animatedBtnStyle4]}>
                    <Icon name="user" size={20} color={color4} />
                </Animatedbtn>

                <View style={styles.centerIconContainer}>
                    <Animatedbtn onPress={PlusBtnOnPress} style={styles.plusButton}>
                        <Icon name="plus" size={20} color="white" />
                    </Animatedbtn>
                </View>

            </View>
        </View>
    );
};

export default BottomTab;

const styles = StyleSheet.create({
    button: {
        height: 60,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innercontainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
        height: 65,
        elevation: 10,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        // borderRadius:0
    },
    centerIconContainer: {
        position: 'absolute',
        borderRadius: 30,
        top: -30, // Adjust this to position the icon higher or lower
        alignItems: 'center',
        marginLeft: 125,
        justifyContent: 'center',
        width: 60, // To center it
        height: 35, // Ensure it stays within the bounds of the tab
        // borderRadius:20
    },
    plusButton: {
        width: 60,
        borderWidth:1,
        borderColor:'white',
        height: 60,
        borderRadius: 35,
        backgroundColor: 'grey',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // To give it a floating effect
    },
});
