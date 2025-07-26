import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {useNavigation} from '@react-navigation/native';
import {loginUser} from '../../data/db';
import {storeSession} from '../../utils/SecureStorage';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (Platform.OS === 'android' && changeNavigationBarColor) {
      changeNavigationBarColor('#F4F4F4', true);
    }
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter a username and password.');
      return;
    }

    try {
      const user = await loginUser(username, password);
      if (user) {
        await storeSession(user);
        navigation.reset({index: 0, routes: [{name: 'homestack'}]});
      } else {
        Alert.alert('Login Failed', 'Invalid username or password.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An unexpected error occurred. Try again.');
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#F4F4F4" barStyle="dark-content" />
      <StatusBar backgroundColor="#F4F4F4" barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View style={styles.container}>
              <View style={styles.header}>
                <Image
                  source={require('../../../assets/images/icon.png')}
                  style={styles.image}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.title}>Welcome Back</Text>
                  <Text style={styles.subtitle}>Sign in to continue 🌱</Text>
                </View>
              </View>

              <View style={styles.middleContent}>
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="#666"
                  value={username}
                  onChangeText={setUsername}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#666"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />

                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleLogin}>
                  <Text style={styles.loginButtonText}>Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.supportButton}>
                  <Text style={styles.supportButtonText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.bottomSection}>
                <TouchableOpacity
                  onPress={() => navigation.replace('register')}>
                  <Text style={styles.loginScreenText}>
                    Don't have an account?
                    <Text style={{textDecorationLine: 'underline'}}>
                      Sign Up
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F4F4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#709856',
    fontFamily: 'Sansita-ExtraBold',
  },
  subtitle: {
    fontSize: 14,
    color: '#709856',
    fontFamily: 'Sansita-Bold',
    marginTop: 5,
  },
  middleContent: {
    flexGrow: 0.1,
    justifyContent: 'center',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontFamily: 'Sansita-Regular',
    color: '#212121',
  },
  loginButton: {
    backgroundColor: '#709856',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#F4F4F4',
    fontSize: 18,
    fontFamily: 'Sansita-Bold',
  },
  supportButton: {
    marginTop: 10,
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#709856',
    alignItems: 'center',
  },
  supportButtonText: {
    color: '#709856',
    fontSize: 18,
    fontFamily: 'Sansita-Bold',
  },
  bottomSection: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingVertical: 10,
  },
  loginScreenText: {
    color: '#709856',
    fontSize: 18,
    fontFamily: 'Sansita-Bold',
  },
});
