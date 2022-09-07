import React, { useContext, useState, useEffect } from 'react';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

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
} from 'native-base';
import { ScrollView,View } from 'react-native';
import { MaterialCommunityIcons, Entypo, Ionicons } from '@expo/vector-icons';

import Modal from "react-native-modal";

import { WalletContext } from '../providers/WalletContext';
import WalletModalContent from '../modals/WalletModalContent';
import ScanQrModalContent from '../modals/ScanQrModalContent';
import MetaQrModalContent from '../modals/MetaQrModalContent';

import {WebsocketBuilder} from 'websocket-ts';

export function AdminSign(props) {

  const { colorMode, toggleColorMode } = useColorMode();

  const [isScanQrModalVisible, setScanQrModalVisible] = useState(false);

  const [isSignModalVisible, setSignModalVisible] = useState(false);

  const [metaState, setMetaState] = useState("");


  const toggleModal = () => {
    setScanQrModalVisible(!isScanQrModalVisible);
  };

  const toggleSignModal = () => {
    setSignModalVisible(!isSignModalVisible);
  };

  const scanQr = async () => {

    setScanQrModalVisible(true);
    console.log("ScanQr! >> " + props.userAddress);

  };

  return (
    <>
    <Modal testID={'modal'} isVisible={isScanQrModalVisible}>
      <ScanQrModalContent onPress={toggleModal} onSigning={toggleSignModal}
        colorMode={colorMode} userAddress={""+props.userAddress}
        metaState={metaState} setMetaState={setMetaState} 
         />
    </Modal> 

    <Modal testID={'modal'} isVisible={isSignModalVisible}>
      <MetaQrModalContent onPress={toggleSignModal} 
          signState={metaState} setSignState={setMetaState}
          />
    </Modal>

    <HStack alignItems="center" space={6} py={4} px={3} mx={2}>
      <Ionicons
          name="pencil"
          size={24}
          color={colorMode == 'dark' ? 'white' : 'black'}
        />
      <Text>Admin</Text>
      <Button ml="auto" onPress={scanQr}>Scan</Button>
      {/* <Button ml="auto" onPress={toggleModal}>TEST</Button> */}
      {/* <Button ml="auto" onPress={() => getTicketNfts("tz1i4W46rLC4qNHn2jcZmgUo6FQ1AEomhzjh")}>TEST</Button> */}
      {/* {isWalletLinked 
      ?<Button ml="auto" >Sign</Button>
      :<></>
      } */}
    </HStack>
    </>
  );

}

export function Profile({ navigation }: { navigation: BottomTabNavigationProp<any> }) {

  const { colorMode, toggleColorMode } = useColorMode();

  const { isWalletLinked, isAdmin, userAddress, linkWallet, 
    ticketList, setTicketList, fetchTicketInfos } = useContext(WalletContext);

  const [isWalletModalVisible, setWalletModalVisible] = useState(false);

  const toggleModal = () => {
    setWalletModalVisible(!isWalletModalVisible);
  };

  const showWallet = async () => {

    setWalletModalVisible(true);
    console.log("ShowWallet! >> " + userAddress);

  };

  useEffect(() => {
    fetchTicketInfos();
    console.log(ticketList);
  }, [])

  return (
    <Box  pt={8}>
        <ScrollView contentContainerStyle={{ width: '100%' }}>
        <Heading p={3} mx={2}>
          Profile
        </Heading>

        <Modal testID={'modal'} isVisible={isWalletModalVisible}>
          <WalletModalContent onPress={toggleModal} colorMode={colorMode} userAddress={""+userAddress} />
        </Modal>

        <Divider opacity={colorMode == 'dark' ? '0.4' : '1'} />
        <Text fontSize="sm" px={2} mx={2} my={5}>Account</Text>
        <HStack alignItems="center" space={6} py={4} px={3} mx={2}>
          <Ionicons
            name="wallet"
            size={24}
            color={colorMode == 'dark' ? 'white' : 'black'}
          />
          <Text>Tezos</Text>
          {/* <Button ml="auto" onPress={showWallet}>TEST</Button> */}
          {isWalletLinked 
          ?<Button ml="auto" onPress={showWallet}>Show</Button>
          :<Button ml="auto" onPress={linkWallet} colorScheme="secondary">Link</Button>
          }
        </HStack>
        {/* <AdminSign/> */}
        {isAdmin
        ?<AdminSign userAddress={userAddress}/>
        :<></>
        }

        <Text fontSize="sm" px={2} mx={2} my={5}>App Preferences</Text>
        {/* <Divider opacity={colorMode == 'dark' ? '0.4' : '1'} /> */}
        <HStack alignItems="center" space={6} py={4} px={3} mx={2}>
          <Ionicons
            name="moon-sharp"
            size={24}
            color={colorMode == 'dark' ? 'white' : 'black'}
          />
          <Text>Dark Mode</Text>
          <Switch
            ml="auto"
            onToggle={toggleColorMode}
            isChecked={colorMode === 'dark'}
          />
        </HStack>
        {/* <HStack alignItems="center" space={6} py={4} px={3} mx={2}>
          <Ionicons
            name="language"
            size={24}
            color={colorMode == 'dark' ? 'white' : 'black'}
          />
          <Text>Language</Text>
          >
          <Switch
            ml="auto"
            onToggle={toggleColorMode}
            isChecked={colorMode === 'dark'}
          />
        </HStack> */}
        <HStack alignItems="center" space={6} py={4} px={3} mx={2}>
          <Ionicons
            name="musical-note"
            size={24}
            color={colorMode == 'dark' ? 'white' : 'black'}
          />
          <Text>Version</Text>
          <Text ml="auto">2.02   </Text>
        </HStack>
        {/* <Divider opacity={colorMode == 'dark' ? '0.4' : '1'} /> */}


      </ScrollView>
    </Box>
  );
}