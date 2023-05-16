import {
  Token,
  Game,
  MetricsHourlySnapshot,
  MetricsDailySnapshot,
  User,
  Card as CardNft,
  Currency,
  Marketplace,
  Card
} from "../../generated/schema";
import * as constants from "./constants";
import { Address, BigDecimal, bigDecimal, BigInt, cosmos, ethereum } from "@graphprotocol/graph-ts";
import { BEP20 } from "../../generated/ERA7/BEP20";
import * as utils from "./utils"


export function getOrcreateGameProtocol(): Game {
  const gameID = constants.Game.name
  let game = Game.load(gameID)

  if (!game) {
    game = new Game(gameID);
    game.name = constants.Game.name;
    game.schemaVersion = constants.Game.schemaVersion;
    game.subgraphVersion = constants.Game.subgraphVersion; game.network = constants.Network.MAINNET;

    /// Quantitative Data ////////
    game.cumulativeUsersRevenueUSD = constants.BIGDECIMAL_ZERO;
    game.cumulativeGameSideRevenueUSD = constants.BIGDECIMAL_ZERO;
    game.cumulativeUniqueUsers = 0;
    game.save()
  }

  return game
}

export function getOrCreateToken(address: Address): Token {
  let token = Token.load(address.toHexString());

  if (!token) {
    token = new Token(address.toHexString());
    const contract = BEP20.bind(address);

    token.name = utils.readValue<string>(contract.try_name(), "");
    token.symbol = utils.readValue<string>(contract.try_symbol(), "");
    token.decimals = utils.readValue<BigInt>(contract.try_decimals(), BigInt.fromI32(18))

    token.save();
  }

  return token;
}

export function getOrCreateMarketplace(
  block: ethereum.Block
): Marketplace {
  let game = getOrcreateGameProtocol()
  let marketId = constants.CARD_MARKETPLACE_CONTRACT.toHexString()
  let marketPlace = Marketplace.load(marketId)

  if (!marketPlace) {
    marketPlace = new Marketplace(marketId)
    marketPlace.game = game.id
    marketPlace.createdBlockNumber = block.number
    marketPlace.createdTimestamp = block.timestamp
    marketPlace.save()
  }

  return marketPlace
}

export function getOrCreateCardNft(
  user: User,
  price: BigDecimal,
  nftId: BigInt,
  transaction: ethereum.Transaction,
  block: ethereum.Block
): CardNft {
  let cardId = constants.CARD_MARKETPLACE_CONTRACT.toHexString()
    .concat("-")
    .concat(nftId.toString());
  let card = CardNft.load(cardId);

  if (!card) {
    card = new CardNft(cardId);
    card.tokenId = nftId;
    card.hash = transaction.hash.toHexString();
    card.mintOwner = user.id
    card.owner = user.id
    card.price = price
    user.nftsCount += 1
    user.nftsMintedCount += 1
    card.createdTimestamp = block.timestamp;
    card.createdBlockNumber = block.number;
    card.save()
  }
  
  return card;
}

export function getOrCreateCurrency(
  block: ethereum.Block
): Currency {
  let token = getOrCreateToken(constants.BUSD_SMART_CONTRACT)
  let marketPlace = getOrCreateMarketplace(block)
  let currencyId = constants.BUSD_SMART_CONTRACT.toHexString()
  let currency = Currency.load(currencyId)

  if (!currency) {
    currency = new Currency(currencyId)
    currency.token = token.id
    currency.market = marketPlace.id
    currency.save()
  }

  return currency
}

