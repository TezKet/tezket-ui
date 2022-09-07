import React, {useEffect, useState} from 'react';

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

import {WebsocketBuilder} from 'websocket-ts';

import { TicketNft, WalletContext, SignSocketUrl } from '../providers/WalletContext';
import { ApiMinter } from '../modals/MintModalContent';

// import { QrReader } from 'react-qr-reader';
import QrReader from 'modern-react-qr-reader'

type Props = {
  onPress: () => any;
  onSigning: () => any;
  userAddress: string;
  colorMode: ColorMode;
  metaState: string;
  setMetaState: (string) => any;
};

const ScanQrModalContent: React.FC<Props> = (props) => {

  const [data, setData] = useState('No result');

  useEffect(() => {

  }, [])

  // const fetchSqPayment = async () => {
  const handleScan = data => {
    if (data) {
      // console.log(data);

      const meta = data.split(";", 8); 
      console.log(meta);

      // setData(meta[6]);
      setData(meta[4]);

      // Switch Data Model
      // >> Sub Address > Request to Sign

      // 1234;tz1ioHBakcGBzT9PFxaiPCoxDJh1Ad7rWkms-4ExdpPd;-;startdate;enddate;746090;tz1ioHBakcGBzT9PFxaiPCoxDJh1Ad7rWkms;;<>;
      // 241944074126507120/R1;tz1ioHBakcGBzT9PFxaiPCoxDJh1Ad7rWkms-aJGqos1;;1135020;tz1ioHBakcGBzT9PFxaiPCoxDJh1Ad7rWkms;KT1Q88GESbqLK6mTJu7NL42DiFkGAmiBfhMb;;06/09/2022 04:29 AM

      // Modal Display Infor.

      // const minterAddress = meta[6];
      const minterAddress = meta[4];
     
      const ws = new WebsocketBuilder(SignSocketUrl)
      .onOpen(async (i, ev) => { 
        console.log("opened");
    
        const reqTd = {
          userAddress: props.userAddress,
          mode: "OPEN"
        };
        ws.send(JSON.stringify(reqTd));

        props.onPress();
        props.setMetaState("");
        props.onSigning();

        // let RespApiUse = await fetch(`${ApiMinter}/sign/${minterAddress}/${props.userAddress}`)
        //   .then((response) => response.json());
    
        // console.log(RespApiUse);

        const signTd = {
          userAddress: props.userAddress,
          mode: "SIGN",
          signAddress: minterAddress,
          gateAddress: props.userAddress
        };
        ws.send(JSON.stringify(signTd));

      })
      .onClose((i, ev) => { console.log("closed") })
      .onError((i, ev) => { console.log("error") })
      .onMessage(async (i, ev) => { 
    
          const cmd = ev.data.split(":", 2); 
          console.log(cmd);
          if(cmd[0] == "DONE") {
    
            props.setMetaState("OK");
    
          }
       })
      .onRetry((i, ev) => { console.log("retry") })
      .build();    

    }
  }
  
  const handleError = err => {
    console.error(err)
  }
  
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
    Scan Tickets
    </Heading>
    {/* <Text style={styles.contentTitle}>Hi {props.userAddress} 👋!</Text> */}
    <HStack alignItems="center" space={6} py={4} px={3} mx={2}>
    <Ionicons
      name="wallet"
      size={24}
      color={props.colorMode == 'dark' ? 'white' : 'black'}
    />
    <Text fontSize="sm">{data}</Text>
    </HStack>
    {/* <HStack style={styles.qrContent}  space={6} py={4} px={3} mx={2}> */}
    <QrReader
        delay={300}
        facingMode={"environment"}
        onError={handleError}
        onScan={handleScan}
        showViewFinder={true}
        style={{ width: '90%' }}
      />
    {/* </HStack> */}
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
    backgroundColor: 'white',
  }
});

export default ScanQrModalContent;

