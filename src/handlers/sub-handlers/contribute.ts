import { SubstrateEvent } from '@subql/types';
import { CrowdloanContributed, CrowdloanMemo } from '../../types';
import { AccountHandler } from './account';

export class CrowdloanHandler {
  static async check({ event, block: { events, timestamp, block } }: SubstrateEvent) {
    const target = events.find((item) => item.event.section === 'Crowdloan');

    if (!target) {
      return;
    }

    const { data, method } = target.event;
    let instance: CrowdloanMemo | CrowdloanContributed | null = null;

    if (method === 'MemoUpdated') {
      const [account, paraId, memo] = JSON.parse(data.toString());

      instance = new CrowdloanMemo(event.hash.toString());

      instance.whoId = account;
      instance.paraId = paraId;
      instance.memo = memo;
      instance.timestamp = timestamp;
      instance.blockId = block.hash.toString();
    }

    if (method === 'Contributed') {
      const [account, paraId, balance] = JSON.parse(data.toString());

      await AccountHandler.ensureAccount(account);
      await AccountHandler.updateCrowdloanStatistic(account, balance);

      instance = new CrowdloanContributed(event.hash.toString());

      instance.who = account;
      instance.paraId = paraId;
      instance.balance = balance;
      instance.timestamp = timestamp;
    }

    try {
      if (instance) {
        await instance.save();
      }
    } catch (error) {
      logger('CrowdloanHandler error method: ', method);
    }
  }
}
