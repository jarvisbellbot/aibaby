import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  style?: ViewStyle;
  multiline?: boolean;
  maxLength?: number;
}

export const Input: React.FC<InputProps> = ({
  value, onChangeText, placeholder, label, error, secureTextEntry = false,
  autoCapitalize = 'sentences', keyboardType = 'default', style, multiline = false, maxLength,
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[inp.container, style]}>
      {label && <Text style={inp.label}>{label}</Text>}
      <View style={[inp.inputWrapper, focused && inp.focused, !!error && inp.errored]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={secureTextEntry && !showPassword}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={inp.input}
          multiline={multiline}
          maxLength={maxLength}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={inp.eyeBtn}>
            <Text style={inp.eyeText}>{showPassword ? '🙈' : '👁'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={inp.error}>{error}</Text>}
    </View>
  );
};

const inp = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 13, color: colors.textSecondary, fontWeight: '600', marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 14, borderWidth: 1.5, borderColor: colors.borderLight,
    paddingHorizontal: 16,
  },
  focused: { borderColor: colors.borderFocus, backgroundColor: colors.surface },
  errored: { borderColor: colors.error },
  input: { flex: 1, paddingVertical: 14, fontSize: 16, color: colors.text },
  eyeBtn: { padding: 8 },
  eyeText: { fontSize: 16 },
  error: { fontSize: 12, color: colors.error, marginTop: 4 },
});
