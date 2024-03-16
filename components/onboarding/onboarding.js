import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { COLORS, SIZES } from '../../constants';
import Couple from './svg/couple';
import List from './svg/list';
import Habit from './svg/habit';



const OnboardingScreen = ({ i18n}) => { // Added navigation prop

  const slides = [
    {
      key: 'slide1',
      title: i18n.t('onboarding.sharedListTitle'), // Translate the title
      svgComponent: List,
      text: i18n.t('onboarding.sharedListText'), // Translate the text
      id:'',
    },
    {
      key: 'slide2',
      title: i18n.t('onboarding.habitTrackerTitle'), // Translate the title
      svgComponent: Habit,
      text: i18n.t('onboarding.habitTrackerText'), // Translate the text
      id:'habit',
    },
    {
      key: 'slide3',
      title: i18n.t('onboarding.sharedNotesTitle'), // Translate the title
      svgComponent: Couple,
      text: i18n.t('onboarding.sharedNotesText'), // Translate the text
      id:'',
    },
  ];
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
    fontSize: 18,
  },
  TextBlock: {
    textAlign: 'center',
    fontSize: 16,
    padding: 15,
  },
});

export default OnboardingScreen;
