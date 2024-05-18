import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from "react-native";
import appFirebase from "../firebase/credenciales";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import Icon from 'react-native-vector-icons/FontAwesome';

const db = getFirestore(appFirebase);

export default function ListProvincias({ route, navigation }) {
    const { nombreComunidad } = route.params;
    const [provincias, setProvincias] = useState([]);

    useEffect(() => {
        const getProvincias = async () => {
            try {
                const provinciasRef = collection(db, "comunidades", nombreComunidad, "provincias");
                const provinciasSnapshot = await getDocs(provinciasRef);
                const provinciasData = provinciasSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
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
                        <Text style={styles.cardText}>{item.nombre}</Text>
                    </TouchableOpacity>
                )}
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
        backgroundColor: '#fffc00', // Fondo gris claro
        alignItems: 'center', // Alinear elementos en el centro horizontalmente
        justifyContent: 'center', // Alinear elementos en el centro verticalmente
    },
    card: {
        width: '100%',
        backgroundColor: '#ffdb00', // Amarillo dorado
        padding: 20,
        marginVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'flex-start',
        elevation: 5,
        borderWidth: 2,
        borderColor: '#ad1519', // Borde rojo
    },
    cardText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#ad1519', // Rojo oscuro
    },
    chatButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#00008B', // Azul oscuro
        borderRadius: 10,
        padding: 10,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
