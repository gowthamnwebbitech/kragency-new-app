import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';

import AppInput from '@/components/AppInput';
import AppButton from '@/components/AppButton';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { loginThunk } from '@/features/auth/authThunk';
import RED_LOGO from '@/assets/logo/logo.png';
import ScreenContainer from '@/components/ScreenContainer';

/* ================= TYPES ================= */
interface LoginFormData {
  mobile: string;
  password: string;
}

/* ================= VALIDATION ================= */
const schema = yup.object({
  mobile: yup
    .string()
    .required('Mobile number is required')
    .matches(/^\d{10}$/, 'Mobile number must be 10 digits'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const PRIMARY_RED = '#E31E24';
// const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(state => state.auth.loading);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  /* ================= SUBMIT ================= */
  const onSubmit = async (data: LoginFormData) => {
    if (loading) return;

    try {
      const response = await dispatch(loginThunk(data)).unwrap();

      Toast.show({
        type: 'success',
        text1: response.message || 'Login Successful',
        text2: `Welcome ${response.user.name}`,
      });
      navigation.replace('MainTabs');
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2:
          err?.message ||
          err?.error ||
          'Something went wrong. Please try again.',
      });
    }
  };

  const onError = () => {
    Toast.show({
      type: 'error',
      text1: 'Validation Error',
      text2: 'Please check the highlighted fields',
    });
  };

  const handleWhatsAppJoin = () => {
    Linking.openURL('https://wa.me/yournumber');
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.navigate('MainTabs')}
          >
            <Feather name="arrow-left" size={22} color="#1A1A1A" />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={RED_LOGO}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Enter your details to access your account
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formCard}>
            <AppInput
              control={control}
              name="mobile"
              placeholder="Mobile Number"
              keyboardType="number-pad"
              leftIcon={
                <FontAwesome name="phone" size={18} color={PRIMARY_RED} />
              }
            />
            {errors.mobile && (
              <Text style={styles.errorText}>{errors.mobile.message}</Text>
            )}

            <View style={{ height: 12 }} />

            <AppInput
              control={control}
              name="password"
              placeholder="Password"
              secureTextEntry={!showPassword}
              leftIcon={
                <FontAwesome name="lock" size={18} color={PRIMARY_RED} />
              }
              rightIcon={
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <FontAwesome
                    name={showPassword ? 'eye' : 'eye-slash'}
                    size={18}
                    color={PRIMARY_RED}
                  />
                </TouchableOpacity>
              }
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}

            <AppButton
              title={loading ? 'Authenticating...' : 'Sign In'}
              onPress={handleSubmit(onSubmit, onError)}
              style={styles.loginButton}
              disabled={loading}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.dividerContainer}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity
              style={styles.whatsappButton}
              onPress={handleWhatsAppJoin}
              activeOpacity={0.8}
            >
              <FontAwesome name="whatsapp" size={20} color="#25D366" />
              <Text style={styles.whatsappText}>Join Now on WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 40,
  },
  backBtn: { marginTop: 20, marginBottom: 5 },
  header: { alignItems: 'center', marginBottom: 40 },
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#FFF1F1',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: PRIMARY_RED,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: { elevation: 5 },
    }),
  },
  logo: { width: 60, height: 60 },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#7C7C7C',
    marginTop: 8,
    textAlign: 'center',
  },
  formCard: { width: '100%' },
  loginButton: {
    marginTop: 24,
    backgroundColor: PRIMARY_RED,
    height: 58,
    borderRadius: 16,
    shadowColor: PRIMARY_RED,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  errorText: {
    color: PRIMARY_RED,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  footer: { marginTop: 40, alignItems: 'center' },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  line: { flex: 1, height: 1, backgroundColor: '#EEEEEE' },
  dividerText: {
    marginHorizontal: 16,
    color: '#BDBDBD',
    fontSize: 12,
    fontWeight: '600',
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    width: '100%',
    backgroundColor: '#F9F9F9',
  },
  whatsappText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
});
