import { SubstrateEvent } from '@subql/types';
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
  static async check({ event, block: { events, timestamp, block } }: SubstrateEvent) {
    if (event.method !== 'Transfer' ) {
      return;
    }

    const { data, section } = event;
    const [from, to, amount] = JSON.parse(data.toString());

    await AccountHandler.ensureAccount(to);
    await AccountHandler.updateTransferStatistic(to);
    await AccountHandler.ensureAccount(from);
    await AccountHandler.updateTransferStatistic(from);
    await TokenHandler.ensureToken(section);
    await BlockHandler.ensureBlock(block.hash.toString());

    const transfer = new Transfer(event.hash.toString());

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
          fee = BigInt(parseInt(JSON.parse(cur.event.data.toString())[FeePosition[cur.event.method]]));
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
  }
}
