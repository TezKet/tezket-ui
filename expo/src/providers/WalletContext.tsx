import React, { createContext, useState, FC } from "react";

import axios from 'axios';

// import { TezosToolkit, MichelCodecPacker } from "@taquito/taquito";
// import { char2Bytes, bytes2Char } from "@taquito/utils";
// import { BeaconWallet } from "@taquito/beacon-wallet";
import { NetworkType, DAppClient, PermissionResponseOutput, SigningType } from "@airgap/beacon-sdk";
const { TezosToolkit, MichelsonMap } = require('@taquito/taquito');
import { char2Bytes, bytes2Char } from "@taquito/utils";

import { TicketInfo } from '../screens/Tickets';

import { TEZOS_RPC_URL, 
    TEZOS_NFT_CONTRACT } from "@env"

import { logTag } from '../services/firebase';

const rpcUrl = TEZOS_RPC_URL;
const networkId = NetworkType.ITHACANET;
const networkName = "Ithanet Testnet"
// // TEMPLE WALLET WORK WITH ITHANET

const Tezos = new TezosToolkit(rpcUrl);
const nftContract = TEZOS_NFT_CONTRACT; // LOAD

// const ipfsUrl = 'https://cloudflare-ipfs.com'
const ipfsUrl = 'https://gateway.pinata.cloud'

// ------------------------------------------------------
// const rpcUrl = 'https://hangzhounet.api.tez.ie';
// const networkId = NetworkType.HANGZHOUNET;
// const networkName = "Hangzhounet Testnet"
// ------------------------------------------------------
// // AIRGAP WALLET WORK WITH HANGZHOUNET (ONLY)
// // CANNOT TO DEPLOY MLIGO TO HANGZHOUNET ...
// ------------------------------------------------------

// const walletOptions = {
//   name: "Tezket",
//   disclaimerText: `This is an ${networkName} <b>disclaimer</b>.`,
//   preferredNetwork: networkId
// };

const walletOptions = {
    name: "Tezket",
    disclaimerText: `This is an ${networkName} <b>disclaimer</b>.`,
    preferredNetwork: networkId
};

const storeMeta = 'https://tezket-emu-api-pplpa5ifea-wl.a.run.app';

// https://0934b1956eec.ap.ngrok.io
// export const SignSocketUrl = 'wss://0934b1956eec.ap.ngrok.io';
export const SignSocketUrl = 'wss://tezket-wss-pplpa5ifea-wl.a.run.app';
// export const SignSocketUrl = 'ws://192.168.1.114:8083';

export type TicketNft = {
    tokenId: number;  
    displayNft: string;
    ipfsHash: string;
    tokenMetadata: any;
    reservation: TicketInfo;
    version: number;
}

export type WalletContextState = {
    client: DAppClient;
    isWalletLinked: Boolean;
    isAdmin: Boolean;
    // respReqPermit: PermissionResponseOutput;
    userAddress: string;
    userTicketNfts: TicketNft[],
    ticketList: TicketInfo[],
    getTicketNfts: (address: string) => void,
    setTicketList: (list: TicketInfo[]) => void,
    linkWallet: () => void;
    fetchTicketInfos: () => void,
    // signResult: string;
    signPayload: (payload: string) => void;
};

const contextDefaultValues: WalletContextState = {
    client: new DAppClient(walletOptions),
    isWalletLinked: false,
    isAdmin: false,
    // respReqPermit: null,
    userAddress: '',
    userTicketNfts: [],
    ticketList: [],
    getTicketNfts: (address: string) => null,
    setTicketList: (list: TicketInfo[]) => null,
    linkWallet: () => null,
    fetchTicketInfos: () => null,
    // signResult: '',
    signPayload: (payload: string) => null,
};

export const WalletContext = createContext<WalletContextState>(
    contextDefaultValues
);

