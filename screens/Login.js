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
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState(''); 
    const navigation = useNavigation();
    const { currentUser } = useAuth();
    const spinValue = new Animated.Value(0);

    const handleEmailChange = (text) => setEmail(text);
    const handlePasswordChange = (text) => setPassword(text);

    const validateInput = () => {
        if (!email || !password) {
            showModal('Por favor ingrese email y contraseña', 'error');
            return false;
        }
        if (!email.includes('@') || !email.includes('.')) {
            showModal('Email inválido', 'error');
            return false;
        }
        if (password.length < 8) {
            showModal('La contraseña debe tener al menos 8 caracteres', 'error');
            return false;
        }
        return true;
    };

    const showModal = (message, type) => {
        setModalMessage(message);
        setModalType(type);
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

        setTimeout(hideModal, 2000);
    };

    const hideModal = () => {
        setModalVisible(false);
    };

    const handleSignInOrSignUp = async () => {
        if (!validateInput()) return;
        if (currentUser) {
            showModal('Ya hay un usuario que ha iniciado sesión. Cierre sesión primero por favor.', 'error');
            return;
        }
        try {
            await signInWithEmailAndPassword(auth, email, password);
            showModal('Inicio de sesión exitoso', 'success');
            setTimeout(() => {
                hideModal();
                navigation.navigate('Comunidades');
            }, 2000);
        } catch (signInError) {
            showModal('No existe ese usuario. Regístrese.', 'error');
        }
    };

    const handleSignUp = async () => {
        if (!validateInput()) return;
        if (currentUser) {
            showModal('Ya hay un usuario que ha iniciado sesión. Cierre sesión primero por favor.', 'error');
            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            showModal('Registro exitoso', 'success');
            setTimeout(() => {
                hideModal();
                navigation.navigate('Comunidades');
            }, 2000);
        } catch (signUpError) {
            showModal('Error durante el registro.', 'error');
        }
    };

    const handleSignOut = async () => {
        if (!currentUser) {
            showModal('No hay ningún usuario en este momento. Por favor, inicie sesión.', 'error');
            return;
        }
        try {
            await signOut(auth);
            showModal('Cierre de sesión exitoso', 'success');
            setTimeout(() => {
                hideModal();
                navigation.navigate('Comunidades');
            }, 2000);
        } catch (error) {
            showModal('Error durante el cierre de sesión.', 'error');
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
            <Modal isVisible={isModalVisible}>
                <Animated.View style={[styles.modalContent, { transform: [{ rotate: spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }]}>
                    <Icon name={modalType === 'error' ? "error" : "check-circle"} size={50} color={modalType === 'error' ? "#FF0000" : "#32CD32"} />
                    <Text style={[styles.modalText, { color: modalType === 'error' ? "#FF0000" : "#32CD32" }]}>{modalMessage}</Text>
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
        color: '#18315f',
    },
    subtitle: {
        fontSize: 24,
        marginBottom: 20,
        color: '#18315f',
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
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
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
