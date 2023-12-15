import {GasPrice} from "@cosmjs/stargate";
import {stringToPath} from "@cosmjs/crypto";

export const MNEMONIC = process.env.MNEMONIC
export const HOST_CHAIN = process.env.HOST_CHAIN

export const COMET_BFT_VERSIONS = {
    comet34: "34",
    comet37: "37",
    comet38: "38",
}

export const ChainInfos = {
    // MAINNETS
    Persistence: {
        rpc: "https://rpc.core.persistence.one:443",
        chainID: "core-1",
        prefix: "persistence",
        feeDenom: "uxprt",
        gasPrice: GasPrice.fromString("0.005uxprt"),
        tmVersion: COMET_BFT_VERSIONS.comet37,
    },

    // TESTNETS
    PersistenceTestnet: {
        rpc: "https://rpc.testnet2.persistence.one:443",
        chainID: "test-core-2",
        prefix: "persistence",
        feeDenom: "uxprt",
        tmVersion: COMET_BFT_VERSIONS.comet37,
        gasPrice: GasPrice.fromString("0.005uxprt"),
    },
    DydxTestnet: {
        rpc: "https://dydx-testnet-rpc.publicnode.com:443",
        chainID: "dydx-testnet-4",
        prefix: "dydx",
        feeDenom: "adv4tnt",
        tmVersion: COMET_BFT_VERSIONS.comet37,
        gasPrice: GasPrice.fromString("12500000000adv4tnt"),
    },
}

export const IBCInfos = {
    Persistence: {
        Noble: {
            channelId: "channel-11",
            connectionId: "connection-3",
            clientId: "07-tendermint-5",
            port: "transfer"
        },
        Dydx: {
            channelId: "channel-15",
            connectionId: "connection-5",
            clientId: "07-tendermint-14",
            port: "transfer"
        }
    },
    Noble: {
        Persistence: {
            channelId: "channel-18",
            connectionId: "connection-25",
            clientId: "07-tendermint-26",
            port: "transfer"
        }
    },
    Dydx: {
        Persistence: {
            channelId: "channel-1",
            connectionId: "connection-1",
            clientId: "07-tendermint-1",
            port: "transfer"
        },
        Noble: {
            channelId: "channel-0",
            connectionId: "connection-0",
            clientId: "07-tendermint-0",
            port: "transfer"
        }
    }
}

export const Addresses = {
    PersistenceSwapAddress: {
        address: "persistence1wmd9kfszmzymug76hjfjrfyghzmts6gcls763g",
        hdPath: stringToPath("m/44'/118'/2'/0/0"),
        prefix: "persistence",
        chainInfo: ChainInfos.Persistence,
        description: "Has authz for updating HostChains of liquidstakeibc module, granter: persistence1ealyadcds02yvsn78he4wntt7tpdqhlhg7y2s6, older granter: persistence12d7ett36q9vmtzztudt48f9rtyxlayflz5gun3"
    },

    //TESTNETS
    PersistenceTestnetSwapAddress: {
        address: "persistence1h69039p8dpjlrx3uwz656rhmdcmnd8tyx5y6fe",
        hdPath: stringToPath("m/44'/0'/1'/0/0"),
        prefix: "persistence",
        chainInfo: ChainInfos.PersistenceTestnet,
        description: "Has authz for updating HostChains/ UpdateParams of liquidstakeibc module, has authz for persistence18dsfsljczehwd5yem9qq2jcz56dz3shp48j3zj"
    },
    DydxTestnetSwapAddress: {
        address: "persistence1h69039p8dpjlrx3uwz656rhmdcmnd8tyx5y6fe",
        hdPath: stringToPath("m/44'/0'/1'/0/0"),
        prefix: "persistence",
        chainInfo: ChainInfos.PersistenceTestnet,
        description: "Has authz for updating HostChains/ UpdateParams of liquidstakeibc module, has authz for persistence18dsfsljczehwd5yem9qq2jcz56dz3shp48j3zj"
    },
}
