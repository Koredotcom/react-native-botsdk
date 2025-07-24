import React from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import {NativeCard, EnhancedCard, ElevatedCard} from '../components/CardExamples';

const CardDemo: React.FC = () => {
  const handleCardPress = (cardType: string) => {
    Alert.alert('Card Pressed', `You pressed the ${cardType} card!`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>React Native Card Examples</Text>
      <Text style={styles.subtitle}>Using React Native 0.77+ built-in box-shadow</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✨ Native Card (Recommended)</Text>
        <NativeCard
          title="Native Card"
          content="This card uses React Native 0.77+'s new built-in box-shadow support. Multiple shadows work on both iOS and Android!"
          onPress={() => handleCardPress('Native')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎨 Enhanced Card</Text>
        <EnhancedCard
          title="Enhanced Card"
          content="This card features enhanced shadows and can include images. Perfect for content with rich media."
          onPress={() => handleCardPress('Enhanced')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📱 Elevated Card</Text>
        <ElevatedCard
          title="Elevated Card"
          content="This card has a modern elevated design with header and body sections, perfect for structured content."
          onPress={() => handleCardPress('Elevated')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Simple Example</Text>
        <View style={styles.customCard}>
          <Text style={styles.cardTitle}>Custom Card</Text>
          <Text style={styles.cardContent}>
            You can easily create your own cards using React Native 0.77+'s box-shadow:
          </Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>
              {`boxShadow: '0 4px 8px rgba(0,0,0,0.1)'`}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 Benefits</Text>
        <View style={styles.benefitCard}>
          <Text style={styles.benefitTitle}>Why Use Built-in Shadows?</Text>
          <Text style={styles.benefitItem}>✅ No third-party dependencies</Text>
          <Text style={styles.benefitItem}>✅ Works on iOS, Android & Web</Text>
          <Text style={styles.benefitItem}>✅ Multiple shadows supported</Text>
          <Text style={styles.benefitItem}>✅ Better performance</Text>
          <Text style={styles.benefitItem}>✅ React 18.3.1 compatible</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  customCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  codeBlock: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#333',
  },
  benefitCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  benefitItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
});

export default CardDemo; 