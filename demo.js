const wa = require('@open-wa/wa-automate');
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
var parseJson;
var j;
var flag = 0;

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';



wa.create({
    sessionId: "service",
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
        fs.readFile('demo.json', function (err, content) {
            if (err) throw err;
            parseJson = JSON.parse(content);
            for (i in parseJson.users) {
                if (parseJson.users[i].number === message.from) {
                    flag = 1;
                    if (parseJson.users[i].order === "1") {
                        client.sendText(message.from, "Hello... Welcome to quadcare home service, powered by Welo \n\n1. Medicine delivery. \n2. Home sample collection.");
                        parseJson.users[i].order = "2";
                    }
                    else if (parseJson.users[i].order === "2") {
                        if (message.body === "1") {
                            parseJson.users[i].home = "0";
                        }
                        else if (message.body === "2") {
                            parseJson.users[i].home = "1";
                        }
                        client.sendText(message.from, "Select Clinic: \n\n1. Braamfontein \n2. Fox Street \n3. Meadowlands");
                        parseJson.users[i].order = "3";
                    }
                    else if (parseJson.users[i].order === "3") {
                        if (message.body === "1") {
                            parseJson.users[i].centre = "Braamfontein";
                        }
                        else if (message.body === "2") {
                            parseJson.users[i].centre = "Fox Street";
                        }
                        else if (message.body === "3") {
                            parseJson.users[i].centre = "Meadowlands";
                        }
                        client.sendText(message.from, "Clinical associate?");
                        parseJson.users[i].order = "4";
                    }
                    else if (parseJson.users[i].order === "4") {
                        parseJson.users[i].name = message.body;
                        client.sendText(message.from, "Patient's file number?");
                        parseJson.users[i].order = "5";
                    }
                    else if (parseJson.users[i].order === "5") {
                        client.sendText(message.from, "Patient's name?");
                        parseJson.users[i].pfile = message.body;
                        parseJson.users[i].order = "6";
                    }
                    else if (parseJson.users[i].order === "6") {
                        client.sendText(message.from, "Patient's telephone number?");
                        parseJson.users[i].patient = message.body;
                        parseJson.users[i].order = "7";
                    }
                    else if (parseJson.users[i].order === "7") {
                        client.sendText(message.from, "Patient's address?");
                        parseJson.users[i].pnumber = message.body;
                        parseJson.users[i].order = "8";
                    }
                    else if (parseJson.users[i].order === "8") {
                        parseJson.users[i].paddress = message.body;
                        if (parseJson.users[i].home === "0") {
                            client.sendText(message.from, "Delivery instructions?");
                        }
                        else if (parseJson.users[i].home === "1") {
                            client.sendText(message.from, "Preferred date and time of visit?");
                        }
                        parseJson.users[i].order = "9";
                        
                    }
                    else if (parseJson.users[i].order === "9") {
                        if (parseJson.users[i].home === "0") {
                            client.sendText(message.from, "The order will be delivered within 24 hours \n\nThank you for using Welo.");
                            client.sendText("27727459587@c.us", "New Order: \n\n" + parseJson.users[i].centre + "\n" + parseJson.users[i].name + "\n" + parseJson.users[i].pfile + "\n" + parseJson.users[i].patient + "\n" + parseJson.users[i].pnumber + "\n" + parseJson.users[i].paddress + "\nDelivery instructions: " + message.body);
                            j = i;
                            // Load client secrets from a local file.
                            fs.readFile('credentials.json', (err, content) => {
                                if (err) return console.log('Error loading client secret file:', err);
                                // Authorize a client with credentials, then call the Google Sheets API.
                                authorize(JSON.parse(content), listMajors);
                            });
                        }
                        else if (parseJson.users[i].home === "1") {
                            client.sendText(message.from, "A medical consultant will be dispatched shortly \n\nThank you for using Welo.");
                            client.sendText("27727459587@c.us", "Sample Collection: \n\n" + parseJson.users[i].centre + "\n" + parseJson.users[i].name + "\n" + parseJson.users[i].pfile + "\n" + parseJson.users[i].patient + "\n" + parseJson.users[i].pnumber + "\n" + parseJson.users[i].paddress + "\nPreferred time and date: " + message.body);
                            j = i;
                            // Load client secrets from a local file.
                            fs.readFile('credentials.json', (err, content) => {
                                if (err) return console.log('Error loading client secret file:', err);
                                // Authorize a client with credentials, then call the Google Sheets API.
                                authorize(JSON.parse(content), listMajors);
                            });
                        }
                        parseJson.users[i].order = "1";
                    }
                    fs.writeFile('demo.json', JSON.stringify(parseJson), function (err) {
                        if (err) throw err;
                        console.log("done");
                    });
                }
            }
            if (flag === 0) {
                parseJson.users.push({ number: message.from, order: "2", home: "0",centre:"", name:"",patient:"",pfile:"",pnumber:"",paddress:""});
                client.sendText(message.from, "Hello... Welcome to quadcare home service, powered by Welo \n\n1. Medicine delivery. \n2. Home sample collection.");
                fs.writeFile('demo.json', JSON.stringify(parseJson), function (err) {
                    if (err) throw err;
                    console.log("done");
                });
            }
        });
    });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1GKjUwba1oLQPWpulq2mlr_2xPugPl77rFuqMxt2HuIU/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */

function listMajors(auth) {
    const sheets = google.sheets({ version: 'v4', auth });
    let values = [
        [
            parseJson.users[j].centre,parseJson.users[j].name,parseJson.users[j].pfile,parseJson.users[j].patient,parseJson.users[j].pnumber,parseJson.users[j].paddress, new Date().toISOString()
        ]
    ];
    let resource = {
        values: values,
    };
    sheets.spreadsheets.values.append({
        spreadsheetId: '1GKjUwba1oLQPWpulq2mlr_2xPugPl77rFuqMxt2HuIU',
        range: 'Sheet1!A2:G',
        valueInputOption: 'RAW',
        resource: resource,
    }, (err, result) => {
        if (err) {
            // Handle error.
            console.log(err);
        } else {
            console.log(`cells appended.`);
        }
    });
    
}