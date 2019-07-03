const json = require('./dist/_data.json');

let orgs = json.filter(el => Array.isArray(el.Accounts));
console.log(orgs.length);

console.log(orgs[0]);

const showMultipleAccounts = () => {
    orgs.forEach(el => {
        let accounts = el.Accounts.reduce((acc, account) => {
            return acc += account.Account + '\n';
        }, '');
        console.log(accounts);
    });
};
//showMultipleAccounts();
//040407853