import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Routes from './stackRoute';

const Stack = createStackNavigator();

function AppStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="VentaRevista">
        <Stack.Screen
          name="VentaRevista"
          component={Routes.VentaRevista}
          options={{
            title: 'Caso 1',
          }}
        />
        <Stack.Screen
          name="Historial"
          component={Routes.Historial}
          options={{
            title: 'Historial',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default AppStack;
