import {
  // getOrCreateFinancialDailySnapshots,
  getOrcreateGameProtocol,
  getOrCreateUsageMetricsDailySnapshot,
  getOrCreateUsageMetricsHourlySnapshot,
  getorcreateUser,
} from "../Utitlity/initializer";
import * as constants from "../Utitlity/constants";
import { Address, BigDecimal, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { ActiveUser } from "../../generated/schema";

export function updateUsageMetrics(block: ethereum.Block, buyer:Address): void {
  // Get Account Information

  const protocol = getOrcreateGameProtocol();
  const usageMetricsDaily = getOrCreateUsageMetricsDailySnapshot(block);
  const usageMetricsHourly = getOrCreateUsageMetricsHourlySnapshot(block);

  usageMetricsDaily.blockNumber = block.number;
  usageMetricsHourly.blockNumber = block.number;

  usageMetricsDaily.timestamp = block.timestamp;
  usageMetricsHourly.timestamp = block.timestamp;

  usageMetricsDaily.dailyTransactionCount += 1;
  usageMetricsHourly.hourlyTransactionCount += 1;

  usageMetricsDaily.cumulativeUniqueUsers = protocol.cumulativeUniqueUsers;
  usageMetricsHourly.cumulativeUniqueUsers = protocol.cumulativeUniqueUsers;

  let dailyActiveUserId = "daily"
    .concat("-")
    .concat(buyer.toHexString())
    .concat("-")
    .concat((block.timestamp.toI64() / constants.SECONDS_PER_DAY).toString());
  let dailyActiveAccount = ActiveUser.load(dailyActiveUserId);

  if (!dailyActiveAccount) {
    dailyActiveAccount = new ActiveUser(dailyActiveUserId);
    dailyActiveAccount.save();

    usageMetricsDaily.dailyActiveUsers += 1;
  }

  let hourlyActiveUserId = "hourly"
    .concat("-")
    .concat(buyer.toHexString())
    .concat("-")
    .concat((block.timestamp.toI64() / constants.SECONDS_PER_HOUR).toString());
  let hourlyActiveUser = ActiveUser.load(hourlyActiveUserId);

  if (!hourlyActiveUser) {
    hourlyActiveUser = new ActiveUser(hourlyActiveUserId);
    hourlyActiveUser.save();

    usageMetricsHourly.hourlyActiveUsers += 1;
  }

  usageMetricsHourly.save();
  usageMetricsDaily.save();
}

// export function updateFinancials(block: ethereum.Block): void {
//   const financialMetrics = getOrCreateFinancialDailySnapshots(block);
//   const protocol = getOrcreateGameProtocol();

//   financialMetrics.cumulativeUsersRevenueUSD =
//     protocol.cumulativeUsersRevenueUSD;
//   financialMetrics.cumulativeGameSideRevenueUSD =
//     protocol.cumulativeGameSideRevenueUSD

//   financialMetrics.blockNumber = block.number;
//   financialMetrics.timestamp = block.timestamp;

//   financialMetrics.save();
// }

