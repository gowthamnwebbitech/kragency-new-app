import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { Control, Controller, FieldError } from 'react-hook-form';
import colors from '@/theme/colors';

interface AppInputProps extends TextInputProps {
  control: Control<any>;
  name: string;
  error?: string | FieldError;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function AppInput({
  control,
  name,
  error,
  leftIcon,
  rightIcon,
  ...props
}: AppInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const inputContainerStyles = [
    styles.inputContainer,
    isFocused && styles.focused,
    error && styles.errorBorder,
  ];

  return (
    <View style={styles.wrapper}>
      <View style={inputContainerStyles}>
        {/* LEFT ICON */}
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        {/* INPUT */}
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              placeholderTextColor={colors.textLight}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              {...props}
            />
          )}
        />

        {/* RIGHT ICON */}
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>

      {/* ERROR */}
      {error && (
        <Text style={styles.errorText}>
          {typeof error === 'string' ? error : error.message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    borderRadius: 14,
    backgroundColor: colors.inputBackground,
    paddingHorizontal: 14,
  },

  focused: {
    borderColor: colors.primary,
  },

  errorBorder: {
    borderColor: colors.error,
  },

  leftIcon: {
    marginRight: 10,
  },

  rightIcon: {
    marginLeft: 10,
  },

  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },

  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: colors.error,
  },
});
