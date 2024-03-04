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
    id:''
  },
  {
    key: 'slide2',
    title: 'Habit Tracker',
    svgComponent: Habit,
    text: 'Cultivate shared habits and goals, reinforcing accountability and wellness in your relationship',
    id:'habit'
  },
  {
    key: 'slide3',
    title: ' Shared Notes',
    svgComponent: Couple,
    text: 'Enhance communication and create a shared digital space for notes, fostering intimacy and connection between you and your partner.',
    id:''
  },
];

const OnboardingScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <View style= {{ width: item.id === 'habit' ? 150 : 200, height: item.id === 'habit' ? 150 : 200,marginBottom:item.id ==='habit' ? 12:0}}>
      {item.svgComponent && (
        < item.svgComponent />
      )}
      </View>
      <Text style={styles.sectionTitle}>{item.title}</Text>

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
  sectionTitle: {
    color: COLORS.primary,
    fontSize: SIZES.medium,
    marginTop: 10,
    fontWeight: 'bold',
    fontSize:18
  },
  TextBlock: {
    textAlign: 'center',
    fontSize:16,
    padding:15
  },
});

export default OnboardingScreen;
