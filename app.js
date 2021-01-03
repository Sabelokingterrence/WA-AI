const wa = require('@open-wa/wa-automate');
const fs = require('fs');
var flag = 0;
var parseJson;
var done = 0;

wa.create({
    sessionId: "bot",
    authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
    blockCrashLogs: true,
    disableSpins: true,
    headless: true,
    hostNotificationLang: 'PT_BR',
    logConsole: false,
    onChrome: true,
    popup: true,
    qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
}).then(client => start(client));

function start(client) {
    client.onMessage(async message => {
        //await client.sendText(message.from, "Hi welcome to the township food services: \n\n1. Place Order \n2. See Menu \n3. Talk to consultant");
        fs.readFile('cars.json', function (err, content) {
            if (err) throw err;
            parseJson = JSON.parse(content);
            flag = 0;
            for (var i in parseJson.users) {
                console.log(parseJson.users[i]);
                if (parseJson.users[i].number === message.from) {
                    if (parseJson.users[i].order === "0") {
                        parseJson.users[i].order = "1";
                        flag = 1;
                    }
                    else if (parseJson.users[i].order === "1") {
                        parseJson.users[i].order = "2";
                        flag = 2;
                    }
                    else if (parseJson.users[i].order === "2") {
                        parseJson.users[i].order = "3";
                        flag = 3;
                    }
                    else if (parseJson.users[i].order === "3") {
                        parseJson.users[i].order = "0";
                        flag = 4;
                    }
                }
            }
            if (flag === 0) {
                parseJson.users.push({ number: message.from, order: "1" });
                flag = 1;
            }
            fs.writeFile('cars.json', JSON.stringify(parseJson), function (err) {
                if (err) throw err;
                console.log("done");
            })
        })
        if (flag === 1) {
            await client.sendText(message.from, "Hi welcome to Kasi Foods. \n\n1. Place Order \n2. Get Menu \n3. Speak to consultant");
        }
        else if (flag === 2) {
            if (message.body === "1") {
                await client.sendText(message.from, "What would you like to order");
            }
            else if (message.body === "2") {
                await client.sendText(message.from, "A menu will be sent shortly");
                fs.readFile('cars.json', function (err, content) {
                    if (err) throw err;
                    parseJson = JSON.parse(content);
                    for (var i in parseJson.users) {
                        console.log(parseJson.users[i]);
                        if (parseJson.users[i].number === message.from) {
                            parseJson.users[i].order = "0";
                        }
                    }
                    fs.writeFile('cars.json', JSON.stringify(parseJson), function (err) {
                        if (err) throw err;
                        console.log("done");
                    });
                })
            }
            else if (message.body === "3") {
                fs.readFile('cars.json', function (err, content) {
                    if (err) throw err;
                    parseJson = JSON.parse(content);
                    for (var i in parseJson.users) {
                        console.log(parseJson.users[i]);
                        if (parseJson.users[i].number === message.from) {
                            parseJson.users[i].order = "0";
                        }
                    }
                    fs.writeFile('cars.json', JSON.stringify(parseJson), function (err) {
                        if (err) throw err;
                        console.log("done");
                    });
                })
                await client.sendText(message.from, "A consultant will be in touch shortly");
            }
        }
        else if (flag === 3) {
            await client.sendText(message.from, "Send location or delivery address");
        }
        else if (flag === 4) {
            await client.sendText(message.from, "Your order is on the way, thank you for using Kasi Foods");
        }
    });
}