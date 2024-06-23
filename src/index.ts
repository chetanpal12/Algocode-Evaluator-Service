import express,{Express} from 'express';

import serverConfig from './config/serverConfig';
import sampleQueueProducers from './producers/sampleQueueProducers';
import apiRouter from './routes';
import SampleWorker from './worker/sampleWorker';

const app:Express=express();

app.use('/api',apiRouter);

app.listen(serverConfig.PORT,()=>{
    console.log(`server started at port ${serverConfig.PORT}`);
    SampleWorker('SampleQueue');

    sampleQueueProducers('SampleJob', {
        name: "Sarthak",
        company: "swiggy",
        position: "PM 2",
        locatiion: "Noida"
        },2);

    sampleQueueProducers('SampleJob', {
    name: "Sanket",
    company: "Microsoft",
    position: "SDE 2 L61",
    locatiion: "Remote | BLR | Noida"
    },1);
});
