const Credit_Organization = require('../models/creditOrganization.model');
const DataConverter = require('../models/DataConverter');

// requested fields from document
const fields = 'BIC ParticipantInfo.NameP Accounts ParticipantInfo.Tnp ParticipantInfo.Nnp ParticipantInfo.Adr';
// filters: [bic, name]

const getQuery = (reqQuery) => {
    if (Object.keys(reqQuery).length > 0) {
        let { bic, name } = reqQuery;
        let query = {};
        if (bic) {
            query["BIC"] = bic;
        }
        if (name) {
            query["ParticipantInfo.NameP"] = name
        }
        return query;
    }
    return {};
};

const getEntries = (req, res, next) => {
    //console.log('get entries');
    // pagination
    let perPage = 50;
    let page = Number.parseInt(req.query.page, 10) || 1;

    let query = getQuery(req.query);
    Credit_Organization
        .find(query, fields)
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec((err, orgs) => {
            Credit_Organization.estimatedDocumentCount().then((count) => {

                let data = [];
                if (Array.isArray(orgs)) {
                    data = orgs.map(org => new DataConverter(org));
                }  else {
                    next(`expected array, but got ${orgs}`);
                }

                // todo refactor
                if (data.length === 1) {
                    res.send({
                        data,
                        page: 1,
                        pageCount: 1
                    });

                } else {
                    res.send({
                        data,
                        page,
                        pageCount: Math.ceil(count / perPage)
                    });
                }
                next();
            },
            err => {
                if (err) return next(err);
            })
        });
};

const getEntry = (req, res, next) => {
    Credit_Organization.findOne({BIC: req.params.bic}, fields, (err, org) => {
        if (err) return next(err);

        org !== null
            ? res.send(new DataConverter(org, next))
            : res.status(404).send('Not found');

        next();
    });
};

const createEntry = (req, res, next) => {
    Credit_Organization.exists({BIC: req.body.BIC}).then(isExists => {
        if (!isExists) {
            Credit_Organization.create(
                DataConverter.convertToModel(req.body),
                (err, data) => {
                    if (err) return next(err);
                    console.log(`created entry with BIC ${req.body.BIC}`);
                    res.send(data);
                    next();
                });
        } else {
            console.log('entry with same BIC already exists');
            res.status(409).send('entry with same BIC already exists');
        }
    });
};

const updateEntry = (req, res, next) => {
    Credit_Organization.exists({BIC: req.body.BIC}).then(isExists => {
        if (isExists) {
            Credit_Organization.findOneAndUpdate(
                { BIC: req.body.BIC },
                { $set: DataConverter.convertToModel(req.body) },
                {
                    useFindAndModify: false,
                    new: true
                },
                (err, updatedEntry) => {
                    if (err) return next(err);
                    console.log(`entry with ${req.body.BIC} was successfully updated !`);
                    res.send(updatedEntry);
                }
            );
        } else {
            let message = 'entry with same BIC does not exist';
            console.log(message);
            res.status(404).send(message);
        }
    });
};

const deleteEntry = (req, res, next) => {
    Credit_Organization.exists({BIC: req.params.bic}).then(isExists => {
        if (isExists) {
            Credit_Organization.deleteOne({BIC: req.params.bic}, err => {
                if (err) return next(err);
                let message = `entry with ${req.params.bic} was successfully deleted`;
                console.log(message);
                res.send(message);
            })
        } else {
            let message = 'entry with same BIC does not exist';
            console.log(message);
            res.status(404).send(message);
        }
    });
};

module.exports = {
    getEntries,
    getEntry,
    createEntry,
    updateEntry,
    deleteEntry
};