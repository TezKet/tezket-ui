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

import axios from 'axios';

import { WalletContext } from '../providers/WalletContext';

import { TEZKET_API_MINTER } from "@env"

export const ApiMinter = TEZKET_API_MINTER;

type Props = {
  onPress: () => any;
  payStatus: Boolean;
  mintStatus: Boolean;
  setMintStatus: (Boolean) => any;
  contractAddress: string;
  userAddress: string;
  ticketType: string;
  txID: string;
};

    
const MintModalContent: React.FC<Props> = (props) => {

    const { getTicketNfts } =useContext(WalletContext);

    const [isMintSuccess, setIsMintSuccess] = useState(false);
    const [isMintFail, setIsMintFail] = useState(false);

    useEffect(() => {
    
        const mint = async () => {
            
          console.log("Mint!");
      
          try {

            const req = { 
              contractAddress: props.contractAddress,
              minterAddress: props.userAddress,
              ticketTarget: props.ticketType,
              payRef: props.txID,
              signRef: "<>"
            };
        
          //   {
          //     "contractAddress": "KT1Q88GESbqLK6mTJu7NL42DiFkGAmiBfhMb",
          //     "minterAddress": "tz1i4W46rLC4qNHn2jcZmgUo6FQ1AEomhzjh",
          //     "ticketTarget": "241944074126507120/R1",
          //     "payRef": ""
          // }

            console.log(req);

            const resp = await axios.post(
                  `${ApiMinter}/mint`,
                  req
                );
                
            if(resp.data.code.status) {
              props.setMintStatus(true);
              setIsMintSuccess(true);
              getTicketNfts(props.userAddress);
              
            } else {
              setIsMintFail(true);
            }

            // console.log(resp.data);

          } catch (err) {
              // Handle Error Here
              console.error(err);
              setIsMintFail(true);
          }

        }

        // call the function
        mint()
          // make sure to catch any error
          .catch(console.error);
          
    }, [])


    // const MintResult=(props)=>{
      
    //   return(
    //     <HStack alignItems="center" space={6} py={4} px={3} mx={2}>
    //       {props.mintStatus 
    //       ?<Image source={require('./symbol/green-check.png')} style={{ width: 120, height: 120 }}/>
    //       :<Image source={require('./symbol/red-error.png')} style={{ width: 120, height: 120 }}/>
    //       }
    //     </HStack>
    //   )
    // }


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
    Mint ...
    </Heading>

    {isMintSuccess 
    ?<Image source={require('./symbol/green-check.png')} style={{ width: 120, height: 120 }}/>
    :<></>
    }
    {isMintFail
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

export default MintModalContent;


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