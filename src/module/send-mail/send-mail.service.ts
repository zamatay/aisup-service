import { Injectable } from '@nestjs/common';
import { BaseService } from "../../services/base.service";
import { Cron } from "@nestjs/schedule";
import { mail } from "../../config/mail";
import { TelegramService } from "../../services/telegram.service";
import path from "path";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class SendMailService extends BaseService {
    private working: boolean;

    constructor(props,
                protected telegramService: TelegramService,
                private readonly mailerService: MailerService) {
        super(props);
        this.working = false;
    }

    @Cron(`*/${mail.interval} * 5-23 * * *`, { name: 'sendMail' })
    async handleCron() {
        if (this.working) return;
        this.working = true;
        try {
            // получаем данные писем
            const data = await this.getMail();
            if (data && data.length) {
                let items = [], ids = [];
                for (const idx in data) {
                    ids.push(data[idx].id)
                    items.push(this.execElement(data[idx]));
                }
                try {
                    // отправляем
                    let result = await Promise.all(items);
                    // id отправленных писем
                    const updateIDs = ids.filter((item, i) => result[i]);
                    if (updateIDs.length) {
                        await this.queryBuilder()
                            .update('_ReceiveEmails')
                            .set({ 'DateComplet': new Date() })
                            .where('id in (:...id)', { id: updateIDs })
                            .execute()
                    }
                } catch (e) {
                    this.telegramService.sendMessage(e.message);
                }
            }
        } catch (e) {
            this.telegramService.sendMessage(e.message);
        }
        finally {
            this.working = false;
        }

    }

    getAtachment(row): string {
        return (row.files) ? row.files.split(',').map(item => {
                //console.log(path.parse(item.replace(/\\/ig, '/')));
                let { base: filename, dir } = path.parse(item.replace(/\\/ig, '/'));
                dir = dir.replace('//vkbdisk', 'smb://ApacheImages333:HJDfgt67YudF78@@vkbdisk')
                return { filename, path: dir }
            }
        ) : null;
    }

    execElement(row) {
        try {
            const fromMail = (!row.from) ? `${mail.from_text} <${mail.from}>` : `${row.from} <${mail.from}>`
            const toEmails = mail.TO_EMAIL ? mail.TO_EMAIL : row.emails;
            let html = row.subject;
            if (typeof (html) == 'string' && (html.search(/<html>/) === -1) && (html.search(/\r\n/) !== -1)) {
                html = html.replace(/\r\n/gi, '<br>');
            }
            const sendMail = { to: toEmails, subject: row.theme, html, from: fromMail };
            //console.log(sendMail);
            return this.mailerService.sendMail(sendMail)
        } catch (e) {
            this.telegramService.sendMessage(e.message)
        }
    }

    async getMail() {
        try {
            const query = `
            select top 500 theme, subject, emails, DateComplet, id, isnull([from], 'Администратор АИСУП ВКБ') [from], DateCreate, STUFF(fn, 1, 1, '') files
            from _ReceiveEmails re
                outer apply (select ',' + fileName from _Files where table_id = 53416 and line_id = re.id for xml path ('')) a(fn)
            where DateComplet is null
            order by DateCreate`;
            return await this.manager.query(query);
        } catch (e) {
            this.telegramService.sendMessage(e)
            return false;
        }
    }
}
