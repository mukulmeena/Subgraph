import { Address, BigDecimal, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Deposit, LendingProtocol, Market, Token, Withdraw } from "../../generated/schema";
import { amountInUSD, getProtocolSnapId } from "../common/metrics";
import { getProtocolIdFromCtx } from "../common/util";

export function withdraw(
    to: Address,
    asset: Token,
    market: Market,
    amount: BigInt,
    protocol: LendingProtocol,
    event: ethereum.Event
): Withdraw {

    const withdrawId = event.transaction.hash.toHexString()
    .concat('-')
    .concat(event.logIndex.toString())
    let amountUSD = amountInUSD(market.inputTokenPricesUSD[0], amount.toBigDecimal(), asset.decimals)

    let withdrawTransaction = Withdraw.load(withdrawId)
    if (!withdrawTransaction) {
        withdrawTransaction = new Withdraw(withdrawId)
        withdrawTransaction.hash = event.transaction.hash.toHexString()
        withdrawTransaction.logIndex = event.logIndex.toI32()
        withdrawTransaction.protocol = protocol.id
        withdrawTransaction.from = market.id
        withdrawTransaction.to = to.toHexString()
        withdrawTransaction.blockNumber = event.block.number
        withdrawTransaction.timestamp = event.block.timestamp
        withdrawTransaction.asset = asset.id
        withdrawTransaction.amount = amount
        withdrawTransaction.amountUSD = amountUSD
        withdrawTransaction.market = market.id
        withdrawTransaction.snapshotId = getProtocolSnapId(event)
        withdrawTransaction.save()
    }

    return withdrawTransaction as Withdraw
}