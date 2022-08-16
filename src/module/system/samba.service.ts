import { Injectable } from '@nestjs/common';
import { BaseService } from "../../services/base.service";
import * as Buffer from "buffer";

@Injectable()
export class SambaService extends BaseService{
    private readonly smb;

    constructor(props) {
        super(props);
        const SMB2 = require('smb2');
        this.smb = new SMB2({
            share: "\\\\192.168.0.8\\Images"
            , domain:"vkbdisk"
            , username:"ApacheImages333"
            , password:"HJDfgt67YudF78@"
            , autoCloseTimeout: 0
        })
    }

    async readFile(fileName: string): Promise<any>{
        const startWith = '\\\\vkbdisk\\images\\';
        if (fileName.startsWith(startWith)){
            fileName = fileName.substring(startWith.length);
        }
        fileName = fileName.replace(/\\/g, '/');

        return await new Promise((resolve, reject)=>{
            this.smb.readFile(fileName, (err, data: Buffer)=>{
                if (err) reject(err);
                console.log(data.constructor);
                resolve(data);
            })
        })
    }
}
