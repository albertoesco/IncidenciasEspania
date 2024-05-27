import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIndicator } from 'react-native-indicators';

export default function PantallaCarga({ navigation }) {
    // useEffect para manejar la navegación después de un tiempo aleatorio
    useEffect(() => {
        // Configurar un temporizador para redirigir a la pantalla 'Comunidades' después de un tiempo aleatorio entre 5 y 10 segundos
        const timer = setTimeout(() => {
            navigation.replace('Comunidades');
        }, Math.random() * 5000 + 5000);

        // Limpiar el temporizador cuando el componente se desmonte
        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        // LinearGradient para crear un fondo con un degradado de colores
        <LinearGradient
            colors={['#e0eafc', '#cfdef3', '#18315f']}
            style={styles.container}
        >
            {/* Imagen animada con un efecto de pulso */}
            <Animatable.Image
                animation="pulse"
                easing="ease-out"
                iterationCount="infinite"
                duration={1500}
                source={require('../assets/In.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            {/* Texto animado que se desvanece hacia abajo */}
            <Animatable.Text 
                animation="fadeInDown" 
                duration={2000} 
                iterationCount="infinite" 
                style={styles.loadingText}
            >
                Cargando...
            </Animatable.Text>
            {/* Indicador de carga animado */}
            <Animatable.View 
                animation="fadeIn" 
                duration={2000} 
                style={styles.indicatorContainer}
            >
                <MaterialIndicator color="#ffffff" size={60} />
            </Animatable.View>
        </LinearGradient>
    );
}

// Estilos para el componente
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        padding: 0,
    },
    logo: {
        width: 350,
        height: 350, 
        marginTop: 300,
    },
    loadingText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#18315f',
        marginBottom: 0,
    },
    indicatorContainer: {
        marginTop: 0,
        marginBottom: 400,
    },
});
