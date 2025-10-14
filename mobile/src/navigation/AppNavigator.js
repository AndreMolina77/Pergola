import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, StyleSheet } from 'react-native';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';


import LoginScreen from '../screen/LoginScreen';
import RegisterScreen from '../screen/RegisterScreen';
import RecoverPasswordScreen from '../screen/RecoverPasswordScreen';
import HomeScreen from '../screen/HomeScreen';
import WelcomeScreen from '../screen/WelcomeScreen';
import CustomDesignsScreen from '../screen/CustomDesignsScreen';
import EmailVerificationScreen from '../screen/EmailVerification';
import VerificationSuccessScreen from '../screen/VerificationSucess';
import AuthGuardProfile from '../components/AuthGuardProfile';
import SurveyScreen from '../screen/SurveyScreen';
import ProductsScreen from '../screen/catalog/ProductsScreen';
import CartScreen from '../components/cart/CartScreen';
import SubcategoryDetailScreen from '../screen/SubcategoryScreen';
import CollectionDetailScreen from '../screen/CollectionScreen';
import ProductDetailScreen from '../screen/catalog/ProductDetailScreen';
import CategoryDetailScreen from '../screen/CategoryScreen';
import WishlistScreen from '../screen/WishlistScreen';
import CheckoutScreen from '../screen/checkout/CheckoutScreen';
import OrderSuccessScreen from '../screen/checkout/OrderSucessScreen';
import OrderHistoryScreen from '../screen/OrderHistoryScreen';
import OrderDetailScreen from '../screen/OrderDetailScreen';
import RefundsScreen from '../screen/RefundsScreen';
import NewRefundScreen from '../screen/NewRefundsScreen';
import RefundDetailScreen from '../screen/RefundDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const CartIcon = ({ focused, color, size }) => {
  const { cartItemsCount } = useContext(CartContext);
  
  return (
    <View>
      <Ionicons 
        name={focused ? "cart" : "cart-outline"} 
        size={size} 
        color={color} 
      />
      {cartItemsCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {cartItemsCount > 99 ? '99+' : cartItemsCount}
          </Text>
        </View>
      )}
    </View>
  );
};

// Bottom Tab Navigator con estilos personalizados
function MainTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          height: 70 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 10,
          elevation: 20, // Sombra en Android
          shadowColor: '#000', // Sombra en iOS
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: '#A73249',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          fontFamily: 'Quicksand-Bold',
          marginTop: 4,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          let IconComponent = Ionicons;
          
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            IconComponent = MaterialCommunityIcons;
            iconName = focused ? 'account' : 'account-outline';
          } else if (route.name === 'ProductLines') {
            IconComponent = MaterialCommunityIcons;
            iconName = focused ? 'shopping' : 'shopping-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          }

          return (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: focused ? '#A7324915' : 'transparent',
            }}>
              <IconComponent 
                name={iconName} 
                size={26} 
                color={color}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Inicio' }}/>
      <Tab.Screen name="ProductLines" component={ProductsScreen} options={{ tabBarLabel: 'Productos' }}/>
      <Tab.Screen name="Cart" component={CartScreen} options={{ tabBarLabel: 'Carrito', tabBarIcon: CartIcon, }} />
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
          params
          component={CollectionDetailScreen}
          options={{ headerShown: false }}
        />  
        <Stack.Screen
          name="SubcategoryDetail"
          params
          component={SubcategoryDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CategoryDetail"
          params
          component={CategoryDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProductDetail"
          params
          component={ProductDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WishList"
          params
          component={WishlistScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Checkout" 
          component={CheckoutScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="OrderSuccess" 
          component={OrderSuccessScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OrderHistory"
          component={OrderHistoryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OrderDetail"
          params
          component={OrderDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Refunds" 
          component={RefundsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="NewRefund" 
          component={NewRefundScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="RefundDetail" 
          component={RefundDetailScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -8,
    top: -4,
    backgroundColor: '#A73249',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Quicksand-Bold',
  },
});