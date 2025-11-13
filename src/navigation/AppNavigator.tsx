import React, {useState, useEffect} from "react";
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {Text, ActivityIndicator, View} from 'react-native';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from "../config/firebase";


// IMPORTANDO TELAS
import Login from "../screens/Login";
import Home from "../screens/Home";
import Perfil from "../screens/Perfil";
import Recomendacoes from "../screens/Recomendacoes";
import CursoDetalhes from "../screens/CursoDetalhes";
import Progresso from "../screens/Progresso";

import { colors } from "../styles/globalStyles";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// NAVEGAÇÃO POR TABS 
function TabNavigator() {
    return (
        <Tab.Navigator
        screenOptions={{ 
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textSecondary,
            tabBarStyle: {
                paddingBottom: 5,
                paddingTop: 5,
                height: 60,
            },
            headerShown: false,
        }}
        >
            <Tab.Screen
            name="HomeTab"
            component={Home}
            options={{
                tabBarLabel: 'Início',
                tabBarIcon: ({ color }) => <Text style={{ fontSize: 24}}>🏠</Text>,
            }} 
            />

            <Tab.Screen
            name="ProgressTab"
            component={Progresso}
            options={{
                tabBarLabel: 'Progresso',
                tabBarIcon: ({ color }) => <Text style={{ fontSize: 24}}>📊</Text>,
            }} 
            />

            <Tab.Screen
            name="RecomendacoesTab"
            component={Recomendacoes}
            options={{
                tabBarLabel: 'IA',
                tabBarIcon: ({ color }) => <Text style={{ fontSize: 24}}>🤖</Text>,
            }} 
            />

            <Tab.Screen
            name="PerfilTab"
            component={Perfil}
            options={{
                tabBarLabel: 'Perfil',
                tabBarIcon: ({ color }) => <Text style={{ fontSize: 24}}>👤</Text>,
            }} 
            />

        </Tab.Navigator>
    )
}

// NAVEGACAO POR DRAWER
function DrawerNavigator() {
    return(
        <Drawer.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: colors.primary,
            },
            headerTintColor: colors.surface,
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            drawerActiveTintColor: colors.primary,
            drawerInactiveTintColor: colors.textSecondary,
        }}
        >
            <Drawer.Screen
            name="HomeTabs"
            component={TabNavigator}
            options={{
                drawerLabel: 'Início',
                title: 'SkillUpPlus 2030+',
                drawerIcon: () => <Text style={{fontSize: 20}}>🏠</Text>
            }} 
            />

            <Drawer.Screen
            name="Perfil"
            component={Perfil}
            options={{
                drawerLabel: 'Meu Perfil',
                title: 'Perfil',
                drawerIcon: () => <Text style={{fontSize: 20}}>👤</Text>
            }} 
            />

            <Drawer.Screen
            name="Recomendacoes"
            component={Recomendacoes}
            options={{
                drawerLabel: 'Recomendações IA',
                title: 'Recomendações',
                drawerIcon: () => <Text style={{fontSize: 20}}>🤖</Text>
            }} 
            />

            <Drawer.Screen
            name="Progresso"
            component={Progresso}
            options={{
                drawerLabel: 'Meu Progresso',
                title: 'Progresso',
                drawerIcon: () => <Text style={{fontSize: 20}}>📊</Text>
            }} 
            />

        </Drawer.Navigator>
    );
};


// NAVEGAÇÃO PRINCIPAL
export default function AppNavigator() {

    const [usuarioLogado, setUsuarioLogado] = useState<any>(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (usuario) => {
        setUsuarioLogado(usuario);
        setCarregando(false);
        });

        return unsubscribe;
    }, []);

    if (carregando) {
        return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
        );
    }

  const handleLogout = async (navigation: any) => {
    try {
      await signOut(auth);
      
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };
  

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.surface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {!usuarioLogado ? (
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="MainApp"
            component={DrawerNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CursoDetalhes"
            component={CursoDetalhes}
            options={{ title: 'Detalhes do Curso' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}