import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import appFirebase from "../firebase/credenciales";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

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
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    card: {
      width: "100%",
      backgroundColor: "#e0e0e0",
      padding: 20,
      marginVertical: 10,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
    },
    cardText: {
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
    },
  });
