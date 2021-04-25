import { SubstrateEvent } from '@subql/types';
import { Dispatcher } from '../helpers/dispatcher';
import { Event } from '../types/models/Event';
import { BlockHandler } from './block';
import { ExtrinsicHandler } from './extrinsic';
import { TransferHandler } from './sub-handlers/transfer';

type EventDispatch = Dispatcher<SubstrateEvent>;

export class EventHandler {
  private event: SubstrateEvent;
  private dispatcher: EventDispatch;

  constructor(event: SubstrateEvent) {
    this.event = event;
    this.dispatcher = new Dispatcher();

    this.dispatcher.batchRegister([]);
  }

  get index() {
    return this.event.idx;
  }

  get blockNumber() {
    return this.event.block.block.header.number.toBigInt();
  }

  get blockHash() {
    return this.event.block.block.hash.toString();
  }

  get events() {
    return this.event.block.events;
  }

  get section() {
    return this.event.event.section;
  }

  get method() {
    return this.event.event.method;
  }

  get data() {
    return this.event.event.data.toString();
  }

  get extrinsicHash() {
    const i = this.event?.extrinsic?.extrinsic?.hash?.toString();

    return i === 'null' ? undefined : i;
  }

  get id() {
    return `${this.blockNumber}-${this.index}`;
  }

  get timestamp() {
    return this.event.block.timestamp;
  }

  public async save() {
    await BlockHandler.ensureBlock(this.blockHash);

    if (this.extrinsicHash) {
      await ExtrinsicHandler.ensureExtrinsic(this.extrinsicHash);
    }

    const saveEvent = async (source: {
      id: string;
      index: number;
      section: string;
      method: string;
      data: string;
    }): Promise<void> => {
      const { id, index, section, method, data } = source;
      const event = new Event(id);

      event.index = index;
      event.section = section;
      event.method = method;
      event.data = data;

      event.blockId = this.blockHash;
      event.timestamp = this.timestamp;

      if (this.extrinsicHash) {
        event.extrinsicId = this.extrinsicHash;
      }

      await this.dispatcher.dispatch(`${this.section}-${this.method}`, this.event);

      await event.save();
    };

    // await saveEvent({ id: this.id, index: this.index, method: this.method, data: this.data, section: this.section });

    const records = this.events
      .map((item, index) => {
        const { event } = item;

        if (event.method === 'ExtrinsicSuccess') {
          return null;
        }

        return saveEvent({
          id: `${this.blockNumber}-${index}`,
          section: event.section,
          data: event.data.toString(),
          method: event.method,
          index,
        });
      })
      .filter((item) => !!item);

    await Promise.all(records);

    await TransferHandler.checkTransfer(this.event);
  }
}
