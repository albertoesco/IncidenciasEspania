import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";

//importar firebase
import appFirebase from "../credenciales";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const db = getFirestore(appFirebase)

export default function ListComunidades(props) {

  const [lista, setLista] = useState([])

  useEffect(() => {
    const getLista = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'comunidades'))
        const docs = []
        querySnapshot.forEach((doc) => {
          const { nombre, idcomunidad } = doc.data()
          docs.push({
            idcomunidad,
            nombre,
          })
        })
        setLista(docs);
      } catch (error) {
        console.log(error);
      }
    }
    getLista()
  }, [])

  return (
    <ScrollView>
      <View>
        {
          lista.map((list, index) => (
            <TouchableOpacity key={index} onPress={() => props.navigation.navigate('Provincias', { comunidadId: list.idcomunidad })}>
              <Text>{list.nombre}</Text>
            </TouchableOpacity>
          )
          )
        }
      </View>
    </ScrollView>
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
