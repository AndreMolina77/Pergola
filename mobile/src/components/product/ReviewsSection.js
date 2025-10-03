import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { useFonts } from 'expo-font';

const { width: screenWidth } = Dimensions.get('window');

const ReviewsSection = ({ productId }) => {
  const { user, API } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });

  const [fontsLoaded] = useFonts({
    'Quicksand-Bold': require('../../../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-Medium': require('../../../assets/fonts/Quicksand-Medium.ttf'),
    'Nunito-Bold': require('../../../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-SemiBold': require('../../../assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-Regular': require('../../../assets/fonts/Nunito-Regular.ttf'),
  });

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/public/reviews`);
      if (response.ok) {
        const allReviews = await response.json();
        // Filtrar reseñas para este producto específico
        const productReviews = allReviews.filter(review => 
          (review.product && review.product._id === productId) || review.product === productId
        );
        setReviews(productReviews);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!user) {
      Alert.alert('Inicia sesión', 'Debes iniciar sesión para escribir una reseña');
      return;
    }

    if (!newReview.comment.trim() || newReview.comment.trim().length < 10) {
      Alert.alert('Error', 'El comentario debe tener al menos 10 caracteres');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: productId,
          customer: user.id,
          rating: newReview.rating,
          comment: newReview.comment.trim()
        }),
      });

      if (response.ok) {
        Alert.alert('Éxito', 'Tu reseña ha sido enviada correctamente');
        setShowReviewModal(false);
        setNewReview({ rating: 5, comment: '' });
        loadReviews(); // Recargar reseñas
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'No se pudo enviar la reseña');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Error de conexión al enviar la reseña');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const renderStars = (rating, size = 16, onPress = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => onPress && onPress(i)}
          disabled={!onPress}
          activeOpacity={onPress ? 0.7 : 1}
        >
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={size}
            color={i <= rating ? "#FFD700" : "#E0E0E0"}
            style={{ marginRight: 2 }}
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  const renderReviewItem = ({ item: review }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewerInfo}>
          <Text style={styles.reviewerName}>
            {review.customer?.username || 'Usuario anónimo'}
          </Text>
          {renderStars(review.rating, 14)}
        </View>
        <Text style={styles.reviewDate}>
          {new Date(review.createdAt).toLocaleDateString('es-ES')}
        </Text>
      </View>
      
      <Text style={styles.reviewComment}>{review.comment}</Text>
      
      {review.response && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseLabel}>Respuesta del vendedor:</Text>
          <Text style={styles.responseText}>{review.response}</Text>
        </View>
      )}
    </View>
  );

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A73249" />
      </View>
    );
  }

  const averageRating = calculateAverageRating();
  const distribution = getRatingDistribution();

  return (
    <View style={styles.container}>
      {/* Header de reseñas */}
      <View style={styles.header}>
        <View style={styles.ratingOverview}>
          <View style={styles.averageRating}>
            <Text style={styles.ratingNumber}>{averageRating}</Text>
            {renderStars(Math.round(parseFloat(averageRating)), 20)}
            <Text style={styles.reviewCount}>
              {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}
            </Text>
          </View>

          {/* Distribución de calificaciones */}
          <View style={styles.ratingDistribution}>
            {[5, 4, 3, 2, 1].map(rating => (
              <View key={rating} style={styles.distributionRow}>
                <Text style={styles.ratingLabel}>{rating}</Text>
                <Ionicons name="star" size={12} color="#FFD700" />
                <View style={styles.distributionBar}>
                  <View 
                    style={[
                      styles.distributionFill,
                      { width: `${reviews.length > 0 ? (distribution[rating] / reviews.length) * 100 : 0}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.distributionCount}>{distribution[rating]}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Botón para escribir reseña */}
        <TouchableOpacity
          style={styles.writeReviewBtn}
          onPress={() => setShowReviewModal(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={18} color="#FFFFFF" />
          <Text style={styles.writeReviewText}>Escribir reseña</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de reseñas */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A73249" />
        </View>
      ) : reviews.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubble-outline" size={48} color="#E0E0E0" />
          <Text style={styles.emptyText}>No hay reseñas aún</Text>
          <Text style={styles.emptySubtext}>Sé el primero en escribir una reseña</Text>
        </View>
      ) : (
        <ScrollView style={styles.reviewsList} showsVerticalScrollIndicator={false}>
          {reviews.map((review, index) => (
            <View key={review._id || index}>
              {renderReviewItem({ item: review })}
            </View>
          ))}
        </ScrollView>
      )}

      {/* Modal para escribir reseña */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showReviewModal}
        onRequestClose={() => setShowReviewModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Escribir reseña</Text>
              <TouchableOpacity onPress={() => setShowReviewModal(false)}>
                <Ionicons name="close" size={24} color="#3D1609" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Calificación</Text>
              <View style={styles.ratingSelector}>
                {renderStars(newReview.rating, 32, (rating) => 
                  setNewReview(prev => ({ ...prev, rating }))
                )}
              </View>

              <Text style={styles.inputLabel}>Comentario</Text>
              <TextInput
                style={styles.commentInput}
                placeholder="Escribe tu opinión sobre este producto..."
                placeholderTextColor="#A73249AA"
                value={newReview.comment}
                onChangeText={(text) => setNewReview(prev => ({ ...prev, comment: text }))}
                multiline={true}
                numberOfLines={5}
                maxLength={500}
                textAlignVertical="top"
              />
              <Text style={styles.characterCount}>
                {newReview.comment.length}/500 caracteres
              </Text>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowReviewModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
                onPress={submitReview}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.submitBtnText}>Enviar reseña</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  header: {
    padding: 16,
    backgroundColor: '#F5EDE8',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E1D8',
  },
  ratingOverview: {
    marginBottom: 16,
  },
  averageRating: {
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingNumber: {
    fontSize: 32,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
    marginBottom: 4,
  },
  reviewCount: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#666666',
    marginTop: 4,
  },
  ratingDistribution: {
    gap: 4,
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingLabel: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#3D1609',
    width: 8,
  },
  distributionBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  distributionFill: {
    height: '100%',
    backgroundColor: '#FFD700',
  },
  distributionCount: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#666666',
    width: 20,
    textAlign: 'right',
  },
  writeReviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A73249',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    gap: 8,
  },
  writeReviewText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Quicksand-Bold',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewsList: {
    flex: 1,
  },
  reviewItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 14,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#999999',
  },
  reviewComment: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#3D1609',
    lineHeight: 20,
    marginBottom: 8,
  },
  responseContainer: {
    backgroundColor: '#F5EDE8',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#A73249',
  },
  responseLabel: {
    fontSize: 12,
    fontFamily: 'Quicksand-Bold',
    color: '#A73249',
    marginBottom: 4,
  },
  responseText: {
    fontSize: 13,
    fontFamily: 'Nunito-Regular',
    color: '#3D1609',
    lineHeight: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    color: '#999999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#CCCCCC',
    marginTop: 4,
  },

  // Estilos del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#F5EDE8',
    borderRadius: 20,
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8D5C9',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
  },
  modalBody: {
    padding: 20,
    maxHeight: 300,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#3D1609',
    marginBottom: 8,
  },
  ratingSelector: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 20,
  },
  commentInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    borderWidth: 1,
    borderColor: '#E8D5C9',
    color: '#3D1609',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#999999',
    textAlign: 'right',
    marginTop: 4,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E8D5C9',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#E8D5C9',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#3D1609',
    fontFamily: 'Quicksand-Bold',
    fontSize: 14,
  },
  submitBtn: {
    flex: 1,
    backgroundColor: '#A73249',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    backgroundColor: '#A7324980',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontFamily: 'Quicksand-Bold',
    fontSize: 14,
  },
});

export default ReviewsSection;