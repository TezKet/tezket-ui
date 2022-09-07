import React, {useEffect,useContext} from 'react';

import {
  Box,
  Divider,
  Heading,
  HStack,
  Icon,
  List,
  Switch,
  Text,
  Image,
  Button,
  useColorMode,
  AspectRatio,
  ColorMode,
} from 'native-base';
import {StyleSheet, View} from 'react-native';
import { MaterialCommunityIcons, Entypo, Ionicons } from '@expo/vector-icons';

import { NetworkType, DAppClient, PermissionResponseOutput } from "@airgap/beacon-sdk";
import {WebsocketBuilder} from 'websocket-ts';

import { TicketNft, WalletContext, SignSocketUrl } from '../providers/WalletContext';
import { ApiMinter } from '../modals/MintModalContent';

type Props = {
  onPress: () => any;
  onSigning: () => any;
  ticketNft: TicketNft;
  userAddress: string;
  signState: string;
  setSignState: (string) => any;
};


const TicketModalContent: React.FC<Props> =  (props) => {

  const { colorMode } = useColorMode();

  const { isWalletLinked, isAdmin, userAddress, signPayload } = useContext(WalletContext);

  // Sub Address! <SignButton>

  const ws = new WebsocketBuilder(SignSocketUrl)
    .onOpen((i, ev) => { 
      console.log("opened");

      const reqTd = {
        userAddress: props.userAddress,
        mode: "OPEN"
      };
      ws.send(JSON.stringify(reqTd));

    })
    .onClose((i, ev) => { console.log("closed") })
    .onError((i, ev) => { console.log("error") })
    .onMessage(async (i, ev) => { 

        const cmd = ev.data.split(":", 2); 
        console.log(cmd);

        if(cmd[0] == "SIGN") {

          props.onPress();
          props.setSignState("");
          props.onSigning();

          await signPayload("TEST");

          // // Sign ...
          // let RespApiUse = await fetch(`${ApiMinter}/use/${props.userAddress}/1234/TEST/${cmd[1]}`)
          //   .then((response) => response.json());

          // console.log(RespApiUse);

          const reqTd = {
            userAddress: props.userAddress,
            mode: "USE",
            signAddress: props.userAddress,
            gateAddress: cmd[1],
            ticketId: "",
            signature: ""
          };
          ws.send(JSON.stringify(reqTd));

          props.setSignState("OK");

        }
     })
    .onRetry((i, ev) => { console.log("retry") })
    .build();

  useEffect(() => {
    console.log(props);
  }, [])

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
    Ticket ID: {String(props.ticketNft.tokenId).padStart(20, '0')}
    </Heading>
    {/* <Text style={styles.contentTitle}>Hi {props.userAddress} 👋!</Text> */}
    {/* <HStack alignItems="center" space={6} py={4} px={3} mx={2}>
    <Ionicons
      name="wallet"
      size={24}
      color={colorMode == 'dark' ? 'white' : 'black'}
    /> */}
    {/* <Text fontSize="sm">{props.userAddress}</Text> */}
    {/* </HStack> */}
    <HStack style={styles.qrContent} >
      {/* <AspectRatio w="100%" ratio={16 / 9}> */}
        <Image source={props.ticketNft.displayNft} style={{width: 330, height: 440, resizeMode: 'contain'}} ></Image>
      {/* </AspectRatio> */}
    </HStack>
    <HStack alignItems="center" space={6} py={4} px={3} mx={2}>
    <Button testID={'close-button'} onPress={props.onPress}>Close</Button>
    </HStack>
  </Box>
  )
};
const styles = StyleSheet.create({
  content: {
    // backgroundColor: 'black',
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
  qrContent: {
    alignItems: 'center',
    // backgroundColor: 'white',
  }
});

export default TicketModalContent;
