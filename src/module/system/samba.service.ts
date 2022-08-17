import { Injectable } from '@nestjs/common';
import { BaseService } from "../../services/base.service";
import * as Buffer from "buffer";

@Injectable()
export class SambaService extends BaseService{
    private readonly smb;

    constructor(props) {
        super(props);
    }

    getSamba(fileName){
        const SMB2 = require('@marsaud/smb2');

        const allowShare = [
            '\\\\192.168.0.8\\Images', '\\\\192.168.0.8\\Документы', '\\\\192.168.0.8\\Общедоступные документы',
            '\\\\vkbdisk\\Images', '\\\\vkbdisk\\Документы', '\\\\vkbdisk\\Общедоступные документы'
        ];
        const idx = allowShare.findIndex(item=>fileName.toLowerCase().startsWith(item.toLowerCase()));

        if (idx >= 0) {
            const share = allowShare[idx].replace('vkbdisk', '192.168.0.8')
            fileName = fileName.substring(allowShare[idx].length + 1).replace(/\\/g, '/');
            return [new SMB2({
                share
                , domain: "vkbdisk"
                //, username: "admin"
                //, password: "ldytbcyc"
                , username: 'ApacheImages333'
                , password: 'HJDfgt67YudF78@'
            }), fileName];
        }
        return null;
    }

    async readFile(fileName: string): Promise<any>{
        const [smb, file] = this.getSamba(fileName);
        return await new Promise((resolve, reject)=>{
            if (smb){
                smb.readFile(file, (err, data: Buffer)=>{
                    if (err) reject(err);
                    resolve(data);
                })
            } else
                resolve(false);
        })
    }
}
