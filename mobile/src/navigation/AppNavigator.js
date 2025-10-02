import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


import LoginScreen from '../screen/LoginScreen';
import RegisterScreen from '../screen/RegisterScreen';
import RecoverPasswordScreen from '../screen/RecoverPasswordScreen';
import HomeScreen from '../screen/HomeScreen';
import WelcomeScreen from '../screen/WelcomeScreen';
import ProgressScreen from '../screen/ProgressScreen';
import CustomDesignsScreen from '../screen/CustomDesignsScreen';
import EmailVerificationScreen from '../screen/EmailVerification';
import VerificationSuccessScreen from '../screen/VerificationSucess';
import ProfileScreen from '../screen/ProfileScreen';
import AuthGuardProfile from '../components/AuthGuardProfile';
import SurveyScreen from '../screen/SurveyScreen';
import ProductsScreen from '../screen/catalog/ProductsScreen';
import CartScreen from '../components/cart/CartScreen';
import SubcategoryDetailScreen from '../components/CatalogoExclusivo';
import CollectionDetailScreen from '../screen/CollectionScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator con estilos personalizados
function MainTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#e8e1d8',
          borderTopWidth: 0,
          height: 70 + insets.bottom, // Más grande
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
        },
        tabBarActiveTintColor: '#A73249',
        tabBarInactiveTintColor: '#A73249',
        tabBarLabelStyle: {
          fontSize: 15,
          fontWeight: '600',
          fontFamily: 'Quicksand-Bold',
        },
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') {
            return <Ionicons name={focused ? 'home' : 'home-outline'} size={28} color={color} />;
          }
          if (route.name === 'Profile') {
            return <MaterialCommunityIcons name={focused ? 'account' : 'account-outline'} size={28} color={color} />;
          }
          if (route.name === 'ProductLines') {
            // Usar un ícono de "view-list" para líneas de productos
            return <MaterialCommunityIcons name={focused ? 'view-list' : 'view-list-outline'} size={28} color={color} />;
          }
          if (route.name === 'Cart') {
            return <Ionicons name={focused ? 'cart' : 'cart-outline'} size={28} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Inicio' }} />
      <Tab.Screen name="ProductLines" component={ProductsScreen} options={{ tabBarLabel: 'Líneas de productos', tabBarItemStyle: { minWidth: 85 } }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ tabBarLabel: 'Carrito' }} />
      <Tab.Screen name="Profile" component={AuthGuardProfile} options={{ tabBarLabel: 'Perfil' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RecoverPassword"
          component={RecoverPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EmailVerification"
          component={EmailVerificationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VerificationSuccess"
          component={VerificationSuccessScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CustomDesign"
          component={CustomDesignsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Survey"
          component={SurveyScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CollectionDetail"
          component={CollectionDetailScreen}
          options={{ headerShown: false }}
        />  

        <Stack.Screen
          name="SubcategoryDetail"
          params
          component={SubcategoryDetailScreen}
          options={{ headerShown: false }}
        />
        </Stack.Navigator>
    </NavigationContainer>
  );
}
