// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class CrowdloanContributed implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public who: string;

    public refer?: string;

    public balance: bigint;

    public powerWho: bigint;

    public powerRefer?: bigint;

    public timestamp?: Date;

    public paraId: number;

    public whoStatisticsId?: string;

    public referStatisticsId?: string;

    public blockId?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save CrowdloanContributed entity without an ID");
        await store.set('CrowdloanContributed', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove CrowdloanContributed entity without an ID");
        await store.remove('CrowdloanContributed', id.toString());
    }

    static async get(id:string): Promise<CrowdloanContributed | undefined>{
        assert((id !== null && id !== undefined), "Cannot get CrowdloanContributed entity without an ID");
        const record = await store.get('CrowdloanContributed', id.toString());
        if (record){
            return CrowdloanContributed.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new CrowdloanContributed(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
