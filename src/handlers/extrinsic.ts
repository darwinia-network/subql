import { SubstrateExtrinsic } from '@subql/types';
import { checkIfExtrinsicExecuteSuccess, getBatchInterruptedIndex } from '../helpers';
import { Extrinsic } from '../types/models/Extrinsic';
import { BlockHandler } from './block';
import { AccountHandler } from './sub-handlers/account';

export class ExtrinsicHandler {
  private extrinsic: SubstrateExtrinsic;

  static async ensureExtrinsic(id: string): Promise<void> {
    const extrinsic = await Extrinsic.get(id);

    if (!extrinsic) {
      await new Extrinsic(id).save();
    }
  }

  constructor(extrinsic: SubstrateExtrinsic) {
    this.extrinsic = extrinsic;
  }

  get id(): string {
    return this.extrinsic?.extrinsic?.hash?.toString();
  }

  get method(): string {
    return this.extrinsic.extrinsic.method.method;
  }

  get section(): string {
    return this.extrinsic.extrinsic.method.section;
  }

  get args(): string {
    const { args, meta } = this.extrinsic?.extrinsic || {};
    const { args: argsDef } = meta;
    const result = args.map((arg, index) => {
      const { name, type } = argsDef[index];

      return { name, type, value: arg.toHuman() };
    });

    return JSON.stringify(result);
  }

  get signer(): string {
    return this.extrinsic?.extrinsic?.signer?.toString();
  }

  get nonce(): bigint {
    return this.extrinsic?.extrinsic?.nonce?.toBigInt() || BigInt(0);
  }

  get timestamp(): Date {
    return this.extrinsic.block.timestamp;
  }

  get blockHash(): string {
    return this.extrinsic?.block?.block?.hash?.toString();
  }

  get isSigned(): boolean {
    return this.extrinsic.extrinsic.isSigned;
  }

  get signature(): string {
    return this.extrinsic.extrinsic.signature.toString();
  }

  get tip(): bigint {
    return this.extrinsic.extrinsic.tip.toBigInt() || BigInt(0);
  }

  get isSuccess(): boolean {
    return checkIfExtrinsicExecuteSuccess(this.extrinsic);
  }

  get batchInterruptedIndex(): number {
    return getBatchInterruptedIndex(this.extrinsic);
  }

  public async save() {
    const record = new Extrinsic(this.id);

    await BlockHandler.ensureBlock(this.blockHash);
    await AccountHandler.ensureAccount(this.signer);

    const data = this.extrinsic.extrinsic.toHuman();

    record.method = this.method;
    record.section = this.section;
    record.args = this.args;
    record.signerId = this.signer;
    record.nonce = this.nonce;
    record.isSigned = this.isSigned;
    record.timestamp = this.timestamp;
    record.signature = this.signature;
    record.tip = this.tip;
    record.isSuccess = this.isSuccess;
    record.blockId = this.blockHash;

    await record.save();
  }
}
