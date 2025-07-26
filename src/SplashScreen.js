import React, {useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Animated,
  Easing,
  Platform,
  Text,
} from 'react-native';
import {getSession} from './utils/SecureStorage';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

const SplashScreen = ({navigation}) => {
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textScale = useRef(new Animated.Value(0.8)).current;

  const dot1Opacity = useRef(new Animated.Value(0.3)).current;
  const dot2Opacity = useRef(new Animated.Value(0.3)).current;
  const dot3Opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (Platform.OS === 'android' && changeNavigationBarColor) {
      changeNavigationBarColor('#709856', true);
    }

    // Text fade-in animation
    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Text scale animation sequence
    Animated.sequence([
      Animated.timing(textScale, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.spring(textScale, {
        toValue: 1.1,
        tension: 80,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(textScale, {
        toValue: 1,
        tension: 80,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // Dot animation function
    const animateDot = (dot, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    // Start dot animations
    animateDot(dot1Opacity, 0);
    animateDot(dot2Opacity, 300);
    animateDot(dot3Opacity, 600);

    // Check login status
    const checkLoginStatus = async () => {
      const user = await getSession();
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{name: user ? 'homestack' : 'authStack'}],
        });
      }, 2000);
    };

    checkLoginStatus();
  }, []);

  return (
    <>
      <StatusBar hidden />
      <View style={styles.container}>
        <Animated.Text
          style={[
            styles.title,
            {
              opacity: textOpacity,
              transform: [{scale: textScale}],
            },
          ]}>
          Farmly
        </Animated.Text>

        <View style={styles.loadingContainer}>
          <Animated.Text style={[styles.dot, {opacity: dot1Opacity}]}>
            .
          </Animated.Text>
          <Animated.Text style={[styles.dot, {opacity: dot2Opacity}]}>
            .
          </Animated.Text>
          <Animated.Text style={[styles.dot, {opacity: dot3Opacity}]}>
            .
          </Animated.Text>
        </View>
      </View>
    </>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#709856',
  },
  title: {
    fontFamily: 'Sansita-ExtraBold',
    fontSize: 40,
    color: '#F4F4F4',
  },
  loadingContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  dot: {
    fontSize: 27,
    color: '#F4F4F4',
    marginHorizontal: 4,
  },
});
