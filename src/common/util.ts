import {
    Address,
    BigDecimal,
    BigInt,
    bigInt,
    dataSource,
    ethereum,
    log
} from "@graphprotocol/graph-ts";

import {
    Account,
    LendingProtocol,
    Market,
    RewardToken,
    Token
} from "../../generated/schema"

import * as constant from "../common/constants"
import { ERC20 } from "../../generated/templates/lendingPool/ERC20"
import { StableDebtToken as SToken } from '../../generated/templates/LendingPool/StableDebtToken';
import { VariableDebtToken as VToken } from '../../generated/templates/LendingPool/VariableDebtToken';
import { LendingPool, LendingPool as lendingPoolContract } from "../../generated/templates/lendingPool/LendingPool";
import { AToken } from "../../generated/templates/lendingPool/AToken";
import { AaveIncentivesController } from "../../generated/templates/lendingPool/AaveIncentivesController";
import { getUsdPricePerToken } from "../Prices";
import { BIGINT_ZERO } from "../Prices/common/constants";
import { amountInUSD } from "./metrics";

export function getorCreateProtocol(protocolID: string): LendingProtocol {
    let protocol = LendingProtocol.load(protocolID)
    if (!protocol) {
        protocol = new LendingProtocol(protocolID)
        protocol.name = constant.PROTOCOL_NAME
        protocol.slug = constant.PROTOCOL_SLUG
        protocol.schemaVersion = constant.SCHEMA_VERSION
        protocol.subgraphVersion = constant.SUBGRAPH_VERSION
        protocol.methodologyVersion = constant.METHODOLOGY_VERSION
        protocol.network = constant.Network.MAINNET
        protocol.type = constant.ProtocolType.LENDING
        protocol.protocolPriceOracle = constant.PRICE_ORACLE
        protocol.totalUniqueUsers = 0
        protocol.totalRevenueUSD = constant.BIGDECIMAL_ZERO
        protocol.totalValueLockedUSD = constant.BIGDECIMAL_ZERO
        protocol.protocolSideRevenueUSD = constant.BIGDECIMAL_ZERO
        protocol.supplySideRevenueUSD = constant.BIGDECIMAL_ZERO
        protocol.totalVolumeUSD = constant.BIGDECIMAL_ZERO
        protocol.totalDepositUSD = constant.BIGDECIMAL_ZERO
        protocol.totalBorrowUSD = constant.BIGDECIMAL_ZERO
        protocol.lendingType = constant.LENDING_TYPE
        protocol.riskType = constant.RISK_TYPE
        protocol.save()
    }

    return protocol
}

export function getorCreateToken(address: Address, underlyingAsset: string = ''): Token {
    const tokenId = address.toHexString()
    let token = Token.load(tokenId)
    if (!token) {
        token = new Token(tokenId)
        if (address == Address.fromString("0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2")) {
            token.name = "Maker"
            token.symbol = "MKR"
            token.decimals = 18
            token.underlyingAsset = underlyingAsset
            token.save()
        }
        else {
            let ERC20Contract = ERC20.bind(address)
            token.name = ERC20Contract.try_name().value
            token.symbol = ERC20Contract.try_symbol().value
            token.decimals = ERC20Contract.try_decimals().value
            token.underlyingAsset = underlyingAsset
            token.save()
        }
    }
    return token
}

export function getProtocolIdFromCtx(): string {
    const context = dataSource.context();
    return context.getString('protocolId');
}

export function getLendingPoolIdFromCtx(): string {
    const context = dataSource.context()
    return context.getString('lendingPool')
}

