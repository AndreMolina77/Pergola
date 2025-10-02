import React from "react";
import { 
  TextInput, 
  StyleSheet, 
  View, 
  Text,
  TouchableOpacity 
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function TextInputField({ 
  placeholder, 
  value, 
  onChangeText,
  label,
  secureTextEntry = false,
  showPasswordToggle = false,
  onTogglePassword,
  keyboardType = "default",
  multiline = false,
  numberOfLines = 1,
  editable = true,
  maxLength,
  autoCapitalize = "sentences",
  style,
  ...props 
}) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused,
        !editable && styles.inputContainerDisabled,
        multiline && styles.multilineContainer,
        style
      ]}>
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            !editable && styles.inputDisabled
          ]}
          placeholder={placeholder}
          placeholderTextColor="#A73249AA"
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          editable={editable}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          textAlignVertical={multiline ? "top" : "center"}
          {...props}
        />
        
        {showPasswordToggle && (
          <TouchableOpacity
            onPress={onTogglePassword}
            style={styles.eyeIconContainer}
            activeOpacity={0.7}
            disabled={!editable}
          >
            <Ionicons 
              name={secureTextEntry ? "eye-off" : "eye"} 
              size={24} 
              color={editable ? "#3D1609" : "#A7324980"} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {maxLength && (
        <Text style={styles.charCounter}>
          {value?.length || 0}/{maxLength}
        </Text>
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
  inputContainer: {
    position: "relative",
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E8E1D8",
    shadowColor: "#3D1609",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainerFocused: {
    borderColor: "#A73249",
    shadowOpacity: 0.1,
    elevation: 4,
  },
  inputContainerDisabled: {
    backgroundColor: "#F5F5F5",
    borderColor: "#E0E0E0",
  },
  multilineContainer: {
    minHeight: 100,
  },
  input: {
    width: "100%",
    height: 56,
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: "Nunito-Regular",
    color: "#3D1609",
  },
  multilineInput: {
    height: "auto",
    paddingTop: 16,
    paddingBottom: 16,
    minHeight: 100,
  },
  inputDisabled: {
    color: "#9E9E9E",
  },
  eyeIconContainer: {
    position: "absolute",
    right: 15,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 56,
  },
  charCounter: {
    fontSize: 12,
    fontFamily: "Nunito-Regular",
    color: "#3D1609AA",
    textAlign: "right",
    marginTop: 4,
    marginRight: 5,
  },
});