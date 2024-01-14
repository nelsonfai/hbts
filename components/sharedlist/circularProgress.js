import React from 'react';
import { View } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';

const CircularProgressBar = ({ percentage, tintColor ,radius}) => {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', }}>
      <CircularProgress
      value={percentage}
      size={60}
      activeStrokeColor={tintColor}
      activeStrokeWidth={6}
      inActiveStrokeWidth={6}
      inActiveStrokeColor={tintColor}
   inActiveStrokeOpacity={0.2}
   titleFontSize={12}
      radius={radius}
      />
    </View>
  );
};

export default CircularProgressBar;

