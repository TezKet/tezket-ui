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
  AspectRatio,
  Stack,
  Image,
  Center,
  useColorMode,
} from 'native-base';
import { ScrollView } from 'react-native';
import { MaterialCommunityIcons, Entypo, Ionicons } from '@expo/vector-icons';

import Modal from "react-native-modal";

import { WalletContext } from '../providers/WalletContext';
import BuyTicketModalContent from '../modals/BuyTicketModalContent';
import MintModalContent from '../modals/MintModalContent';

import { getTicketInfos, logTag } from '../services/firebase';


export type TicketInfo = {
  ticketype: string;  
  name: string;
  urlimg: String;
  tag: string;
  keyword: string;
  description: string;
  timepref: string;
  ticketprice: string;
}

export const TicketType = [
  "1234",
  "1235",
];

export const TicketList: TicketInfo[] = [
  // {
  //   ticketype: TicketType[0],
  //   name: "The Garden City",
  //   urlimg: require('./card/Bangalore_citycover_20190613234056.jpg'),
  //   tag: "1 DAY PASS",
  //   keyword: "The Silicon Valley of India.",
  //   description: "Bengaluru (also called Bangalore) is the center of India's high-tech\nindustry. The city is also known for its parks and nightlife.",
  //   timepref: "Vaild in 27/06/2022",
  //   ticketprice: "2.00" // THB
  // },
  // {
  //   ticketype: TicketType[1],
  //   name: "The Garden City",
  //   urlimg: require('./card/Bangalore_citycover_20190613234056.jpg'),
  //   tag: "3 DAY PASS",
  //   keyword: "The Silicon Valley of India.",
  //   description: "Bengaluru (also called Bangalore) is the center of India's high-tech\nindustry. The city is also known for its parks and nightlife.",
  //   timepref: "Vaild in 29/06/2022"
  // },
];

export function Tickets({ navigation }: { navigation: BottomTabNavigationProp<any> }) {

  const { colorMode, toggleColorMode } = useColorMode();

  const { isWalletLinked, userAddress } =useContext(WalletContext);
  const [isBuyTicketModalVisible, setBuyTicketModalVisible] = useState(false);
  const [isMintModalVisible, setMintModalVisible] = useState(false);

  const [callPayStatus, setCallPayStatus] = useState(false);
  const [payStatus, setPayStatus] = useState(false);
  const [mintStatus, setMintStatus] = useState(false);

  const [ticketType, setTicketType] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");

  const [ticketList, setTicketList] = useState<TicketInfo[]>([]);

  const toggleBuyTicketModal = () => {
    setBuyTicketModalVisible(!isBuyTicketModalVisible);
    // if(callPayStatus) {
      // toggleMintModal();
    // }
  };

  const toggleMintModal = () => {
    setMintModalVisible(!isMintModalVisible);
    setBuyTicketModalVisible(false);
  };

  const showBuyTicket = async (tickettype,ticketprice) => {
    setTicketType(tickettype);
    setTicketPrice(ticketprice);
    setBuyTicketModalVisible(true);
  };

  const fetchTicketInfos=async()=>{
    const querySnapshot = await getTicketInfos();
    querySnapshot.forEach((doc) => {
    

      const ticketItem: TicketInfo = {
        ticketype: doc.data().ticketype,
        name: doc.data().name,
        urlimg: doc.data().urlimg,
        tag: doc.data().tag,
        keyword: doc.data().keyword,
        description: doc.data().description,
        timepref: "" + doc.data().timepref,
        ticketprice: doc.data().ticketprice,
      };

      setTicketList([...ticketList,ticketItem])
    });

  }

  useEffect(() => {
    fetchTicketInfos();
  }, [])

  return (
    <Box  pt={8}>
        <ScrollView contentContainerStyle={{ width: '100%', flexGrow: 1 }}>
        <Heading p={3} mx={2}>
          Tickets
        </Heading>

        <Modal testID={'modal'} isVisible={isBuyTicketModalVisible}>
          <BuyTicketModalContent onPress={toggleBuyTicketModal} 
              resultStatus={payStatus} setCallPaymentStatus={setCallPayStatus} setResultStatus={setPayStatus}
              ticketPrice={ticketPrice}/>
        </Modal>
        
        <Modal testID={'modal'} isVisible={isMintModalVisible}>
          <MintModalContent onPress={toggleMintModal} 
              payStatus={payStatus} 
              mintStatus={mintStatus} setMintStatus={setMintStatus}
              userAddress={userAddress} ticketType={ticketType} txID={''}/>
        </Modal>

        <Divider opacity={colorMode == 'dark' ? '0.4' : '1'} />

        {ticketList.map((ticket) => (
        
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
                ticket.urlimg
              } alt="image" />
              </AspectRatio>
              <Center bg="violet.500" _dark={{
                  bg: "violet.400"
                }} _text={{
                  color: "warmGray.50",
                  fontWeight: "700",
                  fontSize: "xs"
                }} position="absolute" bottom="0" px="3" py="1.5">
                {ticket.tag}
              </Center>
            </Box>
            <Stack p="4" space={3}>
              <Stack space={2}>
                <Heading size="md" ml="-1">
                  {ticket.name}
                </Heading>
                <Text fontSize="xs" _light={{
                  color: "violet.500"
                }} _dark={{
                  color: "violet.400"
                }} fontWeight="500" ml="-0.5" mt="-1">
                  {ticket.keyword}
                </Text>
              </Stack>
              <Text fontWeight="400">
                {ticket.description}
              </Text>
              <HStack alignItems="center" space={4} justifyContent="space-between">
                <HStack alignItems="center">
                  <Text color="coolGray.600" _dark={{
                      color: "warmGray.200"
                    }} fontWeight="400">
                    {ticket.timepref}
                  </Text>
                </HStack>
              {/* <Button ml="auto"
                onPress={()=>showBuyTicket(ticket.ticketype, ticket.ticketprice)}
                >Buy</Button> */}
              <Button ml="auto" disabled={true}
                // onPress={()=>showBuyTicket(ticket.ticketype, ticket.ticketprice)}
                >Soon</Button>
              </HStack>
            </Stack>
          </Box>
        </Box>

        ))}

      </ScrollView>
    </Box>
  );
}

// https://cloudflare-ipfs.com/ipfs/QmWACw3fWq8EbGSdgsBZMxw4cwjedonoSUtaKesZC1QgvH

// {
//   "minterAddress": "tz1i4W46rLC4qNHn2jcZmgUo6FQ1AEomhzjh",
//   "status": true,
//   "ipfs": {
//       "imageHash": "QmUm87xMH8b5XkeD1Xo54ZzQao62K83F3NmmLFV1JSgiKZ",
//       "metadataHash": "QmWACw3fWq8EbGSdgsBZMxw4cwjedonoSUtaKesZC1QgvH"
//   }
// }