const WalletProvider: FC = ({ children }) => {
    const [client, setClient] = useState<DAppClient>(contextDefaultValues.client);
    const [isWalletLinked, setIsWalletLinked] = useState<Boolean>(contextDefaultValues.isWalletLinked);
    const [isAdmin, setIsAdmin] = useState<Boolean>(contextDefaultValues.isAdmin);
    // ..
    const [userAddress, setUserAddress] = useState<string>(contextDefaultValues.userAddress);
    const [userTicketNfts, setUserTicketNfts] = 
        useState<TicketNft[]>(contextDefaultValues.userTicketNfts);
    const [ticketList, setTicketList] = 
        useState<TicketInfo[]>(contextDefaultValues.ticketList);

    // const [signResult, setSignResult] = useState<string>(contextDefaultValues.signResult);

    const fetchTicketInfos= async()=>{

        setTicketList([]);
        var eventInfo = await axios.get(`${storeMeta}/events`);

        // console.log(eventInfo);

        for (let v in eventInfo.data) {
        // code to be executed
        console.log(eventInfo.data[v]);
        
        const ticketItem: TicketInfo = {
            ticketype: v +"/" + eventInfo.data[v].tickets[0].ref,
            name: eventInfo.data[v].name,
            urlimg: "https://assets-global.website-files.com/60ca686c96b42034829a80d3/60de41c9d82d5b6f6922bb9d_network-poster-00001.jpg",
            tag: eventInfo.data[v].tag[0],
            keyword: eventInfo.data[v].keyword[0],
            description: eventInfo.data[v].description,
            timepref: eventInfo.data[v].timepref[0].type,
            ticketprice: "" + eventInfo.data[v].tickets[0].price + ".00",
            contract: eventInfo.data[v].contract
        };

        setTicketList([...ticketList,ticketItem]);

        }


        console.log(ticketList);


        // await eventInfo.data.forEach((value) => {
        //   console.log(value);
        // });

        // const querySnapshot = await getTicketInfos();
        // querySnapshot.forEach((doc) => {
        

        //   const ticketItem: TicketInfo = {
        //     ticketype: doc.data().ticketype,
        //     name: doc.data().name,
        //     urlimg: doc.data().urlimg,
        //     tag: doc.data().tag,
        //     keyword: doc.data().keyword,
        //     description: doc.data().description,
        //     timepref: "" + doc.data().timepref,
        //     ticketprice: doc.data().ticketprice,
        //   };

        //   setTicketList([...ticketList,ticketItem])
        // });

    }


    const getTicketNfts = async (address: string) => {
        // finds Ticket's NFTs

        const contract = await Tezos.contract.at(nftContract);
        const nftStorage = await contract.storage();

        const getTokenIds = await nftStorage.reverse_ledger.get(address);
        if (getTokenIds) {
            const userTicketNfts:TicketNft[] = await Promise.all([
                ...getTokenIds.map(async id => {

                  const tokenId = id.toNumber();
                  const metadata = await nftStorage.token_metadata.get(tokenId);
                  const tokenInfoBytes = metadata.token_info.get("");
                  const tokenInfo = bytes2Char(tokenInfoBytes);
                  const ipfsHash = tokenInfo.slice(0, 7) === "ipfs://" ? tokenInfo.slice(7) : null;

                  let metadataNft = await fetch(`${ipfsUrl}/ipfs/${ipfsHash}`)
                    .then((response) => response.json());

                    console.log(metadataNft);
                    
                  // TICKETTYPE
                  const displayUri = metadataNft.displayUri;
                  const tokenSymbol = metadataNft.symbol;

                  const ticketType = tokenSymbol.slice(0, 4) === "TZT-" ? tokenSymbol.slice(4) : null;
                  const ipfsDisplayHash = displayUri.slice(0, 7) === "ipfs://" ? displayUri.slice(7) : null;

                  const eventRef = ticketType.split('/')[0];
                  const ticketRef = ticketType.split('/')[1];

                //   if(ticketList.length <= 0) {
                //     await fetchTicketInfos();
                //   }
                //   console.log(ticketList);

                  var ticketInfo = undefined;
                  for (let v in ticketList) {
                    // code to be executed
                    // console.log(ticketList[v]);
                    if(ticketList[v].ticketype === ticketType) {
                        ticketInfo = ticketList[v];
                    }
                  }
  
                
                  let ticketNft: TicketNft = {
                    tokenId: tokenId,
                    displayNft: `${ipfsUrl}/ipfs/${ipfsDisplayHash}`,
                    ipfsHash: ipfsHash,
                    tokenMetadata: metadataNft,
                    reservation: ticketInfo,
                    // reservation: undefined,
                    version: metadataNft.version
                  };

                  return ticketNft;
                })
              ]);

            setUserTicketNfts(userTicketNfts.filter((element) => { 
                // console.log(element);
                return element.reservation !== undefined && 
                            element.version >= 3; // SKIP unknown TicketType
            }));
        }
        // console.log(getTokenIds);

    };

    const linkWallet = async () => {

        if (!client) {
            setClient(new DAppClient(walletOptions));
        }
    
        try {
            const respReqPermit = await client.requestPermissions({
                network: {
                type: networkId,
                rpcUrl
                }
            });
            const addr = respReqPermit.address;
            setUserAddress(addr);
            setIsWalletLinked(true);
            logTag('event_wallet_linked');
            setIsAdmin(addr == 'tz1ioHBakcGBzT9PFxaiPCoxDJh1Ad7rWkms');
            await getTicketNfts(addr);
    
        } catch (err) {
            console.log(err);
        }
    
    };


    const signPayload = async(payload: string) =>  {

          console.log(payload);

          const response = await client.requestSignPayload({
            signingType: SigningType.RAW,
            payload: "any string that will be signed",
          });
          
          console.log(`Signature: ${response.signature}`);
  
        //   setSignResult(""+response.signature);

    }


    return (
        <WalletContext.Provider
        value={{
            client,
            isWalletLinked,
            isAdmin,
            // ..
            userAddress,
            userTicketNfts,
            ticketList,
            setTicketList,
            getTicketNfts,
            linkWallet,
            fetchTicketInfos,
            // signResult,
            signPayload
        }}
        >
        {children}
        </WalletContext.Provider>
    );
};

export default WalletProvider;