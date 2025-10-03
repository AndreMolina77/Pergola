import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, FlatList, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
// IMPORTACIÓN DE LA NUEVA LIBRERÍA
import { Avatar } from '@kolking/react-native-avatar';
import { useFonts } from 'expo-font';

// El PROFILE_PLACEHOLDER ya no es estrictamente necesario, pero lo dejo por si acaso
const PROFILE_PLACEHOLDER = require('../../assets/icon.png');

export default function ProfileScreen() {
  const { user, logout, API } = useContext(AuthContext);
  const [profilePic, setProfilePic] = useState(user?.profilePic || null);
  const [loadingPic, setLoadingPic] = useState(false);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingWishlist, setLoadingWishlist] = useState(true);

  const [fontsLoaded] = useFonts({
    'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-Medium': require('../../assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-Regular': require('../../assets/fonts/Quicksand-Regular.ttf'),
    'Nunito-Bold': require('../../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-SemiBold': require('../../assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-Regular': require('../../assets/fonts/Nunito-Regular.ttf'),
  });

  // Cargar pedidos (API) y wishlist (local) al montar
  useEffect(() => {
    if (user?.id) {
      fetch(`${API}/public/orders`)
        .then(res => res.json())
        .then(data => {
          setOrders(Array.isArray(data) ? data : []);
        })
        .catch(() => setOrders([]))
        .finally(() => setLoadingOrders(false));

      // Cargar wishlist local
      const loadWishlist = async () => {
        setLoadingWishlist(true);
        try {
          const stored = await AsyncStorage.getItem(`wishlist_${user.id}`);
          setWishlist(stored ? JSON.parse(stored) : []);
        } catch {
          setWishlist([]);
        } finally {
          setLoadingWishlist(false);
        }
      };
      loadWishlist();
    }
  }, [user]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A73249" />
      </View>
    );
  }
  // Funciones para agregar/quitar de wishlist local
  const addToWishlist = async (item) => {
    const exists = wishlist.some(w => w._id === item._id);
    if (!exists) {
      const newWishlist = [...wishlist, item];
      setWishlist(newWishlist);
      await AsyncStorage.setItem(`wishlist_${user.id}`, JSON.stringify(newWishlist));
    }
  };

  const removeFromWishlist = async (itemId) => {
    const newWishlist = wishlist.filter(w => w._id !== itemId);
    setWishlist(newWishlist);
    await AsyncStorage.setItem(`wishlist_${user.id}`, JSON.stringify(newWishlist));
  };

  // Cambiar foto de perfil
  const handleChangePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets[0].uri) {
      const asset = result.assets[0];
      const uri = asset.uri;
      // Intenta obtener el nombre real de la URI. Si falla, usa un nombre genérico.
      const fileName = uri.split('/').pop() || 'profile.jpg';
      // Usar el tipo MIME que devuelve Expo o intentar deducirlo de la extensión.
      // `*/*` es un wildcard si no estás seguro del tipo.
      const mimeType = asset.mimeType || 'image/jpeg'; 

      setLoadingPic(true);
      const formData = new FormData();
      
      formData.append('profilePic', {
        uri: uri,
        name: fileName,
        type: mimeType,
      });
      try {
        const response = await fetch(`${API}/customers/${user.id}`, {
          method: 'PUT',
          headers: {
            // 'Content-Type': 'multipart/form-data', // React Native lo maneja automáticamente para FormData
          },
          body: formData,
        });
        const data = await response.json();
        if (response.ok && data.data?.profilePic) {
          setProfilePic(data.data.profilePic);
        } else {
          Alert.alert('Error', data.message || 'No se pudo actualizar la foto');
        }
      } catch (e) {
        Alert.alert('Error', 'No se pudo actualizar la foto');
      } finally {
        setLoadingPic(false);
      }
    }
  };

  // Borrar foto de perfil
  const handleDeletePhoto = async () => {
    Alert.alert('Eliminar foto', '¿Seguro que deseas borrar tu foto de perfil?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive', onPress: async () => {
          setLoadingPic(true);
          try {
            const response = await fetch(`${API}/customers/${user.id}/profile-pic`, {
              method: 'DELETE',
            });
            if (response.ok) {
              setProfilePic(null);
            } else {
              Alert.alert('Error', 'No se pudo borrar la foto');
            }
          } catch (e) {
            Alert.alert('Error', 'No se pudo borrar la foto');
          } finally {
            setLoadingPic(false);
          }
        }
      },
    ]);
  };

  const renderOrder = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderTitle}>Pedido #{item._id?.slice(-5) || 'N/A'}</Text>
      <Text style={styles.orderDate}>Fecha: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</Text>
      <Text style={styles.orderStatus}>Estado: {item.status || 'Pendiente'}</Text>
    </View>
  );

  const renderWishlist = ({ item }) => (
    <View style={styles.wishlistItem}>
      <Text style={styles.wishlistTitle}>{item.name || 'Producto'}</Text>
      <Text style={styles.wishlistDesc}>{item.description || ''}</Text>
      <TouchableOpacity onPress={() => removeFromWishlist(item._id)} style={{marginTop: 6, alignSelf: 'flex-end'}}>
        <MaterialCommunityIcons name="delete" size={18} color="#A73249" />
      </TouchableOpacity>
    </View>
  );

  if (!user) {
    return (
      <View style={styles.centered}><Text>No hay usuario autenticado.</Text></View>
    );
  }
  
  // Combina nombre y apellido para el avatar de iniciales
  const fullName = `${user.name || ''} ${user.lastName || ''}`.trim();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.profilePicContainer}>
          {loadingPic ? (
            <ActivityIndicator size="large" color="#A73249" style={styles.avatarPlaceholder} />
          ) : (
            <>
              {/* LÓGICA DEL AVATAR CON FALLBACK */}
              {profilePic ? (
                // 1. Mostrar la imagen de perfil si existe
                <Image
                  source={{ uri: profilePic }}
                  style={styles.profilePic}
                />
              ) : (
                // 2. Mostrar el Avatar de Kolking con iniciales si no hay foto
                <Avatar
                  size={110}
                  name={fullName}
                  colorize={true} // Genera un color único basado en el nombre
                  radius={55}    // Para que sea circular
                  textStyle={{ fontSize: 40, fontFamily: 'Quicksand-Bold' }} // Estilo de las iniciales
                  style={styles.avatarDefault} // Estilo del contenedor para borde, etc.
                />
              )}
            </>
          )}
          <TouchableOpacity style={styles.editPicBtn} onPress={handleChangePhoto}>
            <MaterialCommunityIcons name="camera" size={22} color="#fff" />
          </TouchableOpacity>
          {profilePic && (
            <TouchableOpacity style={styles.deletePicBtn} onPress={handleDeletePhoto}>
              <MaterialCommunityIcons name="delete" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.name}>{user.name} {user.lastName}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={18} color="#fff" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información de perfil</Text>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>Usuario:</Text><Text style={styles.infoValue}>{user.username || '-'}</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>Teléfono:</Text><Text style={styles.infoValue}>{user.phoneNumber || '-'}</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>DUI:</Text><Text style={styles.infoValue}>{user.DUI || '-'}</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>Dirección:</Text><Text style={styles.infoValue}>{user.address || '-'}</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>Fecha de nacimiento:</Text><Text style={styles.infoValue}>{user.birthDate ? new Date(user.birthDate).toLocaleDateString() : '-'}</Text></View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pedidos realizados</Text>
        {loadingOrders ? <ActivityIndicator color="#A73249" /> : (
          orders.length === 0 ? <Text style={styles.emptyText}>No tienes pedidos.</Text> :
            <FlatList
              data={orders}
              renderItem={renderOrder}
              keyExtractor={item => item._id || Math.random().toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalList}
            />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lista de deseos</Text>
        {loadingWishlist ? <ActivityIndicator color="#A73249" /> : (
          wishlist.length === 0 ? <Text style={styles.emptyText}>No tienes productos en tu lista de deseos.</Text> :
            <FlatList
              data={wishlist}
              renderItem={renderWishlist}
              keyExtractor={item => item._id || Math.random().toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalList}
            />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3c6b8',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#E3C6B8",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profilePicContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  // ESTILOS DE IMAGEN/AVATAR ACTUALIZADOS
  profilePic: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#e8e1d8',
  },
  avatarDefault: { // Estilo para el componente Avatar (iniciales)
    borderWidth: 3,
    borderColor: '#e8e1d8',
  },
  avatarPlaceholder: { // Estilo para el ActivityIndicator
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#e8e1d8',
  },
  // FIN DE ESTILOS DE IMAGEN/AVATAR ACTUALIZADOS
  editPicBtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#A73249',
    borderRadius: 16,
    padding: 6,
    zIndex: 2,
  },
  deletePicBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#A73249',
    borderRadius: 16,
    padding: 5,
    zIndex: 2,
  },
  name: {
    fontSize: 22,
    fontFamily: 'Quicksand-Bold',
    color: '#3d1609',
    marginBottom: 2,
  },
  email: {
    fontSize: 15,
    color: '#3d1609',
    marginBottom: 10,
    fontFamily: 'Nunito-Regular',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A73249',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 18,
    marginTop: 8,
  },
  logoutText: {
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
    fontSize: 15,
    marginLeft: 7,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 18,
    marginBottom: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 17,
    color: '#A73249',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  infoLabel: {
    fontFamily: 'Quicksand-Bold',
    color: '#3d1609',
    fontSize: 14,
  },
  infoValue: {
    fontFamily: 'Nunito-Regular',
    color: '#3d1609',
    fontSize: 14,
    maxWidth: 170,
    textAlign: 'right',
  },
  orderItem: {
    backgroundColor: '#e8e1d8',
    borderRadius: 12,
    padding: 14,
    marginRight: 12,
    minWidth: 140,
    alignItems: 'flex-start',
  },
  orderTitle: {
    fontFamily: 'Quicksand-Bold',
    color: '#A73249',
    fontSize: 15,
    marginBottom: 2,
  },
  orderDate: {
    fontFamily: 'Nunito-Regular',
    color: '#3d1609',
    fontSize: 13,
    marginBottom: 2,
  },
  orderStatus: {
    fontFamily: 'Quicksand-Bold',
    color: '#3d1609',
    fontSize: 13,
  },
  wishlistItem: {
    backgroundColor: '#e8e1d8',
    borderRadius: 12,
    padding: 14,
    marginRight: 12,
    minWidth: 140,
    alignItems: 'flex-start',
  },
  wishlistTitle: {
    fontFamily: 'Quicksand-Bold',
    color: '#A73249',
    fontSize: 15,
    marginBottom: 2,
  },
  wishlistDesc: {
    fontFamily: 'Nunito-Regular',
    color: '#3d1609',
    fontSize: 13,
  },
  horizontalList: {
    marginTop: 5,
  },
  emptyText: {
    color: '#A73249',
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    marginTop: 5,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});