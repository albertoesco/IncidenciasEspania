import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ImageBackground } from "react-native";
import appFirebase from "../firebase/credenciales";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const db = getFirestore(appFirebase);
const storage = getStorage(appFirebase);

export default function ListProvincias({ route, navigation }) {
    const { nombreComunidad } = route.params;
    const [provincias, setProvincias] = useState([]);

    useEffect(() => {
        const getProvincias = async () => {
            try {
                const provinciasRef = collection(db, "comunidades", nombreComunidad, "provincias");
                const provinciasSnapshot = await getDocs(provinciasRef);
                const provinciasData = await Promise.all(provinciasSnapshot.docs.map(async doc => {
                    const provinciaData = doc.data();
                    // Obtiene la URL de descarga de la imagen de la provincia desde Storage
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
                contentContainerStyle={styles.flatListContainer} // Centra los cards en la pantalla
            />
            <TouchableOpacity style={styles.chatButton} onPress={() => navigation.navigate('Chat')}>
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
        alignItems: 'center', // Centra horizontalmente los items en la FlatList
        justifyContent: 'center', // Centra verticalmente los items en la FlatList
    },
    card: {
        width: '90%',
        aspectRatio: 16 / 9,
        marginVertical: 10,
        borderRadius: 15,
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: '#18315f', // Cambia el color del borde aquí
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
        color: '#ffff', // Cambia el color del texto aquí
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
});
