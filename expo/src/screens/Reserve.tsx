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
  Link,
  Button,
  useColorMode,
  AspectRatio,
  Center,
  Image,
  Stack,
  Alert,
  VStack,
  CloseIcon,
  IconButton
} from 'native-base';

import { Pressable } from 'native-base';

import { ScrollView } from 'react-native';
import { MaterialCommunityIcons, Entypo, Ionicons } from '@expo/vector-icons';

import Modal from "react-native-modal";
import SignModalContent from '../modals/SignModalContent';

// const scheduleList = [
//   {
//     name: "The Garden City",
//     urlimg: require('./card/Bangalore_citycover_20190613234056.jpg'),
//     tag: "1 DAY PASS",
//     keyword: "The Silicon Valley of India.",
//     description: "Bengaluru (also called Bangalore) is the center of India's high-tech\nindustry. The city is also known for its parks and nightlife.",
//     timepref: "Vaild in 10/06/2022"
//   },
// ];

import { TicketNft, WalletContext } from '../providers/WalletContext';
import TicketModalContent from '../modals/TicketModalContent';

import { TicketType, TicketList } from './Tickets';

export function Reserve({ navigation }: { navigation: BottomTabNavigationProp<any> }) {

  const { colorMode } = useColorMode();
  
  const { isWalletLinked, userAddress, userTicketNfts } =useContext(WalletContext);
  
  const [isTicketModalVisible, setTicketModalVisible] = useState(false);
  const [isSignModalVisible, setSignModalVisible] = useState(false);

  const [signState, setSignState] = useState("");

  const [selectNft, setSelectNft] = useState(undefined);

  const toggleTicketModal = () => {
    setTicketModalVisible(!isTicketModalVisible);
  };

  const toggleSignModal = () => {
    setSignModalVisible(!isSignModalVisible);
  };

  // let selectNft: TicketNft;
  const showTicket = async (nft:TicketNft) => {

    setSelectNft(nft);
    
    setTicketModalVisible(true);

  };

  return (
    <Box  pt={8}>
        <ScrollView contentContainerStyle={{ width: '100%' }}>
        <Heading p={3} mx={2}>
          Reserve
        </Heading>

        <Modal testID={'modal'} isVisible={isTicketModalVisible}>
          <TicketModalContent onPress={toggleTicketModal} onSigning={toggleSignModal}
            signState={signState} setSignState={setSignState} 
            ticketNft={selectNft} userAddress={userAddress} />
        </Modal>


        <Modal testID={'modal'} isVisible={isSignModalVisible}>
          <SignModalContent onPress={toggleSignModal} 
              signState={signState} setSignState={setSignState}
              />
        </Modal>

        <Divider opacity={colorMode == 'dark' ? '0.4' : '1'} />
        {/* <HStack alignItems="center" space={6} py={4} px={3} mx={2}>
          <Button
            onPress={() => navigation.navigate('Profile')}
          >Go to Profile</Button>
        </HStack> */}
        
        {/* {isWalletLinked 
        ?<Button ml="auto" onPress={showWallet}>Show</Button>
        :<Button ml="auto" onPress={linkWallet} colorScheme="secondary">Link</Button>
        } */}

        <Text fontSize="md" px={2} mx={2} my={5}>Announcement</Text>
        <Center>
          <Alert w="90%" maxW="400" status="info" colorScheme="info">
            <VStack space={2} flexShrink={1} w="100%">
              <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                <HStack flexShrink={1} space={2} alignItems="center">
                  <Alert.Icon />
                  <Text fontSize="md" fontWeight="medium" color="coolGray.800">
                    We are going live in Q3 2022!
                  </Text>
                </HStack>
                <IconButton variant="unstyled" _focus={{
                borderWidth: 0
              }} icon={<CloseIcon size="3" color="coolGray.600" />} />
              </HStack>
            </VStack>
          </Alert>
        </Center>
        {/* <Divider opacity={colorMode == 'dark' ? '0.4' : '1'} /> */}
        <Text fontSize="md" px={2} mx={2} my={3}>Your ticket</Text>
        {/* <Button ml="auto" onPress={ () => { setSignState("ERR"); toggleSignModal(); }}>TEST</Button> */}

        {userTicketNfts.map((nft) => (
        

        <Pressable onPress={() => showTicket(nft) }>
        <Box alignItems="center" mx={3} my={3}> 
          <Box maxW="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
            borderColor: "coolGray.600",
            backgroundColor: "gray.700"
          }} _web={{
            shadow: 2,
            borderWidth: 0
          }} _light={{
            backgroundColor: "gray.50"
          }}>
            <Box>
              <AspectRatio w="100%" ratio={16 / 9}>
                <Image source={
                  nft.reservation.urlimg
              } alt="image" />
              </AspectRatio>
              <Center bg="violet.500" _dark={{
                  bg: "violet.400"
                }} _text={{
                  color: "warmGray.50",
                  fontWeight: "700",
                  fontSize: "xs"
                }} position="absolute" bottom="0" px="3" py="1.5">
                {nft.reservation.tag}
              </Center>
            </Box>
            <Stack minW="290" p="4" space={3}>
              <Stack space={2}>
                <Heading size="md" ml="-1">
                  {nft.reservation.name}
                </Heading>
                {/* <Text fontSize="xs" _light={{
                  color: "violet.500"
                }} _dark={{
                  color: "violet.400"
                }} fontWeight="500" ml="-0.5" mt="-1">
                  {nft.schedule.keyword}
                </Text> */}
              </Stack>
              {/* <Text fontWeight="400">
                {schedule.description}
              </Text> */}
              <HStack alignItems="center" space={4} justifyContent="space-between">
                <HStack alignItems="center">
                  <Text color="coolGray.600" _dark={{
                      color: "warmGray.200"
                    }} fontWeight="400">
                    {nft.reservation.timepref}
                  </Text>
                </HStack>
              {/* <Button ml="auto"
                onPress={() => console.log("BUY")}
                >Buy</Button> */}
              </HStack>
            </Stack>
          </Box>
        </Box>
        </Pressable>
        ))
        }

        {/* {userTicketNfts.map((nft) => (
          <Link
          href={`${nft.displayNft}`}
          // rel="noopener noreferrer nofollow"
        >
          {nft.tokenId} {nft.tokenMetadata.symbol}
        </Link>
        ))
        } */}

      </ScrollView>
    </Box>
  );
}