import { BigDecimal, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Repay, LendingProtocol, Market, Token } from "../../generated/schema";
import { amountInUSD, getProtocolSnapId } from "../common/metrics";

export function repay(
    market: Market,
    asset: Token,
    protocol: LendingProtocol,
    event: ethereum.Event,
    amount: BigInt
): Repay {
    let repayId = event.transaction.hash.toHexString()
    .concat('-')
    .concat(event.logIndex.toString())
    let repayTransaction = Repay.load(repayId)
    let amountUSD = amountInUSD(market.inputTokenPricesUSD[0], amount.toBigDecimal(), asset.decimals)

    if (!repayTransaction) {
        repayTransaction = new Repay(repayId)
        repayTransaction.hash = event.transaction.hash.toHexString()
        repayTransaction.logIndex =  event.logIndex.toI32()
        repayTransaction.protocol = protocol.id
        repayTransaction.to = market.id
        repayTransaction.from = event.transaction.from.toHexString()
        repayTransaction.market = market.id
        repayTransaction.asset = asset.id
        repayTransaction.amount = amount
        repayTransaction.amountUSD = amountUSD
        repayTransaction.snapshotId = getProtocolSnapId(event)
        repayTransaction.blockNumber = event.block.number
        repayTransaction.timestamp = event.block.timestamp
        repayTransaction.save()
    }

    return repayTransaction as Repay
}