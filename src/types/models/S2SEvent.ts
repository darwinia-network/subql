// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class S2SEvent implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public laneId: string;

    public nonce: bigint;

    public requestTxHash: string;

    public responseTxHash?: string;

    public sender: string;

    public result: number;

    public recipient: string;

    public token: string;

    public amount: string;

    public startTimestamp: Date;

    public endTimestamp?: Date;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save S2SEvent entity without an ID");
        await store.set('S2SEvent', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove S2SEvent entity without an ID");
        await store.remove('S2SEvent', id.toString());
    }

    static async get(id:string): Promise<S2SEvent | undefined>{
        assert((id !== null && id !== undefined), "Cannot get S2SEvent entity without an ID");
        const record = await store.get('S2SEvent', id.toString());
        if (record){
            return S2SEvent.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new S2SEvent(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
