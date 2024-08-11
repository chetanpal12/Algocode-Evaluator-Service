import DockerStreamOutput from "../types/dockerStreamOutput";
import { DOCKER_STREAM_HEADER_SIZE } from "../utils/constants";



export function decodeDockerStream(buffer: Buffer) : DockerStreamOutput{
    let offset = 0; // This variable keeps track of the current position in the buffer while parsing

    // The output that will store the accumulated stdout and stderr output as strings
    const output: DockerStreamOutput = { stdout: '' , stderr: ''}; 

    // Loop until offset reaches end of the buffer
    while(offset < buffer.length) {

        // channel is read from buffer and has value of type of stream
        const typeOfStream = buffer[offset];

        // This length variable hold the length of the value 
        // We will read this variable on an offset of 4 bytes from the start of the chunk
        const length = buffer.readUint32BE(offset + 4);

        // as now we have read the header, we can move forward to the value of the chunk
        offset += DOCKER_STREAM_HEADER_SIZE;

        if(typeOfStream === 1) {
            // stdout stream
            output.stdout += buffer.toString('utf-8', offset, offset + length);
        } else if(typeOfStream === 2) {
            // stderr stream
            output.stderr += buffer.toString('utf-8', offset, offset + length);
        }

        offset += length; // move offset to next chunk
    }

    return output;
}


export function fetchDecodedStream(loggerStream: NodeJS.ReadableStream, rawLogBuffer: Buffer[]) : Promise<string> {
    // TODO: May be moved to the docker helper util
   
    return new Promise((res, rej) => {
        const timeout = setTimeout(() => {
            console.log("Timeout called");
            rej("TLE");
        }, 2000);
        loggerStream.on('end', () => {
            // This callback executes when the stream ends
            clearTimeout(timeout);
            console.log(rawLogBuffer);
            const completeBuffer = Buffer.concat(rawLogBuffer);
            const decodedStream = decodeDockerStream(completeBuffer);
            console.log(decodedStream);
            console.log(decodedStream.stdout);
            if(decodedStream.stderr) {
                rej(decodedStream.stderr);
            } else {
                res(decodedStream.stdout);
            }
        });
    })
}

// todo
// hey we have to add the fetchdecoded and for every language it should take the time limit and that according to that 
