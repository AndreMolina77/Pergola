import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const JewelryScreen = () => {
  const creacionesPropias = [
    {
      id: 1,
      title: 'Crear bohemio',
      image: 'https://via.placeholder.com/80x80/E8E8E8/999999?text=💍',
    },
    {
      id: 2,
      title: 'Ejercicios ligeros',
      image: 'https://via.placeholder.com/80x80/E8E8E8/999999?text=💎',
    },
    {
      id: 3,
      title: 'Plantas recicl.',
      image: 'https://via.placeholder.com/80x80/E8E8E8/999999?text=🌿',
    },
  ];

  const seleccionExclusiva = [
    {
      id: 1,
      title: 'Pulseras',
      image: 'https://via.placeholder.com/100x100/4A90E2/FFFFFF?text=🔵',
      price: '$45.00',
    },
    {
      id: 2,
      title: 'Anillos',
      image: 'https://via.placeholder.com/100x100/F5F5F5/999999?text=💖',
      price: '$65.00',
    },
    {
      id: 3,
      title: 'Collares',
      image: 'https://via.placeholder.com/100x100/E8E8E8/999999?text=📿',
      price: '$85.00',
    },
  ];

  const disenosUnicos = [
    'https://via.placeholder.com/100x100/FFB6C1/FFFFFF?text=💕',
    'https://via.placeholder.com/100x100/98FB98/FFFFFF?text=🌸',
    'https://via.placeholder.com/100x100/F0E68C/FFFFFF?text=✨',
    'https://via.placeholder.com/100x100/DDA0DD/FFFFFF?text=🦋',
    'https://via.placeholder.com/100x100/87CEEB/FFFFFF?text=🌊',
    'https://via.placeholder.com/100x100/F4A460/FFFFFF?text=🍯',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F3F0" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.menuIcon}>👤</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Explorar productos ⌄</Text>
        <View style={styles.cartBadge}>
          <Text style={styles.cartIcon}>🛍️</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar"
            placeholderTextColor="#999"
          />
        </View>

        {/* Creaciones Propias */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Creaciones propias</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver todo</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {creacionesPropias.map((item) => (
              <TouchableOpacity key={item.id} style={styles.creacionItem}>
                <View style={styles.creacionImage}>
                  <Text style={styles.creacionIcon}>
                    {item.id === 1 ? '💍' : item.id === 2 ? '💎' : '🌿'}
                  </Text>
                </View>
                <Text style={styles.creacionText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Selección Exclusiva */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Selección exclusiva</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver todo</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {seleccionExclusiva.map((item) => (
              <TouchableOpacity key={item.id} style={styles.exclusivaItem}>
                <TouchableOpacity style={styles.heartIcon}>
                  <Text>🤍</Text>
                </TouchableOpacity>
                <View style={styles.exclusivaImage}>
                  <Text style={styles.exclusivaEmoji}>
                    {item.id === 1 ? '🔵' : item.id === 2 ? '💖' : '📿'}
                  </Text>
                </View>
                <Text style={styles.exclusivaTitle}>{item.title}</Text>
                <Text style={styles.exclusivaPrice}>{item.price}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Diseños únicos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Diseños únicos</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Empacar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.gridContainer}>
            {disenosUnicos.map((item, index) => (
              <TouchableOpacity key={index} style={styles.gridItem}>
                <Text style={styles.gridEmoji}>
                  {index === 0 ? '💕' : index === 1 ? '🌸' : index === 2 ? '✨' : 
                   index === 3 ? '🦋' : index === 4 ? '🌊' : '🍯'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>$43.99</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🛍️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>💬</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>$35.99</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F3F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F8F3F0',
  },
  menuIcon: {
    fontSize: 20,
    color: '#333',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cartBadge: {
    position: 'relative',
  },
  cartIcon: {
    fontSize: 20,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF4757',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#333',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'underline',
  },
  horizontalScroll: {
    marginHorizontal: -5,
  },
  creacionItem: {
    alignItems: 'center',
    marginHorizontal: 15,
    width: 80,
  },
  creacionImage: {
    width: 70,
    height: 70,
    backgroundColor: 'white',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  creacionIcon: {
    fontSize: 24,
  },
  creacionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  exclusivaItem: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 8,
    width: 140,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  exclusivaImage: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  exclusivaEmoji: {
    fontSize: 40,
  },
  exclusivaTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  exclusivaPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF4757',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  gridEmoji: {
    fontSize: 30,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  navText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
});

export default JewelryScreen;