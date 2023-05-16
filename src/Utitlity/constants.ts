import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { Marketplace } from "../../generated/schema";

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
  
export namespace Game{
    export const name = 'ERA7'
    export const schemaVersion = '1.0.0'
    export const subgraphVersion = '1.0.0'
}

export namespace NFTType{
    export const EMPIRE_OF_LIGHT = "EMPIRE OF LIGHT"
    export const ROUGHROCK_WEALD = "ROUGHROCK WEALD"
    export const ZEN_ALLEY = "ZEN ALLEY"
    export const PIRATE_BAY = "PIRATE BAY"
    export const ACADEMY_OF_MYSTERIA = "ACADEMY OF MYSTERIA BAY"
    export const INFERNO = "INFERNO"
    export const FROZEN_NECROPOLIS = "FROZEN NECROPOLIS"
}

export namespace NFTRarity{
    export const LEGENDARY = "LEGENDARY"
    export const EPIC = "EPIC"
    export const RARE = "RARE"
    export const COMMON = "COMMON"
    export const UNKNOWN= "UNKOWN"
}

export namespace OrderStatus{
  export const LISTED = "LISTED"
  export const UNLISTED = "UNLISTED"
  export const COMPLETED = "COMPLETED"
}

export const SECONDS_PER_YEAR = BigInt.fromI32(31556952);

export const SECONDS_PER_HOUR = 60 * 60;
export const SECONDS_PER_DAY = 60 * 60 * 24;

export const DEFAULT_MANAGEMENT_FEE = BigInt.fromI32(200);
export const DEFAULT_PERFORMANCE_FEE = BigInt.fromI32(2000);
export const DEFAULT_WITHDRAWAL_FEE = BigInt.fromI32(50);

export const BIGINT_ZERO = BigInt.fromI32(0);
export const BIGINT_ONE = BigInt.fromI32(1);
export const BIGINT_TEN = BigInt.fromI32(10);
export const BIGINT_HUNDRED = BigInt.fromI32(100);
export const BIGINT_SECONDS_PER_DAY = BigInt.fromI32(SECONDS_PER_DAY);

export const BIGDECIMAL_ZERO = new BigDecimal(BIGINT_ZERO);
export const BIGDECIMAL_ONE = new BigDecimal(BIGINT_ONE);
export const BIGDECIMAL_HUNDRED = BigDecimal.fromString("100");
export const BIGDECIMAL_SECONDS_PER_DAY = new BigDecimal(
  BigInt.fromI32(SECONDS_PER_DAY)
);
export const ZERO_ADDRESS_STRING = "0x0000000000000000000000000000000000000000";
export const ZERO_ADDRESS = Address.fromString(
  "0x0000000000000000000000000000000000000000"
);

export const CARD_SMART_CONTRACT = Address.fromString("0x07D971C03553011a48E951a53F48632D37652Ba1")
export const BUSD_SMART_CONTRACT = Address.fromString("0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56")
export const CARD_MARKETPLACE_CONTRACT = Address.fromString("0x3C4257f6D4505D156ea9334ACC053c729e794d6F")