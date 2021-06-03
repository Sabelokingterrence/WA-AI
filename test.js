const wa = require('@open-wa/wa-automate');
const fs = require('fs');
var parseJson;
var flag = 0;

wa.create({
    sessionId: "school-bot",
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
        fs.readFile('school.json', function (err, content) {
            if (err) throw err;
            parseJson = JSON.parse(content);
            for (var i in parseJson.users) {
                if (parseJson.users[i].number === message.from) {
                    flag = 1;
                    if (parseJson.users[i].order === "1") {
                        parseJson.users[i].order = "2";
                        client.sendText(message.from, "Hello... Welcome to Whatsapp Learn! \nWe are a Whatsapp based learning platform! \n\n1. Get past papers \n2. Tutorials \n3. Speed Test \n4. Test and Exam Dates");
                    }
                    else if (parseJson.users[i].order === "2") {
                        if (message.body === "1") {
                            parseJson.users[i].order = "3";
                            client.sendText(message.from, "1. Maths \n2. English");
                        }
                        else if (message.body === "2") {
                            parseJson.users[i].order = "4";
                            client.sendText(message.from, "1. Maths \n2. English");
                            parseJson.users[i].subscription = "1";
                        }
                        else if (message.body === "3") {
                            parseJson.users[i].order = "5";
                            client.sendText(message.from, "1. Maths \n2. English");
                        }
                        else if (message.body === "4") {
                            parseJson.users[i].order = "1";
                            //client.sendFile(message.from, '', 'file.pdf', 'check this pdf', null, true);
                            client.sendImage(message.from, "./pic4.jpg", "pic4.jpg", "");
                        }
                        else {
                            parseJson.users[i].order = "2";
                            client.sendText(message.from, "Wrong response, reply with a number between 1 and 4");
                        }
                    }
                    else if (parseJson.users[i].order === "3") {
                        if (message.body === "1") {
                            client.sendText(message.from, "Choose year: \n\n1. 2018 \n2. 2019 \n3. 2020");
                            parseJson.users[i].order = "6";
                        }
                        else if (message.body === "2") {
                            client.sendText(message.from, "Choose year: \n\n1. 2018 \n2. 2019 \n3. 2020");
                            parseJson.users[i].order = "7";
                        }
                        else {
                            client.sendText(message.from, "Invalid response, send a number between 1 and 2");
                            parseJson.users[i].order = "3";
                        }
                    }
                    else if (parseJson.users[i].order === "4") {
                        if (message.body === "1") {
                            client.sendImage(message.from, "./maths-tut.png", "maths-tut.png", "");
                            parseJson.users[i].order = "1";
                        }
                        else if (message.body === "2") {
                            client.sendImage(message.from, "./english-tut.png", "english-tut.png", "");
                            parseJson.users[i].order = "1";
                        }
                        else {
                            client.sendText(message.from, "Invalid response, respond with a number between 1 and 2");
                            parseJson.users[i].order = "4";
                        }
                    }
                    else if (parseJson.users[i].order === "5") {
                        if (message.body === "1") {
                            client.sendText(message.from, "1. Solve the following equation: \n5 + 9 = ?");
                            parseJson.users[i].order = "5.1";
                        }
                        else if (message.body === "2") {
                            client.sendText(message.from, "1. Fill in the missing word: \nNo nook or corner ___ left unexplored");
                            parseJson.users[i].order = "5.5";
                        }
                        else {
                            client.sendText(message.from, "Invalid response, respond with a number between 1 and 2");
                            parseJson.users[i].order = "5";
                        }
                    }
                    else if (parseJson.users[i].order === "5.1") {
                        client.sendText(message.from, "2. If 2x - 4 = 10, what is the value of x ");
                        parseJson.users[i].order = "5.2";    
                    }
                    else if (parseJson.users[i].order === "5.2") {
                        client.sendText(message.from, "3. If x + y = 10 and 3y - x = 5, find the value of x ");
                        parseJson.users[i].order = "5.3";
                    }
                    else if (parseJson.users[i].order === "5.3") {
                        client.sendText(message.from, "4. Find f'(x) if f(x) = 5x");
                        parseJson.users[i].order = "5.4";
                    }
                    else if (parseJson.users[i].order === "5.4") {
                        client.sendText(message.from ,"5. Find f'(x) if f(x) = sin(x)");
                        parseJson.users[i].order = "1";
                    }
                    else if (parseJson.users[i].order === "5.5") {
                        client.sendText(message.from, "3. 2. Fill in the missing word: \nFrance _____ world champions");
                        parseJson.users[i].order = "5.6";
                    }
                    else if (parseJson.users[i].order === "5.6") {
                        client.sendText(message.from, "3. Fill in the missing word: \nSabelo ____ a genius");
                        parseJson.users[i].order = "5.7";
                    }
                    else if (parseJson.users[i].order === "5.7") {
                        client.sendText(message.from, "4. Fill in the missing word: \nHe is as good a player as ____ ");
                        parseJson.users[i].order = "5.8";
                    }
                    else if (parseJson.users[i].order === "5.8") {
                        client.sendText(message.from, "5. Fill in the missing word: \nEvery man must bear ____ own burden ");
                        parseJson.users[i].order = "1";
                    }
                    else if (parseJson.users[i].order === "6") {
                        if (message.body === "1") {
                            client.sendFile(message.from, './Mathematics P2 Nov 2018 Eng.pdf', 'Mathematics P2 Nov 2018 Eng.pdf', '', null, true);
                            client.sendFile(message.from, './Mathematics P1 Nov 2018 Eng.pdf', 'Mathematics P1 Nov 2018 Eng.pdf', '', null, true);
                            parseJson.users[i].order = "1";
                        }
                        else if (message.body === "2") {
                            client.sendFile(message.from, './Mathematics P1 Nov 2019 Eng.pdf', 'Mathematics P1 Nov 2019 Eng.pdf', '', null, true);
                            client.sendFile(message.from, './Mathematics P2 Nov 2019 Eng.pdf', 'Mathematics P2 Nov 2019 Eng.pdf', '', null, true);
                            parseJson.users[i].order = "1";
                        }
                        else if (message.body === "3") {
                            client.sendFile(message.from, './Mathematics P2 Nov 2020 Eng.pdf', 'Mathematics P2 Nov 2020 Eng.pdf', '', null, true);
                            client.sendFile(message.from, './Mathematics P1 Nov 2020 Eng.pdf', 'Mathematics P1 Nov 2020 Eng.pdf', '', null, true);
                            parseJson.users[i].order = "1";
                        }
                        else {
                            client.sendText(message.from, "Invalid response");
                            parseJson.users[i].order = "6";
                        }
                    }
                    else if (parseJson.users[i].order === "7") {
                        if (message.body === "1") {
                            client.sendText(message.from, "Send 2018 english exam");
                            client.sendFile(message.from, './English FAL P1 Nov 2018.pdf', 'English FAL P1 Nov 2018.pdf', '', null, true);
                            parseJson.users[i].order = "1";
                        }
                        else if (message.body === "2") {
                            client.sendFile(message.from, './English FAL P1 Nov 2019.pdf', 'English FAL P1 Nov 2019.pdf', '', null, true);
                            parseJson.users[i].order = "1";
                        }
                        else if (message.body === "3") {
                            client.sendFile(message.from, './English FAL P1 Nov 2020.pdf', 'English FAL P1 Nov 2020.pdf', '', null, true);
                            parseJson.users[i].order = "1";
                        }
                        else {
                            client.sendText(message.from, "Invalid response, reply with a number between 1 and 3");
                            parseJson.users[i].order = "7";
                        }
                    }
                    fs.writeFile('school.json', JSON.stringify(parseJson), function (err) {
                        if (err) throw err;
                        console.log("done");
                    });
                }
            }
            if (flag === 0) {
                parseJson.users.push({ number: message.from, order: "2"});
                client.sendText(message.from, "Hello... Welcome to Whatsapp Learn! \nWe are a Whatsapp based learning platform! \n\n1. Get past papers \n2. Tutorials \n3. Speed Test \n4. Test and Exam Dates");
                fs.writeFile('school.json', JSON.stringify(parseJson), function (err) {
                    if (err) throw err;
                    console.log("done");
                });
            }
        });
    });
}
