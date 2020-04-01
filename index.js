const superagent = require('superagent');
const dotenv = require('dotenv');
dotenv.config();

const URLS = process.env.URLS.split(',') || [];
const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK || undefined;
const INTERVAL = process.env.INTERVAL || (10 * 60 * 1000); // every ten minutes if nothing else set

const ping = async (url) => {
    console.log("ping -> url", url)
    try {
        const res = await superagent.get(url);
        return res.statusCode;
    } catch (err) {
        console.error(err);
        throw new Error('Could not initiate ping.');
    }
};

const postToSlack = async (data) => {
    if (SLACK_WEBHOOK) {
        const response = await superagent.post(SLACK_WEBHOOK)
        .send(data)
        .set('accept', 'json')
        .catch((err) => {
            console.error(err);
        });
    }
    else console.info('Slack webhook not setup.');
};

const createPostObject = (statusList) => {
    return {
        "blocks": statusList.map(data => ({
            "type:": "section",
            "text": {
                "type": "mrkdwn",
                "text": `${data.url} - ${data.statusCode}`
            }
        })),
    };
};

const makeRun = async () => {
    const responses = [];
    for (url of URLS) {
        const statusCode = await ping(url);
        responses.push({ url, statusCode });
    }

    const postObject = createPostObject(responses);
    console.log("makeRun -> postObject", postObject)
    postToSlack(postObject);
};

const start = () => {
    if (process.env.NODE_ENV === 'development') process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    setTimeout(() => {
        const interval = setInterval(makeRun, INTERVAL);
    }, 3000);
};

start();
