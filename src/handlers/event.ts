import { SubstrateEvent } from '@subql/types';
import { Event } from '../types/models/Event';
import { BlockHandler } from './block';
import { ExtrinsicHandler } from './extrinsic';
import { CrowdloanHandler } from './sub-handlers/crowdloan';

export class EventHandler {
  private event: SubstrateEvent;

  constructor(event: SubstrateEvent) {
    this.event = event;
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
    if (
      this.section !== 'crowdloan' ||
      (this.section === 'crowdloan' && this.method === 'create')
    ) {
      return;
    }

    await BlockHandler.ensureBlock(this.blockHash);

    if (this.extrinsicHash) {
      await ExtrinsicHandler.ensureExtrinsic(this.extrinsicHash);
    }

    const event = new Event(this.id);

    event.index = this.index;
    event.section = this.section;
    event.method = this.method;
    event.data = this.data;

    event.blockId = this.blockHash;
    event.timestamp = this.timestamp;

    if (this.extrinsicHash) {
      event.extrinsicId = this.extrinsicHash;
    }

    await event.save();

    await CrowdloanHandler.check(this.event);
  }
}
