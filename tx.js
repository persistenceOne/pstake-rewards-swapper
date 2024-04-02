import {CreateSigningClientFromAddress} from "./helper.js";
import {assertIsDeliverTxSuccess} from "@cosmjs/stargate";
import { MsgTransfer } from "cosmjs-types/ibc/applications/transfer/v1/tx.js";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx.js";

export async function IBCRoute(senderAddress, receiverAddress, senderIBCInfo, forwardIBCInfo, coin) {
    let memo = "{\"forward\":{\"receiver\":\"" + receiverAddress.address + "\",\"port\":\"" + forwardIBCInfo.port + "\"," +
        "\"channel\":\"" + forwardIBCInfo.channelId + "\",\"timeout\":\"1m\",\"retries\":2}}"

    const msgIBCTransfer = {
        typeUrl: "/ibc.applications.transfer.v1.MsgTransfer", value: MsgTransfer.fromPartial({
            sourcePort: senderIBCInfo.port,
            sourceChannel: senderIBCInfo.channelId,
            token: coin,
            sender: senderAddress.address,
            receiver: receiverAddress.address,
            timeoutTimestamp: (Date.now() + 60 * 1000) * 1e6,
            memo: memo
        })
    }
    //console.log("MsgTransfer: ", JSON.stringify(msgIBCTransfer))

    return await SendTx(senderAddress, [msgIBCTransfer], 1.5, "")
}

export async function IBCSend(senderAddress, receiverAddress, senderIBCInfo, coin) {
    const msgIBCTransfer = {
        typeUrl: "/ibc.applications.transfer.v1.MsgTransfer", value: MsgTransfer.fromPartial({
            sourcePort: senderIBCInfo.port,
            sourceChannel: senderIBCInfo.channelId,
            token: coin,
            sender: senderAddress.address,
            receiver: receiverAddress.address,
            timeoutTimestamp: (Date.now() + 60 * 1000) * 1e6,
            memo: ""
        })
    }

    return await SendTx(senderAddress, [msgIBCTransfer], 1.5, "")
}

export async function ExecuteContract(senderAddress, contractAddress, msg, funds) {
    const msgExecuteContract = {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract", value: MsgExecuteContract.fromPartial({
            sender: senderAddress.address,
            contract: contractAddress,
            msg: new TextEncoder().encode(JSON.stringify(msg)),
            funds: funds,
            memo: ""
        })
    }

    return await SendTx(senderAddress, [msgExecuteContract], 1.5, "")
}

async function SendTx(senderAddress, msgs, fee, memo) {
    const signingPersistenceClient = await CreateSigningClientFromAddress(senderAddress)
    const response = await signingPersistenceClient.signAndBroadcast(senderAddress.address, msgs, fee, memo)

    assertIsDeliverTxSuccess(response)

    return response.transactionHash
}
