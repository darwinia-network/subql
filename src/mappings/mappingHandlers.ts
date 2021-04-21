import { SubstrateBlock, SubstrateEvent, SubstrateExtrinsic } from "@subql/types";
import { ExtrinsicHandler } from "../handlers";

export async function handleBlock(block: SubstrateBlock): Promise<void> {
  // const handler = new BlockHandler(block);

  // await handler.save();
}

export async function handleEvent(event: SubstrateEvent): Promise<void> {

}

export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void> {
  const handler = new ExtrinsicHandler(extrinsic);

  await handler.save();
}
