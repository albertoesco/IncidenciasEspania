// PantallaCarga.js
import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIndicator } from 'react-native-indicators';

export default function PantallaCarga({ navigation }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Comunidades'); // Reemplaza 'Comunidades' con la pantalla que desees cargar después
        }, Math.random() * 5000 + 5000); // Carga entre 5 y 10 segundos

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <LinearGradient
            colors={['#fffc00', '#ffcc00']}
            style={styles.container}
        >
            <Animatable.Image
                animation="bounceIn"
                duration={2000}
                source={require('../assets/splash.png')} // Asegúrate de tener un logo en tu carpeta de assets
                style={styles.logo}
                resizeMode="contain"
            />
            <Animatable.Text 
                animation="pulse" 
                easing="ease-out" 
                iterationCount="infinite" 
                style={styles.loadingText}
            >
                Cargando...
            </Animatable.Text>
            <MaterialIndicator color="#ad1519" size={60} />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    loadingText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ad1519', // Texto rojo oscuro
        marginBottom: 20,
    },
});
