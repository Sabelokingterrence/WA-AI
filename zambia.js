const wa = require('@open-wa/wa-automate');
const fs = require('fs');
var parseJson;
var flag = 0;

wa.create({
    sessionId: "zambia-bot",
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
        fs.readFile('zambia.json', function (err, content) {
            if (err) throw err;
            parseJson = JSON.parse(content);
            for (var i in parseJson.users) {
                if (parseJson.users[i].number === message.from) {
                    flag = 1;
                    if (parseJson.users[i].order === "1") {
                        parseJson.users[i].order = "2";
                        client.sendText(message.from, "Hello... Welcome to Welo Rovert Zambia!\n We are a medical delivery business at your service! \n\n1. Buy and/or deliver my medication \n2. Subscribe to 3/6 months recurring delivery \n3. Collect at Clinic/Hospital \n4. Speak to a consultant.");
                    }
                    else if (parseJson.users[i].order === "2") {

                        if (message.body === "1") {
                            parseJson.users[i].order = "3";
                            client.sendText(message.from, "Please send a picture of your prescription\nCaption it with the pharmacy name");
                        }
                        else if (message.body === "2") {
                            parseJson.users[i].order = "3";
                            client.sendText(message.from, "Please send a picture of your prescription\nCaption it with the pharmacy name");
                            parseJson.users[i].subscription = "1";
                        }
                        else if (message.body === "3") {
                            parseJson.users[i].order = "3";
                            client.sendText(message.from, "Please send us a copy of your hospital/clinic file");

                        }
                        else if (message.body === "4") {
                            parseJson.users[i].order = "1";
                            client.sendText(message.from, "A consultant will be in touch shortly");
                        }
                    }
                    else if (parseJson.users[i].order === "3") {
                        client.sendText(message.from, "Please send a picture of your ID\nCaption it with your name");
                        parseJson.users[i].order = "4";
                    }
                    else if (parseJson.users[i].order === "4") {
                        client.sendText(message.from, "Delivery Address?");
                        parseJson.users[i].order = "5";
                    }
                    else if (parseJson.users[i].order === "5") {
                        client.sendText(message.from, "1. Cash \n2. Eft");
                        parseJson.users[i].order = "6";
                    }
                    else if (parseJson.users[i].order === "6") {
                        parseJson.users[i].order = "7";
                        if (message.body === "1") {
                            client.sendText(message.from, "Your order is being processed \nThank you for using Welo");
                            client.sendText("27672291680@c.us", "New order, check bot");
                            parseJson.users[i].order = "1";

                        }
                        else if (message.body === "2") {
                            client.sendText(message.from, "Payment link: \n\nhttps://grizzled-pleasant-pearl.glitch.me/ \nReply with your email address so that we can track your payment");
                        }
                    }
                    else if (parseJson.users[i].order === "7") {
                        client.sendText(message.from, "Your order is being processed \nThank you for using Welo Rovert");
                        client.sendText("27672291680@c.us", "New order, check bot");
                        parseJson.users[i].order = "1";

                    }
                    fs.writeFile('zambia.json', JSON.stringify(parseJson), function (err) {
                        if (err) throw err;
                        console.log("done");
                    });
                }
            }
            if (flag === 0) {
                parseJson.users.push({ number: message.from, order: "2", subscription: "0" });
                client.sendText(message.from, "Hello... Welcome to Welo Rovert Zambia!\n We are a medical delivery business at your service! \n\n1. Buy and/or deliver my medication \n2. Subscribe to 3/6 months recurring delivery \n3. Collect at Clinic/Hospital \n4. Speak to a consultant.");
                fs.writeFile('zambia.json', JSON.stringify(parseJson), function (err) {
                    if (err) throw err;
                    console.log("done");
                });
            }
        });
    });
}
