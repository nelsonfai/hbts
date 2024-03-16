import React, { useState,useContext } from "react";
import { useUser} from "../../context/userContext";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView, ScrollView } from "react-native";
import { Stack, useRouter } from "expo-router";
import AsyncStorageService from "../../services/asyncStorage";
import { COLORS } from "../../constants";
import * as Clipboard from 'expo-clipboard';
import { useRefresh } from "../../context/refreshContext";
import I18nContext from "../../context/i18nProvider";
import { SyncReminders } from "../../services/syncReminder";

export default function IndexPage() {
  const {user, setUser } = useUser();
  const {setRefresh} = useRefresh();
  const router = useRouter();
  const {i18n} = useContext(I18nContext)
  const [partnerCode, setPartnerCode] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [copy, setCopy] = useState(i18n.t('partnerPairing.shareInviteCode.copyButtonText'))

  const updateTeamInfo = (newHasTeam, newTeamId) => {
    setUser((prevUser) => ({
      ...prevUser,
      hasTeam: newHasTeam,
      team_id: newTeamId,
    }));
    setRefresh({ refreshHabits: true, refreshList: true,refreshSummary:true,refreshNotes:false});


  };
  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(user.team_invite_code);
    setCopy(i18n.t('partnerPairing.shareInviteCode.copied'));
  };

  const handleUnpairTeam = async () => {
    Alert.alert(
      i18n.t('partnerPairing.unpairTeam.alert.confirmTitle'),
      i18n.t('partnerPairing.unpairTeam.alert.confirmMessage'),
      [
        {
          text: i18n.t('partnerPairing.unpairTeam.alert.cancelText'),
          style: 'cancel',
        },
        {
          text: i18n.t('partnerPairing.unpairTeam.alert.unpairText'),
          onPress: async () => {
            try {
              const token = await AsyncStorageService.getItem('token');
              const apiUrl = "https://cpj.onrender.com/api/unpair-team/";

              const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: `Token ${token}`,
                },
              });

              if (response.ok) {
                const data = await response.json();
                updateTeamInfo(newHasTeamValue=false, newTeamIdValue=null);
                SyncReminders(token)

              } else {
                const errorMessage = await response.text();
                //("Team unpairing failed:", errorMessage);
                Alert.alert(i18n.t('partnerPairing.unpairTeam.alert.errorTitle'), i18n.t('partnerPairing.unpairTeam.alert.errorMessage'));
              }
            } catch (error) {
              //("Error during team unpairing:", error.message);
              Alert.alert(i18n.t('partnerPairing.unpairTeam.alert.errorTitle'), i18n.t('partnerPairing.unpairTeam.alert.errorMessage'));
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEnterPartnerCode = async () => {
    try {
      if (!partnerCode){
        setError(i18n.t('partnerPairing.404error.requireInvite'));
        return
      }
      const token = await AsyncStorageService.getItem('token');
      const apiUrl = "https://cpj.onrender.com/api/team-invitation/";

      const response = await fetch(`${apiUrl}${partnerCode}/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setError('');
        setSuccess(i18n.t('partnerPairing.enterPartnerCode.success'));
        SyncReminders(token)
      } else {
        const errorMessage = await response.text();

        if (response.status === 400) {
          const errorData = JSON.parse(errorMessage);
          if (errorData.error === 'User is already in a team.') {
            setError(i18n.t('partnerPairing.404error.alreadyInTeam'));
          } else if (errorData.error === 'Cannot create a team with yourself.') {
            setError(i18n.t('partnerPairing.404error.cannotCreateWithYourself'));
          } else if (errorData.error === 'Invited user is already in a team.') {
            setError('The invited user is already in a team.');
            setError(i18n.t('partnerPairing.404error.invitedUserAlreadyInTeam'));
          } else {
            setError(i18n.t('partnerPairing.404error.teamPairingFailed'));
          }
        } else {
          ////("Team invitation failed:", errorMessage);
          setError(i18n.t('partnerPairing.enterPartnerCode.error'));
        }
      }
    } catch (error) {
      //("Error during team invitation:", error.message);
      setError(i18n.t('partnerPairing.404error.teamPairingFailed'));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: true,
          headerTitle:i18n.t('partnerPairing.title')
          ,
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={{padding:15}}>
            <Text style={styles.sectionText}>
            {i18n.t('partnerPairing.description')}
            </Text>
          </View>
  
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{i18n.t('partnerPairing.shareInviteCode.sectionTitle')}</Text>
  
            <Text style={styles.inviteCode}>{i18n.t('partnerPairing.shareInviteCode.myCode')} {user.team_invite_code}</Text>
            <TouchableOpacity style={styles.button} onPress={handleCopyCode}>
              <Text style={styles.buttonText}>{copy} </Text>
            </TouchableOpacity>
          </View>
  
          {user.hasTeam ? (
            <View style={styles.section}>
              <TouchableOpacity style={styles.button} onPress={handleUnpairTeam}>
                <Text style={styles.buttonText}>{i18n.t('partnerPairing.unpairTeam.buttonText')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
          <View style={styles.section}>

              <Text style={styles.sectionTitle}>{i18n.t('partnerPairing.enterPartnerCode.sectionTitle')}</Text>
              <TextInput
                style={styles.input}
                placeholder={i18n.t('partnerPairing.enterPartnerCode.placeholder')}
                placeholderTextColor="black" // Add the desired color here
                value={partnerCode}
                onChangeText={(text) => setPartnerCode(text)}
              />
            {error && <Text style={styles.errorText}>{error}</Text>}
            {success && <Text style={styles.successText}>{success}</Text>}
              <TouchableOpacity
                style={styles.button}
                onPress={handleEnterPartnerCode}
              >
                <Text style={styles.buttonText}>{i18n.t('partnerPairing.enterPartnerCode.pairButtonText')}</Text>
              </TouchableOpacity>
              </View>

            </>

          )}

          <View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  section: {
    marginVertical: 10,
    backgroundColor: 'white',
    paddingVertical: 30,
    paddingHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0.1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 0.6,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
  },
  input: {
    height: 50,
    marginBottom: 10,
    paddingLeft: 10,
    backgroundColor: '#EFEFEF',
    borderRadius:10,
    paddingVertical:20
  },
  button: {
    backgroundColor: "black",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  inviteCode: {
    fontSize: 18,
    marginBottom: 10,
  },

  errorText: {
    color: "red",
    marginBottom: 30,
  },
  successText: {
    color: "green",
    marginBottom: 15,
  },
});
