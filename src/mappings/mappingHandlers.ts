import { SubstrateBlock, SubstrateEvent, SubstrateExtrinsic } from "@subql/types";
import { BlockHandler } from "../handlers/block";

export async function handleBlock(block: SubstrateBlock): Promise<void> {
  const handler = new BlockHandler(block);
  console.log("%c [ block ]-9", "font-size:13px; background:pink; color:#bf2c9f;", block);

  await handler.save();
}

export async function handleEvent(event: SubstrateEvent): Promise<void> {
  console.log("%c [ event ]-15", "font-size:13px; background:pink; color:#bf2c9f;", event);
}

export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void> {
  console.log("%c [ extrinsic ]-19", "font-size:13px; background:pink; color:#bf2c9f;", extrinsic);
}
