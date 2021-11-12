import { SubstrateEvent } from '@subql/types';
import {
  CrowdloanContributed,
  CrowdloanMemo,
  CrowdloanReferStatistics,
  CrowdloanWhoStatistics,
} from '../../types';
import { AccountHandler } from './account';

const START_BLOCK = BigInt(9473310);

export class CrowdloanHandler {
  static async check({ event, block: { events, timestamp, block } }: SubstrateEvent) {
    const target = events.find((item) => item.event.section === 'crowdloan');

    if (!target) {
      return;
    }

    const { data, method } = target.event;

    if (method === 'MemoUpdated') {
      const [account, paraId, memo] = JSON.parse(data.toString());

      const instance = new CrowdloanMemo(account);

      instance.who = account;
      instance.paraId = paraId;
      instance.memo = memo;
      instance.timestamp = timestamp;
      instance.blockId = block.hash.toString();

      try {
        await instance.save();
      } catch (error) {
        logger('CrowdloanHandler error method: ', method);
      }
    }

    if (method === 'Contributed') {
      const [account, paraId, amount] = JSON.parse(data.toString()) as [string, number, number];

      if (paraId !== 2003) {
        return;  
      }

      const balance = BigInt(amount);

      await AccountHandler.ensureAccount(account);
      await AccountHandler.updateCrowdloanStatistic(account, balance);

      const refer = (await CrowdloanMemo.get(account))?.memo || null;
      const rewardEarly =
        block.header.number.toBigInt() < START_BLOCK ? balance / BigInt(5) : BigInt(0);
      const powerBase = balance + rewardEarly;
      const powerWho = powerBase + (!refer ? BigInt(0) : powerBase / BigInt(20));
      const powerRefer = !refer ? BigInt(0) : powerBase / BigInt(20);
      const instance = new CrowdloanContributed(block.hash.toString());

      await CrowdloanWho.ensure(account);
      await CrowdloanWho.update(account, balance, powerWho);

      if (refer) {
        instance.referStatisticsId = refer;

        await CrowdloanRefer.ensure(refer);
        await CrowdloanRefer.update(refer, balance, powerRefer);
      }

      instance.who = account;
      instance.refer = refer;
      instance.balance = balance;
      instance.powerWho = powerWho;
      instance.powerRefer = powerRefer;
      instance.paraId = paraId;
      instance.timestamp = timestamp;
      instance.whoStatisticsId = account;
      instance.blockId = block.hash.toString();

      try {
        await instance.save();
      } catch (error) {
        logger('CrowdloanHandler error method: ', method);
      }
    }
  }
}

export class CrowdloanWho {
  static async ensure(id: string) {
    const target = await CrowdloanWhoStatistics.get(id);

    if (!target) {
      const statistics = new CrowdloanWhoStatistics(id);

      statistics.totalBalance = BigInt(0);
      statistics.totalPower = BigInt(0);
      statistics.user = id;

      await statistics.save();

      return statistics;
    }
  }

  static async update(id: string, balance: bigint, power: bigint) {
    const target = await CrowdloanWhoStatistics.get(id);

    target.totalBalance = target.totalBalance + balance;
    target.totalPower = target.totalPower + power;

    await target.save();
  }
}

export class CrowdloanRefer {
  static async ensure(id: string) {
    const target = await CrowdloanReferStatistics.get(id);

    if (!target) {
      const statistics = new CrowdloanReferStatistics(id);

      statistics.totalBalance = BigInt(0);
      statistics.totalPower = BigInt(0);
      statistics.user = id;

      await statistics.save();

      return statistics;
    }
  }

  static async update(id: string, balance: bigint, power: bigint) {
    const target = await CrowdloanReferStatistics.get(id);

    target.totalBalance = target.totalBalance + balance;
    target.totalPower = target.totalPower + power;

    await target.save();
  }
}
