import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/components/AuthProvider';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();

  async function handleRegister() {
    alert(`Registering user with ${email}`);
    try {
      await auth.register(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      console.error("Registration error:", error.code, error.message);
      alert(`Registration failed: ${error.message}`);
    }
  }

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Atlas</Text>
        <Text style={styles.subText}>SCHOOL</Text>
      </View>

      {/* Title */}
      <Text style={styles.registerTitle}>Register</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#A0C4C3"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#A0C4C3"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Create Account Button */}
      <TouchableOpacity style={styles.createButton} onPress={handleRegister}>
        <Text style={styles.createText}>Create Account</Text>
      </TouchableOpacity>

      {/* Back to Login Button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.replace('/login')}>
        <Text style={styles.loginText}>Login to existing account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A52', // deep navy background
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    color: 'white',
    fontSize: 48,
    fontWeight: '800',
  },
  subText: {
    color: '#35D3C9',
    fontSize: 20,
    letterSpacing: 2,
    marginTop: -5,
    fontWeight: '600',
  },
  registerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#35D3C9',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    color: 'white',
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#35D3C9',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 15,
  },
  createText: {
    color: '#0A0A52',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButton: {
    borderWidth: 1,
    borderColor: '#35D3C9',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
