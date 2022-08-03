import React, { useContext, useState, useEffect } from 'react';

import {
    Box,
    Divider,
    Heading,
    HStack,
    Icon,
    List,
    Switch,
    Text,
    Button,
    useColorMode,
    ColorMode,
  } from 'native-base';
import {StyleSheet, View} from 'react-native';
import { MaterialCommunityIcons, Entypo, Ionicons } from '@expo/vector-icons';

import { payments } from '@square/web-sdk';
import type { Payments, GooglePay } from '@square/web-sdk';

const paymentUrl = '<>'
const appId = '';
const locationId = '';

type Props = {
  onPress: () => any;
  setResultStatus: (Boolean) => any;
  resultStatus: Boolean;
  ticketPrice: string;
};

async function tokenize(paymentMethod) {
    const tokenResult = await paymentMethod.tokenize();
    if (tokenResult.status === 'OK') {
      return tokenResult.token;
    } else {
      let errorMessage = `Tokenization failed with status: ${tokenResult.status}`;
      if (tokenResult.errors) {
        errorMessage += ` and errors: ${JSON.stringify(
          tokenResult.errors
        )}`;
      }

      throw new Error(errorMessage);
    }
}

async function createPayment(token) {
    const body = JSON.stringify({
      locationId,
      sourceId: token,
    });

    const paymentResponse = await fetch(`${paymentUrl}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    if (paymentResponse.ok) {
      return paymentResponse.json();
    }

    const errorBody = await paymentResponse.text();
    throw new Error(errorBody);
}


// status is either SUCCESS or FAILURE;
function displayPaymentResults(status, props) {
    // const statusContainer = document.getElementById(
    //     'payment-status-container'
    // );


    if (status === 'SUCCESS') {
        // Call Mint?


        props.setResultStatus(true);

        // statusContainer.classList.remove('is-failure');
        // statusContainer.classList.add('is-success');
    } else {
        // statusContainer.classList.remove('is-success');
        // statusContainer.classList.add('is-failure');


        props.setResultStatus(false);
    }

    props.setResultStatus(true); // TEST
    props.onPress();

    // statusContainer.style.visibility = 'visible';
}

async function handlePaymentMethodSubmission(paymentMethod, props) {
    // event.preventDefault();

    try {
      // disable the submit button as we await tokenization and make a payment request.
    //   cardButton.disabled = true;
      const token = await tokenize(paymentMethod);
      const paymentResults = await createPayment(token);
      displayPaymentResults('SUCCESS', props);

      console.debug('Payment Success', paymentResults);
    } catch (e) {
    //   cardButton.disabled = false;
      displayPaymentResults('FAILURE', props);
      console.error("handlePaymentMethodSubmission >> " + e.message);
    }
}

    
const BuyTicketModalContent: React.FC<Props> = (props) => {

    // props.setResultStatus(true);
    
    useEffect(() => {
    
        const fetchSqPayment = async () => {
            
            const sqPayments = await payments(appId, locationId);

            if (sqPayments === null) {
                throw new Error('Square Web Payments SDK failed to load');
            }

            // const card = await sqPayments.card();
            // if (card) {
            //     await card.attach('#card-container');

            //     const cardButton = document.getElementById('card-button');
            //     cardButton.addEventListener('click', async function (event) {
            //       await handlePaymentMethodSubmission(card);
            //     });
            // }
            
            const paymentRequest = sqPayments.paymentRequest({
                countryCode: 'TH',
                currencyCode: 'THB',
                total: {
                  amount: props.ticketPrice,
                  label: 'Total',
                },
            });
            
            const googlePay = await sqPayments.googlePay(paymentRequest);
            if (googlePay) {

                await googlePay.attach('#google-pay-button');
                
                const googlePayButtonTarget = document.getElementById('google-pay-button');
                googlePayButtonTarget.onclick = async () => {
                    await handlePaymentMethodSubmission(googlePay, props);
                }
            }

        }

        // call the function
        fetchSqPayment()
          // make sure to catch any error
          .catch(console.error);
          
    }, [])

    // https://github.com/square/web-payments-quickstart/blob/main/public/app.css

    return (
<Box style={styles.content} pt={5} _dark={{
    borderColor: "coolGray.600",
    backgroundColor: "gray.800"
  }} _web={{
    shadow: 2,
    borderWidth: 0
  }} _light={{
    backgroundColor: "gray.50"
  }}>
    <Heading p={3} mx={2}>
    Buy Ticket
    </Heading>
    
    <HStack alignItems="center" space={6} py={4} px={3} mx={2}>
    <form id="payment-form">
      <div id="google-pay-button"></div>
      {/* <div id="card-container"></div> */}
      {/* <button id="card-button" type="button">Pay THB1.00</button> */}
      {/* <Button id="card-button">Pay THB1.00</Button> */}
    </form>
    {/* <div id="payment-status-container"></div> */}
    </HStack>

    <HStack alignItems="center" space={6} py={4} px={3} mx={2}>
    <Button testID={'close-button'} onPress={props.onPress}>Close</Button>
    </HStack> 
  </Box>
    )
};

const styles = StyleSheet.create({
  content: {
    // backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
});

export default BuyTicketModalContent;


// const payments = Square.payments(appId, locationId);
// const card = await payments.card({
//     "postalCode" : "12345",
//     "style": {
//         "input": {
//         "color": "red",
//         }
//         "@media screen and (max-width: 600px)": {
//             "input": {
//             "fontSize": "12px",
//         }
//         }
//     }
// });
// await card.attach('#card');
// const form = document.querySelector('#card-payment');
// form.addEventListener('submit', async (event) => {
//     event.preventDefault();
//     const result = await card.tokenize(); // the card nonce
// });