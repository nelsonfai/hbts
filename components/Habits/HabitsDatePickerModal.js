import React from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DatePickerModal = ({ isVisible, date, onConfirm, onCancel, mode }) => {
  return (
    <DateTimePickerModal
      isVisible={isVisible}
      mode={mode}
      date={date || new Date()}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};

export default DatePickerModal;
