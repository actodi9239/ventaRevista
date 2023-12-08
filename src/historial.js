import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, ScrollView} from 'react-native';
import {
  getFirestore,
  addDoc,
  collection,
  onSnapshot,
  query,
} from 'firebase/firestore';
import {FirestoreProvider, useFirebaseApp} from 'reactfire';
import {useNavigation} from '@react-navigation/native';
const Historial = () => {
  const firestoreInstance = getFirestore(useFirebaseApp());
  const firestore = getFirestore();

  const [data, setData] = useState([]);

  useEffect(() => {
    const handleMostrar = async () => {
      const collectionRef = collection(firestore, 'historial');
      const q = query(collectionRef);
      const unsubscribe = onSnapshot(q, snapshot => {
        const historiales = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(historiales);
      });
      return () => unsubscribe();
    };

    handleMostrar();
    return () => {};
  }, []);

  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <ScrollView>
        {data.map((historial, i) => (
          <View key={i}>
            <Text style={styles.boldText}>Simulacion {i + 1}</Text>
            <View>
              <Text> Precio de Venta: {historial.precioventa}</Text>
              <Text> Costo de Compra: {historial.costocompraprov1}</Text>
              <Text>Costo de Devolución al Proveedor 1: {historial.costodevprv1}</Text>
              <Text> Costo de Compra al Proveedor 2:{historial.costocompraprov2}</Text>
              <Text> Costo de Devolución al Proveedor 2:{historial.costodevprv2}</Text>
              <Text>Días del Primer Período:{historial.diasprimer}</Text>
              <Text>Días del Segundo Período:{historial.diassegundo}</Text>
              <Text>Número de Simulaciones:{historial.simulaciones}</Text>
              <Text>Resultado:{historial.resultado}</Text>
              <Text>Decisión de Compra:{historial.decision}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </FirestoreProvider>
  );
};

const styles = {
    boldText: {
      fontWeight: 'bold',
    },
  };

export default Historial;
