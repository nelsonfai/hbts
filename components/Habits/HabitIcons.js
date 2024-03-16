import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import MyHabitIcon from './habitIcon';
import HabitIcon from './habitIcon';
import EmojiSelector from 'react-native-emoji-selector';

const HabitIconModal = ({ isVisible, onClose, confirmSelection,icon,i18n }) => {
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
  const [showIcons, setShowIcons] = useState(true);
  const toggleIcons = () => {
    setShowIcons(!showIcons);
  };

  const selectIcon = (icon) => {
    setSelectedIcon(icon);
    confirmSelection(icon)
  };

  const selectEmoji = (emoji) => {
    setSelectedIcon(emoji);
    confirmSelection(emoji)
  };



  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => selectIcon(item)}>
      <View style={styles.iconContainer}>
        <HabitIcon
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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' ,paddingBottom:10,marginBottom:20,borderBottomWidth:2,borderColor:'whitesmoke',gap:10,flexWrap:'wrap'}}>
            <Text style={styles.modalTitle}>{i18n.t('editHabit.habitIconModal.selectIconOrEmoji')}</Text>
            <TouchableOpacity style={styles.toggleButton} onPress={toggleIcons}>
            <Text style={styles.toggleButtonText}>
            {showIcons ? i18n.t('editHabit.habitIconModal.showEmojis') : i18n.t('editHabit.habitIconModal.showIcons')}
            </Text>
          </TouchableOpacity>
          </View>
          {showIcons ? (
            <FlatList
              numColumns={7}
              data={[...fontAwesomeIcons, ...materialIcons]}
              renderItem={renderItem}
              keyExtractor={(item) => item}
              contentContainerStyle={{ flexDirection: 'column', justifyContent: 'space-between', gap: 5, alignItems: 'center' }}
            />
          ) : (
            <EmojiSelector
              columns={8}
              onEmojiSelected={emoji => selectEmoji(emoji)}
              style={{ maxHeight: 1000 ,height:500 }} // Adjust the height of the EmojiSelector

            />
          )}

          <TouchableOpacity style={styles.closeButton} onPress={() => onClose()}>
          <Text style={styles.closeButtonText}>{i18n.t('editHabit.habitIconModal.close')}</Text>
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
    fontWeight: '600',
  },
  iconContainer: {
    alignItems: 'center',
    height: 50,
    width: 50
  },
  toggleButton: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    alignItems: 'center',
  },
  toggleButtonText: {
    fontWeight: 'bold',
  
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