export function getOrCreateMarket(mrktId: string, event: ethereum.Event): Market {
    let market = Market.load(mrktId)
    const token = getorCreateToken(Address.fromString(mrktId))
    if (!market) {
        const lendingPoolId = getLendingPoolIdFromCtx()
        const lendingPool = lendingPoolContract.bind(Address.fromString(lendingPoolId))
        const protocolId = getProtocolIdFromCtx()
        const protocol = getorCreateProtocol(protocolId)
        let inputTokens = [token.id]
        let inputTokenBalances = [constant.BIGINT_ZERO]

        market = new Market(mrktId)
        market.name = token.name
        market.protocol = protocol.name
        market.stableBorrowRate = constant.BIGDECIMAL_ZERO;
        market.totalValueLockedUSD = constant.BIGDECIMAL_ZERO
        market.variableBorrowRate = constant.BIGDECIMAL_ZERO;
        market.totalStableValueLocked = constant.BIGINT_ZERO;
        market.totalVariableValueLocked = constant.BIGINT_ZERO;
        market.protocolSideRevenueUSD = constant.BIGDECIMAL_ZERO;
        market.supplySideRevenueUSD = constant.BIGDECIMAL_ZERO;
        market.reserveFactor = constant.BIGINT_ZERO;
        market.outputToken = constant.ZERO_ADDRESS_STRING;
        market.inputTokens = inputTokens;
        market.inputTokenBalances = inputTokenBalances;
        market.sToken = constant.ZERO_ADDRESS_STRING;
        market.vToken = constant.ZERO_ADDRESS_STRING;
        market.rewardTokens = [];
        market.rewardTokenEmissionsAmount = [];
        market.rewardTokenEmissionsUSD = [];
        market.createdBlockNumber = event.block.number;
        market.createdTimestamp = event.block.timestamp;
        market.isActive = false;
        market.canBorrowFrom = false;
        market.canUseAsCollateral = false;
        market.maximumLTV = constant.BIGDECIMAL_ZERO;
        market.liquidationPenalty = constant.BIGDECIMAL_ZERO;
        market.liquidationThreshold = constant.BIGDECIMAL_ZERO;
        market.depositRate = constant.BIGDECIMAL_ZERO;
        market.totalDepositUSD = constant.BIGDECIMAL_ZERO
        market.totalBorrowUSD = constant.BIGDECIMAL_ZERO
        market.totalRevenueUSD = constant.BIGDECIMAL_ZERO;
        market.totalVolumeUSD = constant.BIGDECIMAL_ZERO;
        market.outputTokenSupply = constant.BIGINT_ZERO;
        let tryReserve = lendingPool.try_getReserveData(Address.fromString(mrktId))
        if (!tryReserve.reverted) {
            market.stableBorrowRate = tryReserve.value.currentStableBorrowRate.toBigDecimal()
            market.variableBorrowRate = tryReserve.value.currentVariableBorrowRate.toBigDecimal()
        }
        else {
            log.error("FAILED TO GET RESERVE", [])
        }
        if (event.block.number.gt(BigInt.fromString('12317479'))) {
            let rewardTokens = market.rewardTokens
            if (rewardTokens == null) rewardTokens = []
            if (rewardTokens.length == 0) {
                var rewardtokenFromIncContrl = Address.fromString(constant.REWARD_TOKEN)
                const depositRewardToken = loadRewardToken(rewardtokenFromIncContrl, constant.RewardTokenType.DEPOSIT)
                const borrowRewardToken = loadRewardToken(rewardtokenFromIncContrl, constant.RewardTokenType.BORROW)
                market.rewardTokens = [depositRewardToken.id, borrowRewardToken.id]
                market.rewardTokenEmissionsAmount = [constant.BIGINT_ZERO, constant.BIGINT_ZERO]
                market.rewardTokenEmissionsUSD = [constant.BIGDECIMAL_ZERO, constant.BIGDECIMAL_ZERO]
            }
            market.rewardTokenEmissionsAmount = getCurrentRewardEmissionAmount(market)
            market.rewardTokenEmissionsUSD =  getCurrentRewardEmissionAmountUSD(market)
        }
        let inputPricePerTokenUSD = getUsdPricePerToken(Address.fromString(mrktId)).usdPrice
        .div(constant.BIGINT_TEN.pow(6 as u8).toBigDecimal())

        log.info('INPUT TOKEN PRICE: ' + inputPricePerTokenUSD.toString(), [])
        market.outputTokenPriceUSD = inputPricePerTokenUSD
        market.inputTokenPricesUSD = [inputPricePerTokenUSD]
        market.save()
    }
    
    return market as Market
}

export function getCurrentRewardEmissionAmount(market: Market): BigInt[] {
    let depositRewardEmissions = market.rewardTokenEmissionsAmount[0];
    let borrowRewardEmissions = market.rewardTokenEmissionsAmount[1];
    const incentiveControllerAddr = initIncentiveController(market)
    let incentiveControllerContract = AaveIncentivesController.bind(incentiveControllerAddr)
    if (!incentiveControllerContract.try_assets(Address.fromString(market.outputToken)).reverted) {
        let assetDataSupply = incentiveControllerContract.try_assets(Address.fromString(market.outputToken)).value.value0
        let assetBorrowStableEmission = incentiveControllerContract.try_assets(Address.fromString(market.sToken)).value.value0
        let assetBorrowVariableEmission = incentiveControllerContract.try_assets(Address.fromString(market.vToken)).value.value0

        if (assetDataSupply != constant.BIGINT_ZERO) {
            depositRewardEmissions = assetDataSupply.times(constant.BIGINT_SECONDS_PER_DAY)
        }
        else {
            depositRewardEmissions = BIGINT_ZERO
        }
        if (assetBorrowStableEmission != BIGINT_ZERO && assetBorrowVariableEmission != BIGINT_ZERO) {
            let borrowEmissionAvg = (assetBorrowStableEmission.plus(assetBorrowVariableEmission)).div(constant.BIGINT_TWO)
            borrowRewardEmissions = borrowEmissionAvg.times(constant.BIGINT_SECONDS_PER_DAY)
        }
        else {
            borrowRewardEmissions = BIGINT_ZERO
        }
    }

    return [depositRewardEmissions, borrowRewardEmissions]  
}

