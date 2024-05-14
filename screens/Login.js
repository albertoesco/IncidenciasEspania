import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
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
  const [username, setUsername] = useState('');  // Nuevo estado para el nombre de usuario

  const navigation = useNavigation();

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

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

  const hideModal = () => {
    setModalVisible(false);
  };

  const handleSignInOrSignUp = async () => {
    if (!validateInput()) return;
    try {
      // Intentar iniciar sesión
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Usuario iniciado sesión con éxito:', userCredential.user.email);
      const user = email.split('@')[0];  // Obtener el nombre de usuario
      setUsername(user);
      showModal('Inició sesión con éxito');
      setTimeout(() => {
        hideModal();
        navigation.navigate('Comunidades'); // Navega a la pantalla de la lista de comunidades
      }, 1000); // Tiempo para mostrar el modal antes de navegar
    } catch (signInError) {
      if (signInError.code === 'auth/user-not-found') {
        // Si el usuario no existe, intentar registrarlo
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          console.log('Usuario registrado con éxito:', userCredential.user.email);
          const user = email.split('@')[0];  // Obtener el nombre de usuario
          setUsername(user);
          showModal('Registrado con éxito');
          setTimeout(() => {
            hideModal();
            navigation.navigate('Comunidades'); // Navega a la pantalla de la lista de comunidades
          }, 1000); // Tiempo para mostrar el modal antes de navegar
        } catch (signUpError) {
          setError(signUpError.message);
          console.log('Error al registrar el usuario:', signUpError.message);
        }
      } else {
        setError(signInError.message);
        console.log('Error al iniciar sesión:', signInError.message);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('Usuario cerró sesión con éxito');
      setUsername('');  // Limpiar el nombre de usuario al cerrar sesión
      showModal('Cerró sesión con éxito');
      setTimeout(() => {
        hideModal();
        navigation.navigate('Login'); // Navega a la pantalla de inicio de sesión
      }, 1000); // Tiempo para mostrar el modal antes de navegar
    } catch (error) {
      setError('Error al cerrar sesión');
      console.log('Error al cerrar sesión:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <Text style={styles.userLabel}>Usuario:</Text>
        <Text style={styles.username}>{username}</Text>
      </View>
      <Text style={styles.title}>Inicio Sesión / Registro</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={handleEmailChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={handlePasswordChange}
      />
      {error && (
        <Text style={styles.error}>{error}</Text>
      )}
      <View style={styles.buttonContainer}>
        <Button title="Iniciar Sesión / Registrarse" onPress={handleSignInOrSignUp} />
        <Button title="Cerrar Sesión" onPress={handleSignOut} />
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
  },
  username: {
    fontSize: 16,
    marginLeft: 5,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
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
