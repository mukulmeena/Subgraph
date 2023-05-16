import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export namespace Network {
    export const ARBITRUM_ONE = "ARBITRUM_ONE";
    export const AVALANCHE = "AVALANCHE";
    export const AURORA = "AURORA";
    export const BSC = "BSC"; // aka BNB Chain
    export const CELO = "CELO";
    export const MAINNET = "MAINNET"; // Ethereum mainnet
    export const FANTOM = "FANTOM";
    export const FUSE = "FUSE";
    export const MOONBEAM = "MOONBEAM";
    export const MOONRIVER = "MOONRIVER";
    export const NEAR_MAINNET = "NEAR_MAINNET";
    export const OPTIMISM = "OPTIMISM";
    export const MATIC = "MATIC"; // aka Polygon
    export const XDAI = "XDAI"; // aka Gnosis Chain
}

export namespace ProtocolType {
    export const EXCHANGE = 'EXCHANGE'
    export const LENDING = 'LENDING'    
    export const YEILD = 'YEILD'
    export const BRIDGE = 'BRIDGE'
    export const GENERIC = 'GENERIC'
}
export namespace RewardTokenType {
    export const DEPOSIT = "DEPOSIT"
    export const BORROW = 'BORROW'
    
}

export namespace LendingType {
  export const CDP = "CDP"
  export const POOLED = "POOLED"
}

export namespace RiskType {
  export const GLOBAL = "GLOBAL"
  export const ISOLATED = "ISOLATED"
}
  


export const SECONDS_PER_YEAR = BigInt.fromI32(31556952);

export const SECONDS_PER_HOUR = 60 * 60;
export const SECONDS_PER_DAY = 60 * 60 * 24;

export const DEFAULT_MANAGEMENT_FEE = BigInt.fromI32(200);
export const DEFAULT_PERFORMANCE_FEE = BigInt.fromI32(2000);
export const DEFAULT_WITHDRAWAL_FEE = BigInt.fromI32(50);

export const BIGINT_ZERO = BigInt.fromI32(0);
export const BIGINT_ONE = BigInt.fromI32(1);
export const BIGINT_TWO = BigInt.fromI32(2);
export const BIGINT_TEN = BigInt.fromI32(10);
export const BIGINT_HUNDRED = BigInt.fromI32(100);
export const BIGINT_SECONDS_PER_DAY = BigInt.fromI32(SECONDS_PER_DAY);

export const BIGDECIMAL_ZERO = new BigDecimal(BIGINT_ZERO);
export const BIGDECIMAL_ONE = new BigDecimal(BIGINT_ONE);
export const BIGDECIMAL_HUNDRED = BigDecimal.fromString("100");
export const BIGDECIMAL_THOUSAND = BigDecimal.fromString("1000");
export const BIGDECIMAL_SECONDS_PER_DAY = new BigDecimal(
  BigInt.fromI32(SECONDS_PER_DAY)
);
export const ZERO_ADDRESS_STRING = "0x0000000000000000000000000000000000000000";
export const ZERO_ADDRESS = Address.fromString(
  "0x0000000000000000000000000000000000000000"
);

export const LENDING_POOL_REGISTRY = "0x52D306e36E3B6B02c153d0266ff0f85d18BCD413"
export const INCENTIVE_CONTROLLER = "0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5"
export const REWARD_TOKEN = "0x4da27a545c0c5B758a6BA100e3a049001de870f5"
export const PRICE_ORACLE = "0xA50ba011c48153De246E5192C8f9258A2ba79Ca9"
export const LENDING_POOL_PROVIDER = Address.fromString("0xb53c1a33016b2dc2ff3653530bff1848a515c8c5")
export const LENDING_POOL = Address.fromString("0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9 ")
export const LENDING_POOL_CONFIGURATOR = Address.fromString("0x311Bb771e4F8952E6Da169b425E7e92d6Ac45756 ")

export const SCHEMA_VERSION = '1.0.0'
export const PROTOCOL_SLUG = 'Aave-v2'
export const PROTOCOL_NAME = 'Aave v2'
export const SUBGRAPH_VERSION = '1.0.0'
export const METHODOLOGY_VERSION = '1.0.0'
export const LENDING_TYPE = 'POOLED';
export const RISK_TYPE = 'ISOLATED';
