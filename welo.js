const wa = require('@open-wa/wa-automate');
const fs = require('fs');
var flag = 0;
var parseJson;
var paid = 0;

wa.create({
    sessionId: "welo",
    authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
    blockCrashLogs: true,
    disableSpins: true,
    headless: true,
    onChrome:true,
    hostNotificationLang: 'PT_BR',
    logConsole: false,
    popup: true,
    qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
}).then(client => start(client));

function start(client) {
    client.onMessage(async message => {
        fs.readFile('welo.json', function (err, content) {
            if (err) throw err;
            parseJson = JSON.parse(content);
            flag = 0;
            for (var i in parseJson.users) {
                console.log(parseJson.users[i]);
                if (parseJson.users[i].number === message.from) {
                    if (parseJson.users[i].order === "0") {
                        flag = 1;
                        parseJson.users[i].order = "1";
                    }
                    else if (parseJson.users[i].order === "1") {
                        flag = 2;
                        parseJson.users[i].order = "2";
                    }
                    else if (parseJson.users[i].order === "2") {
                        flag = 3;
                        parseJson.users[i].order = "3";
                    }
                    else if (parseJson.users[i].order === "3") {
                        flag = 4;
                        parseJson.users[i].order = "4";
                    }
                    else if (parseJson.users[i].order === "4") {
                        flag = 5;
                        parseJson.users[i].order = "5";
                    }
                    else if (parseJson.users[i].order === "5") {
                        flag = 6;
                        parseJson.users[i].order = "6";
                    }
                    else if (parseJson.users[i].order === "6") {
                        flag = 7;
                        parseJson.users[i].order = "7";
                    }
                    else if (parseJson.users[i].order === "7") {
                        flag = 1;
                        parseJson.users[i].order = "1";
                    }
                }
            }
            if (flag === 0) {
                flag = 1;
                parseJson.users.push({ number: message.from, order: "1", subscription:"0",paid:"0" });
            }
            fs.writeFile('welo.json', JSON.stringify(parseJson), function (err) {
                if (err) throw err;
                console.log("done");
            })
        })
        if (flag === 0) {
            await client.sendText(message.from, "Hello... Welcome to Welo!\n We are a medical delivery business at your service! \n\n1. Buy and/or deliver my medication \n2. Subscribe to 3/6 months recurring delivery \n3. Collect at Clinic/Hospital \n4. Speak to a consultant.");
        }
        else if (flag === 1) {
            await client.sendText(message.from, "Hello... Welcome to Welo!\n We are a medical delivery business at your service! \n\n1. Buy and/or deliver my medication \n2. Subscribe to 3/6 months recurring delivery \n3. Collect at Clinic/Hospital \n4.Speak to a consultant.");
            
        }
        else if (flag === 2) {
            if (message.body === "1") {
                await client.sendText(message.from, "Please send a picture of your prescription\nCaption it with the pharmacy name\n\n We charge a flat fee of R35(7 km radius) per delivery");
            }
            else if (message.body === "2") {
                await client.sendText(message.from, "Please send a picture of your prescription\nCaption it with the pharmacy name\n\n We charge a flat fee of R35(7 km radius) per delivery");
                fs.readFile('welo.json', function (err, content) {
                    if (err) throw err;
                    parseJson = JSON.parse(content);
                    for (var i in parseJson.users) {
                        if (parseJson.users[i].number === message.from) {
                            parseJson.users[i].subscription = "1";
                            fs.writeFile('welo.json', JSON.stringify(parseJson), function (err) {
                                if (err) throw err;
                                console.log("done");
                            })
                        }
                    }
                    
                })
                
            }
            else if (message.body === "3") {
                await client.sendText(message.from, "Please send us a copy of your hospital/clinic file");
                
            }
            else if (message.body === "4") {
                await client.sendText(message.from, "A consultant will be in touch shortly");
                
            }
        }
        else if (flag === 3) {
            await client.sendText(message.from, "Please send a picture of your ID\nCaption it with your name");

        }
        else if (flag === 4) {
            await client.sendText(message.from, "Delivery Address?");
        }
        else if (flag === 5) {
            await client.sendText(message.from, "1. Cash \n2. Eft");
        }
        else if (flag === 6) {
            if (message.body === "1") {
                await client.sendText(message.from, "Your order is being processed \nThank you for using Welo");
                await client.sendText("27672291680@c.us", "New order, check bot");
                fs.readFile('welo.json', function (err, content) {
                    if (err) throw err;
                    parseJson = JSON.parse(content);
                    for (var i in parseJson.users) {
                        if (parseJson.users[i].number === message.from) {
                            parseJson.users[i].order = "0";
                            fs.writeFile('welo.json', JSON.stringify(parseJson), function (err) {
                                if (err) throw err;
                                console.log("done");
                            })
                        }
                    }
                })
            }
            else if (message.body === "2") {
                await client.sendText(message.from, "Payment link: \n\nhttps://grizzled-pleasant-pearl.glitch.me/ \nReply with your email address so that we can track your payment");
            }
        }
        else if (flag === 7) {
            await client.sendText(message.from, "Your order is being processed \nThank you for using Welo");
            await client.sendText("27672291680@c.us", "New order, check bot");
        }
    });
}