import { Address, BigDecimal, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Deposit, LendingProtocol, Market, Token } from "../../generated/schema";
import { amountInUSD, getProtocolSnapId } from "../common/metrics";

export function deposit(
    from: Address,
    asset: Token,
    market: Market,
    amount: BigInt,
    protocol: LendingProtocol,
    event: ethereum.Event
): Deposit {

    const depositId = event.transaction.hash.toHexString()
    .concat('-')
    .concat(event.logIndex.toString())
    let amountUSD = amountInUSD(market.inputTokenPricesUSD[0], amount.toBigDecimal(), asset.decimals)

    let depositTransaction = Deposit.load(depositId)
    if (!depositTransaction) {
        depositTransaction = new Deposit(depositId)
        depositTransaction.hash = event.transaction.hash.toHexString()
        depositTransaction.logIndex = event.logIndex.toI32()
        depositTransaction.protocol = protocol.id
        depositTransaction.to = market.id
        depositTransaction.from = from.toHexString()
        depositTransaction.blockNumber = event.block.number
        depositTransaction.timestamp = event.block.timestamp
        depositTransaction.asset = asset.id
        depositTransaction.amount = amount
        depositTransaction.amountUSD = amountUSD
        depositTransaction.market = market.id
        depositTransaction.snapshotId = getProtocolSnapId(event)
        depositTransaction.save()
    }

    return depositTransaction as Deposit
}