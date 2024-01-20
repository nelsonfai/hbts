import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity,StyleSheet } from 'react-native';
const MyHabitIcon = ({ iconName, isSelected, onPress,size,colorValue }) => {
    const MaterialIcons = ['hiking', 'run', 'dumbbell', 'cup-water', 'compass', 'church', 'medical-bag', 'meditation', 'microphone', 'walk', 'hands-pray','plus-circle-outline','arrow-back-ios'];
    const isMaterialIcon = MaterialIcons.includes(iconName);
    const renderIcon = () => {
      if (isMaterialIcon) {
        return (
            <MaterialIcon
              name={iconName}
              size={size}
              color={(isSelected && '#c5bef9') || (colorValue ? colorValue : 'black')}

            />
        );
      } else {
        return (
          <FontAwesomeIcon
            name={iconName}
            size={size-5}
            color={(isSelected && '#c5bef9') || (colorValue ? colorValue : 'black')}

          />
        );
      }
    };
    return (

        renderIcon()
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
          fontWeight: 'bold',
          marginBottom: 20,
        },
        iconContainer: {
          alignItems: 'center',
          margin: 15,

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
  export default MyHabitIcon