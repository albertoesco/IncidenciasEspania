import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase/credenciales';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const navigation = useNavigation();
    const { currentUser } = useAuth();
    const spinValue = new Animated.Value(0);

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
        Animated.loop(
            Animated.timing(
                spinValue,
                {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: true
                }
            )
        ).start();
    };

    const hideModal = () => {
        setModalVisible(false);
        setError(null);
    };

    const handleSignInOrSignUp = async () => {
        if (!validateInput()) return;
        if (currentUser) {
            showModal('A user is already logged in. Please sign out first.');
            return;
        }
        try {
            await signInWithEmailAndPassword(auth, email, password);
            showModal('Logged in successfully');
            setTimeout(() => {
                hideModal();
                navigation.navigate('Comunidades');
            }, 1000);
        } catch (signInError) {
            if (signInError.code === 'auth/user-not-found') {
                setError('No user found with this email. Please register.');
            } else {
                setError(signInError.message);
            }
        }
    };

    const handleSignUp = async () => {
        if (!validateInput()) return;
        if (currentUser) {
            showModal('A user is already logged in. Please sign out first.');
            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            showModal('Registered successfully');
            setTimeout(() => {
                hideModal();
                navigation.navigate('Comunidades');
            }, 1000);
        } catch (signUpError) {
            setError(signUpError.message);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
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
            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>Inicio de Sesión / Registro</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
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
                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={styles.button} onPress={handleSignInOrSignUp}>
                        <Text style={styles.buttonText}>Iniciar Sesión</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                        <Text style={styles.buttonText}>Registro</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.button} onPress={handleSignOut}>
                    <Text style={styles.buttonText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
            <Modal isVisible={isModalVisible || error !== null}>
                <Animated.View style={[styles.modalContent, { transform: [{ rotate: spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }]}>
                    <Icon name={error ? "error" : "check-circle"} size={50} color={error ? "#FF6347" : "#32CD32"} />
                    <Text style={[styles.modalText, { color: error ? "#FF6347" : "#32CD32" }]}>{modalMessage || error}</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={hideModal}>
                        <Text style={styles.closeButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                </Animated.View>
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
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#3F51B5',
    },
    subtitle: {
        fontSize: 24,
        marginBottom: 20,
        color: '#3F51B5',
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
    buttonGroup: {
        flexDirection: 'row',
    },
    button: {
        backgroundColor: '#3F51B5',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14.5,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    error: {
        color: '#FF6347',
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
    closeButton: {
        marginTop: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
