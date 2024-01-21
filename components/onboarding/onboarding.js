import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { COLORS, SIZES } from '../../constants';
import { router } from "expo-router";

const slides = [
  {
    key: 'slide1',
    title: 'Shared List',
    image: require('./images/couple.png'),
    text: 'Simplify your to-dos and stay in sync with your partner through shared lists for seamless collaboration',
  },
  {
    key: 'slide2',
    title: 'Habits',
    image: require('./images/list.jpg'),
    text: 'Cultivate shared habits and goals, reinforcing accountability and wellness in your relationship',
  },
  {
    key: 'Notes',
    title: 'Step Three',
    image: require('./images/diary.jpg'),
    text: 'Enhance communication and create a shared digital space for notes, fostering intimacy and connection between you and your partner.',
  },
];

const OnboardingScreen = () => {
  const buttonLabel = (label) => {
    return(
      <View style={{
        padding: 12
      }}>
        <Text style={{
          color: COLORS.primary,
          fontWeight: '600',
          fontSize: SIZES.medium,
        }}>
          {label}
        </Text>
      </View>
    )
  }
  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Text style={styles.sectionTitle}>{item.title}</Text>
      <Image source={item.image} style={styles.image} />
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
        height:2,
        width:12,
        backgroundColor: COLORS.primary,
      }}
      dotStyle={{
        height:2,
        width:7,
        backgroundColor:'#E5E4E2',

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
    resizeMode: 'cover',
  },
  sectionTitle: {
    color: COLORS.primary,
    fontSize: SIZES.medium,
    marginBottom: 10,
    marginTop: 30,
    fontWeight:'bold',
  },
  TextBlock: {
    textAlign: 'center',
  },
});

export default OnboardingScreen;
