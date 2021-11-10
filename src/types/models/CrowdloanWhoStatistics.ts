// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class CrowdloanWhoStatistics implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public user?: string;

    public totalBalance: bigint;

    public totalPower: bigint;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save CrowdloanWhoStatistics entity without an ID");
        await store.set('CrowdloanWhoStatistics', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove CrowdloanWhoStatistics entity without an ID");
        await store.remove('CrowdloanWhoStatistics', id.toString());
    }

    static async get(id:string): Promise<CrowdloanWhoStatistics | undefined>{
        assert((id !== null && id !== undefined), "Cannot get CrowdloanWhoStatistics entity without an ID");
        const record = await store.get('CrowdloanWhoStatistics', id.toString());
        if (record){
            return CrowdloanWhoStatistics.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new CrowdloanWhoStatistics(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
