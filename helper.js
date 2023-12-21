import {DirectSecp256k1HdWallet, Registry} from "@cosmjs/proto-signing";
import {
    SigningStargateClient,
    defaultRegistryTypes as defaultStargateTypes,
    QueryClient,
    createProtobufRpcClient
} from "@cosmjs/stargate";
import {registry as ibcTransferRegistry} from "persistenceonejs/ibc/applications/transfer/v1/tx.registry.js";
import {registry as wasmRegistry} from "persistenceonejs/cosmwasm/wasm/v1/tx.registry.js";
import {COMET_BFT_VERSIONS, MNEMONIC} from "./constants.js";
import {Tendermint34Client, Tendermint37Client} from "@cosmjs/tendermint-rpc";
import {MAX_SPREAD, USDC_DYDX_POOL_ID} from "./swapper.js";
export const CustomRegistry = new Registry([...defaultStargateTypes, ...ibcTransferRegistry, ...wasmRegistry]);

export async function RpcClient(chainInfo) {
    let tendermintClient = {}
    switch (chainInfo.tmVersion) {
        case COMET_BFT_VERSIONS.comet34:
            tendermintClient = await Tendermint34Client.connect(chainInfo.rpc);
            break
        case COMET_BFT_VERSIONS.comet37:
            tendermintClient = await Tendermint37Client.connect(chainInfo.rpc);
            break
        case COMET_BFT_VERSIONS.comet38:
            tendermintClient = await Tendermint37Client.connect(chainInfo.rpc);
            break
    }
    const queryClient = new QueryClient(tendermintClient);
    return [tendermintClient, createProtobufRpcClient(queryClient)];
}

export async function CreateWallet(address) {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(MNEMONIC, {
        prefix: address.prefix,
        hdPaths: [address.hdPath]
    });
    const [firstAccount] = await wallet.getAccounts();
    if (firstAccount.address !== address.address) {
        throw new Error("Incorrect address generated, expected: " + address.address + ", got: " + firstAccount.address);
    }
    return [wallet, firstAccount]
}

export async function CreateSigningClient(chainInfo, wallet) {
    return await SigningStargateClient.connectWithSigner(chainInfo.rpc, wallet, {
        prefix: chainInfo.prefix,
        registry: CustomRegistry,
        gasPrice: chainInfo.gasPrice,
    })
}

export async function CreateSigningClientFromAddress(address) {
    const [wallet, _] = await CreateWallet(address)
    return CreateSigningClient(address.chainInfo, wallet)
}

export function GenerateOnSwapRequest(offerAsset, askAsset, amount) {
    return {
        on_swap: {
            offer_asset: {
                native_token: {
                    denom: offerAsset
                }
            },
            ask_asset: {
                native_token: {
                    denom: askAsset
                }
            },
            amount: amount,
            max_spread: MAX_SPREAD,
            swap_type: {
                give_in: {}
            }
        }
    }
}

export function GenerateSwapMsg(minReceive, amount, assetIn, assetOut) {
    return {
        swap: {
            min_receive: minReceive,
            swap_request: {
                amount: amount,
                    asset_in: {
                    native_token: {
                        denom: assetIn
                    }
                },
                asset_out: {
                    native_token: {
                        denom: assetOut
                    }
                },
                max_spread: MAX_SPREAD,
                pool_id: USDC_DYDX_POOL_ID,
                swap_type: {
                    give_in: {}
                }
            }
        }
    }
}
