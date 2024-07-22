import { createBullBoard } from "@bull-board/api";
import {BullMQAdapter} from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";

import sampleQueue from "../queues/sampleQueues";
import submissionQueue from "../queues/submissionQueue";


const myQueue = sampleQueue;

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/bullboard/ui');
createBullBoard({
    queues: [
      new BullMQAdapter(myQueue),
      new BullMQAdapter(submissionQueue),
    ],
    serverAdapter,
});

export default serverAdapter;