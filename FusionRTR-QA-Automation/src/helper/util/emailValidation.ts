import Imap = require('imap');

export default class OutlookEmailAutomation {
    private username:string;
    private password:string;
    private imap: Imap;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
        this.imap = new Imap({
            user: this.username,
            password: this.password,
            host: 'mail.realpage.com',
            port: 993,
            tls: true
        });
    }

    async connect() {
        return new Promise<void>((resolve, reject) => {
            this.imap.once('ready', () => {
                resolve();
            });
            this.imap.once('error', (err) => {
                reject(err);
            });
            this.imap.connect();
        });
    }

    async openInbox() {
        return new Promise<void>((resolve, reject) => {
            this.imap.openBox('INBOX', true, (err, box) => {
                if(err) {
                    reject();
                } else {
                    resolve();
                }
            });
        });
    }

    async searchUnseenEmails() {
        return new Promise<number[]>((resolve, reject) => {
            const searchCriteria = ['UNSEEN'];
            this.imap.search(searchCriteria, (err, results) => {
                if(err) {
                    reject();
                } else {
                    resolve(results);
                }
            });
        });
    }

    async fetchEmailContent(emailId: number) {
        return new Promise<string>((resolve, reject) => {
            const fetch = this.imap.fetch([emailId], { bodies: '' });
            fetch.on('message', (msg) => {
                let emailContent = '';
                msg.on('body', (stream) => {
                    stream.on('data', (chunk) => {
                        emailContent += chunk.toString('utf8');
                    });
                });
                msg.on('end', () => {
                    resolve(emailContent);
                });
            });
        });
    }

    async closeConnection() {
        return new Promise<void>((resolve) => {
            this.imap.end();
            resolve();
        });
    }
}