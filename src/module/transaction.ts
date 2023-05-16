import { Address, BigDecimal, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { MarketPlace_Card } from "../../generated/Era7/MarketPlace_Card";
import { Card, Order, User } from "../../generated/schema";
import * as constants from "../Utitlity/constants";
import { getOrCreateCurrency, getOrcreateGameProtocol, getOrCreateMarketplace, getorcreateUser } from "../Utitlity/initializer";


export function order(
    buyer: string,
    seller: string,
    sellingPrice: BigInt,
    sellingPriceUSD: BigDecimal,
    nft: Card,
    block: ethereum.Block,
    transaction: ethereum.Transaction
): Order {
    let game = getOrcreateGameProtocol()
    let transactionHash = transaction.hash.toHexString()
    let currency = getOrCreateCurrency(block)
    let marketPlace = getOrCreateMarketplace(block)
    let orderID = transactionHash
        .concat('-')
        .concat(transaction.index.toString());
    let order = Order.load(orderID)

    if (!order) {
        order = new Order(orderID)
        order.listedHash = nft.hash.toString()
        order.soldHash = transactionHash.toString()
        order.game = game.id
        order.seller = seller
        order.soldpriceUSD = sellingPriceUSD
        order.buyer = buyer
        order.soldPrice = sellingPrice
        order.status = ""
        order.currency = currency.id
        order.nft = nft.id
        order.market = marketPlace.id
        order.save()
    }

    return order
}