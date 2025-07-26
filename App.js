import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import React, {useState, useEffect} from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {I18nextProvider} from 'react-i18next';
import {i18n, i18nPromise} from './i18n';
import Toast from 'react-native-toast-message';

// ICons
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Screens
import SplashScreen from './src/SplashScreen';
import RegisterScreen from './src/Screens/Auth/RegisterScreen';
import LoginScreen from './src/Screens/Auth/LoginScreen';
import HomeScreen from './src/Screens/Home/HomeScreen';
import ExploreScreen from './src/Screens/Home/ExploreScreen';
import CartScreen from './src/Screens/Home/CartScreen';
import ProfileScreen from './src/Screens/Home/ProfileScreen';
import BuyScreen from './src/Screens/Home/BuyScreen';

// Home Inner
import CategoryScreen from './src/Screens/Home/HomeInner/CategoryScreen';
import SettingsScreen from './src/Screens/Home/HomeInner/SettingsScreen';
import ViewAllScreen from './src/Screens/Home/HomeInner/ViewAllScreen';
import FarmScreen from './src/Screens/Home/HomeInner/FarmScreen';
import OrderDetailsScreen from './src/Screens/Home/OrderDetailsScreen';

const stack = createNativeStackNavigator();
const BottomStack = createBottomTabNavigator();
const HomeInnerStack = createNativeStackNavigator();
const CartInnerStack = createNativeStackNavigator();
const ExploreInnerStack = createNativeStackNavigator();
const ProfileInnerStack = createNativeStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#709856',
    primary: '#F4F4F4',
  },
};

const AuthStack = () => {
  return (
    <stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="register">
      <stack.Screen name="register" component={RegisterScreen} />
      <stack.Screen name="login" component={LoginScreen} />
    </stack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <HomeInnerStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <HomeInnerStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeInnerStack.Screen name="CategoryScreen" component={CategoryScreen} />
      <HomeInnerStack.Screen name="settings" component={SettingsScreen} />
      <HomeInnerStack.Screen name="viewall" component={ViewAllScreen} />
      <HomeInnerStack.Screen name="farmScreen" component={FarmScreen} />
    </HomeInnerStack.Navigator>
  );
};

const CartStack = () => {
  return (
    <CartInnerStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <HomeInnerStack.Screen name="CartMain" component={CartScreen} />
      <HomeInnerStack.Screen name="settings" component={SettingsScreen} />
      <HomeInnerStack.Screen name="buystack" component={BuyScreen} />
    </CartInnerStack.Navigator>
  );
};

const ExploreStack = () => {
  return (
    <ExploreInnerStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <ExploreInnerStack.Screen name="ExploreMain" component={ExploreScreen} />
      <ExploreInnerStack.Screen name="settings" component={SettingsScreen} />
      <HomeInnerStack.Screen name="farmScreen" component={FarmScreen} />
    </ExploreInnerStack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <ProfileInnerStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <ProfileInnerStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileInnerStack.Screen name="settings" component={SettingsScreen} />
      <ProfileInnerStack.Screen name='OrderDetails' component={OrderDetailsScreen} />
    </ProfileInnerStack.Navigator>
  );
};

const HomeBottomTabs = () => {
  return (
    <BottomStack.Navigator
      initialRouteName="home"
      screenOptions={({route}) => ({
        tabBarActiveTintColor: '#709856',
        tabBarInactiveTintColor: '#a3a3a3',
        tabBarLabelStyle: {
          fontSize: 13.5,
          fontFamily: 'Sansita-Regular',
        },
        tabBarStyle: {
          backgroundColor: '#F4F4F4',
          height: 60,
          paddingVertical: 10,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.2,
          shadowRadius: 4,
          borderTopWidth: 1,
          borderTopColor: '#d1d1d1',
        },
        headerShown: false,
        tabBarIcon: ({color, size}) => {
          let iconName;

          // Assign icons based on the route name
          if (route.name === 'home') {
            iconName = 'home';
          } else if (route.name === 'explore') {
            iconName = 'explore';
          } else if (route.name === 'cart') {
            iconName = 'shopping-cart';
          } else if (route.name === 'profile') {
            iconName = 'person';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}>
      <BottomStack.Screen name="home" component={HomeStack} />
      <BottomStack.Screen name="explore" component={ExploreStack} />
      <BottomStack.Screen name="cart" component={CartStack} />
      <BottomStack.Screen name="profile" component={ProfileStack} />
    </BottomStack.Navigator>
  );
};

const App = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    i18nPromise.then(() => setIsReady(true));
  }, []);

  if (!isReady) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
        <Text>Loading translations...</Text>
      </View>
    );
  }

  return (
    <>
      <NavigationContainer theme={MyTheme}>
        <I18nextProvider i18n={i18n}>
          <stack.Navigator
            initialRouteName="SplashScreen"
            screenOptions={{
              headerShown: false,
            }}>
            <stack.Screen name="SplashScreen" component={SplashScreen} />
            <stack.Screen name="authStack" component={AuthStack} />
            <stack.Screen name="homestack" component={HomeBottomTabs} />
          </stack.Navigator>
        </I18nextProvider>
      </NavigationContainer>
      <Toast />
    </>
  );
};

export default App;

const styles = StyleSheet.create({});
