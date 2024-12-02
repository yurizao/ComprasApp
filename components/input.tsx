import React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';

export function Input({ placeholder, ...rest }: TextInputProps) {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#888" 
      {...rest} 
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 54,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 7,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});