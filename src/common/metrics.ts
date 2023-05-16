import { Address, BigDecimal, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { DailyActiveAccount, FinancialsDailySnapshot, LendingProtocol, Market, MarketDailySnapshot, Token, UsageMetricsDailySnapshot } from "../../generated/schema";
import { BIGDECIMAL_ZERO, BIGINT_ZERO } from "./constants";
import { getorCreateProtocol, getorCreateToken, getOrCreateUser, getProtocolIdFromCtx} from "./util";
import * as constant from "../common/constants"

export function getMarketSnapId(market:Market, event:ethereum.Event): string {
    let epochTime = (event.block.timestamp.toI64() / constant.SECONDS_PER_DAY).toString()
    let snapId = market.id.concat('-').concat(epochTime)
    return snapId
}

export function getProtocolSnapId(event:ethereum.Event): string {
    let epochTime = (event.block.timestamp.toI64() / constant.SECONDS_PER_DAY).toString()
    return epochTime
}

export function amountInUSD(tokenPrice: BigDecimal, amount: BigDecimal, decimals: number): BigDecimal {
    return tokenPrice.times(amount)
    .div(constant.BIGINT_TEN.pow(decimals as u8).toBigDecimal())
}


let rewardTokenEmissionsAmount: BigInt[] = []
let rewardTokenEmissionsUSD: BigDecimal[] = []
export function getOrCreateMarketDailySnapshot(market: Market, event: ethereum.Event): MarketDailySnapshot {
    const protocolId = getProtocolIdFromCtx()
    const protocol = getorCreateProtocol(protocolId)
    let snapId = getMarketSnapId(market, event)
    let dailySnapshot = MarketDailySnapshot.load(snapId)

    if (!dailySnapshot) {
        dailySnapshot = new MarketDailySnapshot(market.id)
        dailySnapshot.protocol = protocol.name
        dailySnapshot.market = market.id
        if (market.rewardTokens) {
            let rewardTokens = market.rewardTokens as string[]
            rewardTokenEmissionsAmount = []
            rewardTokenEmissionsUSD = []
            rewardTokens.forEach(() => {
                rewardTokenEmissionsAmount.push(BIGINT_ZERO)
                rewardTokenEmissionsUSD.push(BIGDECIMAL_ZERO)   
            });
            dailySnapshot.rewardTokenEmissionsAmount = rewardTokenEmissionsAmount
            dailySnapshot.rewardTokenEmissionsUSD = rewardTokenEmissionsUSD
        }
        dailySnapshot.totalValueLockedUSD = BIGDECIMAL_ZERO
        dailySnapshot.totalVolumeUSD = BIGDECIMAL_ZERO
        dailySnapshot.totalDepositUSD = BIGDECIMAL_ZERO
        dailySnapshot.totalBorrowUSD = BIGDECIMAL_ZERO
        dailySnapshot.inputTokenBalances = [BIGINT_ZERO]
        dailySnapshot.inputTokenPricesUSD = []
        dailySnapshot.outputTokenSupply = BIGINT_ZERO
        dailySnapshot.outputTokenPriceUSD = BIGDECIMAL_ZERO
        dailySnapshot.blockNumber = event.block.number
        dailySnapshot.timestamp = event.block.timestamp
        dailySnapshot.depositRate = BIGDECIMAL_ZERO
        dailySnapshot.stableBorrowRate = BIGDECIMAL_ZERO
        dailySnapshot.variableBorrowRate = BIGDECIMAL_ZERO
        dailySnapshot.save()
    }
    return dailySnapshot as MarketDailySnapshot
}

export function updateMarketDailySnapshots(
    market: Market, 
    event: ethereum.Event
    ): void {
    const dailySnapshot = getOrCreateMarketDailySnapshot(market, event)
    let token = getorCreateToken(Address.fromString(market.id))

    dailySnapshot.totalValueLockedUSD = amountInUSD(market.inputTokenPricesUSD[0], market.inputTokenBalances[0].toBigDecimal(), token.decimals)
    dailySnapshot.totalVolumeUSD = market.totalVolumeUSD
    dailySnapshot.totalDepositUSD = market.totalDepositUSD
    dailySnapshot.totalBorrowUSD = market.totalBorrowUSD
    dailySnapshot.inputTokenBalances = market.inputTokenBalances
    dailySnapshot.inputTokenPricesUSD = market.inputTokenPricesUSD
    dailySnapshot.outputTokenSupply = market.outputTokenSupply
    dailySnapshot.outputTokenPriceUSD = market.outputTokenPriceUSD
    dailySnapshot.blockNumber = event.block.number
    dailySnapshot.timestamp = event.block.timestamp
    dailySnapshot.depositRate = market.depositRate
    dailySnapshot.stableBorrowRate = market.stableBorrowRate
    dailySnapshot.variableBorrowRate = market.variableBorrowRate
    dailySnapshot.save()
}

export function updateTVL(
    market: Market, 
    protocol: LendingProtocol,
    token: Token,
    amount: BigInt,
    toSubract: bool
    ): void {
        let newMarketTVL =  market.inputTokenBalances[0]
        if (!toSubract) {
            newMarketTVL = newMarketTVL.plus(amount)
        }
        else {
            newMarketTVL = newMarketTVL.minus(amount)
        }
        protocol.totalValueLockedUSD = protocol.totalValueLockedUSD.minus(market.totalValueLockedUSD)
        market.totalValueLockedUSD = amountInUSD(market.inputTokenPricesUSD[0], newMarketTVL.toBigDecimal(), token.decimals) 
        market.totalDepositUSD = market.totalValueLockedUSD
        market.save()

        protocol.totalValueLockedUSD = protocol.totalValueLockedUSD.plus(market.totalValueLockedUSD)
        protocol.totalDepositUSD = protocol.totalValueLockedUSD
        protocol.save()
}

export function getOrCreateDailyUsageMetrics(
    market: Market, 
    event: ethereum.Event
    ): UsageMetricsDailySnapshot {
        let snapId = getProtocolSnapId(event)
        const protocolId = getProtocolIdFromCtx()
        let protocol = getorCreateProtocol(protocolId)
        let dailyUsageMetrics = UsageMetricsDailySnapshot.load(snapId)
        if (!dailyUsageMetrics) {
            dailyUsageMetrics = new UsageMetricsDailySnapshot(snapId)
            dailyUsageMetrics.protocol = protocol.id
            dailyUsageMetrics.activeUsers = 0
            dailyUsageMetrics.totalUniqueUsers = 0
            dailyUsageMetrics.dailyTransactionCount = 0
            dailyUsageMetrics.blockNumber = event.block.number
            dailyUsageMetrics.timestamp = event.block.timestamp
            dailyUsageMetrics.save()
        }

        return dailyUsageMetrics as UsageMetricsDailySnapshot
    }


export function updateDailyUsageMetrics(
    market: Market,
    event: ethereum.Event
): void {
    const protocolId = getProtocolIdFromCtx()
    let protocol = getorCreateProtocol(protocolId)
    const dailyUsageMetrics = getOrCreateDailyUsageMetrics(market, event)
    let userAddr = event.transaction.from
    getOrCreateUser(userAddr)

    let dailyActiveUserId = (event.block.timestamp.toI64() 
    / constant.SECONDS_PER_DAY).toString()
    .concat('-')
    .concat(userAddr.toHexString())
    let dailyActiveUser = DailyActiveAccount.load(dailyActiveUserId)
    if(! dailyActiveUser) {
        dailyActiveUser = new DailyActiveAccount(dailyActiveUserId)
        dailyActiveUser.save()

        dailyUsageMetrics.activeUsers += 1
    }

    dailyUsageMetrics.totalUniqueUsers = protocol.totalUniqueUsers
    dailyUsageMetrics.dailyTransactionCount += 1
    dailyUsageMetrics.save()
}


export function updateFinancials(event: ethereum.Event): FinancialsDailySnapshot {
    let epochTime = getProtocolSnapId(event)
    const protocolId = getProtocolIdFromCtx()
    let protocol = getorCreateProtocol(protocolId)
    let financialsDailySnapshot = FinancialsDailySnapshot.load(epochTime)
    if (!financialsDailySnapshot) {
        financialsDailySnapshot = new FinancialsDailySnapshot(epochTime)
        financialsDailySnapshot.protocol = protocol.id
        financialsDailySnapshot.totalVolumeUSD = BIGDECIMAL_ZERO
    }
    financialsDailySnapshot.totalValueLockedUSD = protocol.totalValueLockedUSD
    financialsDailySnapshot.protocolControlledValueUSD = protocol.protocolSideRevenueUSD
    financialsDailySnapshot.totalRevenueUSD = protocol.totalRevenueUSD
    financialsDailySnapshot.totalDepositUSD = protocol.totalDepositUSD
    financialsDailySnapshot.totalBorrowUSD = protocol.totalBorrowUSD
    financialsDailySnapshot.supplySideRevenueUSD = protocol.supplySideRevenueUSD
    financialsDailySnapshot.protocolSideRevenueUSD = protocol.protocolSideRevenueUSD
    financialsDailySnapshot.blockNumber = event.block.number
    financialsDailySnapshot.timestamp = event.block.timestamp
    financialsDailySnapshot.save()

    return financialsDailySnapshot
}


