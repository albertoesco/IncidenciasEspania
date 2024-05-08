import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../credenciales';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async () => {
        try {
            // Crea el usuario utilizando Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Usuario registrado con éxito:', userCredential.user.email);
            // Lógica adicional después del registro exitoso, como navegar a otra pantalla
        } catch (error) {
            console.error('Error al registrar el usuario:', error.message);
            // Manejar errores, como mostrar un mensaje al usuario
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registro</Text>
            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Registrarse" onPress={handleSignUp} />
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
});
