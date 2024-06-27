import { Request,Response } from "express";

import logger from "../config/logger.config";

export const pingCheck = (_:Request,res:Response)=>{
    // console.log("request url",req.url);
    logger.error('hey winston is working');
    return res.status(200).json({
        message:'Ping check ok'
    });
};