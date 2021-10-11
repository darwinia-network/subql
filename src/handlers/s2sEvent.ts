import { SubstrateEvent } from '@subql/types';
import { S2SEvent } from '../types';

export class S2SEventHandler {
  private event: SubstrateEvent;

  constructor(event: SubstrateEvent) {
    this.event = event;
  }

  get method() {
    return this.event.event.method;
  }

  get data() {
    return this.event.event.data.toString();
  }

  get id() {
    const data = this.event.event.data;

    return data[0].toString();
  }

  // hash requestTxHash/responseTxHash
  get extrinsicHash() {
    const i = this.event?.extrinsic?.extrinsic?.hash?.toString();

    return i === 'null' ? undefined : i;
  }

  // startTimestamp/endTimestamp
  get timestamp() {
    return this.event.block.timestamp;
  }

  public async save() {
    if (this.method === 'TokenLocked') {
      const [
        messageId,
        {
          native: { address, value },
        },
        sender,
        recipient,
      ] = JSON.parse(this.data) as [
        string,
        { native: { address: string; value: number; option: null } },
        string,
        string,
        number
      ];
      const event = new S2SEvent(messageId);

      event.requestTxHash = this.extrinsicHash;
      event.startTimestamp = this.timestamp;
      event.sender = sender;
      event.recipient = recipient;
      event.token = address;
      event.amount = value.toString();
      event.result = 0;
      event.endTimestamp = null;
      event.responseTxHash = null;

      await event.save();
    }

    if (this.method === 'TokenLockedConfirmed') {
      const [messageId, _1, _2, confirmResult] = JSON.parse(this.data) as [
        string,
        { native: { address: string; value: number; option: null } },
        string,
        boolean
      ];

      const event = await S2SEvent.get(messageId);

      if (event) {
        event.responseTxHash = this.extrinsicHash;
        event.endTimestamp = this.timestamp;
        event.result = confirmResult ? 1 : 2;


        await event.save();
      }
    }
  }
}
