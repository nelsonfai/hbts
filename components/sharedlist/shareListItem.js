import React, { useRef, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import { useSwipeable } from "../../context/swipeableContext";
const ListItem = ({
  item,
  handleCheckButtonPress,
  handleDeleteButtonPress,
  onEdit,
  color,
  swipeableRefs,
}) => {
  const swipeableRef = useRef(null);

  const {openRowId, setOpenRowId } = useSwipeable({
    listOpenId:null,
    habitOpenid:null,
    noteOpenid:null
  })

  useEffect(() => {
    swipeableRefs[item.id] = swipeableRef.current;
    return () => {
      swipeableRefs[item.id] = null;
    };
  }, [item.id, swipeableRefs]);


  const renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-50, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.listMenu}>
        <TouchableOpacity
          onPress={() => {
            handleDeleteButtonPress(item.id);
          }}>
          <View style={[styles.actionButton]}>
            <Icon name="trash" size={25} color='grey' />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onEdit(item.id, item.text);
            currentSwipeable()
          }}>
          <View style={[styles.actionButton]}>
            <Icon name="edit" size={24}  color='grey'/>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

const closeRow = (index)=> {
    if (openRowId?.listOpenId !==null && openRowId?.listOpenId !== index) {
      swipeableRefs[openRowId?.listOpenId]?.close();
    }
     setOpenRowId({listOpenId:index,habitOpenid:null,noteOpenid:null})
}
  const currentSwipeable = () =>{
      if (swipeableRef.current) {
        swipeableRef.current.close();
        }}

  return (
    <Swipeable
    ref={swipeableRef}
    renderRightActions={renderRightActions}
      overshootRight={false}
      onSwipeableWillOpen={() => {
      closeRow(item.id)
    }}
      onSwipeableClose={() => {
        }}

    >
      <View style={styles.itemContainer}>
        {item.done ? (
          <TouchableOpacity
            style={[styles.checkButton, styles.checkedButton]}
            onPress={() => handleCheckButtonPress(item.id, false)}
          >
            <Icon name="check-square" size={25} color={color} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.checkButton}
            onPress={() => handleCheckButtonPress(item.id, true)}
          >
            <Icon name="square-o" size={25} color={color} />
          </TouchableOpacity>
        )}
        <Text style={[styles.itemText, { flex: 1 }]}>{item.text} </Text>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
    marginBottom: 10,
  },
  itemText: {
    fontSize: 18,
    marginLeft: 10,
  },
  checkButton: {
    padding: 8,
    borderRadius: 4,
  },

  listMenu: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: 150,
    marginBottom: 10,
    gap: 7,
    marginLeft: 10,
  },
  actionButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 65,

    borderRadius: 10,
    backgroundColor: "#EFEFEF",
  },
});

export default ListItem;
