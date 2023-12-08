import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const App = () => {
  const [precioVenta, setPrecioVenta] = useState('2');
  const [costoCompra, setCostoCompra] = useState('1.5');
  const [costoDevolucionProveedor1, setCostoDevolucionProveedor1] = useState('0.9');
  const [costoCompraProveedor2, setCostoCompraProveedor2] = useState('1.2');
  const [costoDevolucionProveedor2, setCostoDevolucionProveedor2] = useState('0.6');
  const [diasPrimerPeriodo, setDiasPrimerPeriodo] = useState('10');
  const [diasSegundoPeriodo, setDiasSegundoPeriodo] = useState('20');
  const [numSimulaciones, setNumSimulaciones] = useState('10');
  const [resultado, setResultado] = useState(null);
  const [decisionCompra, setDecisionCompra] = useState(null);
  const [pasosSimulacion, setPasosSimulacion] = useState([]);

  const realizarSimulacion = () => {
    const generadorCongruencial = congruencial();

    let beneficioTotal = 0;
    const pasos = [];

    for (let i = 0; i < numSimulaciones; i++) {
      const demandaPrimerPeriodo = generarDemanda(generadorCongruencial, [5, 6, 7, 8, 9, 10, 11], [0.05, 0.05, 0.10, 0.15, 0.25, 0.25, 0.15]);
      const demandaSegundoPeriodo = generarDemanda(generadorCongruencial, [4, 5, 6, 7, 8], [0.15, 0.20, 0.30, 0.20, 0.15]);
      const demandaTotal = demandaPrimerPeriodo + demandaSegundoPeriodo;

      const cantidadInicial = demandaTotal;
      const cantidadDuranteMes = demandaTotal - cantidadInicial;

      const ventasPrimerPeriodo = Math.min(cantidadInicial, diasPrimerPeriodo);
      const devolucionesProveedor1 = Math.max(cantidadInicial - diasPrimerPeriodo, 0);
      const ventasSegundoPeriodo = Math.min(cantidadDuranteMes, diasSegundoPeriodo);
      const devolucionesProveedor2 = Math.max(cantidadDuranteMes - diasSegundoPeriodo, 0);

      const beneficio = calcularBeneficio(
        ventasPrimerPeriodo,
        devolucionesProveedor1,
        ventasSegundoPeriodo,
        devolucionesProveedor2
      );

      beneficioTotal += beneficio;

      pasos.push({
        simulacion: i + 1,
        demandaPrimerPeriodo,
        demandaSegundoPeriodo,
        demandaTotal,
        cantidadInicial,
        cantidadDuranteMes,
        ventasPrimerPeriodo,
        devolucionesProveedor1,
        ventasSegundoPeriodo,
        devolucionesProveedor2,
        beneficio,
      });
    }

    const beneficioPromedio = beneficioTotal / numSimulaciones;

    setResultado(beneficioPromedio);
    setPasosSimulacion(pasos);

    const decision = beneficioPromedio >= 0 ? 'Buena política de compra' : 'No es rentable comprar';
    setDecisionCompra(decision);
  };

  const congruencial = () => {
    const m = Math.pow(2, 31) - 1; // Módulo
    const a = 16807; // Multiplicador
    const c = 0; // Incremento
    let seed = Date.now(); // Semilla inicial

    return () => {
      seed = (a * seed + c) % m;
      return seed / m;
    };
  };

  const generarDemanda = (rng, valores, probabilidades) => {
    const aleatorio = rng();
    let acumulativo = 0;

    for (let i = 0; i < valores.length; i++) {
      acumulativo += probabilidades[i];
      if (aleatorio <= acumulativo) {
        return valores[i];
      }
    }

    return valores[valores.length - 1];
  };

  const calcularBeneficio = (ventasPrimerPeriodo, devolucionesProveedor1, ventasSegundoPeriodo, devolucionesProveedor2) => {
    const ingresosVentas = (ventasPrimerPeriodo + ventasSegundoPeriodo) * precioVenta;
    const costoCompraTotal = (ventasPrimerPeriodo + ventasSegundoPeriodo) * costoCompra;
    const devolucionesProveedor1Total = devolucionesProveedor1 * costoDevolucionProveedor1;
    const costoCompraProveedor2Total = devolucionesProveedor1 * costoCompraProveedor2;
    const devolucionesProveedor2Total = devolucionesProveedor2 * costoDevolucionProveedor2;
    const ingresosDevoluciones = (devolucionesProveedor1 + devolucionesProveedor2) * precioVenta;

    return ingresosVentas - costoCompraTotal - devolucionesProveedor1Total - costoCompraProveedor2Total - devolucionesProveedor2Total + ingresosDevoluciones;
  };

  return (
    <ScrollView>


      <View>
        <Text>Enunciado del Caso de Estudio 1:</Text>
        <Text>
          Un vendedor de revistas compra mensualmente una revista el día primero de cada mes.
          El costo de cada ejemplar es de Bs. 1.50. La demanda de esta revista en los primeros 10 días
          del mes sigue la siguiente distribución de probabilidad:
          Demanda 5 6 7 8 9 10 11
          Probabilidad 0.05 0.05 0.10 0.15 0.25 0.25 0.15
          Al final del décimo día, el vendedor puede regresar cualquier cantidad al proveedor, quien
          se las pagará a Bs. 0.90 el ejemplar, o comprar más a Bs. 1.20 el ejemplar. La demanda en
          los siguientes 20 días está dada por la siguiente distribución de probabilidad:
          Demanda 4 5 6 7 8
          Probabilidad 0.15 0.20 0.30 0.20 0.15
          Al final del mes, el vendedor puede regresar al proveedor las revistas que le sobren, las
          cuales se le pagarán a Bs. 0.60 el ejemplar. Finalmente, se asume que después de un mes
          ya no existe demanda por parte del público, puesto que para ese entonces ya habrá
          aparecido el nuevo número de la revista. Si el precio al público es de Bs. 2.‐ por ejemplar,
          determine la política óptima de compra.
        </Text>
      </View>


      <View>
        <Text>Pasos para la Resolución del Caso de Estudio 1:</Text>
        <Text>1. Descripción del Problema:</Text>
        <Text>
          El vendedor de revistas realiza compras mensuales con un costo de compra, y al final del décimo día, puede devolver las revistas sobrantes al proveedor o comprar más.
        </Text>
        <Text>2. Distribución de Probabilidades:</Text>
        <Text>
          Se presenta la distribución de probabilidad de la demanda para los primeros 10 días y los siguientes 20 días.
        </Text>
        <Text>3. Política de Compra:</Text>
        <Text>
          Se establece la política de compra considerando los costos de compra, devolución al proveedor 1, compra al proveedor 2, y devolución al proveedor 2.
        </Text>
        <Text>4. Simulación:</Text>
        <Text>
          Se utiliza un método de simulación para modelar el comportamiento del sistema en múltiples escenarios. Se generan números aleatorios para la demanda en cada periodo, se calculan las ventas y devoluciones, y se determina el beneficio.
        </Text>
        <Text>5. Cálculo del Beneficio:</Text>
        <Text>
          El beneficio se calcula considerando ingresos por ventas, costos de compra, devoluciones y costos asociados.
        </Text>
        <Text>6. Análisis de Resultados:</Text>
        <Text>
          Se realiza un análisis de los resultados de la simulación, obteniendo un beneficio promedio y evaluando si la política de compra es rentable.
        </Text>
      </View>

      <View>
        <Text>Precio de Venta:</Text>
        <TextInput value={precioVenta} onChangeText={setPrecioVenta} keyboardType="numeric" />
      </View>
      <View>
        <Text>Costo de Compra:</Text>
        <TextInput value={costoCompra} onChangeText={setCostoCompra} keyboardType="numeric" />
      </View>
      <View>
        <Text>Costo de Devolución al Proveedor 1:</Text>
        <TextInput value={costoDevolucionProveedor1} onChangeText={setCostoDevolucionProveedor1} keyboardType="numeric" />
      </View>
      <View>
        <Text>Costo de Compra al Proveedor 2:</Text>
        <TextInput value={costoCompraProveedor2} onChangeText={setCostoCompraProveedor2} keyboardType="numeric" />
      </View>
      <View>
        <Text>Costo de Devolución al Proveedor 2:</Text>
        <TextInput value={costoDevolucionProveedor2} onChangeText={setCostoDevolucionProveedor2} keyboardType="numeric" />
      </View>
      <View>
        <Text>Días del Primer Período:</Text>
        <TextInput value={diasPrimerPeriodo} onChangeText={setDiasPrimerPeriodo} keyboardType="numeric" />
      </View>
      <View>
        <Text>Días del Segundo Período:</Text>
        <TextInput value={diasSegundoPeriodo} onChangeText={setDiasSegundoPeriodo} keyboardType="numeric" />
      </View>
      <View>
        <Text>Número de Simulaciones:</Text>
        <TextInput value={numSimulaciones} onChangeText={setNumSimulaciones} keyboardType="numeric" />
      </View>

      <Button title="Realizar Simulación" onPress={realizarSimulacion} />

      {resultado !== null && (
        <View>
          <Text>Resultado:</Text>
          <Text>{resultado}</Text>
          <Text>Decisión de Compra:</Text>
          <Text>{decisionCompra}</Text>
        </View>
      )}

      {pasosSimulacion.length > 0 && (
        <View>

          <Text>Gráfico de Barras:</Text>
          <BarChart
            style={{ marginVertical: 10, borderRadius: 8 }}
            data={{
              labels: pasosSimulacion.map((paso) => `Sim. ${paso.simulacion}`),
              datasets: [
                {
                  data: pasosSimulacion.map((paso) => paso.beneficio),
                },
              ],
            }}
            width={300}
            height={200}
            yAxisLabel="$"
            yAxisSuffix=""
            chartConfig={{
              backgroundGradientFrom: '#1E2923',
              backgroundGradientTo: '#08130D',
              color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
            }}
          />

          <Text>Pasos de la Simulación:</Text>
          {pasosSimulacion.map((paso) => (
            <Text key={paso.simulacion}>{`Simulación ${paso.simulacion}: ${paso.beneficio}`}</Text>
          ))}


        </View>
      )}
    </ScrollView>
  );
};

export default App;
