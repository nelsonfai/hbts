import React, { useState,useContext} from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView,ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { images } from '../../constants';
import I18nContext from '../../context/i18nProvider';

const SubscriptionModal = ({ isVisible, onClose }) => {
  const {i18n} = useContext(I18nContext)
  const [selectedPackage, setSelectedPackage] = useState('monthly');
  const handleSubscribe = () => {
    console.log(`Subscribing to ${selectedPackage} package`);
    onClose();
  };
  const renderFeature = (title, description, iconName,key) => (
    <View style={styles.featureContainer} key={key}>
      <View style={styles.featureIconContainer}>
        <Icon name={iconName} size={24} color={'grey'} />
        <Text style={styles.featureTitle}>{title}</Text>
      </View>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  );

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name={'close'} size={30} color={'grey'} />
        </TouchableOpacity>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          <View style={styles.modalContent}>
            <View style={styles.imageContainer}>
              <ImageBackground
                source={images.holdhands}
                resizeMode='cover'
                style={styles.image}> 
              </ImageBackground>
            </View>

            <Text style={styles.title}>{i18n.t('subscription.title')}</Text>

            <View style={styles.packageContainer}>
              <TouchableOpacity
                style={[
                  styles.package,
                  selectedPackage === 'monthly' && styles.selectedPackage,
                ]}
                onPress={() => setSelectedPackage('monthly')}
              >
                <Text style={styles.packageText}>{i18n.t('subscription.monthlyPackage.text')}</Text>
                <Text style={styles.packageDetails}>{i18n.t('subscription.monthlyPackage.details')}</Text>
                <Text style={styles.packageDetails}></Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.package,
                  selectedPackage === 'yearly' && styles.selectedPackage,
                ]}
                onPress={() => setSelectedPackage('yearly')}
              >
                <Text style={styles.packageText}>{i18n.t('subscription.yearlyPackage.text')}</Text>
                <Text style={styles.packageDetails}>{i18n.t('subscription.yearlyPackage.details')}</Text>
                <Text style={[styles.packageDetails, { color: '#FF5733' }]}>{i18n.t('subscription.yearlyPackage.bestValue')}</Text>
              </TouchableOpacity>
            </View>

            {/* {subscription.features.map((feature, index) => (*/}
            
            {i18n.t('subscription.features', { returnObjects: true }).map((feature, index) => (
              renderFeature(
                title=feature.title,
                description=feature.description,
                iconName=feature.icon,
                key=feature.title
                // Using feature.title as the key
                )
            ))}
            <View style={{ marginBottom: 90 }} />
          </View>
        </ScrollView>

        {/* Fixed buttons at the bottom */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
            <Text style={styles.subscribeButtonText}>{i18n.t('subscription.subscribeButton')}</Text>
          </TouchableOpacity>
          <Text style={{ textAlign: 'center', paddingTop: 8 }}>{i18n.t('subscription.partnerText')}</Text>
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backgroundColor:'white'
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding:20,
    marginTop:20
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'cover',
    marginBottom: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  packageContainer: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  package: {
    borderWidth: 0.3,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    flex: 1,
    backgroundColor:'#fbfbfe'
  },
  selectedPackage: {
    backgroundColor:'#c5bef9'
  },
  packageText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  packageDetails: {
    fontSize: 14,
    marginBottom: 5,
  },
  buttonContainer: {
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
    borderTopWidth: 0,
    borderTopColor: '#ccc',
    padding: 30,
  },
  subscribeButton: {
    backgroundColor: '#c5bef9',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  subscribeButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    position: 'absolute',
    top:60,
    zIndex:1,
    right:10
  },
  featureContainer: {
    marginBottom: 10,
    padding:5,
    marginLeft:5
  },
  featureIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  featureTitle: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '500',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default SubscriptionModal;
