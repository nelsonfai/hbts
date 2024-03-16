import React, { useState, useEffect, useContext } from 'react';
import I18nContext from '../../context/i18nProvider';
import {
  View,
  Text,
  Modal,
  TextInput,
  Switch,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  SafeAreaView, 
  ScrollView// Import SafeAreaView
} from 'react-native';
import { useUser } from '../../context/userContext';
import { COLORS } from '../../constants';
import AsyncStorageService from '../../services/asyncStorage';
import { useRefresh } from '../../context/refreshContext';
import { API_BASE_URL, colorOptions } from '../../appConstants';
import DatePickerModal from '../Habits/HabitsDatePickerModal';

const AddSharedListModal = ({ visible, onClose, userHasTeam, callBack, updateList, selectedList }) => {
  const { user } = useUser();
  const { i18n } = useContext(I18nContext);
  const { setRefresh } = useRefresh();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const startDate = new Date();
  const [validationErrors, setValidationErrors] = useState({
    title: '',
    color: '',
  });

  const isharedIniValue = userHasTeam ? true : false;

  const [newSharedList, setNewSharedList] = useState({
    title: '',
    color: '',
    description: '',
    dateline: null,
    isShared: isharedIniValue, // Initialize with the provided value
  });

  const [selectedColor, setSelectedColor] = useState(null);
  useEffect(() => {
    if (selectedList) {
      // If selectedList is provided, update the state with its values
      setNewSharedList({
        title: selectedList.title,
        color: selectedList.color,
        description: selectedList.description,
        dateline: selectedList.dueDate ? new Date(selectedList.dueDate).toISOString().split('T')[0] : null,
        isShared: Boolean(selectedList.isSharedValue),
      });
      setSelectedColor(selectedList.color);
    } else {
      // If no selectedList, reset the state to default values
      setNewSharedList({
        title: '',
        color: '#f7b4a3',
        description: '',
        dateline: null,
        isShared: true,
      });
      setSelectedColor(colorOptions[0]);
    }
  }, [selectedList, isharedIniValue]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleAddOrUpdateList = async () => {
    setValidationErrors({
      title: '',
      color: '',
    });

    if (!newSharedList.title.trim()) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        title: i18n.t('sharedListModal.validationError.titleRequired'),
      }));
      return;
    }
    if (newSharedList.title.length > 60) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        title: i18n.t('sharedListModal.validationError.titleLength'),
      }));
      return;
    }
    if (!selectedColor) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        color: i18n.t('sharedListModal.validationError.colorRequired'),
      }));
      return;
    }
    const teamValue = newSharedList.isShared && userHasTeam ? user.team_id : null;
    const newSharedListWithUser = {
      ...newSharedList,
      user: user.id,
      color: selectedColor,
      team: teamValue,
    };

    try {
      const bodyData = JSON.stringify(newSharedListWithUser);
      console.log(bodyData);
      const token = await AsyncStorageService.getItem('token');
      const apiUrl = selectedList
        ? `${API_BASE_URL}/collaborative-lists/${selectedList.id}/`
        : `${API_BASE_URL}/create-collabotive-list/`;

      const requestOptions = {
        method: selectedList ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: bodyData,
      };
      const response = await fetch(apiUrl, requestOptions);

      if (response.ok) {
        callBack();
        onClose();
        setNewSharedList({
          title: '',
          color: COLORS.white,
          description: '',
          dateline: null,
          isShared: Boolean(isharedIniValue),
        });
        setRefresh({ refreshHabits: false, refreshList: true, refreshSummary: false,refreshNotes:false });
      } else {
        const errorData = await response.json();
        //('Error adding/shared list:', errorData);
      }
    } catch (error) {
      //('Error adding/shared list:', error.message);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%', margin: 'auto' }}>
        <ScrollView>

          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, paddingBottom: 70 }}>
            <TextInput
              style={{ marginBottom: 10, paddingVertical: 20, paddingHorizontal: 10, borderRadius: 5 ,backgroundColor:'#EFEFEF'}}
              placeholder={i18n.t('sharedListModal.listName')}
              placeholderTextColor="gray"
              fontSize={16} 
              value={newSharedList.title}
              onChangeText={(text) => setNewSharedList({ ...newSharedList, title: text })}
            />
            {validationErrors.title ? <Text style={{ color: 'red', marginBottom: 10 }}>{validationErrors.title}</Text> : null}

            <TextInput
              style={{ marginBottom: 10, padding: 15, backgroundColor:'#EFEFEF', borderRadius: 5 }}
              placeholder={i18n.t('sharedListModal.description')}
              placeholderTextColor="gray"
              fontSize={16} 
              value={newSharedList.description}
              onChangeText={(text) => 
              {
                setNewSharedList({ ...newSharedList, description: text })
              }}/>
                <TouchableOpacity 
                  onPress={() => setShowDatePicker(true)}
                  style={{padding:15,backgroundColor:'whitesmoke',borderRadius:5,marginTop:5}}>
                  <Text style={{ color:newSharedList.dateline ? 'black':'grey' }}>{newSharedList.dateline ? newSharedList.dateline : i18n.t('sharedListModal.datePlaceholder')}</Text>
                  </TouchableOpacity>
                  <DatePickerModal
                    isVisible={showDatePicker}
                    date={startDate}
                    onConfirm={(date) => 
                      {
                        setNewSharedList({ ...newSharedList, dateline: date.toISOString().split('T')[0] })
                        setShowDatePicker(false)
                      }}
                      onCancel={() => setShowDatePicker(false)}
                      mode="date"/>
                          <TouchableOpacity onPress={() => setNewSharedList({ ...newSharedList, dateline: null })}>
                              <View style={{paddingVertical:10,paddingHorizontal:5}}>
                                <Text >{i18n.t('sharedListModal.clear')}</Text>
                              </View>
                            </TouchableOpacity>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
              <Text style={{ marginRight: 10 }}>{i18n.t('sharedListModal.shareList')}</Text>
              <Switch
                value={newSharedList.isShared}
                onValueChange={(value) => setNewSharedList({ ...newSharedList, isShared: value })}
                trackColor={{ false:'white', true: 'black' }}
                thumbColor={newSharedList.isShared ? COLORS.white : COLORS.lightGray}
                disabled={!userHasTeam}
              />
            </View>
            {!userHasTeam && (
              <View style={{ marginBottom: 10 ,marginTop:10}}>
                <Text style={{ color: 'grey' }}>{i18n.t('sharedListModal.createJoinTeam')}</Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: COLORS.lightGray,
                    padding: 10,
                    borderRadius: 5,
                    marginTop: 5,
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    // Handle create/join team action
                  }}
                >
                </TouchableOpacity>
              </View>
            )}
            <View style={{ flexDirection: 'row', marginVertical: 20, justifyContent: 'left',flexWrap:'wrap',gap:10 }}>
              {colorOptions.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: color,
                    borderColor: color === selectedColor ? COLORS.primary : 'transparent',
                    borderWidth: 2,
                    borderRadius: 15,
                  }}
                  onPress={() => handleColorSelect(color)}
                />
              ))}
            </View>
            {validationErrors.color ? <Text style={{ color: 'red', marginBottom: 10 }}>{validationErrors.color}</Text> : null}

            <View>
              <TouchableOpacity
                style={{
                  backgroundColor: 'black',
                  padding: 15,
                  borderRadius: 10,
                  alignItems: 'center',
                  marginTop: 30
                }}
                onPress={handleAddOrUpdateList}
              >
                <Text style={{ color: 'white' }}>{selectedList ? i18n.t('sharedListModal.updateList') : i18n.t('sharedListModal.createList')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: 'black',
                  padding: 15,
                  borderRadius: 10,
                  alignItems: 'center',
                  marginTop: 10,
                }}
                onPress={onClose}
              >
                <Text style={{ color: 'white' }}>{i18n.t('sharedListModal.cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
          </ScrollView>

        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default AddSharedListModal;
