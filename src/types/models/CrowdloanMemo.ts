// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class CrowdloanMemo implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public who: string;

    public paraId: number;

    public memo?: string;

    public timestamp?: Date;

    public blockId?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save CrowdloanMemo entity without an ID");
        await store.set('CrowdloanMemo', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove CrowdloanMemo entity without an ID");
        await store.remove('CrowdloanMemo', id.toString());
    }

    static async get(id:string): Promise<CrowdloanMemo | undefined>{
        assert((id !== null && id !== undefined), "Cannot get CrowdloanMemo entity without an ID");
        const record = await store.get('CrowdloanMemo', id.toString());
        if (record){
            return CrowdloanMemo.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new CrowdloanMemo(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
