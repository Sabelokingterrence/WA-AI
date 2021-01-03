const wa = require('@open-wa/wa-automate');
const fs = require('fs');
var flag = 0;
var parseJson;

wa.create({
    sessionId: "bot",
    authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
    blockCrashLogs: true,
    disableSpins: true,
    headless: true,
    hostNotificationLang: 'PT_BR',
    logConsole: false,
    popup: true,
    qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
}).then(client => start(client));

function start(client) {
    client.onMessage(async message =>
    {
        fs.readFile('cars.json', function (err, content)
        {
            if (err) throw err;
            parseJson = JSON.parse(content);
            for (var i in parseJson.users)
            {
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
                        parseJson.users[i].order = "0";
                    }
                }
            }
            if (flag === 0) {
                parseJson.users.push({ number: message.from, order: "1" });
            }
            fs.writeFile('cars.json', JSON.stringify(parseJson), function (err) {
                if (err) throw err;
                console.log("done");
            })
        })
        if (flag === 0) {
            await client.sendText(message.from, "Hi, Im Steve your car consultant. Want me to help you:\n\n1. Buy a car \n2. Sell your car \n3. Fix your car \n4. Car Specials \n5. Speak to consultant");     
        }
        else if (flag === 1) {
            await client.sendText(message.from, "Hi, Im Steve your car consultant. Want me to help you:\n\n1. Buy a car \n2. Sell your car \n3. Fix your car \n4. Car Specials \n5. Speak to consultant");
        }
        else if (flag === 2) {
            if (message.body === "1") {
                await client.sendText(message.from, "Choose installment range: \n\n1. 0-R2000 \n2. R2000-R4000 \n3. R4000-R7000 \n4. R7000+");

            }
            else if (message.body === "2") {
                await client.sendText(message.from, "Send us the specifications of your car");

            }
            else if (message.body === "3") {
                await client.sendText(message.from, "Send us your location and we will get back to you");

            }
            else if (message.body === "4") {
                await client.sendText(message.from, "Here are some car specials");

            }
            else if (message.body === "5") {
                await client.sendText(message.from, "A consultant will be in touch shortly");
            }

        }
        else if (flag === 3) {
            if (message.body === "1") {
                await client.sendText(message.from, "Here are some car specials");
            }
            else if (message.body === "2") {
                await client.sendText(message.from, "Here are some car specials");
            }
            else if (message.body === "3") {
                await client.sendText(message.from, "Here are some car specials");
            }
            else if (message.body === "4") {
                await client.sendText(message.from, "Here are some car specials");
            }
            
        }
    });
    flag = 0;
}