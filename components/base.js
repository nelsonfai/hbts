// SharedContent.js
import React from 'react';
import { Stack } from "expo-router";
import { View ,StyleSheet,} from 'react-native';

import { COLORS, icons, images, SIZES } from '../constants';
import { ScreenHeaderBtn} from './common/header/ScreenHeaderBtn';
import FloatingButton from './floatingButton';

const BaseContent = ({ title, children }) => {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerLeft: () => <ScreenHeaderBtn iconUrl={icons.menu} dimension="60%" />,
          headerRight: () => <ScreenHeaderBtn iconUrl={images.profile} dimension="75%" />,
          headerTitle: title,
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>{children}</View>
      </ScrollView>
      <FloatingButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  content: {
    flex: 1,
    padding: SIZES.medium,
  },

});

export default BaseContent;