export function getCurrentRewardEmissionAmountUSD(market: Market): BigDecimal[] {
    let rewardTokenEmissionsUSD = market.rewardTokenEmissionsUSD
    let rewardTokenAddr = Address.fromString(constant.REWARD_TOKEN)
    let rewardToken = getorCreateToken(rewardTokenAddr)
    let rewardTokenPrice = getUsdPricePerToken(rewardTokenAddr).usdPrice
    .div(constant.BIGINT_TEN.pow(rewardToken.decimals as u8).toBigDecimal())

    rewardTokenEmissionsUSD[0] = amountInUSD(rewardTokenPrice, market.rewardTokenEmissionsAmount[0].toBigDecimal(), 18)
    rewardTokenEmissionsUSD[1] = amountInUSD(rewardTokenPrice, market.rewardTokenEmissionsAmount[1].toBigDecimal(), 18)
    return rewardTokenEmissionsUSD
}

export function initIncentiveController(market: Market): Address {
    let aToken = AToken.bind(Address.fromString(market.outputToken)) //reward token addr
    if (!aToken.try_getIncentivesController().reverted) {
        let incentiveController = aToken.try_getIncentivesController().value
        return incentiveController
    }
    else {
        let incentiveController = Address.fromString(constant.INCENTIVE_CONTROLLER)
        return incentiveController
    }
}

export function loadRewardToken(tokenAddr: Address, type: string): RewardToken {
    let asset = RewardToken.load(tokenAddr.toHexString())
    if (!asset) {
        asset = new RewardToken(tokenAddr.toHexString())
        let ERC20Contract = ERC20.bind(tokenAddr)
        asset.name = ERC20Contract.try_name().value
        asset.symbol = ERC20Contract.try_symbol().value
        asset.decimals = ERC20Contract.try_decimals().value
        asset.type = type
        asset.save()
    }
    getorCreateToken(tokenAddr)
    
    return asset as RewardToken
}

export function getOrCreateUser(id: Address): void {
    let user = Account.load(id.toHexString())
    if (!user) {
        user = new Account(id.toHexString())
        user.save()
        const protocolId = getProtocolIdFromCtx()
        let protocol = getorCreateProtocol(protocolId)
        protocol.totalUniqueUsers += 1
        protocol.save()
    }
}


export function calculateRevenues(token: Token, market: Market): void {
    let vDebtTokenContract = VToken.bind(Address.fromString(market.vToken))
    let sDebtTokenContract = SToken.bind(Address.fromString(market.sToken))
    let vDebtTokenSupply = vDebtTokenContract.try_totalSupply()
    let sDebtTokenSupply = sDebtTokenContract.try_totalSupply()
    
    if (!vDebtTokenSupply.reverted && !sDebtTokenSupply.reverted) {
        market.totalStableValueLocked = sDebtTokenSupply.value
        market.totalVariableValueLocked = vDebtTokenSupply.value
        market.save()
    }
    const protocolId = getProtocolIdFromCtx();
    const protocol = getorCreateProtocol(protocolId);

    const protoMinusMarketProtoRevenue = protocol.protocolSideRevenueUSD.minus(market.protocolSideRevenueUSD);
    const protoMinusMarketSupplyRevenue = protocol.supplySideRevenueUSD.minus(market.supplySideRevenueUSD);
    const protoMinusMarketFees = protocol.totalRevenueUSD.minus(market.totalRevenueUSD);
    const varAmountUSD = amountInUSD(market.inputTokenPricesUSD[0], market.totalVariableValueLocked.toBigDecimal(), token.decimals);
    const varFees = varAmountUSD.times(market.variableBorrowRate);
    const staAmountUSD = amountInUSD(market.inputTokenPricesUSD[0], market.totalVariableValueLocked.toBigDecimal(), token.decimals);
    const staFees = staAmountUSD.times(market.stableBorrowRate);

    market.totalRevenueUSD = staFees.plus(varFees).truncate(3);
    protocol.totalRevenueUSD = protoMinusMarketFees.plus(market.totalRevenueUSD);
    market.protocolSideRevenueUSD = market.totalRevenueUSD.times(market.reserveFactor.toBigDecimal()).truncate(3);
    protocol.protocolSideRevenueUSD = protoMinusMarketProtoRevenue.plus(market.protocolSideRevenueUSD);
    market.supplySideRevenueUSD = market.totalRevenueUSD.times(constant.BIGDECIMAL_ONE.minus(market.reserveFactor.toBigDecimal())).truncate(3);
    protocol.supplySideRevenueUSD = protoMinusMarketSupplyRevenue.plus(market.supplySideRevenueUSD);

    const tempProtocolBorrowTotal = protocol.totalBorrowUSD.minus(market.totalBorrowUSD);
    market.totalBorrowUSD = staAmountUSD.plus(varAmountUSD);
    protocol.totalBorrowUSD = tempProtocolBorrowTotal.plus(market.totalBorrowUSD);

    market.save();
    protocol.save();
}

            