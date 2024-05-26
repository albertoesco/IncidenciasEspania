import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getFirestore, collection, onSnapshot, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

import appFirebase from '../firebase/credenciales';

const db = getFirestore(appFirebase);

export default function ListIncidencias({ route }) {
    const { nombreComunidad, nombreProvincia } = route.params;
    const [incidencias, setIncidencias] = useState([]);
    const { currentUser } = useAuth();
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const getIncidencias = async () => {
            try {
                const incidenciasRef = collection(db, 'comunidades', nombreComunidad, 'provincias', nombreProvincia, 'incidencias');
                const unsubscribe = onSnapshot(incidenciasRef, (snapshot) => {
                    const incidenciasData = snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data(),
                        ref: doc.ref
                    }));
                    setIncidencias(incidenciasData);
                });
                return () => unsubscribe();
            } catch (error) {
                console.error('Error fetching incidencias: ', error);
            }
        };

        getIncidencias();
    }, [nombreProvincia, nombreComunidad]);

    const handleIncidenciaPress = (incidencia) => {
        navigation.navigate('Detail', { incidencia });
    };

    const handleNewIncidencia = () => {
        if (currentUser) {
            navigation.navigate('New', { nombreComunidad, nombreProvincia });
        } else {
            setErrorModalVisible(true);
            setTimeout(() => {
                setErrorModalVisible(false);
                navigation.navigate('Login');
            }, 2000);
        }
    };

    const handleDeleteIncidencia = async (incidencia) => {
        try {
            await deleteDoc(incidencia.ref);
            console.log('Incidencia eliminada con éxito');
        } catch (error) {
            console.error('Error deleting incidencia: ', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Incidencias de {nombreProvincia}</Text>
                <TouchableOpacity style={styles.addButton} onPress={handleNewIncidencia}>
                    <Icon name="plus" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollView}>
                {incidencias.map((incidencia, index) => (
                    <TouchableOpacity key={index} style={styles.card} onPress={() => handleIncidenciaPress(incidencia)}>
                        <Text style={styles.cardText}>{incidencia.data.nombre}</Text>
                        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteIncidencia(incidencia)}>
                            <Text style={styles.deleteButtonText}>Eliminar</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Modal
                animationType="fade"
                transparent={true}
                visible={errorModalVisible}
                onRequestClose={() => setErrorModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Icon name="exclamation-circle" size={50} color="red" style={styles.errorIcon} />
                        <Text style={styles.modalText}>Para acceder al chat, primero debes iniciar sesión.</Text>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity style={styles.chatButton} onPress={() => {
                if (!currentUser) {
                    setErrorModalVisible(true);
                    setTimeout(() => {
                        setErrorModalVisible(false);
                        navigation.navigate('Login');
                    }, 2000);
                } else {
                    navigation.navigate('Chat');
                }
            }}>
                <Icon name="comments" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        backgroundColor: '#ffffff',
        borderBottomWidth: 3,
        borderBottomColor: '#18315f',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#18315f',
        marginBottom: 10,
    },
    scrollView: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    card: {
        width: '90%',
        backgroundColor: '#ffffff',
        padding: 20,
        marginVertical: 10,
        borderRadius: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#18315f',
    },
    cardText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333333',
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#18315f',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    errorIcon: {
        marginBottom: 10,
    },
    chatButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#18315f',
        borderRadius: 30,
        padding: 15,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
