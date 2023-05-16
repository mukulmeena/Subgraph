// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class AssetConfigUpdated extends ethereum.Event {
  get params(): AssetConfigUpdated__Params {
    return new AssetConfigUpdated__Params(this);
  }
}

export class AssetConfigUpdated__Params {
  _event: AssetConfigUpdated;

  constructor(event: AssetConfigUpdated) {
    this._event = event;
  }

  get asset(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get emission(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class AssetIndexUpdated extends ethereum.Event {
  get params(): AssetIndexUpdated__Params {
    return new AssetIndexUpdated__Params(this);
  }
}

export class AssetIndexUpdated__Params {
  _event: AssetIndexUpdated;

  constructor(event: AssetIndexUpdated) {
    this._event = event;
  }

  get asset(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get index(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class ClaimerSet extends ethereum.Event {
  get params(): ClaimerSet__Params {
    return new ClaimerSet__Params(this);
  }
}

export class ClaimerSet__Params {
  _event: ClaimerSet;

  constructor(event: ClaimerSet) {
    this._event = event;
  }

  get user(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get claimer(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class DistributionEndUpdated extends ethereum.Event {
  get params(): DistributionEndUpdated__Params {
    return new DistributionEndUpdated__Params(this);
  }
}

export class DistributionEndUpdated__Params {
  _event: DistributionEndUpdated;

  constructor(event: DistributionEndUpdated) {
    this._event = event;
  }

  get newDistributionEnd(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class RewardsAccrued extends ethereum.Event {
  get params(): RewardsAccrued__Params {
    return new RewardsAccrued__Params(this);
  }
}

export class RewardsAccrued__Params {
  _event: RewardsAccrued;

  constructor(event: RewardsAccrued) {
    this._event = event;
  }

  get user(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class RewardsClaimed extends ethereum.Event {
  get params(): RewardsClaimed__Params {
    return new RewardsClaimed__Params(this);
  }
}

export class RewardsClaimed__Params {
  _event: RewardsClaimed;

  constructor(event: RewardsClaimed) {
    this._event = event;
  }

  get user(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get to(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get claimer(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class UserIndexUpdated extends ethereum.Event {
  get params(): UserIndexUpdated__Params {
    return new UserIndexUpdated__Params(this);
  }
}

export class UserIndexUpdated__Params {
  _event: UserIndexUpdated;

  constructor(event: UserIndexUpdated) {
    this._event = event;
  }

  get user(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get asset(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get index(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class AaveIncentivesController__assetsResult {
  value0: BigInt;
  value1: BigInt;
  value2: BigInt;

  constructor(value0: BigInt, value1: BigInt, value2: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    return map;
  }

  getEmissionPerSecond(): BigInt {
    return this.value0;
  }

  getIndex(): BigInt {
    return this.value1;
  }

  getLastUpdateTimestamp(): BigInt {
    return this.value2;
  }
}

export class AaveIncentivesController__getAssetDataResult {
  value0: BigInt;
  value1: BigInt;
  value2: BigInt;

  constructor(value0: BigInt, value1: BigInt, value2: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    return map;
  }

  getValue0(): BigInt {
    return this.value0;
  }

  getValue1(): BigInt {
    return this.value1;
  }

  getValue2(): BigInt {
    return this.value2;
  }
}

export class AaveIncentivesController extends ethereum.SmartContract {
  static bind(address: Address): AaveIncentivesController {
    return new AaveIncentivesController("AaveIncentivesController", address);
  }

  DISTRIBUTION_END(): BigInt {
    let result = super.call(
      "DISTRIBUTION_END",
      "DISTRIBUTION_END():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_DISTRIBUTION_END(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "DISTRIBUTION_END",
      "DISTRIBUTION_END():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  EMISSION_MANAGER(): Address {
    let result = super.call(
      "EMISSION_MANAGER",
      "EMISSION_MANAGER():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_EMISSION_MANAGER(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "EMISSION_MANAGER",
      "EMISSION_MANAGER():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  PRECISION(): i32 {
    let result = super.call("PRECISION", "PRECISION():(uint8)", []);

    return result[0].toI32();
  }

  try_PRECISION(): ethereum.CallResult<i32> {
    let result = super.tryCall("PRECISION", "PRECISION():(uint8)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toI32());
  }

  REVISION(): BigInt {
    let result = super.call("REVISION", "REVISION():(uint256)", []);

    return result[0].toBigInt();
  }

  try_REVISION(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("REVISION", "REVISION():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  REWARD_TOKEN(): Address {
    let result = super.call("REWARD_TOKEN", "REWARD_TOKEN():(address)", []);

    return result[0].toAddress();
  }

  try_REWARD_TOKEN(): ethereum.CallResult<Address> {
    let result = super.tryCall("REWARD_TOKEN", "REWARD_TOKEN():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  STAKE_TOKEN(): Address {
    let result = super.call("STAKE_TOKEN", "STAKE_TOKEN():(address)", []);

    return result[0].toAddress();
  }

  try_STAKE_TOKEN(): ethereum.CallResult<Address> {
    let result = super.tryCall("STAKE_TOKEN", "STAKE_TOKEN():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  assets(param0: Address): AaveIncentivesController__assetsResult {
    let result = super.call(
      "assets",
      "assets(address):(uint104,uint104,uint40)",
      [ethereum.Value.fromAddress(param0)]
    );

    return new AaveIncentivesController__assetsResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBigInt()
    );
  }

  try_assets(
    param0: Address
  ): ethereum.CallResult<AaveIncentivesController__assetsResult> {
    let result = super.tryCall(
      "assets",
      "assets(address):(uint104,uint104,uint40)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new AaveIncentivesController__assetsResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBigInt()
      )
    );
  }

  claimRewards(assets: Array<Address>, amount: BigInt, to: Address): BigInt {
    let result = super.call(
      "claimRewards",
      "claimRewards(address[],uint256,address):(uint256)",
      [
        ethereum.Value.fromAddressArray(assets),
        ethereum.Value.fromUnsignedBigInt(amount),
        ethereum.Value.fromAddress(to)
      ]
    );

    return result[0].toBigInt();
  }

  try_claimRewards(
    assets: Array<Address>,
    amount: BigInt,
    to: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "claimRewards",
      "claimRewards(address[],uint256,address):(uint256)",
      [
        ethereum.Value.fromAddressArray(assets),
        ethereum.Value.fromUnsignedBigInt(amount),
        ethereum.Value.fromAddress(to)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  claimRewardsOnBehalf(
    assets: Array<Address>,
    amount: BigInt,
    user: Address,
    to: Address
  ): BigInt {
    let result = super.call(
      "claimRewardsOnBehalf",
      "claimRewardsOnBehalf(address[],uint256,address,address):(uint256)",
      [
        ethereum.Value.fromAddressArray(assets),
        ethereum.Value.fromUnsignedBigInt(amount),
        ethereum.Value.fromAddress(user),
        ethereum.Value.fromAddress(to)
      ]
    );

    return result[0].toBigInt();
  }

  try_claimRewardsOnBehalf(
    assets: Array<Address>,
    amount: BigInt,
    user: Address,
    to: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "claimRewardsOnBehalf",
      "claimRewardsOnBehalf(address[],uint256,address,address):(uint256)",
      [
        ethereum.Value.fromAddressArray(assets),
        ethereum.Value.fromUnsignedBigInt(amount),
        ethereum.Value.fromAddress(user),
        ethereum.Value.fromAddress(to)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getAssetData(asset: Address): AaveIncentivesController__getAssetDataResult {
    let result = super.call(
      "getAssetData",
      "getAssetData(address):(uint256,uint256,uint256)",
      [ethereum.Value.fromAddress(asset)]
    );

    return new AaveIncentivesController__getAssetDataResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBigInt()
    );
  }

  try_getAssetData(
    asset: Address
  ): ethereum.CallResult<AaveIncentivesController__getAssetDataResult> {
    let result = super.tryCall(
      "getAssetData",
      "getAssetData(address):(uint256,uint256,uint256)",
      [ethereum.Value.fromAddress(asset)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new AaveIncentivesController__getAssetDataResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBigInt()
      )
    );
  }

  getClaimer(user: Address): Address {
    let result = super.call("getClaimer", "getClaimer(address):(address)", [
      ethereum.Value.fromAddress(user)
    ]);

    return result[0].toAddress();
  }

  try_getClaimer(user: Address): ethereum.CallResult<Address> {
    let result = super.tryCall("getClaimer", "getClaimer(address):(address)", [
      ethereum.Value.fromAddress(user)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getDistributionEnd(): BigInt {
    let result = super.call(
      "getDistributionEnd",
      "getDistributionEnd():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_getDistributionEnd(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getDistributionEnd",
      "getDistributionEnd():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getRewardsBalance(assets: Array<Address>, user: Address): BigInt {
    let result = super.call(
      "getRewardsBalance",
      "getRewardsBalance(address[],address):(uint256)",
      [
        ethereum.Value.fromAddressArray(assets),
        ethereum.Value.fromAddress(user)
      ]
    );

    return result[0].toBigInt();
  }

  try_getRewardsBalance(
    assets: Array<Address>,
    user: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getRewardsBalance",
      "getRewardsBalance(address[],address):(uint256)",
      [
        ethereum.Value.fromAddressArray(assets),
        ethereum.Value.fromAddress(user)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getUserAssetData(user: Address, asset: Address): BigInt {
    let result = super.call(
      "getUserAssetData",
      "getUserAssetData(address,address):(uint256)",
      [ethereum.Value.fromAddress(user), ethereum.Value.fromAddress(asset)]
    );

    return result[0].toBigInt();
  }

  try_getUserAssetData(
    user: Address,
    asset: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getUserAssetData",
      "getUserAssetData(address,address):(uint256)",
      [ethereum.Value.fromAddress(user), ethereum.Value.fromAddress(asset)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getUserUnclaimedRewards(_user: Address): BigInt {
    let result = super.call(
      "getUserUnclaimedRewards",
      "getUserUnclaimedRewards(address):(uint256)",
      [ethereum.Value.fromAddress(_user)]
    );

    return result[0].toBigInt();
  }

  try_getUserUnclaimedRewards(_user: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getUserUnclaimedRewards",
      "getUserUnclaimedRewards(address):(uint256)",
      [ethereum.Value.fromAddress(_user)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get stakeToken(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get emissionManager(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ClaimRewardsCall extends ethereum.Call {
  get inputs(): ClaimRewardsCall__Inputs {
    return new ClaimRewardsCall__Inputs(this);
  }

  get outputs(): ClaimRewardsCall__Outputs {
    return new ClaimRewardsCall__Outputs(this);
  }
}

export class ClaimRewardsCall__Inputs {
  _call: ClaimRewardsCall;

  constructor(call: ClaimRewardsCall) {
    this._call = call;
  }

  get assets(): Array<Address> {
    return this._call.inputValues[0].value.toAddressArray();
  }

  get amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get to(): Address {
    return this._call.inputValues[2].value.toAddress();
  }
}

export class ClaimRewardsCall__Outputs {
  _call: ClaimRewardsCall;

  constructor(call: ClaimRewardsCall) {
    this._call = call;
  }

  get value0(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class ClaimRewardsOnBehalfCall extends ethereum.Call {
  get inputs(): ClaimRewardsOnBehalfCall__Inputs {
    return new ClaimRewardsOnBehalfCall__Inputs(this);
  }

  get outputs(): ClaimRewardsOnBehalfCall__Outputs {
    return new ClaimRewardsOnBehalfCall__Outputs(this);
  }
}

export class ClaimRewardsOnBehalfCall__Inputs {
  _call: ClaimRewardsOnBehalfCall;

  constructor(call: ClaimRewardsOnBehalfCall) {
    this._call = call;
  }

  get assets(): Array<Address> {
    return this._call.inputValues[0].value.toAddressArray();
  }

  get amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get user(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get to(): Address {
    return this._call.inputValues[3].value.toAddress();
  }
}

export class ClaimRewardsOnBehalfCall__Outputs {
  _call: ClaimRewardsOnBehalfCall;

  constructor(call: ClaimRewardsOnBehalfCall) {
    this._call = call;
  }

  get value0(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class ConfigureAssetsCall extends ethereum.Call {
  get inputs(): ConfigureAssetsCall__Inputs {
    return new ConfigureAssetsCall__Inputs(this);
  }

  get outputs(): ConfigureAssetsCall__Outputs {
    return new ConfigureAssetsCall__Outputs(this);
  }
}

export class ConfigureAssetsCall__Inputs {
  _call: ConfigureAssetsCall;

  constructor(call: ConfigureAssetsCall) {
    this._call = call;
  }

  get assets(): Array<Address> {
    return this._call.inputValues[0].value.toAddressArray();
  }

  get emissionsPerSecond(): Array<BigInt> {
    return this._call.inputValues[1].value.toBigIntArray();
  }
}

export class ConfigureAssetsCall__Outputs {
  _call: ConfigureAssetsCall;

  constructor(call: ConfigureAssetsCall) {
    this._call = call;
  }
}

export class HandleActionCall extends ethereum.Call {
  get inputs(): HandleActionCall__Inputs {
    return new HandleActionCall__Inputs(this);
  }

  get outputs(): HandleActionCall__Outputs {
    return new HandleActionCall__Outputs(this);
  }
}

export class HandleActionCall__Inputs {
  _call: HandleActionCall;

  constructor(call: HandleActionCall) {
    this._call = call;
  }

  get user(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get totalSupply(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get userBalance(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class HandleActionCall__Outputs {
  _call: HandleActionCall;

  constructor(call: HandleActionCall) {
    this._call = call;
  }
}

export class InitializeCall extends ethereum.Call {
  get inputs(): InitializeCall__Inputs {
    return new InitializeCall__Inputs(this);
  }

  get outputs(): InitializeCall__Outputs {
    return new InitializeCall__Outputs(this);
  }
}

export class InitializeCall__Inputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }

  get addressesProvider(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class InitializeCall__Outputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }
}

export class SetClaimerCall extends ethereum.Call {
  get inputs(): SetClaimerCall__Inputs {
    return new SetClaimerCall__Inputs(this);
  }

  get outputs(): SetClaimerCall__Outputs {
    return new SetClaimerCall__Outputs(this);
  }
}

export class SetClaimerCall__Inputs {
  _call: SetClaimerCall;

  constructor(call: SetClaimerCall) {
    this._call = call;
  }

  get user(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get caller(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class SetClaimerCall__Outputs {
  _call: SetClaimerCall;

  constructor(call: SetClaimerCall) {
    this._call = call;
  }
}

export class SetDistributionEndCall extends ethereum.Call {
  get inputs(): SetDistributionEndCall__Inputs {
    return new SetDistributionEndCall__Inputs(this);
  }

  get outputs(): SetDistributionEndCall__Outputs {
    return new SetDistributionEndCall__Outputs(this);
  }
}

export class SetDistributionEndCall__Inputs {
  _call: SetDistributionEndCall;

  constructor(call: SetDistributionEndCall) {
    this._call = call;
  }

  get distributionEnd(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class SetDistributionEndCall__Outputs {
  _call: SetDistributionEndCall;

  constructor(call: SetDistributionEndCall) {
    this._call = call;
  }
}