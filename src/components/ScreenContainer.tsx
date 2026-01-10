import React from 'react';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { StyleSheet, ViewStyle } from 'react-native';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: Edge[]; // Allow overriding edges per screen
}

export default function ScreenContainer({
  children,
  style,
  edges = ['top'], 
}: Props) {
  return (
    <SafeAreaView 
      style={[styles.container, style]} 
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', 
  },
});