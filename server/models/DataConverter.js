class DataConverter {
    constructor(data, next) {
        if (!data || !data.ParticipantInfo || !data.Accounts) {
            next('cannot create data instance');
            return this;
        }

        let {NameP, Tnp, Nnp, Adr} = data.ParticipantInfo;

        this.BIC = data.BIC;
        this.name = NameP;
        this.Tnp = Tnp;
        this.Nnp = Nnp;
        this.Adr = Adr;
        this.account = DataConverter.getCorAccount(data.Accounts);
    }

    static getCorAccount(accounts) {
        if (Array.isArray(accounts)) {
            let account = accounts.find(account => account.Account.toString().startsWith('301'));
            if (account !== undefined) {
                return account.Account;
            }
        } else if (accounts.Account) {
            return accounts.Account;
        }

        return '';
    }

    static convertToModel(data) {
        if (!data) return null;
        return {
            BIC: data.BIC,
            ParticipantInfo: {
                NameP: data.name,
                Tnp: data.Tnp,
                Nnp: data.Nnp,
                Adr: data.Adr
            },
            Accounts: {
                Account: data.account
            }
        }
    }
}

module.exports = DataConverter;