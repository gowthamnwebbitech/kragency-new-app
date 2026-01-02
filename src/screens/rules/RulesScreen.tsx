import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
import CommonHeader from '@/components/CommonHeader';
import colors from '@/theme/colors';

const { width } = Dimensions.get('window');

export default function RulesScreen({ navigation }: any) {
  const rules = [
    {
      title: 'Eligibility',
      text: 'Participants must be at least 18 years old and comply with local laws regarding lottery participation.',
    },
    {
      title: 'Ticket Purchase',
      text: 'Tickets can be purchased online through our platform. Each ticket costs $1. Participants can choose their own numbers or opt for a quick pick.',
    },
    {
      title: 'Game Format',
      text: 'The game consists of selecting 3 or 4 digits from 000 to 9999. Draws are held twice daily, and winning numbers are randomly selected.',
    },
    {
      title: 'Winning Combinations',
      text: 'Prizes are awarded based on matching the drawn numbers in exact order or any order, depending on the bet type chosen.',
    },
    {
      title: 'Prize Distribution',
      text: 'Winnings are credited to the participant\'s account within 24 hours of the draw. Participants can withdraw their winnings at any time.',
    },
    {
      title: 'Responsible Gaming',
      text: 'We promote responsible gaming and encourage participants to play within their means. If you feel you may have a gambling problem, please seek help.',
    },
    {
      title: 'Terms and Conditions',
      text: 'By participating in the game, participants agree to abide by all rules and regulations set forth by our platform. We reserve the right to modify the rules at any time.',
    },
  ];

  return (
    <View style={styles.container}>
      {/* COMMON HEADER */}
      <CommonHeader
        title="Game Rules"
        showBack
        walletAmount="₹2,450"
        onBackPress={() => navigation.goBack()}
        showCart={false} // Hide cart on this screen
      />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text style={styles.mainTitle}>Game Rules</Text>

        {rules.map((rule, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.ruleTitle}>{index + 1}. {rule.title}</Text>
            <Text style={styles.ruleText}>{rule.text}</Text>
          </View>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight, // white background
    paddingTop: Platform.OS === 'android' ? 0 : 0,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  mainTitle: {
    fontSize: width * 0.06,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  ruleTitle: {
    fontSize: width * 0.045,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  ruleText: {
    fontSize: width * 0.038,
    color: colors.textDark,
    lineHeight: 22,
  },
});
