import { 
    Address, 
    DataSourceContext, 
    log 
} from "@graphprotocol/graph-ts"

import {
    ProxyCreated,
    PriceOracleUpdated,
    LendingPoolUpdated,
    LendingPoolConfiguratorUpdated,
    LendingPoolProvider as providerContract
} from "../../generated/templates/lendingPoolProvider/LendingPoolProvider"

import {
    lendingPool as lendingPoolTemplate,
    LendingPoolConfigurator as LendingPoolConfiguratorTemplate,
    lendingPoolProvider as lendingPoolProviderTemplate 
} from  "../../generated/templates"

import { AddressesProviderRegistered } from "../../generated/LendingPoolRegistry/LendingPoolRegistry"
import { getorCreateProtocol } from "../common/util"
import * as constant from '../common/constants'

export function handleAddressesProviderRegistered(event: AddressesProviderRegistered): void {
    const address = event.params.newAddress
    getorCreateProtocol(constant.LENDING_POOL_REGISTRY)
    log.info('START INDEXING LENDING_PROVIDER ' + address.toHexString(), [])
    lendingPoolProviderTemplate.create(constant.LENDING_POOL_PROVIDER)
}

export function handleLendingPoolUpdated(event: LendingPoolUpdated): void {
    log.info('POOL UPDATED ' + event.params.newAddress.toHexString(), [])
    const context = initiateContext(event.address);
    startIndexingLendingPool(constant.LENDING_POOL, context);
}

export function handlePriceOracleUpdated(event: PriceOracleUpdated): void {
    const protocol = getorCreateProtocol(constant.LENDING_POOL_REGISTRY)
    protocol.protocolPriceOracle = event.params.newAddress.toHexString()
    protocol.save()
}

export function handleProxyCreated(event: ProxyCreated): void {
    const pool = event.params.id.toHexString();
    const address = event.params.newAddress;
    const context = initiateContext(event.address);
    log.info('PROXY: ' + pool, []);
    if (pool.includes('LENDING_POOL')) {
      startIndexingLendingPool(constant.LENDING_POOL, context);
    } else if (pool.includes('LENDING_POOL_CONFIGURATOR')) {
      startIndexingLendingPoolConfigurator(constant.LENDING_POOL_CONFIGURATOR, context);
    }
  }

  export function handleLendingPoolConfiguratorUpdated(event: LendingPoolConfiguratorUpdated): void {
    log.info('CONFIGURATOR UPDATED ' + event.params.newAddress.toHexString(), [])
    const context = initiateContext(event.address);
    startIndexingLendingPoolConfigurator(constant.LENDING_POOL_CONFIGURATOR, context);
  }

  export function startIndexingLendingPool(poolAddress: Address, context: DataSourceContext): void {
    log.info('START INDEXING LENDING POOL', []);
    lendingPoolTemplate.createWithContext(poolAddress, context);
  }

  export function startIndexingLendingPoolConfigurator(configurator: Address, context: DataSourceContext): void {
    log.info('START INDEXING LENDING POOL CONFIG', []);
    LendingPoolConfiguratorTemplate.createWithContext(configurator, context);
  }

  function initiateContext(addrProvider: Address): DataSourceContext {
    const contract = providerContract.bind(addrProvider);
    log.info('AddrProvContract: ' + addrProvider.toHexString(), []);
    const trylendingPool = contract.try_getLendingPool();
    let lendingPool = ''
    if (!trylendingPool.reverted) {
      lendingPool = trylendingPool.value.toHexString();
      log.info('initiateContext LP:' + lendingPool, []);
    }
    const lendingProtocol = getorCreateProtocol(constant.LENDING_POOL_REGISTRY);
    const tryPriceOracle = contract.try_getPriceOracle();
    if (!tryPriceOracle.reverted) {
      lendingProtocol.protocolPriceOracle = tryPriceOracle.value.toHexString();
      log.info('initiateContext priceOracle: ' + lendingProtocol.protocolPriceOracle, []);
    } else {
      lendingProtocol.protocolPriceOracle = constant.PRICE_ORACLE;
      log.error('FAILED TO GET ORACLE - REVERTED TO DEFAULT HARD-CODED AT ' + lendingProtocol.protocolPriceOracle, ['']);
    }
    lendingProtocol.save();
    log.info('CREATING CONTEXT ' + lendingPool + '-----' + lendingProtocol.id, []);
    const context = new DataSourceContext();
    context.setString('lendingPool', lendingPool);
    context.setString('protocolId', lendingProtocol.id);
    return context;
  }