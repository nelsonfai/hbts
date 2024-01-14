import { StyleSheet } from "react-native";

import { COLORS, FONT, SIZES } from "../../../constants";

const styles = StyleSheet.create({
  itemContainer: {
    paddingHorizontal: SIZES.medium,
    marginBottom: 20,
     padding: 10,
     fontFamily: FONT.regular,
     padding: 16,
     borderWidth: 0.3,
     borderColor: 'lightgrey',
     borderRadius: 10,

  } ,
  listText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.secondary,
  },
    listDate:{
        fontFamily: FONT.bold,
        fontSize: SIZES.medium,
        color: COLORS.primary,
    },
    emoji:{
      fontSize: SIZES.medium,
    }
  });

export default styles;
