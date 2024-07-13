import bodyParser from "body-parser";
import express,{Express} from 'express';

import bullBoardAdapter from "./config/bullBoardConfig";
import serverConfig from './config/serverConfig';
import runPython from "./containers/runPythonDocker";
// import sampleQueueProducers from './producers/sampleQueueProducers';
import apiRouter from './routes';
import SampleWorker from './worker/sampleWorker';

const app:Express=express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use('/api',apiRouter);
app.use('/bullboard/ui', bullBoardAdapter.getRouter());

app.listen(serverConfig.PORT,()=>{
    console.log(`server started at port ${serverConfig.PORT}`);
    console.log(`Bull Board is available at http://localhost:${serverConfig.PORT}/bullboard/ui`);
    SampleWorker('SampleQueue');

    // sampleQueueProducers('SampleJob', {
    //     name: "Sarthak",
    //     company: "swiggy",
    //     position: "PM 2",
    //     locatiion: "Noida"
    //     },2);

    // sampleQueueProducers('SampleJob', {
    // name: "Sanket",
    // company: "Microsoft",
    // position: "SDE 2 L61",
    // locatiion: "Remote | BLR | Noida"
    // },1);

    // const code:string="print('hello')";

    // runPython(code);
    const code = `x = input()
y = input()
print("value of x is", x)
print("value of y is", y)
`;

const inputCase = `100
200
`;

  runPython(code, inputCase);
});
