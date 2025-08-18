import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LazyDateTimePicker, useLazyDateTimePicker, FallbackDateTimePicker } from './LazyDateTimePicker';
import CustomDateTimePickerModal from './CustomDateTimePickerModal';

/**
 * Example component demonstrating different ways to use lazy DateTimePicker
 */
export const LazyDateTimePickerExample: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [showDirectPicker, setShowDirectPicker] = useState(false);

  // Using the hook version
  const { DateTimePickerComponent, isLoading, loadError } = useLazyDateTimePicker();

  const handleDateChange = (event: any, date?: Date) => {
    if (date) {
      setSelectedDate(date);
      setShowDirectPicker(false);
    }
  };

  const handleModalConfirm = (date: Date) => {
    setSelectedDate(date);
    setShowModal(false);
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lazy DateTimePicker Examples</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Selected Date:</Text>
        <Text style={styles.dateText}>{selectedDate.toLocaleDateString()}</Text>
      </View>

      {/* Example 1: Using CustomDateTimePickerModal (recommended) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Modal DateTimePicker</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.buttonText}>Open Modal Date Picker</Text>
        </TouchableOpacity>
      </View>

      {/* Example 2: Direct LazyDateTimePicker usage */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Direct Lazy DateTimePicker</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => setShowDirectPicker(true)}
        >
          <Text style={styles.buttonText}>Show Direct Picker</Text>
        </TouchableOpacity>
        
        {showDirectPicker && (
          <LazyDateTimePicker
            value={selectedDate}
            mode="date"
            onChange={handleDateChange}
            fallbackComponent={FallbackDateTimePicker}
          />
        )}
      </View>

      {/* Example 3: Using the hook */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Using Hook</Text>
        {isLoading && <Text>Loading DateTimePicker...</Text>}
        {loadError && <Text style={styles.errorText}>Error: {loadError}</Text>}
        {DateTimePickerComponent && !showDirectPicker && (
          <TouchableOpacity 
            style={styles.button}
            onPress={() => {
              Alert.alert(
                'Hook Ready', 
                'DateTimePicker component loaded via hook!'
              );
            }}
          >
            <Text style={styles.buttonText}>DateTimePicker Hook Ready</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Example 4: Fallback component */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Fallback Component</Text>
        <FallbackDateTimePicker
          value={selectedDate}
          mode="date"
          onChange={handleDateChange}
        />
      </View>

      {/* Modal */}
      <CustomDateTimePickerModal
        isVisible={showModal}
        mode="date"
        date={selectedDate}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  dateText: {
    fontSize: 18,
    color: '#4ECDC4',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#4ECDC4',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
});

export default LazyDateTimePickerExample;
