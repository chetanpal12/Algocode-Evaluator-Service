import { Job } from "bullmq";

import { Ijob } from "../types/bullMqJobDefination";

export default class SampleJob implements Ijob{
    name:string;
    payload: Record<string, unknown> | undefined;
    constructor(payload:Record<string,unknown>){
        this.name=this.constructor.name;
        this.payload=payload;
    }

    handle=(job?:Job)=>{
        console.log("Handler of the job called");
        console.log(this.payload);
        if(job){
            console.log(job.name,job.id,job.data);
        }

    };
    failed= (job?: Job) : void=>{
        console.log("job failed");
        if(job){
            console.log(job.id);
        }
    }; 
}