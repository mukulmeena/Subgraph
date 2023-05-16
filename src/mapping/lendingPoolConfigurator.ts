import { Address, dataSource } from "@graphprotocol/graph-ts"

import { 
    BorrowingEnabledOnReserve, 
    CollateralConfigurationChanged, 
    ReserveInitialized,
    BorrowingDisabledOnReserve, 
    ReserveActivated,
    ReserveDeactivated, 
    ReserveFactorChanged} from "../../generated/templates/LendingPoolConfigurator/LendingPoolConfigurator"

import { 
    BIGDECIMAL_HUNDRED, 
    BIGDECIMAL_THOUSAND, 
    BIGDECIMAL_ZERO } from "../common/constants"
        
import { getOrCreateMarket, getorCreateToken } from "../common/util"
import { AToken } from "../../generated/templates"
        

export function handleReserveInitialized(event: ReserveInitialized): void {
    const market = getOrCreateMarket(event.params.asset.toHexString(), event)
    AToken.create(event.params.aToken)
    market.outputToken = getorCreateToken(event.params.aToken, event.params.asset.toHexString()).id
    market.sToken = getorCreateToken(event.params.stableDebtToken, event.params.asset.toHexString()).id
    market.vToken = getorCreateToken(event.params.variableDebtToken, event.params.asset.toHexString()).id
    market.save()
}

export function handleCollateralConfigurationChanged(event: CollateralConfigurationChanged): void {
    const market = getOrCreateMarket(event.params.asset.toHexString(), event)
    market.liquidationThreshold = event.params.liquidationThreshold.toBigDecimal()
    market.maximumLTV = event.params.ltv.toBigDecimal()
    let liquidationPenalty = event.params.liquidationBonus.toBigDecimal()
    if (liquidationPenalty.gt(BIGDECIMAL_ZERO)) {
        market.liquidationPenalty = (liquidationPenalty.minus(BIGDECIMAL_THOUSAND)).div(BIGDECIMAL_HUNDRED)
    }
    else {
        market.liquidationPenalty = BIGDECIMAL_ZERO
    }
    market.save()
}

export function handleBorrowingEnabledOnReserve(event: BorrowingEnabledOnReserve): void {
    const market = getOrCreateMarket(event.params.asset.toHexString(), event)
    market.canBorrowFrom = true
    market.save()
}

export function handleBorrowingDisabledOnReserve(event: BorrowingDisabledOnReserve): void {
    const market = getOrCreateMarket(event.params.asset.toHexString(), event)
    market.canBorrowFrom = false
    market.save()
}

export function handleReserveActivated(event: ReserveActivated): void {
    const market = getOrCreateMarket(event.params.asset.toHexString(), event)
    market.isActive = true
    market.save()
}

export function handleReserveDeactivated(event: ReserveDeactivated): void {
    const market = getOrCreateMarket(event.params.asset.toHexString(), event)
    market.isActive = false
    market.save()
}

export function handleReserveFactorChanged(event: ReserveFactorChanged): void {
    const market = getOrCreateMarket(event.params.asset.toHexString(), event)
    market.reserveFactor = event.params.factor
    market.save()
}
