const request = require("request");

exports.getTitle = () => {
    return new Promise((resolve, reject) => {
        request(/*process.env.TITLE_ENDPOINT*/ 'https://firestore.googleapis.com/v1/projects/rokitabot-cfc7e/databases/(default)/documents/rokitabot-discord/title/', (err, res, body) => {
            body = JSON.parse(body);
            if (!err && body) {
                resolve(body.fields);
            } else {
                reject(err);
            }
        });
    });
};