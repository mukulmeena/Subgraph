import { BigDecimal, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Borrow, LendingProtocol, Market, Token } from "../../generated/schema";
import { amountInUSD, getProtocolSnapId } from "../common/metrics";

export function borrow(
    market: Market,
    asset: Token,
    protocol: LendingProtocol,
    event: ethereum.Event,
    amount: BigInt
): Borrow {
    let borrowId = event.transaction.hash.toHexString()
    .concat('-')
    .concat(event.logIndex.toString())
    let amountUSD = amountInUSD(market.inputTokenPricesUSD[0], amount.toBigDecimal(), asset.decimals)
    let borrowTransaction = Borrow.load(borrowId)

    if (!borrowTransaction) {
        borrowTransaction = new Borrow(borrowId)
        borrowTransaction.hash = event.transaction.hash.toHexString()
        borrowTransaction.logIndex =  event.logIndex.toI32()
        borrowTransaction.protocol = protocol.id
        borrowTransaction.to = event.transaction.from.toHexString()
        borrowTransaction.from = market.id
        borrowTransaction.market = market.id
        borrowTransaction.asset = asset.id
        borrowTransaction.amount = amount
        borrowTransaction.amountUSD = amountUSD
        borrowTransaction.snapshotId = getProtocolSnapId(event)
        borrowTransaction.blockNumber = event.block.number
        borrowTransaction.timestamp = event.block.timestamp
        borrowTransaction.save()
    }

    return borrowTransaction as Borrow
}