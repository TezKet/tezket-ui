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
    Image,
  } from 'native-base';
import {StyleSheet, View} from 'react-native';
import { MaterialCommunityIcons, Entypo, Ionicons } from '@expo/vector-icons';

import { WalletContext } from '../providers/WalletContext';

type Props = {
  onPress: () => any;
  signState: string;
  setSignState: (string) => any;
};

    
const MetaQrModalContent: React.FC<Props> = (props) => {

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
    Sign ...
    </Heading>

    {props.signState == "OK"
    ?<Image source={require('./symbol/green-check.png')} style={{ width: 120, height: 120 }}/>
    :<></>
    }

    {props.signState != "OK" && props.signState == "ERR"
    ?<Image source={require('./symbol/red-error.png')} style={{ width: 120, height: 120 }}/>
    :<></>
    }

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

export default MetaQrModalContent;


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