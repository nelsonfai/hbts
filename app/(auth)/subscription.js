// SubscriptionScreen.js

import React, { useState ,useRef} from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { CardField, useStripe,StripeProvider } from '@stripe/stripe-react-native';
import { API_BASE_URL } from '../../appConstants';
import AsyncStorageService from '../../services/asyncStorage';
import { useLocalSearchParams } from 'expo-router';

const SubscriptionScreen = () => {
  const { createPaymentMethod, confirmSetupIntent, handleCardAction } = useStripe();
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const cardFieldRef = useRef(); 

  //plan = params?.plan
  const plan = 'price_1OTPBXHZ7b9ff5E2zUHNdFBE'

  const handleSubscribe = async () => {
    try {
      setLoading(true);

      // Create Payment Method
      const { paymentMethod, error } = await createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        console.error('Error creating payment method:', error);
        Alert.alert('Error', 'Failed to create payment method. Please try again.');
        return;
      }

      // Confirm Setup Intent
      const { setupIntent, error: setupError } = await confirmSetupIntent({
        paymentMethodId: paymentMethod.id,
      });

      if (setupError) {
        console.error('Error confirming setup intent:', setupError);
        Alert.alert('Error', 'Failed to confirm setup intent. Please try again.');
        return;
      }

      // Send subscription details to backend
      await subscribeToBackend(setupIntent.id);

      // Update user premium status on success
      // Handle UI updates

    } catch (error) {
      console.error('Error processing subscription:', error);
      Alert.alert('Error', 'Failed to process subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToBackend = async (setupIntentId) => {
    const token = await AsyncStorageService.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/create-payment-intent/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          user_email: userEmail,
          setup_intent_id: setupIntentId,
          name:userName,
          plan:plan
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe on the backend.');
      }

      const result = await response.json();

      if (result.success) {
        Alert.alert('Success', 'Subscription successful!');
      } else {
        throw new Error('Failed to subscribe on the backend.');
      }
    } catch (error) {
      console.error('Error subscribing to backend:', error);
      Alert.alert('Error', 'Failed to subscribe on the backend. Please try again.');
    }
  };

  return (
    <StripeProvider
    publishableKey="pk_test_51OPRTQHZ7b9ff5E2gwvHGdbBmnRzFiFe6jipBucbyJtJ8EAgPAQQdI6sVaSejPN0jHO6eaq01NxzdJ2hVeHYCri300PdlNLEVK"
    urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
    merchantIdentifier="merchant.com.couplejournal" // required for Apple Pay
  >

    <View>
      <Text>Subscription Screen</Text>
      <TextInput
        placeholder="Enter your email"
        value={userName}
        onChangeText={(text) => setUserName(text)}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ margin: 10, padding: 10, borderColor: 'gray', borderWidth: 1 }}
      />
        <CardField
        ref={cardFieldRef}
          postalCodeEnabled={false}
          placeholder={{
            number: '4242 4242 4242 4242',
          }}
          cardStyle={{
            backgroundColor: '#FFFFFF',
            textColor: '#000000',
          }}
          style={{
            width: '100%',
            height: 50,
            marginVertical: 10,
          }}
          onCardChange={(cardDetails) => {
            console.log('cardDetails', cardDetails);
            // You can use cardDetails to update your UI or perform additional logic
          }}
        />
      <Button title="Subscribe" onPress={handleSubscribe} disabled={loading} />
    </View>
  </StripeProvider>
  );
};

export default SubscriptionScreen;
