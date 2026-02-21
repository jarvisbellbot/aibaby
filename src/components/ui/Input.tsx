import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

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
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, focused && styles.focused, error && styles.errored]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.muted}
          secureTextEntry={secureTextEntry && !showPassword}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={styles.input}
          multiline={multiline}
          maxLength={maxLength}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
            <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: { ...typography.body.sm, color: colors.text.secondary, fontWeight: '600', marginBottom: spacing.xs },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.background.warmWhite,
    borderRadius: 14, borderWidth: 1.5, borderColor: colors.border.light,
    paddingHorizontal: spacing.md,
  },
  focused: { borderColor: colors.border.focus, backgroundColor: '#fff' },
  errored: { borderColor: colors.semantic.error },
  input: { flex: 1, paddingVertical: spacing.sm + 2, ...typography.body.md, color: colors.text.primary },
  eyeBtn: { padding: spacing.xs },
  eyeText: { fontSize: 16 },
  error: { ...typography.body.xs, color: colors.semantic.error, marginTop: 4 },
});
