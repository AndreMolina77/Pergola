import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Animated,
  Easing 
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

const sizes = [
  { value: "pequeño", label: "Pequeño" },
  { value: "mediano", label: "Mediano" },
  { value: "grande", label: "Grande" },
  { value: "muy grande", label: "Muy Grande" }
];

export default function SizeSelector({ selectedSize, onSelect, disabled = false }) {
  const [open, setOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleDropdown = () => {
    if (disabled) return;
    
    const toValue = open ? 0 : 1;
    Animated.timing(animation, {
      toValue,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true
    }).start();
    setOpen(!open);
  };

  const handleSelect = (size) => {
    onSelect(size.value);
    toggleDropdown();
  };

  const rotateAnimation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  const getSelectedLabel = () => {
    const selected = sizes.find(size => size.value === selectedSize);
    return selected ? selected.label : "Selecciona un tamaño";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tamaño preferido</Text>
      
      <TouchableOpacity
        style={[
          styles.dropdown,
          disabled && styles.dropdownDisabled,
          open && styles.dropdownOpen
        ]}
        onPress={toggleDropdown}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.selectedText,
          !selectedSize && styles.placeholderText,
          disabled && styles.textDisabled
        ]}>
          {getSelectedLabel()}
        </Text>
        
        <Animated.View style={{ transform: [{ rotate: rotateAnimation }] }}>
          <Ionicons 
            name="chevron-down" 
            size={20} 
            color={disabled ? "#A7324980" : "#3D1609"} 
          />
        </Animated.View>
      </TouchableOpacity>

      {open && (
        <View style={styles.optionsContainer}>
          <View style={styles.options}>
            {sizes.map((size) => (
              <TouchableOpacity
                key={size.value}
                style={[
                  styles.option,
                  selectedSize === size.value && styles.optionSelected
                ]}
                onPress={() => handleSelect(size)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.optionText,
                  selectedSize === size.value && styles.optionTextSelected
                ]}>
                  {size.label}
                </Text>
                
                {selectedSize === size.value && (
                  <Ionicons name="checkmark" size={18} color="#A73249" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: "Nunito-SemiBold",
    color: "#3D1609",
    marginBottom: 8,
    marginLeft: 5,
  },
  dropdown: {
    width: "100%",
    height: 56,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: "#E8E1D8",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#3D1609",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownOpen: {
    borderColor: "#A73249",
    shadowOpacity: 0.1,
    elevation: 4,
  },
  dropdownDisabled: {
    backgroundColor: "#F5F5F5",
    borderColor: "#E0E0E0",
  },
  selectedText: {
    fontSize: 16,
    fontFamily: "Nunito-Regular",
    color: "#3D1609",
    flex: 1,
  },
  placeholderText: {
    color: "#A73249AA",
  },
  textDisabled: {
    color: "#9E9E9E",
  },
  optionsContainer: {
    marginTop: 4,
    shadowColor: "#3D1609",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  options: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E8E1D8",
    overflow: "hidden",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  optionSelected: {
    backgroundColor: "#FFF5F7",
  },
  optionText: {
    fontSize: 16,
    fontFamily: "Nunito-Regular",
    color: "#3D1609",
    flex: 1,
  },
  optionTextSelected: {
    fontFamily: "Nunito-SemiBold",
    color: "#A73249",
  },
});