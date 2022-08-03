import React from 'react';
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
  Avatar,
  useColorMode,
} from 'native-base';
import { ScrollView } from 'react-native';
import { MaterialCommunityIcons, Entypo, Ionicons } from '@expo/vector-icons';

export function Home({ navigation }: { navigation: BottomTabNavigationProp<any> }) {

  const { colorMode, toggleColorMode } = useColorMode();
  
  return (
    <Box  pt={8}>
        <ScrollView contentContainerStyle={{ width: '100%' }}>
        {/* <Heading p={3} mx={2}>
          Home
        </Heading> */}

        <HStack>
          {/* <Ionicons
            name="wallet"
            size={24}
            color={colorMode == 'dark' ? 'white' : 'black'}
          /> */}
          {/* <Text>Jun 9 2022, 11:22 PM</Text> */}
          <Heading p={3} mx={2}>
            Home
          </Heading>
          <Avatar ml="auto" mx={5} my={2}
            size="sm"
            _light={{ bg: 'blue.300' }}
            _dark={{ bg: 'blue.400' }}
            _text={{
              opacity: 0,
            }}
          >
            NB
            {/* <Avatar.Badge
              _light={{ bg: 'green.300' }}
              _dark={{ bg: 'green.400' }}
              borderWidth={0}
              boxSize={5}
            /> */}
          </Avatar>
          
          {/* <Button ml="auto"
            onPress={() => console.log("LINK")}
          >Link</Button> */}
        </HStack>

        <Divider opacity={colorMode == 'dark' ? '0.4' : '1'} />

        {/* <HStack space={3} py={1} alignItems="center" w="100%">
          <Box mr={4}>
            <Entypo
              name="circular-graph"
              size={32}
              color={colorMode === 'dark' ? 'white' : 'black'}
            />
          </Box>

          <Text>TEST</Text>
          <Box ml="auto">
            <Icon
              mr={2}
              size="sm"
              as={<MaterialCommunityIcons name="chevron-right" />}
              color="coolGray.500"
            />
          </Box>
        </HStack> */}

        {/* <HStack alignItems="center" space={6} py={4} px={3} mx={2}>
          <Button
            onPress={() => navigation.navigate('Profile')}
          >Go to Profile</Button>
        </HStack> */}

      </ScrollView>
    </Box>
  );
}