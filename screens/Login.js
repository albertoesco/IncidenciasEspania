import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase/credenciales';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [username, setUsername] = useState('');
  const navigation = useNavigation();

  const handleEmailChange = (text) => setEmail(text);
  const handlePasswordChange = (text) => setPassword(text);

  const validateInput = () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return false;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('Invalid email address');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    return true;
  };

  const showModal = (message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  const hideModal = () => setModalVisible(false);

  const handleSignInOrSignUp = async () => {
    if (!validateInput()) return;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = email.split('@')[0];
      setUsername(user);
      showModal('Logged in successfully');
      setTimeout(() => {
        hideModal();
        navigation.navigate('Comunidades');
      }, 1000);
    } catch (signInError) {
      if (signInError.code === 'auth/user-not-found') {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = email.split('@')[0];
          setUsername(user);
          showModal('Registered successfully');
          setTimeout(() => {
            hideModal();
            navigation.navigate('Comunidades');
          }, 1000);
        } catch (signUpError) {
          setError(signUpError.message);
        }
      } else {
        setError(signInError.message);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUsername('');
      showModal('Signed out successfully');
      setTimeout(() => {
        hideModal();
        navigation.navigate('Login');
      }, 1000);
    } catch (error) {
      setError('Error signing out');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <Text style={styles.userLabel}>Username:</Text>
        <Text style={styles.username}>{username}</Text>
      </View>
      <Text style={styles.title}>Login / Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={handleEmailChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={handlePasswordChange}
      />
      {error && (
        <Text style={styles.error}>{error}</Text>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSignInOrSignUp}>
          <Text style={styles.buttonText}>Login / Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Icon name="check-circle" size={50} color="green" />
          <Text style={styles.modalText}>{modalMessage}</Text>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  userContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  username: {
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
  },
});
