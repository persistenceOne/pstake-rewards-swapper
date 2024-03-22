import {
    Addresses,
    ChainInfos,
    Contracts,
    Denoms,
    HOST_CHAIN,
    IBCInfos,
    DEX,
    TARGET_ENV,
    TARGET_ENV_MAINNET, TARGET_ENV_TESTNET
} from "./constants.js";
import {QueryAccountBalance, QuerySmartContractState} from "./query.js";
import {ExecuteContract, IBCRoute, IBCSend} from "./tx.js";
import {GenerateOnSwapRequest, GenerateSwapMsg, SkipClient, sleep} from "./helper.js";
import util from "util";

export const SLIPPAGE = 0.5
export const MAX_SPREAD = "0.02"
export const USDC_DYDX_POOL_ID = "5"

async function QueryUSDCRewardBalances() {
    const chainInfo = HOST_CHAIN === ChainInfos.Persistence.chainID ?
        ChainInfos.Dydx : ChainInfos.DydxTestnet
    const address = HOST_CHAIN === ChainInfos.Persistence.chainID ?
        Addresses.Dydx : Addresses.DydxTestnet
    const denom = HOST_CHAIN === ChainInfos.Persistence.chainID ?
        Denoms.Dydx.USDC : Denoms.DydxTestnet.USDC

    return await QueryAccountBalance(chainInfo, address, denom).then(balance => balance.balance)
}

async function MoveUSDCRewardsToPersistence(USDCBalance) {
    const senderAddress = HOST_CHAIN === ChainInfos.Persistence.chainID ?
        Addresses.Dydx : Addresses.DydxTestnet
    const receiverAddress = HOST_CHAIN === ChainInfos.Persistence.chainID ?
        Addresses.Persistence : Addresses.PersistenceTestnet
    const senderIbcInfo = HOST_CHAIN === ChainInfos.Persistence.chainID ?
        IBCInfos.Dydx.Noble : IBCInfos.DydxTestnet.NobleTestnet
    const receiverIbcInfo = HOST_CHAIN === ChainInfos.Persistence.chainID ?
        IBCInfos.Noble.Persistence : IBCInfos.NobleTestnet.PersistenceTestnet

    return await IBCRoute(senderAddress, receiverAddress, senderIbcInfo, receiverIbcInfo, USDCBalance)
}

async function QueryUSDCBalanceOnPersistence() {
    const chainInfo = HOST_CHAIN === ChainInfos.Persistence.chainID ?
        ChainInfos.Persistence : ChainInfos.PersistenceTestnet
    const address = HOST_CHAIN === ChainInfos.Persistence.chainID ?
        Addresses.Persistence : Addresses.PersistenceTestnet
    const denom = HOST_CHAIN === ChainInfos.Persistence.chainID ?
        Denoms.Persistence.USDC : Denoms.PersistenceTestnet.USDC

    return await QueryAccountBalance(chainInfo, address, denom).then(balance => balance.balance.amount)
}

async function SwapUSDCRewards(USDCBalance) {
    if (USDCBalance === 0) {
        return ""
    }

    const chainInfo = HOST_CHAIN === ChainInfos.Persistence.chainID ?
        ChainInfos.Persistence : ChainInfos.PersistenceTestnet
    const senderAddress = HOST_CHAIN === ChainInfos.Persistence.chainID ?
        Addresses.Persistence : Addresses.PersistenceTestnet
    const poolContract = HOST_CHAIN === ChainInfos.Persistence.chainID ?
        Contracts.Persistence.Pool : Contracts.PersistenceTestnet.Pool
    const vaultContract = HOST_CHAIN === ChainInfos.Persistence.chainID ?
        Contracts.Persistence.Vault : Contracts.PersistenceTestnet.Vault
    const USDCDenom = HOST_CHAIN === ChainInfos.Persistence.chainID ?
        Denoms.Persistence.USDC : Denoms.PersistenceTestnet.USDC
    const DYDXDenom = HOST_CHAIN === ChainInfos.Persistence.chainID ?
        Denoms.Persistence.DYDX : Denoms.PersistenceTestnet.DYDX
    const poolID = HOST_CHAIN === ChainInfos.Persistence.chainID ?
        DEX.Persistence.PoolID : DEX.PersistenceTestnet.PoolID

    let state = await QuerySmartContractState(
        chainInfo,
        poolContract,
        GenerateOnSwapRequest(USDCDenom, DYDXDenom, USDCBalance),
    )

    const minReceive = Math.round(state.trade_params.amount_out - (SLIPPAGE * state.trade_params.amount_out / 100))
    return await ExecuteContract(
        senderAddress,
        vaultContract,
        GenerateSwapMsg(minReceive.toString(), USDCBalance, USDCDenom, DYDXDenom, poolID),
        [{denom: USDCDenom, amount: USDCBalance}],
    )

}

async function QueryDYDXSwappedBalances() {
    const chainInfo = HOST_CHAIN === ChainInfos.Persistence.chainID ?
        ChainInfos.Persistence : ChainInfos.PersistenceTestnet
    const address = HOST_CHAIN === ChainInfos.Persistence.chainID ?
        Addresses.Persistence : Addresses.PersistenceTestnet
    const denom = HOST_CHAIN === ChainInfos.Persistence.chainID ?
        Denoms.Persistence.DYDX : Denoms.PersistenceTestnet.DYDX

    return await QueryAccountBalance(chainInfo, address, denom).then(balance => balance.balance)
}

