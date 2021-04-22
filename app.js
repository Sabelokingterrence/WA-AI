const wa = require('@open-wa/wa-automate');
const fs = require('fs');
var parseJson;
var flag = 0;

wa.create({
    sessionId: "test-bot",
    authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
    blockCrashLogs: true,
    disableSpins: true,
    headless: true,
    onChrome: true,
    hostNotificationLang: 'PT_BR',
    logConsole: false,
    popup: true,
    qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
}).then(client => start(client));

function start(client) {
    client.onMessage(async message => {
        flag = 0;
        fs.readFile('cars.json', function (err, content) {
            if (err) throw err;
            parseJson = JSON.parse(content);
            for (var i in parseJson.users) {
                if (parseJson.users[i].number === message.from) {
                    flag = 1;
                    if (parseJson.users[i].order === "1") {
                        client.sendText(message.from, "Hello... Welcome to the Whatsapp Car Service! \n\n1. Look for a car. \n2. Sell my car. \n3. Fix my car \n4. Car Specials \n5. Ready to make purchase");
                        parseJson.users[i].order = "2";
                    }
                    else if (parseJson.users[i].order === "2") {
                        if (message.body === "1") {
                            client.sendText(message.from, "Choose installment range: \n\n1. R0 to R2000 \n1. R2000 to R4000 \n1. R4000 to R6000 \n1. R6000+");
                            parseJson.users[i].order = "3";
                        }
                        else if (message.body === "2") {
                            client.sendText(message.from, "Please send the most recent picture of your car");
                            parseJson.users[i].order = "5";
                        }
                        else if (message.body === "3") {
                            client.sendText(message.from, "A consultant will be in touch shortly");
                            parseJson.users[i].order = "1";
                        }
                        else if (message.body === "4") {
                            client.sendImage(message.from, "./pic4.jpg", "pic4.jpg", "Reply with 1 to make purchase or reply with 2 for previous menu");
                            parseJson.users[i].order = "4";
                        }
                        else if (message.body === "5") {
                            client.sendText(message.from, "A consultant will be in touch shortly");
                            parseJson.users[i].order = "1";
                        }
                        else {
                            client.sendText(message.from, "Invalid response, please send any number between 1 and 5");
                            parseJson.users[i].order = "2";
                        }
                    }
                    else if (parseJson.users[i].order === "3") {
                        if (message.body === "1") {
                            parseJson.users[i].order = "4";
                            client.sendImage(message.from, "./pic4.jpg", "pic4.jpg", "Reply with 1 to make purchase or reply with 2 for previous menu");
                        }
                        else if (message.body === "2") {
                            parseJson.users[i].order = "4";
                            client.sendImage(message.from, "./pic2.jpg", "pic2.jpg", "Reply with 1 to make purchase or reply with 2 for previous menu");
                        }
                        else if (message.body === "3") {
                            parseJson.users[i].order = "4";
                            client.sendImage(message.from, "./pic3.jpg", "pic3.jpg", "Reply with 1 to make purchase or reply with 2 for previous menu");
                        }
                        else if (message.body === "4") {
                            parseJson.users[i].order = "4";
                            client.sendImage(message.from, "./pic3.jpg", "pic3.jpg", "Reply with 1 to make purchase or reply with 2 for previous menu");
                        }
                        else if (message.body === "5") {
                            client.sendImage(message.from, "./pic4.jpg", "pic4.jpg", "Reply with 1 to make purchase or reply with 2 for previous menu");
                            parseJson.users[i].order = "4";
                        }
                        else {
                            client.sendText(message.from, "Invalid response, please send any number between 1 and 5");
                            parseJson.users[i].order = "3";
                        }
                    }
                    else if (parseJson.users[i].order === "4") {
                        if (message.body === "1") {
                            client.sendText(message.from, "A consultant will be in touch shortly");
                            parseJson.users[i].order = "1";
                        }
                        else if (message.body === "2") {
                            client.sendText(message.from, "Choose installment range: \n\n1. R0 to R2000 \n1. R2000 to R4000 \n1. R4000 to R6000 \n1. R6000+");
                            parseJson.users[i].order = "3";
                        }
                        else {
                            client.sendText(message.from, "Hello.... Welcome to the Whatsapp Car Service! \n\n1. Look for a car. \n2. Sell my car. \n3. Fix my car \n4. Car Specials \n5. Ready to make purchase");
                            parseJson.users[i].order = "2";
                        }
                    }
                    else if (parseJson.users[i].order === "5") {
                        client.sendText(message.from, "We will be in touch shortly with an offer");
                        parseJson.users[i].order = "1";
                    }
                    fs.writeFile('cars.json', JSON.stringify(parseJson), function (err) {
                        if (err) throw err;
                        console.log("done");
                    });
                }
            }
            if (flag === 0) {
                parseJson.users.push({ number: message.from, order: "2", home: "0" });
                client.sendText(message.from, "Hello... Welcome to the Whatsapp Car Service! \n\n1. Look for a car. \n2. Sell my car. \n3. Fix my car \n4. Car Specials \n5. Ready to make purchase");
                fs.writeFile('cars.json', JSON.stringify(parseJson), function (err) {
                    if (err) throw err;
                    console.log("done");
                });
            }
        });
    });
}