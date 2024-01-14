import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import MyHabitIcon from './habitIcon';
import HabitIcon from './habitIcon';
const HabitIconModal = ({ isVisible, onClose, confirmSelection,icon }) => {
  const fontAwesomeIcons = [
'hourglass',
    'bicycle',
    'book',
    'coffee',
    'microphone',
    'bell',
    'music',
    'group',
    'heart',
    'pencil-square-o',
    'plus',
    'paint-brush',
    'star',
    'sun-o',
    'thumbs-up',
    'tree',
    'calendar',
    'clock-o',
    'tasks',
    'check-square-o',
    'bullseye',
    'commenting-o',
    'flag-checkered',
    'briefcase',
    'globe',
    'graduation-cap',
    'lightbulb-o',
    'puzzle-piece',
    'rocket',
    'trophy',
    'car',
    'plane',
    'subway',
    'ship',
    'home',
    'building',
    'cutlery',
    'shopping-cart',
    'money',
    'credit-card',
    'paper-plane',
    'wrench',
    'map-marker',
    'flag',
    'phone',
    'link',
    'birthday-cake',
    'glass',
    'camera',
    'shopping-bag',
    'futbol-o',
    'laptop','bed'
  ];

  const materialIcons = [
     'walk',
     'hiking',
     'run',
     'dumbbell',
     'cup-water',
     'compass',
     'church',
     'medical-bag',
      'meditation',
     'hands-pray'
  ];
  const [selectedIcon,setSelectedIcon] = useState(fontAwesomeIcons[0])

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => setSelectedIcon(item)}> 
  <View style={styles.iconContainer}>
    <MyHabitIcon
      iconName={item}
      isSelected={selectedIcon === item}
      size={30}
    />
  </View>
  </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => onClose()}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}> 
          <Text style={styles.modalTitle}>Select an Icon</Text>
          <TouchableOpacity onPress={() => confirmSelection(selectedIcon)}>
            <Text style={[styles.modalTitle,{color:'#c5bef9'}]}> Confirm</Text>
          </TouchableOpacity>
          </View>
          <FlatList
            numColumns={7}
            data={[...fontAwesomeIcons, ...materialIcons]}
            renderItem={renderItem}
            keyExtractor={(item) => item}
            contentContainerStyle={{flexDirection:'column',justifyContent:'space-between',gap:5,alignItems:'center'}}

          />
          <TouchableOpacity style={styles.closeButton} onPress={() => onClose()}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',

  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: '600',
  },
  iconContainer: {
    alignItems: 'center',
    height:50,
    width:50
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HabitIconModal;