async function MoveDYDXSwappedTokensToDydx(DYDXSwappedAmount) {
    const ibcInfo = HOST_CHAIN === ChainInfos.Persistence.chainID ?
        IBCInfos.Persistence.Dydx : IBCInfos.PersistenceTestnet.DydxTestnet
    const senderAddress = HOST_CHAIN === ChainInfos.Persistence.chainID ?
        Addresses.Persistence : Addresses.PersistenceTestnet
    const receiverAddress = HOST_CHAIN === ChainInfos.Persistence.chainID ?
        Addresses.DydxRewardsAddress : Addresses.DydxTestnetRewardsAddress

    return await IBCSend(senderAddress, receiverAddress, ibcInfo, DYDXSwappedAmount)
}

async function Swap() {
    // STEP 1
    // Query the USDC balance of the account controlled by the script in the dYdX chain. Then, move the whole amount to the
    // Persistence chain routing it via Noble using PFM.
    console.log("Querying USDC rewards balance on dYdX.")
    const USDCRewards = await QueryUSDCRewardBalances()
    if (USDCRewards.amount != 0) {
        console.log("Moving " + USDCRewards.amount + "uusdc.")
        const txHash = await MoveUSDCRewardsToPersistence(USDCRewards)
        console.log("Moved USDC rewards to Persistence. Tx Hash: " + txHash)
        await sleep(120000)
    } else {
        console.log("No USDC rewards to move.")
    }

    // STEP 2
    // Query the USDC balance of the account controlled by the script. This will count both the newly transferred balance +
    // any remains that might be in the account as a result of swap errors or just pure accumulation because of, i.e.
    // slippage. Then, swap the rewards via Dexter.
    console.log("Querying USDC rewards balance on Persistence.")
    const USDCBalance = await QueryUSDCBalanceOnPersistence()
    if (USDCBalance != 0) {
        console.log("Swapping " + USDCBalance + "uusdc.")
        const txHash = await SwapUSDCRewards(USDCBalance)
        console.log("Swapped USDC rewards. Tx Hash: " + txHash)
        await sleep(60000)
    } else {
        console.log("No USDC balance to swap.")
    }

    // STEP 3
    // Query the DYDX balance of the account after performing the swap and send the tokens back to the module rewards
    // address in the dYdX chain via IBC.
    console.log("Querying DYDX swapped balance on Persistence.")
    const DYDXBalance = await QueryDYDXSwappedBalances()
    if (DYDXBalance.amount != "0") {
        console.log("Sending " + DYDXBalance.amount + "adydx to the pStake ICA rewards address.")
        const txHash = await MoveDYDXSwappedTokensToDydx(DYDXBalance)
        console.log("Sent swapped DYDX to the dYdX chain. Tx Hash: " + txHash)
    } else {
        console.log("No DYDX balance to move.")
    }
}

async function SkipSwap() {
    // query the USDC rewards amount that the swapper account holds.
    console.log("Querying USDC rewards balance on dYdX.\n")
    const usdcRewardsAmount =  await QueryAccountBalance(ChainInfos.Dydx, Addresses.Dydx, Denoms.Dydx.USDC)
        .then(balance => balance.balance.amount)

    // if there is any reward to swap.
    if (usdcRewardsAmount != "0") {
        console.log("Found " + usdcRewardsAmount + "uusdc on dYdX.\n")

        const client = SkipClient()

        // create a route that sends the USDC to Osmosis and swaps it for DYDX.
        // the swapped DYDX stays in Osmosis as it will be separately moved to the protocol rewards address.
        // this is because Skip does not allow to pass more than one account for a given chain.
        const route = await client.route({
            amountIn: usdcRewardsAmount,
            sourceAssetDenom: Denoms.Dydx.USDC,
            sourceAssetChainID: ChainInfos.Dydx.chainID,
            destAssetDenom: Denoms.Osmosis.DYDX,
            destAssetChainID: ChainInfos.Osmosis.chainID,
            cumulativeAffiliateFeeBPS: "0",
        });

        console.log("Generated Route:\n")
        console.log(util.inspect(route, {showHidden: false, depth: null, colors: true}) + "\n")

        // execute the generated route.
        await client.executeRoute({
            route,
            userAddresses: {
                "dydx-mainnet-1": Addresses.Dydx.address,
                "noble-1": Addresses.Noble.address,
                "osmosis-1": Addresses.Osmosis.address,
            },
            // hook to handle the completed transaction result.
            onTransactionCompleted: async (chainID, hash, response) => {
                console.log("Route Execution Response:\n")
                console.log(util.inspect(response, {showHidden: false, depth: null, colors: true}) + "\n")

                // after swapping the rewards, query the Osmosis account for all its DYDX.
                const dydxSwappedBalance = await QueryAccountBalance(
                    ChainInfos.Osmosis,
                    Addresses.Osmosis,
                    Denoms.Osmosis.DYDX,
                ).then(balance => balance.balance)

                console.log("Sending " + dydxSwappedBalance.amount + "adydx to the dYdX rewards address.\n")

                // send an IBC transfer back to the dYdX ICA rewards account with all the swapped DYDX.
                const txHash = await IBCSend(
                    Addresses.Osmosis,
                    Addresses.DydxRewardsAddress,
                    IBCInfos.Osmosis.Dydx,
                    dydxSwappedBalance,
                )

                console.log("IBC Transfer transaction hash: " + txHash + "\n")
            },
        })
    } else {
        console.log("No USDC rewards to swap.\n")
    }
}

// entrypoint
if (TARGET_ENV === TARGET_ENV_MAINNET) {
    await SkipSwap()
} else if(TARGET_ENV === TARGET_ENV_TESTNET) {
    await Swap()
} else {
    console.log("Target environment not present or not correctly set.")
}
