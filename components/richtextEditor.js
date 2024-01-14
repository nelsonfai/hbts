import React, { useState } from 'react';
import { View, TextInput, ScrollView, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const RichTextEditorScreen = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = () => {
    // Save title, body, and selected date separately
    console.log('Title:', title);
    console.log('Body:', body);
    console.log('Selected Date:', selectedDate);
    // You can now save the title, body, date, or perform other actions
  };

  const onDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    setSelectedDate(date || selectedDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.titleInput}
        placeholder="Enter Title"
        value={title}
        onChangeText={(text) => setTitle(text)}
      />
      <TextInput
        style={styles.bodyInput}
        placeholder="Enter Body"
        multiline
        value={body}
        onChangeText={(text) => setBody(text)}
      />
      <View style={styles.datePickerContainer}>
        <Text style={styles.datePickerLabel}>Select Date:</Text>
        <TouchableOpacity onPress={showDatepicker} style={styles.datePicker}>
          <Text>{selectedDate.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>
      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  titleInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  bodyInput: {
    height: 150,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    textAlignVertical: 'top', // Allows vertical alignment of text in multiline TextInput
  },
  datePickerContainer: {
    marginBottom: 10,
  },
  datePickerLabel: {
    marginBottom: 5,
  },
  datePicker: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default RichTextEditorScreen;
