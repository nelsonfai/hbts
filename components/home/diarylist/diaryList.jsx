import React from 'react';
import { View, FlatList } from 'react-native';
import DiaryEntryItem from './DiaryEntryItem';

const DiaryEntriesScreen = () => {
    const data = {
        "entries": [
          {
            "date": "2023-11-20",
            "diaryEntry": "Had a relaxing day at the park, enjoying the sunshine and reading a good book. It was a much-needed break from work and responsibilities.",
            "moodEmoji": "😊"
          },
          {
            "date": "2023-11-19",
            "diaryEntry": "Spent the evening with friends, laughing and sharing stories. Grateful for the good times and positive vibes.",
            "moodEmoji": "🤗"
          },
          {
            "date": "2023-11-18",
            "diaryEntry": "Faced some challenges at work today, but managed to overcome them. Feeling accomplished and ready for a relaxing evening.",
            "moodEmoji": "😅"
          },
          {
            "date": "2023-11-17",
            "diaryEntry": "Enjoyed a delicious home-cooked meal with family. Food always brings joy and warmth to the heart.",
            "moodEmoji": "😋"
          },
          {
            "date": "2023-11-16",
            "diaryEntry": "Had a reflective day, spending time alone and appreciating the little moments. Sometimes solitude is rejuvenating.",
            "moodEmoji": "🌙"
          }
        ]
      }
      
  return (
    <View> 
        <FlatList
        data={data.entries}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => <DiaryEntryItem item={item} />}
        />
    
    </View>
  );
};

export default DiaryEntriesScreen;
