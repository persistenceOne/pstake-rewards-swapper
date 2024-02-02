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
        rpc: "https://dydx-dao-rpc.polkachu.com:443",
        chainID: "dydx-mainnet-1",
        prefix: "dydx",
        feeDenom: "adydx",
        gasPrice: GasPrice.fromString("12500000000adydx"),
        tmVersion: COMET_BFT_VERSIONS.comet38,
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
            channelId: "channel-132",
            connectionId: "connection-198",
            clientId: "07-tendermint-160",
            port: "transfer"
        },
        Dydx: {
            channelId: "channel-131",
            connectionId: "connection-197",
            clientId: "07-tendermint-159",
            port: "transfer"
        }
    },
    Noble: {
        Persistence: {
            channelId: "channel-36",
            connectionId: "connection-59",
            clientId: "07-tendermint-61",
            port: "transfer"
        }
    },
    Dydx: {
        Persistence: {
            channelId: "channel-4",
            connectionId: "connection-8",
            clientId: "07-tendermint-4",
            port: "transfer"
        },
        Noble: {
            channelId: "channel-0",
            connectionId: "connection-0",
            clientId: "07-tendermint-0",
            port: "transfer"
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
        USDC: "ibc/B3792E4A62DF4A934EF2DF5968556DB56F5776ED25BDE11188A4F58A7DD406F0",
        DYDX: "ibc/23DC3FF0E4CBB53A1915E4C62507CB7796956E84C68CA49707787CB8BDE90A1E"
    },
    Dydx: {
        USDC: "ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5"
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
        address: "persistence17vhsaxt7cffl3crzyzmqz33ty67vzjwgf460rx",
        hdPath: stringToPath("m/44'/118'/0'/0/0"),
        prefix: "persistence",
        chainInfo: ChainInfos.Persistence,
        description: ""
    },
    Dydx: {
        address: "dydx17vhsaxt7cffl3crzyzmqz33ty67vzjwgwqjcd4",
        hdPath: stringToPath("m/44'/118'/0'/0/0"),
        prefix: "dydx",
        chainInfo: ChainInfos.Dydx,
        description: ""
    },
    DydxRewardsAddress: {
        address: "dydx1qqatzdqtm2fu722p3638tgacgev3r0qdywuw2ddp0mtdfr6kay7s7plrgu",
    },

    //TESTNETS
    PersistenceTestnet: {
        address: "persistence1cyu7835cv8vmfyfml7mtv795gegc2hz43xlnaz",
        hdPath: stringToPath("m/44'/118'/0'/0/0"),
        prefix: "persistence",
        chainInfo: ChainInfos.PersistenceTestnet,
        description: ""
    },
    DydxTestnet: {
        address: "dydx1cyu7835cv8vmfyfml7mtv795gegc2hz4knhyn3",
        hdPath: stringToPath("m/44'/118'/0'/0/0"),
        prefix: "dydx",
        chainInfo: ChainInfos.DydxTestnet,
        description: ""
    },
    DydxTestnetRewardsAddress: {
        address: "dydx1jaldkhdwj0fn9ahtwzp763jxw3gdamyeg7nr6ceymazt2eazkj5sk8c8sq",
    }
}

export const Contracts = {
    // MAINNETS
    Persistence: {
        Pool: "persistence1gzuv84xrwwhxhf0f62av279vfyrfrm7x58fcnadlr5m90gnx223sglqscd",
        Vault: "persistence1k8re7jwz6rnnwrktnejdwkwnncte7ek7gt29gvnl3sdrg9mtnqkstujtpg"
    },

    // TESTNETS
    PersistenceTestnet: {
        Pool: "persistence1xl7dhgwggn43hy9q2dmul8hln5e9hzja48h7r4k0de4lachysq4sz4qt28",
        Vault: "persistence1hrpna9v7vs3stzyd4z3xf00676kf78zpe2u5ksvljswn2vnjp3ys64pna7"
    }
}

export const DEX = {
    // MAINNETS
    Persistence: {
        PoolID: "6"
    },

    // TESTNETS
    PersistenceTestnet: {
        PoolID: "5"
    }
}
