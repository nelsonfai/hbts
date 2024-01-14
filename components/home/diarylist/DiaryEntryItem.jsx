// DiaryEntryItem.js
import React from 'react';
import { View, Text } from 'react-native';
 import styles  from './diarylist.style';

const DiaryEntryItem = ({ item }) => (
  <View style={ styles.itemContainer} >
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10,alignItems:'flex-start' }}>
      <Text style={styles.listDate}>
        {new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }).toUpperCase()}
      </Text>
      <Text  style={styles.emoji}>{item.moodEmoji}</Text>
    </View>
    <Text style={styles.listText}>{item.diaryEntry}</Text>
    
  </View>
);

export default DiaryEntryItem;
