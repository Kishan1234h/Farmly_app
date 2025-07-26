import EncryptedStorage from 'react-native-encrypted-storage';

export const storeSession = async user => {
  console.log(user)
  try {
    await EncryptedStorage.setItem('user_session', JSON.stringify(user));
  } catch (error) {
    console.log('Error storing session:', error);
  }
};

export const getSession = async () => {
  try {
    const session = await EncryptedStorage.getItem('user_session');
    console.log(session)
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.log('Error getting session:', error);
    return null;
  }
};

export const logoutUser = async () => {
  try {
    await EncryptedStorage.removeItem('user_session');
    console.log('User logged out successfully');
  } catch (error) {
    console.log('Error logging out:', error);
  }
};