export function getOrCreateUsageMetricsDailySnapshot(
  block: ethereum.Block
): MetricsDailySnapshot {
  let id = (block.timestamp.toI64() / constants.SECONDS_PER_DAY).toString();
  let usageMetrics = MetricsDailySnapshot.load(id);
  let game = getOrcreateGameProtocol()

  if (!usageMetrics) {
    usageMetrics = new MetricsDailySnapshot(id);
    usageMetrics.game = game.id

    usageMetrics.dailyActiveUsers = 0;
    usageMetrics.cumulativeUniqueUsers = 0;
    usageMetrics.dailyTransactionCount = 0;
    usageMetrics.dailyNewUsersCount = 0;
    usageMetrics.dailyNFTSoldCount = 0;
    usageMetrics.dailyNFTListingCount = 0;
    usageMetrics.dailyNFTUnListingCount = 0;
    usageMetrics.dailyNFTMintingCount = 0;

    usageMetrics.blockNumber = block.number;
    usageMetrics.timestamp = block.timestamp;

    usageMetrics.save();
  }

  return usageMetrics;
}

export function getOrCreateUsageMetricsHourlySnapshot(
  block: ethereum.Block
): MetricsHourlySnapshot {
  let id = (block.timestamp.toI64() / constants.SECONDS_PER_HOUR).toString();
  let usageMetrics = MetricsHourlySnapshot.load(id);
  let game = getOrcreateGameProtocol()

  if (!usageMetrics) {
    usageMetrics = new MetricsHourlySnapshot(id);
    usageMetrics.game = game.id

    usageMetrics.hourlyActiveUsers = 0;
    usageMetrics.cumulativeUniqueUsers = 0;
    usageMetrics.hourlyTransactionCount = 0;
    usageMetrics.hourlyNewUsersCount = 0;
    usageMetrics.hourlyNFTSoldCount = 0;
    usageMetrics.hourlyNFTListingCount = 0;
    usageMetrics.hourlyNFTUnListingCount = 0;
    usageMetrics.hourlyNFTMintingCount = 0;

    usageMetrics.blockNumber = block.number;
    usageMetrics.timestamp = block.timestamp;

    usageMetrics.save();
  }

  return usageMetrics;
}


// export function getOrCreateFinancialDailySnapshots(
//   block: ethereum.Block
// ): FinancialsDailySnapshot {
//   let id = (block.timestamp.toI64() / constants.SECONDS_PER_DAY).toString();
//   let financialMetrics = FinancialsDailySnapshot.load(id);

//   if (!financialMetrics) {
//     financialMetrics = new FinancialsDailySnapshot(id);
//     financialMetrics.game = constants.Game.name;

//     financialMetrics.dailyUsersRevenueUSD = constants.BIGDECIMAL_ZERO;
//     financialMetrics.cumulativeUsersRevenueUSD = constants.BIGDECIMAL_ZERO;
//     financialMetrics.dailyGameSideRevenueUSD = constants.BIGDECIMAL_ZERO;
//     financialMetrics. cumulativeGameSideRevenueUSD = constants.BIGDECIMAL_ZERO;

//     financialMetrics.blockNumber = block.number;
//     financialMetrics.timestamp = block.timestamp;

//     financialMetrics.save();
//   }

//   return financialMetrics;
// }

export function getorcreateUser(id: string, block: ethereum.Block): User {
  let user = User.load(id)
  if (!user) {
    if (id == constants.ZERO_ADDRESS_STRING) {
      user = new User(id)
      user.investmentUSD = constants.BIGDECIMAL_ZERO
      user.realizedProfitUSD = constants.BIGDECIMAL_ZERO
      user.nftsCount = 0
      user.nftsMintedCount = 0
      user.blockNumber = block.number
      user.timestamp = block.timestamp
      user.save()
    }
    else {
      user = new User(id)
      user.investmentUSD = constants.BIGDECIMAL_ZERO
      user.realizedProfitUSD = constants.BIGDECIMAL_ZERO
      user.nftsCount = 0
      user.nftsMintedCount = 0
      user.blockNumber = block.number
      user.timestamp = block.timestamp
      user.save()

      const game = getOrcreateGameProtocol()
      game.cumulativeUniqueUsers += 1
      game.save()
    }
  }

  return user

}
