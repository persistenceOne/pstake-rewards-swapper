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
    Dydx: {
        rpc: "https://dydx-testnet-rpc.publicnode.com:443",
        chainID: "dydx-mainnet-1",
        prefix: "dydx",
        feeDenom: "",
        tmVersion: COMET_BFT_VERSIONS.comet37,
        gasPrice: "",
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
        gasPrice: GasPrice.fromString("25000000000adv4tnt"),
    },
}

export const IBCInfos = {
    // MAINNETS
    Persistence: {
        Noble: {
            channelId: "",
            connectionId: "",
            clientId: "",
            port: ""
        },
        Dydx: {
            channelId: "",
            connectionId: "",
            clientId: "",
            port: ""
        }
    },
    Noble: {
        Persistence: {
            channelId: "",
            connectionId: "",
            clientId: "",
            port: ""
        }
    },
    Dydx: {
        Persistence: {
            channelId: "",
            connectionId: "",
            clientId: "",
            port: ""
        },
        Noble: {
            channelId: "",
            connectionId: "",
            clientId: "",
            port: ""
        }
    },

    // TESTNETS
    PersistenceTestnet: {
        NobleTestnet: {
            channelId: "channel-11",
            connectionId: "connection-3",
            clientId: "07-tendermint-5",
            port: "transfer"
        },
        DydxTestnet: {
            channelId: "channel-15",
            connectionId: "connection-5",
            clientId: "07-tendermint-14",
            port: "transfer"
        }
    },
    NobleTestnet: {
        PersistenceTestnet: {
            channelId: "channel-18",
            connectionId: "connection-25",
            clientId: "07-tendermint-26",
            port: "transfer"
        }
    },
    DydxTestnet: {
        PersistenceTestnet: {
            channelId: "channel-1",
            connectionId: "connection-1",
            clientId: "07-tendermint-1",
            port: "transfer"
        },
        NobleTestnet: {
            channelId: "channel-0",
            connectionId: "connection-0",
            clientId: "07-tendermint-0",
            port: "transfer"
        }
    }
}

export const Denoms = {
    //MAINNETS
    Persistence: {
        USDC: "",
        DYDX: ""
    },
    Dydx: {
        USDC: ""
    },

    //TESTNETS
    PersistenceTestnet: {
        DYDX: "ibc/18200EAA7E5BB3D235FF517F04045F4DCB0691CE6FC1B32E4297BEA8EF7710E3",
        USDC: "ibc/75F84596DDE9EE93010620701FFED959F3FFA1D0979F6773DE994FFEEA7D32F3"
    },
    DydxTestnet: {
        USDC: "ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5"
    }
}

export const Addresses = {
    //MAINNETS
    Persistence: {
        address: "",
        hdPath: "",
        prefix: "",
        chainInfo: ChainInfos.Persistence,
        description: ""
    },
    Dydx: {
        address: "",
        hdPath: "",
        prefix: "",
        chainInfo: ChainInfos.Dydx,
        description: ""
    },

    //TESTNETS
    PersistenceTestnet: {
        address: "persistence15e9sgp4h6e703fd832suxuyr3sx63ccfmecv0p",
        hdPath: stringToPath("m/44'/118'/0'/0/0"),
        prefix: "persistence",
        chainInfo: ChainInfos.PersistenceTestnet,
        description: ""
    },
    DydxTestnet: {
        address: "dydx15e9sgp4h6e703fd832suxuyr3sx63ccfuvsmpj",
        hdPath: stringToPath("m/44'/118'/0'/0/0"),
        prefix: "dydx",
        chainInfo: ChainInfos.DydxTestnet,
        description: ""
    },
}

export const Contracts = {
    // MAINNETS
    Persistence: {
        Pool: "",
        Vault: ""
    },

    // TESTNETS
    PersistenceTestnet: {
        Pool: "persistence1xl7dhgwggn43hy9q2dmul8hln5e9hzja48h7r4k0de4lachysq4sz4qt28",
        Vault: "persistence1hrpna9v7vs3stzyd4z3xf00676kf78zpe2u5ksvljswn2vnjp3ys64pna7"
    }
}
