import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ImageBackground, Modal } from "react-native";
import { useEffect, useState } from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

import appFirebase from "../firebase/credenciales";

const db = getFirestore(appFirebase);
const storage = getStorage(appFirebase);

export default function ListProvincias({ route }) {
    const { nombreComunidad } = route.params;
    const [provincias, setProvincias] = useState([]);
    const { currentUser } = useAuth();
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const getProvincias = async () => {
            try {
                const provinciasRef = collection(db, "comunidades", nombreComunidad, "provincias");
                const provinciasSnapshot = await getDocs(provinciasRef);
                const provinciasData = await Promise.all(provinciasSnapshot.docs.map(async doc => {
                    const provinciaData = doc.data();
                    const imagePath = `comunidades/${nombreComunidad}/provincias/${provinciaData.nombre}/${provinciaData.nombre}.jpg`;
                    try {
                        const url = await getDownloadURL(ref(storage, imagePath));
                        provinciaData.imageURL = url;
                    } catch (error) {
                        console.error(`Error al obtener la imagen de ${provinciaData.nombre}:`, error);
                        provinciaData.imageURL = null;
                    }
                    return provinciaData;
                }));
                setProvincias(provinciasData);
            } catch (error) {
                console.error("Error fetching provincias: ", error);
            }
        };

        getProvincias();
    }, [nombreComunidad]);

    const handleProvinciaPress = (nombreProvincia) => {
        navigation.navigate("Incidencias", { nombreProvincia, nombreComunidad });
    };

    const handleChatPress = () => {
        if (!currentUser) {
            setErrorModalVisible(true);
            setTimeout(() => {
                setErrorModalVisible(false);
                navigation.navigate('Login');
            }, 2000);
        } else {
            navigation.navigate('Chat');
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={provincias}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => handleProvinciaPress(item.nombre)}>
                        <ImageBackground
                            source={{ uri: item.imageURL }}
                            style={styles.imageBackground}
                            imageStyle={{ borderRadius: 15 }}
                        >
                            <Text style={styles.cardText}>{item.nombre}</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.flatListContainer}
            />
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
            <TouchableOpacity style={styles.chatButton} onPress={handleChatPress}>
                <Icon name="comments" size={24} color="white" />
            </TouchableOpacity>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    flatListContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: '90%',
        aspectRatio: 16 / 9,
        marginVertical: 10,
        borderRadius: 15,
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: '#18315f',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    imageBackground: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffff',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 10,
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
});
