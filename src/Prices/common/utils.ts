import * as constants from "./constants";
import { BEP20 } from "../../../generated/Era7/BEP20";
import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";

export function readValue<T>(callResult: ethereum.CallResult<T>, defaultValue: T): T {
  return callResult.reverted ? defaultValue : callResult.value;
}

export function getTokenDecimals(tokenAddr: Address): BigInt {
  const token = BEP20.bind(tokenAddr);

  let decimals = readValue<BigInt>(token.try_decimals(), constants.DEFAULT_DECIMALS);

  return decimals;
}
