import { SubstrateBlock, SubstrateEvent } from '@subql/types';
import { TOKEN_DECIMAL } from '../../helpers';
import { Transfer } from '../../types/models/Transfer';
import { BlockHandler } from '../block';
import { AccountHandler } from './account';
import { TokenHandler } from './token';

enum FeePosition {
  'DepositRing',
  'Deposit',
}

export class TransferHandler {
  static async checkTransfer({ events, timestamp, block }: SubstrateBlock) {
    events.forEach(async (item, index) => {
      if (item.event.method !== 'Transfer') {
        return;
      }

      const { data, section } = item.event;
      const [from, to, amount] = JSON.parse(data.toString());

      await AccountHandler.ensureAccount(to);
      await AccountHandler.updateTransferStatistic(to);
      await AccountHandler.ensureAccount(from);
      await AccountHandler.updateTransferStatistic(from);
      await TokenHandler.ensureToken(section);

      // FIXME: without the suffix, some records may be override, why?
      const transfer = new Transfer(item.event.hash.toString() + '_' + index);

      transfer.toId = to;
      transfer.fromId = from;
      transfer.tokenId = section;
      transfer.amount = BigInt(amount);
      transfer.timestamp = timestamp;
      transfer.blockNumber = block.header.number.toBigInt();
      transfer.blockId = block.hash.toString();
      transfer.fee = events.reduce((total, cur) => {
        const method = cur.event.method;
        let fee = BigInt(0);

        if ([FeePosition[0], FeePosition[1]].includes(method)) {
          try {
            fee = BigInt(
              parseInt(JSON.parse(cur.event.data.toString())[FeePosition[cur.event.method]])
            );
          } catch (err) {}

          return total + BigInt(fee);
        }

        return total;
      }, BigInt(0));

      try {
        await transfer.save();
      } catch (error) {
        console.log(error.message);
      }
    });
  }
}
