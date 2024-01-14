import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';

const API_URL = 'YOUR_SERVER_API_ENDPOINT'; // Replace with your actual server API endpoint

const PaymentScreen = () => {
  const { confirmPayment, loading } = useConfirmPayment();
  const [card, setCard] = useState(null);

  const fetchPaymentIntentClientSecret = async () => {
    try {
      const response = await fetch(`${API_URL}/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currency: 'usd',
        }),
      });
      const { clientSecret } = await response.json();
      return clientSecret;
    } catch (error) {
      console.error('Error fetching PaymentIntent client secret:', error);
      return null;
    }
  };

  const handlePayPress = async () => {
    try {
      if (!card) {
        return;
      }

      // Fetch the intent client secret from the backend.
      const clientSecret = await fetchPaymentIntentClientSecret();

      // Confirm the payment with the card details
      const { paymentIntent, error } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          card,
        },
      });

      if (error) {
        console.log('Payment confirmation error', error);
        Alert.alert('Error', 'Payment failed. Please try again.');
      } else if (paymentIntent) {
        console.log('Payment successful:', paymentIntent);
        Alert.alert('Success', 'Payment successful!');
        // You may want to navigate to a success screen or update UI here
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <CardField
        postalCodeEnabled={true}
        placeholders={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
        }}
        style={{
          width: '100%',
          height: 50,
          marginVertical: 30,
        }}
        onCardChange={(cardDetails) => setCard(cardDetails)}
        onFocus={(focusedField) => console.log('Focus on:', focusedField)}
      />
      <Button title="Pay" onPress={handlePayPress} disabled={loading} />
    </View>
  );
};

export default PaymentScreen;
