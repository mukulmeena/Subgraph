import { Market, MarketDailySnapshot } from "../../generated/schema"
import { AToken } from "../../generated/templates/AToken/AToken"
import { Mint, Burn } from "../../generated/templates/AToken/AToken"
import { getMarketSnapId, getOrCreateDailyUsageMetrics, getProtocolSnapId, updateDailyUsageMetrics } from "../common/metrics"
import { getorCreateToken } from "../common/util"
import { log } from "@graphprotocol/graph-ts"

export function handleATokenMint(event: Mint): void {
    const outputTokenAddr = event.address
    const outputTokenContract = AToken.bind(outputTokenAddr)
    let outputTokenSupply = outputTokenContract.try_totalSupply()
    if (!outputTokenSupply.reverted) {
        let marketId = ""
        const Atoken = getorCreateToken(outputTokenAddr)
        if (Atoken.underlyingAsset != '') {
            marketId = Atoken.underlyingAsset
        }
        else {
            marketId = outputTokenContract.UNDERLYING_ASSET_ADDRESS().toHexString()
        }
        const market = Market.load(marketId)
        if (!market){
            return 
        }
        market.outputTokenSupply = outputTokenSupply.value
        market.save()

        const snapId = getMarketSnapId(market, event)
        const snap = MarketDailySnapshot.load(snapId)
        if (!snap) {
            return
        }
        snap.outputTokenSupply = outputTokenSupply.value
        snap.save()
    }
    else {
        log.error("OUTPUT TOKEN CALL REVERTED" + outputTokenAddr.toHexString(), [])
    }
}
export function handleATokenBurn(event: Burn): void {
    const outputTokenAddr = event.address
    const outputTokenContract = AToken.bind(outputTokenAddr)
    let outputTokenSupply = outputTokenContract.try_totalSupply()
    if (!outputTokenSupply.reverted) {
        let marketId = ""
        const Atoken = getorCreateToken(outputTokenAddr)
        if (Atoken.underlyingAsset != '') {
            marketId = Atoken.underlyingAsset
        }
        else {
            marketId = outputTokenContract.UNDERLYING_ASSET_ADDRESS().toHexString()
        }
        const market = Market.load(marketId)
        if (!market){
            return 
        }
        market.outputTokenSupply = outputTokenSupply.value
        market.save()

        const snapId = getMarketSnapId(market, event)
        const snap = MarketDailySnapshot.load(snapId)
        if (!snap) {
            return
        }
        snap.outputTokenSupply = outputTokenSupply.value
        snap.save()
    }
    else {
        log.error("OUTPUT TOKEN CALL REVERTED" + outputTokenAddr.toHexString(), [])
    }
}
