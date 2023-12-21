import {RpcClient} from "./helper.js";
import {QueryClientImpl as BankQueryClient} from "persistenceonejs/cosmos/bank/v1beta1/query.js"
import {QueryClientImpl as WasmQueryClient} from "persistenceonejs/cosmwasm/wasm/v1/query.js"

export async function QueryAccountBalance(chainInfo, address, denom) {
    const [_, rpcClient] = await RpcClient(chainInfo)
    const bankClient = new BankQueryClient(rpcClient)

    return await bankClient.Balance({address: address.address, denom: denom})
}

export async function QuerySmartContractState(chainInfo, contractAddress, data) {
    const [_, rpcClient] = await RpcClient(chainInfo)
    const wasmClient = new WasmQueryClient(rpcClient)

    const request = {address: contractAddress, queryData: new TextEncoder().encode(JSON.stringify(data))}

    const resp = await wasmClient.SmartContractState(request)
    return JSON.parse(new TextDecoder("utf-8").decode(resp.data))
}
