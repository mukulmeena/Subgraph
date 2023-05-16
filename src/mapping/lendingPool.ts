import { log } from "@graphprotocol/graph-ts";

import {
   Deposit as depositEvent,
   Withdraw as withdrawEvent,
   Borrow as borrowEvent,
   Repay,
   ReserveDataUpdated,
   ReserveUsedAsCollateralEnabled,
   ReserveUsedAsCollateralDisabled
} from "../../generated/templates/lendingPool/LendingPool";

import {
   getorCreateProtocol,
   getorCreateToken,
   getOrCreateMarket,
   getProtocolIdFromCtx,
   calculateRevenues
} from "../common/util";

import {
   updateTVL,
   updateDailyUsageMetrics,
   updateMarketDailySnapshots,
   updateFinancials,
   amountInUSD
} from "../common/metrics"

import { Market, Token } from "../../generated/schema"
import { deposit } from "../module/deposit"
import { borrow } from "../module/borrow";
import { withdraw } from "../module/withdraw";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { BIGINT_ZERO } from "../common/constants";
import { repay } from "../module/repay";

export function getTokenBalanceIndex(token: Token, market: Market): i32 {
   let tokenBalanceIndex = market.inputTokens.indexOf(token.id)
   if (tokenBalanceIndex < 0) {
      token = getorCreateToken(Address.fromString(token.id))
      tokenBalanceIndex = market.inputTokens.length
      market.inputTokens.push(token.id)
      market.inputTokenBalances.push(BIGINT_ZERO)
      market.save()
   }
   return <i32>tokenBalanceIndex

}

export function updateTokenBalanceArray(index: i32, newbal: BigInt, market: Market): BigInt[] {
   let newArr: BigInt[] = []
   for(let i = 0; i < market.inputTokenBalances.length; i++) {
      if (i == <i32>index) {
         newArr.push(newbal)
      }
      else{
         newArr.push(market.inputTokenBalances[i])
      }
   }
   return newArr
}


export function handleDeposit(event: depositEvent): void {
   const mrktAdd = event.params.reserve
   const from = event.params.user
   const amount = event.params.amount

   const protocolId = getProtocolIdFromCtx()
   const protocol = getorCreateProtocol(protocolId)
   const inputToken = getorCreateToken(mrktAdd)
   const market = getOrCreateMarket(mrktAdd.toHexString(), event)
   
   let Deposit = deposit(from, inputToken, market, amount, protocol, event)

   log.info("DEPOSITED: " + amount.toString() + ", TOKEN NAME: " + inputToken.name + ", IN USD: " + Deposit.amountUSD.toString(), [])

   let tokenBalanceIndex = getTokenBalanceIndex(inputToken, market)
   let newBal = market.inputTokenBalances[<i32>tokenBalanceIndex].plus(amount)
   market.inputTokenBalances = updateTokenBalanceArray(tokenBalanceIndex, newBal, market)
   market.save()

   updateTVL(market, protocol, inputToken, amount, false)
   

   updateMarketDailySnapshots(market, event)
   updateDailyUsageMetrics(market, event)
   updateFinancials(event)
}

export function handleWithdraw(event: withdrawEvent): void {
   const mrktAdd = event.params.reserve
   const from = event.params.user
   const amount = event.params.amount
   
   const protocolId = getProtocolIdFromCtx()
   const protocol = getorCreateProtocol(protocolId)
   const inputToken = getorCreateToken(mrktAdd)
   const market = getOrCreateMarket(mrktAdd.toHexString(), event)

   let Withdraw = withdraw(from, inputToken, market, amount, protocol, event)
   log.info("WITHDRAW: " + amount.toString() + ", TOKEN NAME: " + inputToken.name +  ", IN USD: " + Withdraw.amountUSD.toString(), [])

   let tokenBalanceIndex = getTokenBalanceIndex(inputToken, market)
   let newBal = market.inputTokenBalances[<i32>tokenBalanceIndex].minus(amount)
   market.inputTokenBalances = updateTokenBalanceArray(tokenBalanceIndex, newBal, market)

   updateTVL(market, protocol, inputToken, amount, true)
   market.save()

   updateMarketDailySnapshots(market, event)
   updateDailyUsageMetrics(market, event)
   updateFinancials(event)
}


export function handleBorrow(event: borrowEvent): void {
   const mrktAddr = event.params.reserve
   const from = event.params.user
   const amount = event.params.amount

   let protocolId = getProtocolIdFromCtx()
   const protocol = getorCreateProtocol(protocolId)
   const token = getorCreateToken(mrktAddr)
   const market = getOrCreateMarket(mrktAddr.toHexString(), event)
   
   let Borrow = borrow(market, token, protocol, event, amount)
   log.info("BORROW: " + amount.toString() + ", TOKEN NAME: " + token.name + ", IN USD: " + Borrow.amountUSD.toString(), [])

   let tokenBalanceIndex = getTokenBalanceIndex(token, market)
   let newBal = market.inputTokenBalances[<i32>tokenBalanceIndex].minus(amount)
   market.inputTokenBalances = updateTokenBalanceArray(tokenBalanceIndex, newBal, market)

   updateTVL(market, protocol, token, amount, true)
   calculateRevenues(token, market)
   market.totalVolumeUSD = market.totalVolumeUSD.plus(Borrow.amountUSD);
   market.save();

   updateMarketDailySnapshots(market, event);
   updateDailyUsageMetrics(market, event);
   const financial = updateFinancials(event);
   financial.totalVolumeUSD = financial.totalVolumeUSD.plus(Borrow.amountUSD)
   financial.save();

}

export function handleRepay(event: Repay): void {
   const mrktAddr = event.params.reserve
   const from = event.params.user
   const amount = event.params.amount

   let protocolId = getProtocolIdFromCtx()
   const protocol = getorCreateProtocol(protocolId)
   const token = getorCreateToken(mrktAddr)
   const market = getOrCreateMarket(mrktAddr.toHexString(), event)
   
   let Repay = repay(market, token, protocol, event, amount)

   log.info("REPAYED: " + amount.toString() + ", TOKEN NAME: " + token.name + ", IN USD: " + Repay.amountUSD.toString(), [])


   let tokenBalanceIndex = getTokenBalanceIndex(token, market)
   let newBal = market.inputTokenBalances[<i32>tokenBalanceIndex].plus(amount)
   market.inputTokenBalances = updateTokenBalanceArray(tokenBalanceIndex, newBal, market)
   market.save()

   updateTVL(market, protocol, token, amount, false)
   calculateRevenues(token, market)

   updateMarketDailySnapshots(market, event);
   updateDailyUsageMetrics(market, event);
}

export function handleReserveDataUpdated(event: ReserveDataUpdated): void {
   const market = getOrCreateMarket(event.params.reserve.toHexString(), event)
   market.stableBorrowRate = event.params.stableBorrowRate.toBigDecimal()
   market.variableBorrowRate = event.params.variableBorrowRate.toBigDecimal()
   market.depositRate = event.params.liquidityRate.toBigDecimal()
   market.save()
}

export function handleReserveUsedAsCollateralEnabled(event: ReserveUsedAsCollateralEnabled): void {
   const market = getOrCreateMarket(event.params.reserve.toHexString(), event)
   market.canUseAsCollateral = true
   market.save()
}

export function handleReserveUsedAsCollateralDisabled(event: ReserveUsedAsCollateralDisabled): void {
   const market = getOrCreateMarket(event.params.reserve.toHexString(), event)
   market.canUseAsCollateral = false
   market.save()
}