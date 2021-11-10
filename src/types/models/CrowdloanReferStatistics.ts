// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class CrowdloanReferStatistics implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public user: string;

    public totalBalance: bigint;

    public totalPower: bigint;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save CrowdloanReferStatistics entity without an ID");
        await store.set('CrowdloanReferStatistics', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove CrowdloanReferStatistics entity without an ID");
        await store.remove('CrowdloanReferStatistics', id.toString());
    }

    static async get(id:string): Promise<CrowdloanReferStatistics | undefined>{
        assert((id !== null && id !== undefined), "Cannot get CrowdloanReferStatistics entity without an ID");
        const record = await store.get('CrowdloanReferStatistics', id.toString());
        if (record){
            return CrowdloanReferStatistics.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new CrowdloanReferStatistics(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
