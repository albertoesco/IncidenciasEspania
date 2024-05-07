import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import appFirebase from "../credenciales";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const db = getFirestore(appFirebase);
const storage = getStorage(appFirebase);

export default function ListComunidades(props) {
  const [lista, setLista] = useState([]);
  const [imagenes, setImagenes] = useState({});

  useEffect(() => {
    const getLista = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "comunidades"));
        const docs = [];
        querySnapshot.forEach((doc) => {
          const { nombre, idcomunidad } = doc.data();
          docs.push({
            idcomunidad,
            nombre,
          });
        });
        setLista(docs);
      } catch (error) {
        console.log(error);
      }
    };
    getLista();
  }, []);

  useEffect(() => {
    const obtenerImagenes = async () => {
      const imagenes = {};
      for (const comunidad of lista) {
        const imagePath = `comunidades/${comunidad.nombre}/${comunidad.nombre}.jpg`; // Ruta de la imagen en el almacenamiento
        try {
          const url = await getDownloadURL(ref(storage, imagePath)); // Obtiene la URL de descarga de la imagen
          imagenes[comunidad.idcomunidad] = url;
        } catch (error) {
          console.error(`Error al obtener la imagen de ${comunidad.nombre}:`, error);
        }
      }
      setImagenes(imagenes);
    };
    obtenerImagenes();
  }, [lista]);

  return (
    <ScrollView>
      <View style={styles.container}>
        {lista.map((list, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() =>
              props.navigation.navigate("Provincias", { nombreComunidad: list.nombre })
            }
          >
            {/* Aquí se muestra la imagen de la comunidad */}
            {imagenes[list.idcomunidad] && (
              <Image source={{ uri: imagenes[list.idcomunidad] }} style={styles.flagImage} />
            )}
            {/* Aquí se muestra el nombre de la comunidad */}
            <Text style={styles.cardText}>{list.nombre}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <StatusBar style="auto" />
    </ScrollView>
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
    width: "80%",
    backgroundColor: "#e0e0e0",
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    flexDirection: "row", // Para alinear elementos horizontalmente
    alignItems: "center", // Para centrar verticalmente los elementos
    justifyContent: "flex-start", // Para alinear los elementos a la izquierda
    alignSelf: "center",
  },
  cardText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  flagImage: {
    width: 30, // Ajustar el ancho de la imagen según sea necesario
    height: 20, // Ajustar la altura de la imagen según sea necesario
    marginRight: 10, // Espacio entre la imagen de la bandera y el texto
  },
});
