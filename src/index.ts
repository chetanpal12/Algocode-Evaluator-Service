import bodyParser from "body-parser";
import express,{Express} from 'express';

import bullBoardAdapter from "./config/bullBoardConfig";
import serverConfig from './config/serverConfig';
import submissionQueueProducer from "./producers/submissionQueueProducer";
// import runCpp from "./containers/runCpp";
// import runJava from "./containers/runJavaDocker";
// import runPython from "./containers/runPythonDocker";
// import sampleQueueProducers from './producers/sampleQueueProducers';
import apiRouter from './routes';
import { submission_queue } from "./utils/constants";
import SampleWorker from './worker/sampleWorker';
import SubmissionWorker from "./worker/SubmissionWorker";

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

  SubmissionWorker(submission_queue);

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
  // const code = `x = input()
  // y = input()
  // print("value of x is", x)
  // print("value of y is", y)
  // `;

  // const inputCase = `100
  // 200
  // `;

  // const inputCase=`10`;
  // const code=`import java.util.*;
  //     public class Main {
  //         public static void main(String[] args) {
  //             Scanner scn = new Scanner(System.in);
  //             int input = scn.nextInt();
  //             System.out.println("Input value given by User: " + input);
  //             for (int i = 0; i < input; i++) {
  //                 System.out.println(i);
  //             }
  //         }
  //     }
  //   `;



  const userCode = `
  
    class Solution {
      public:
      vector<int> permute() {
          vector<int> v;
          v.push_back(10);
          return v;
      }
    };
  `;

  const code = `
  #include<iostream>
  #include<vector>
  #include<stdio.h>
  using namespace std;
  
  ${userCode}
  int main() {
    Solution s;
    vector<int> result = s.permute();
    for(int x : result) {
      cout<<x<<" ";
    }
    cout<<endl;
    return 0;
  }
  `;

const inputCase = `10
`;

submissionQueueProducer({"1234": {
  language: "CPP",
  inputCase,
  code
}});

  // runCpp(code, inputCase);

  // runPython(code, inputCase);
  // runJava(code,inputCase);
});
