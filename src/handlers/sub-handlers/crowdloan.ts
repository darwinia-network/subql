import { SubstrateBlock, SubstrateEvent } from '@subql/types';
import {
  CrowdloanContributed,
  CrowdloanMemo,
  CrowdloanReferStatistics,
  CrowdloanWhoStatistics,
} from '../../types';
import { AccountHandler } from './account';

const START_BLOCK = BigInt(8263710);

export class CrowdloanHandler {
  static async check(substrateEvent: SubstrateEvent) {
    const {
      event: { method },
    } = substrateEvent;

    if (method === 'MemoUpdated') {
      this.handleMemoUpdate(substrateEvent);
    }

    if (method === 'Contributed') {
      await this.ensureMemoUpdated(substrateEvent);

      this.handleContributed(substrateEvent);
    }
  }

  static async ensureMemoUpdated({ event, block }: SubstrateEvent) {
    const [account] = JSON.parse(event.data.toString()) as [string, number, number];
    const target = await CrowdloanMemo.get(account);

    if (!target) {
      const memoEvent = block.events.find((item) => item.event.method === 'MemoUpdated');

      if (memoEvent) {
        await this.handleMemoUpdate({ event: memoEvent.event, block });
      } else {
        logger('Can not find MemoUpdated event in block ', block.block.header.number.toString());
      }
    }
  }

  static async handleMemoUpdate({
    event: { data, method },
    block: { timestamp, block },
  }: Pick<SubstrateEvent, 'event' | 'block'>) {
    const [account, paraId, memo] = JSON.parse(data.toString());
    if (paraId !== 2003) {
      return;
    }

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

  static async handleContributed({
    event: { data, method },
    block: { timestamp, block },
  }: SubstrateEvent) {
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
