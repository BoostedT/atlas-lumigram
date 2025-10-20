import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin() {
    router.replace('/(tabs)');
  }

  return (
    <View style={styles.container}>
      {/* App Title */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Atlas</Text>
        <Text style={styles.subText}>SCHOOL</Text>
      </View>

      {/* Login Title */}
      <Text style={styles.loginTitle}>Login</Text>

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

      {/* Sign In Button */}
      <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
        <Text style={styles.signInText}>Sign in</Text>
      </TouchableOpacity>

      {/* Create Account Button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push('/register')}>
        <Text style={styles.createText}>Create a new account</Text>
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
    fontSize: 64,
    fontWeight: '800',
  },
  subText: {
    color: '#35D3C9',
    fontSize: 20,
    letterSpacing: 2,
    marginTop: -5,
    left: '7%',
    fontWeight: '600',
  },
  loginTitle: {
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
  signInButton: {
    backgroundColor: '#35D3C9',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 15,
  },
  signInText: {
    color: '#0A0A52',
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    borderWidth: 1,
    borderColor: '#35D3C9',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  createText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
