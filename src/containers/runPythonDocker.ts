// -c flag : you if pass your code inside the string then it will run ;
// stty -echo : if we take input in any of the language then it also log whatever we have input it avoids that  
import { PYTHON_IMAGE } from '../utils/constants';
import createContainer from './containerFactory';
import decodeDockerStream from './dockerHelper';
import pullImage from './pullImage';

async function runPython(code:string,inputTestCase: string) {
    const rawLogBuffer: Buffer[] = [];

    console.log("Initialising a new python docker container");
    console.log("image",PYTHON_IMAGE);

    // const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ['python3', '-c', code, 'stty -echo']);
    await pullImage(PYTHON_IMAGE);

    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > test.py && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | python3 test.py`;
    console.log(runCommand);
    const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
        '/bin/sh', 
        '-c',
        runCommand
    ]); 

    await pythonDockerContainer.start();

    console.log("Started the docker container");

    const loggerStream = await pythonDockerContainer.logs({
        stdout: true,
        stderr: true,
        timestamps: false,
        follow: true // whether the logs are streamed or returned as a string
    });

    // Attach events on the stream objects to start and stop reading
    loggerStream.on('data', (chunk) => {
        console.log("reading the buffer chunk by chunk");
        rawLogBuffer.push(chunk);
    });

    // loggerStream.on('end', () => {
    //     console.log("stream end");
    //     console.log(rawLogBuffer);
    //     //we have array of buffer so we are creating a single buffer object by concatinating 
    //     //this is a buffer constuctor if you pass array then it will create the buffer for you 
    //     const completeBuffer = Buffer.concat(rawLogBuffer);
    //     const decodedStream = decodeDockerStream(completeBuffer);
    //     console.log("decoded stream",decodedStream);
    //     console.log("stdout",decodedStream.stdout);

    // });

    // return pythonDockerContainer;
    await new Promise((res) => {
        loggerStream.on('end', () => {
            console.log(rawLogBuffer);
            const completeBuffer = Buffer.concat(rawLogBuffer);
            const decodedStream = decodeDockerStream(completeBuffer);
            console.log(decodedStream);
            console.log(decodedStream.stdout);
            res(decodeDockerStream);
        });
    });

    // remove the container when done with it
    await pythonDockerContainer.remove();
}
export default runPython;