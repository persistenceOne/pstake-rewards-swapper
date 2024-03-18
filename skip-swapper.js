import {Addresses, ChainInfos, Denoms} from "./constants.js";
import {QueryAccountBalance} from "./query.js";
import {SkipClient} from "./helper.js";
import * as util from "util";

async function SkipSwap() {
    console.log("Querying USDC rewards balance on dYdX.\n")

    const usdcRewardsAmount =  await QueryAccountBalance(ChainInfos.Dydx, Addresses.Dydx, Denoms.Dydx.USDC)
        .then(balance => balance.balance.amount)

    if (usdcRewardsAmount != "0") {
        const client = SkipClient()

        const route = await client.route({
            amountIn: usdcRewardsAmount,
            sourceAssetDenom: Denoms.Dydx.USDC,
            sourceAssetChainID: ChainInfos.Dydx.chainID,
            destAssetDenom: ChainInfos.Dydx.feeDenom,
            destAssetChainID: ChainInfos.Dydx.chainID,
            cumulativeAffiliateFeeBPS: "0",
        });

        console.log("ROUTE\n")
        console.log("-------------------------------------------------------------------------------------------------\n")
        console.log(util.inspect(response, {showHidden: false, depth: null, colors: true}))
        console.log("\n")
        console.log("-------------------------------------------------------------------------------------------------\n")

        await client.executeRoute({
            route,
            userAddresses: {
                "dydx-mainnet-1": Addresses.Dydx.address,
                "noble-1": Addresses.Noble.address,
                "osmosis-1": Addresses.Osmosis.address,
            },
            onTransactionCompleted: async (chainID, hash, response) => {
                console.log("Transaction Hash: " + hash + "\n");
                console.log("-------------------------------------------------------------------------------------------------\n")
                console.log(util.inspect(response, {showHidden: false, depth: null, colors: true}))
                console.log("\n")
                console.log("-------------------------------------------------------------------------------------------------\n")
            },
        })
    } else {
        console.log("No USDC rewards to swap.\n")
    }
}

await SkipSwap()
