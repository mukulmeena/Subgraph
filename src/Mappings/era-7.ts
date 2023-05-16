import {
  getorcreateUser,
  getOrCreateUsageMetricsDailySnapshot,
  getOrCreateUsageMetricsHourlySnapshot,
  getOrCreateToken,
  getOrCreateCardNft
} from "../Utitlity/initializer";
import {
  BuyV2 as Marketplace_buy,
  UploadNftV2 as Marketplace_upload,
  StopSell
} from "../../generated/Era7/MarketPlace_Card";
import { getUsdPrice } from "../Prices";
import { order } from "../module/transaction";
import { Address, BigDecimal, BigInt, ethereum, store } from "@graphprotocol/graph-ts";
import * as constants from "../Utitlity/constants";
import { updateUsageMetrics } from "../Utitlity/Metric";
import { Card } from "../../generated/schema";


export function handleBuyV2(event: Marketplace_buy): void {
  const buyer = event.params.to;
  const nftId = event.params.nftId;
  const buyingPrice = event.params.price;
  const buytype = event.params.buyType
  
  let buyeruser = getorcreateUser(buyer.toHexString(), event.block);
  let buyingPriceUsd = getUsdPrice(
    constants.BUSD_SMART_CONTRACT,
    buyingPrice.toBigDecimal()
    .div(BigInt.fromI32(10).pow(18).toBigDecimal())
  );
  let card = getOrCreateCardNft(buyeruser, buyingPriceUsd, nftId, event.transaction, event.block);

  let sellerUser = getorcreateUser(card.owner, event.block)
  buyeruser.investmentUSD = buyeruser.investmentUSD.plus(buyingPriceUsd);
  sellerUser.realizedProfitUSD = buyingPriceUsd.minus(sellerUser.investmentUSD);


  const orderInfo = order(buyeruser.id,
    sellerUser.id,
    buyingPrice,
    buyingPriceUsd,
    card,
    event.block,
    event.transaction);

  orderInfo.status = constants.OrderStatus.COMPLETED
  orderInfo.save()
  
  card.owner = buyeruser.id
  sellerUser.nftsCount -= 1
  buyeruser.nftsCount += 1
  sellerUser.save()
  buyeruser.save()
  card.save();

  // updateFinancials(event.block)
  updateUsageMetrics(event.block, buyer);

  let usageMetricsDaily = getOrCreateUsageMetricsDailySnapshot(event.block);
  let usageMetricsHourly = getOrCreateUsageMetricsHourlySnapshot(event.block);

  usageMetricsDaily.dailyNFTSoldCount += 1;
  usageMetricsHourly.hourlyNFTSoldCount += 1;

  usageMetricsDaily.save();
  usageMetricsHourly.save();
}



export function handleUploadNftV2(event: Marketplace_upload): void {
  const seller = event.params.from;
  const nftId = event.params.nftId;
  const sellingPriceBusd = event.params.busd;
  const sellingPriceEra = event.params.era
  
  const sellerUser = getorcreateUser(seller.toHexString(), event.block);
  const buyerUser = ""

  let sellingPriceUSD = getUsdPrice(
    constants.BUSD_SMART_CONTRACT,
    sellingPriceBusd.toBigDecimal()
    .div(BigInt.fromI32(10).pow(18).toBigDecimal())
  );

  let card = getOrCreateCardNft(sellerUser, sellingPriceUSD, nftId, event.transaction, event.block);

  const orderInfo = order(buyerUser,
    sellerUser.id,
    sellingPriceBusd,
    sellingPriceUSD,
    card,
    event.block,
    event.transaction);

  orderInfo.status = constants.OrderStatus.LISTED
  orderInfo.save()

  sellerUser.save();
  card.save();

  // updateFinancials(event.block)
  updateUsageMetrics(event.block, seller);

  let usageMetricsDaily = getOrCreateUsageMetricsDailySnapshot(event.block);
  let usageMetricsHourly = getOrCreateUsageMetricsHourlySnapshot(event.block);
  usageMetricsDaily.dailyNFTListingCount += 1;
  usageMetricsHourly.hourlyNFTListingCount += 1;

  usageMetricsDaily.save();
  usageMetricsHourly.save();
}


export function handleStopSell(event: StopSell): void {
  let nftId = event.params.nftId
  let cardId = constants.CARD_MARKETPLACE_CONTRACT.toHexString()
    .concat("-")
    .concat(nftId.toString());
  // let card = Card.load(cardId)
  // let buyerAddress = Address.fromString(card.owner)

  // updateUsageMetrics(event.block, buyerAddress
  

  let usageMetricsDaily = getOrCreateUsageMetricsDailySnapshot(event.block);
  let usageMetricsHourly = getOrCreateUsageMetricsHourlySnapshot(event.block);
  usageMetricsDaily.dailyNFTUnListingCount += 1
  usageMetricsHourly.hourlyNFTUnListingCount += 1

  usageMetricsDaily.save();
  usageMetricsHourly.save();                                                                                                                                          

}