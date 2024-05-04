import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { useEffect, useState } from "react";
import appFirebase from "../credenciales";
import { getFirestore, collection, query, where, getDocs, doc } from "firebase/firestore";

const db = getFirestore(appFirebase);

export default function ListProvincias({ route }) {
    const { nombreComunidad } = route.params; // Cambiado a nombreComunidad
    const [provincias, setProvincias] = useState([]);

    useEffect(() => {
        const getProvincias = async () => {
            try {
                // Consultar las provincias de la comunidad por su nombre
                const comunidadQuery = query(collection(db, "comunidades"), where("nombre", "==", nombreComunidad));
                const comunidadSnapshot = await getDocs(comunidadQuery);

                if (!comunidadSnapshot.empty) {
                    // Si se encuentra la comunidad, obtener sus provincias
                    const comunidadDoc = comunidadSnapshot.docs[0];
                    const provinciasRef = collection(comunidadDoc.ref, "provincias");
                    const provinciasSnapshot = await getDocs(provinciasRef);
                    const provinciasData = provinciasSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setProvincias(provinciasData);
                } else {
                    console.log("No se encontró la comunidad:", nombreComunidad);
                }
            } catch (error) {
                console.error("Error fetching provincias: ", error);
            }
        };

        getProvincias();
    }, [nombreComunidad]);

    return (
        <View style={styles.container}>
            <FlatList
                data={provincias}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Text>{item.nombre}</Text>
                )}
            />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
});
