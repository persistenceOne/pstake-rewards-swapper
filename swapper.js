import {Addresses, ChainInfos, Contracts, Denoms, HOST_CHAIN, IBCInfos} from "./constants.js";
import {QueryAccountBalance, QuerySmartContractState} from "./query.js";
import {ExecuteContract, IBCRoute, IBCSend} from "./tx.js";
import {GenerateOnSwapRequest, GenerateSwapMsg, sleep} from "./helper.js";

export const SLIPPAGE = 0.5
export const MAX_SPREAD = "0.02"
export const USDC_DYDX_POOL_ID = "5"

// STEP 1
// Query the USDC balance of the account controlled by the script in the dYdX chain. Then, move the whole amount to the
// Persistence chain routing it via Noble using PFM.
async function QueryUSDCRewardBalances() {
    switch (HOST_CHAIN) {
        case ChainInfos.Dydx.chainID:
            return await QueryAccountBalance(ChainInfos.Dydx, Addresses.Dydx, Denoms.Dydx.USDC)
                .then(balance => balance.balance.amount)
        case ChainInfos.DydxTestnet.chainID:
            return await QueryAccountBalance(ChainInfos.DydxTestnet, Addresses.DydxTestnet, Denoms.DydxTestnet.USDC)
                .then(balance => balance.balance.amount)
    }
}

async function MoveUSDCRewardsToPersistence(USDCBalance) {
    switch (HOST_CHAIN) {
        case ChainInfos.Dydx.chainID:
            return await IBCRoute(
                Addresses.Dydx,
                Addresses.Persistence,
                IBCInfos.Dydx.Noble,
                IBCInfos.Noble.Persistence,
                USDCBalance
            )
        case ChainInfos.DydxTestnet.chainID:
            return await IBCRoute(
                Addresses.DydxTestnet,
                Addresses.PersistenceTestnet,
                IBCInfos.DydxTestnet.NobleTestnet,
                IBCInfos.NobleTestnet.PersistenceTestnet,
                USDCBalance
            )
    }
}

// STEP 2
// Query the USDC balance of the account controlled by the script. This will count both the newly transferred balance +
// any remains that might be in the account as a result of swap errors or just pure accumulation because of, i.e.
// slippage. Then, swap the rewards via Dexter.

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

    let state = await QuerySmartContractState(
        chainInfo,
        poolContract,
        GenerateOnSwapRequest(USDCDenom, DYDXDenom, USDCBalance),
    )

    const minReceive = Math.round(state.trade_params.amount_out - (SLIPPAGE * state.trade_params.amount_out / 100))
    return await ExecuteContract(
        senderAddress,
        vaultContract,
        GenerateSwapMsg(minReceive.toString(), USDCBalance, USDCDenom, DYDXDenom),
        [{denom: USDCDenom, amount: USDCBalance}],
    )

}

// STEP 3
// Query the DYDX balance of the account after performing the swap and send the tokens back to the module rewards
// address in the dYdX chain via IBC.

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
        Addresses.Dydx : Addresses.DydxTestnet

    return await IBCSend(senderAddress, receiverAddress, ibcInfo, DYDXSwappedAmount)
}

async function Swap() {
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

    console.log("Querying DYDX swapped balance on Persistence.")
    const DYDXBalance = await QueryDYDXSwappedBalances()
    if (DYDXBalance != 0) {
        console.log("Sending " + DYDXBalance.amount + "adydx to the pStake ICA rewards address.")
        const txHash = await MoveDYDXSwappedTokensToDydx(DYDXBalance)
        console.log("Sent swapped DYDX to the dYdX chain. Tx Hash: " + txHash)
    } else {
        console.log("No DYDX balance to move.")
    }
}

// entrypoint
await Swap()
