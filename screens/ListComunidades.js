import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";

export default function ListComunidades(props) {
  return (
    <ScrollView>
      <TouchableOpacity onPress={() => props.navigation.navigate('Provincias')}>
        <Text>Andalucia</Text>
      </TouchableOpacity>
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
