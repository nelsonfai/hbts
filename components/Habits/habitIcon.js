import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text } from 'react-native';
import { TouchableOpacity,StyleSheet } from 'react-native';
const MyHabitIcon = ({ iconName, isSelected, onPress,size,colorValue }) => {
    const MaterialIcons = ['hiking', 'run', 'dumbbell', 'cup-water', 'compass', 'church', 'medical-bag', 'meditation', 'microphone', 'walk', 'hands-pray','plus-circle-outline','arrow-back-ios','arrow-left',];
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
      
    const isMaterialIcon = MaterialIcons.includes(iconName);
    const isFontawesomeIcon = fontAwesomeIcons.includes(iconName);
    const renderIcon = () => {
      if (isMaterialIcon) {
        return (
            <MaterialIcon
              name={iconName}
              size={size}
              color={(isSelected && 'grey') || (colorValue ? colorValue : 'black')}

            />
        );
      } else if (isFontawesomeIcon) {
        return (
          <FontAwesomeIcon
            name={iconName}
            size={size-8}
            color={(isSelected && 'grey') || (colorValue ? colorValue : 'black')}

          />
        );
      }
      else{
        return(
          <Text style={{fontSize:27}}>{iconName}</Text>
        )
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