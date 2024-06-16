import { Request,Response } from "express";

export const pingCheck = (_:Request,res:Response)=>{
    // console.log("request url",req.url);
    return res.status(200).json({
        message:'Ping check ok'
    });
};