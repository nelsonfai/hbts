import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { COLORS, SIZES } from '../../constants';
import Couple from './svg/couple';
import List from './svg/list';
import Habit from './svg/habit';
const slides = [
  {
    key: 'slide1',
    title: 'Shared List',
    svgComponent: List,
    text: 'Simplify your to-dos and stay in sync with your partner through shared lists for seamless collaboration',
  },
  {
    key: 'slide2',
    title: 'Habits',
    svgComponent: Habit,
    text: 'Cultivate shared habits and goals, reinforcing accountability and wellness in your relationship',
  },
  {
    key: 'slide3',
    title: 'Notes',
    svgComponent: Couple,
    text: 'Enhance communication and create a shared digital space for notes, fostering intimacy and connection between you and your partner.',
  },
];

const OnboardingScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Text style={styles.sectionTitle}>{item.title}</Text>
      <View style={styles.image}>
      {item.svgComponent && (
        < item.svgComponent />
      )}
      </View>
 
      <Text style={styles.TextBlock}>{item.text}</Text>
    </View>
  );

  const onDone = () => {
    // Handle the action when the user is done with the onboarding
    navigation.navigate('./home'); // Replace 'Home' with your target screen
  };

  return (
    <AppIntroSlider
      renderItem={renderItem}
      data={slides}
      onDone={onDone}
      showSkipButton={true}
      onSkip={onDone}
      activeDotStyle={{
        height: 2,
        width: 12,
        backgroundColor: COLORS.primary,
      }}
      dotStyle={{
        height: 2,
        width: 7,
        backgroundColor: '#E5E4E2',
      }}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
  sectionTitle: {
    color: COLORS.primary,
    fontSize: SIZES.medium,
    marginBottom: 10,
    marginTop: 30,
    fontWeight: 'bold',
  },
  TextBlock: {
    textAlign: 'center',
  },
});

export default OnboardingScreen;
