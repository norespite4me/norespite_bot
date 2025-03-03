import WebSocket from "ws";
import { CLIENT_ID, OAUTH_TOKEN } from "../../twitch_bot_files/token";
import * as react from "../lib/react.js";
import { BOT_ID, BOT_USERNAME, CHANNEL_ID } from "./constants.js";
import * as tool from "./tools.js";

const EVENTSUB_WEBSOCKET_URL = "wss://eventsub.wss.twitch.tv/ws";

var websocketSessionID;

(async () => {
    await getAuth();

    const websocketClient = startWebSocketClient();
})();

async function getAuth() {
    let response = await fetch("https://id.twitch.tv/oauth2/validate", {
        method: "GET",
        headers: {
            Authorization: "OAuth " + OAUTH_TOKEN,
        },
    });

    if (response.status != 200) {
        let data = await response.json();
        console.error(
            "Token is not valid. /oauth2/validate retured status code " +
                response.status
        );
        console.error(data);
        process.exit(1);
    }

    console.log("Validated token.");
}

function startWebSocketClient() {
    let websocketClient = new WebSocket(EVENTSUB_WEBSOCKET_URL);

    websocketClient.on("error", console.error);

    websocketClient.on("open", () => {
        console.log("WebSocket connection opened to " + EVENTSUB_WEBSOCKET_URL);
    });

    websocketClient.on("message", (data) => {
        handleWebSocketMessage(JSON.parse(data.toString()));
    });

    return websocketClient;
}

async function handleWebSocketMessage(data) {
    switch (data.metadata.message_type) {
        case "session_welcome":
            websocketSessionID = data.payload.session.id;

            registerEventSubListeners();
            break;
        case "notification":
            switch (data.metadata.subscription_type) {
                case "channel.chat.message":
                    console.log(
                        `MSG #${data.payload.event.broadcaster_user_login} <${data.payload.event.chatter_user_login}> ${data.payload.event.message.text}`
                    );

                    react.add_user(data);

                    if (
                        BOT_USERNAME ===
                        data.payload.event.broadcaster_user_login
                    ) {
                        await tool.sleep(2000);
                    }

                    react.perform(data);

                    break;
            }
            break;
    }
}

export async function sendChatMessage(channel, chatMessage) {
    let response = await fetch("https://api.twitch.tv/helix/chat/messages", {
        method: "POST",
        headers: {
            Authorization: "Bearer " + OAUTH_TOKEN,
            "Client-Id": CLIENT_ID,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            broadcaster_id: channel,
            sender_id: BOT_ID,
            message: chatMessage,
        }),
    });

    if (response.status != 200) {
        let data = await response.json();
        console.error("Failed to send chat message");
        console.error(data);
    } else {
        console.log("Sent chat message: " + chatMessage);
    }
}

async function registerEventSubListeners() {
    var response = [];

    for (var i = 0; i < CHANNEL_ID.length; i++) {
        response.push(
            await fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + OAUTH_TOKEN,
                    "Client-Id": CLIENT_ID,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: "channel.chat.message",
                    version: "1",
                    condition: {
                        broadcaster_user_id: CHANNEL_ID[i],
                        user_id: BOT_ID,
                    },
                    transport: {
                        method: "websocket",
                        session_id: websocketSessionID,
                    },
                }),
            })
        );

        if (response[i].status != 202) {
            let data = await response.json();
            console.error(
                "Failed to subscribe to channel.chat.message. API call returned status code " +
                    response[i].status
            );
            console.error(data);
            process.exit(1);
        } else {
            const data = await response[i].json();
            console.log(
                `Subscribed to channel.chat.message [${data.data[0].id}]`
            );
        }
    }

    /*
    let response = await fetch(
        "https://api.twitch.tv/helix/eventsub/subscriptions",
        {
            method: "POST",
            headers: {
                Authorization: "Bearer " + OAUTH_TOKEN,
                "Client-Id": CLIENT_ID,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: "channel.chat.message",
                version: "1",
                condition: {
                    broadcaster_user_id: CHANNEL_ID,
                    user_id: BOT_ID,
                },
                transport: {
                    method: "websocket",
                    session_id: websocketSessionID,
                },
            }),
        }
    );

    if (response.status != 202) {
        let data = await response.json();
        console.error(
            "Failed to subscribe to channel.chat.message. API call returned status code " +
                response.status
        );
        console.error(data);
        process.exit(1);
    } else {
        const data = await response.json();
        console.log(`Subscribed to channel.chat.message [${data.data[0].id}]`);
    }*/
}

/*
// Define configuration options
const opts = {
    options: {
        debug: true,
    },
    connection: {
        reconnect: true,
        secure: true,
        timeout: 180000,
        reconnectDecay: 1.4,
        reconnectInterval: 1000,
    },
    identity: {
        username: BOT_USERNAME,
        password: OAUTH_TOKEN,
    },
    channels: CHANNEL_ID,
};

// Create a client with our options
const client = new tmi.client(opts);

// Connect to Twitch:
client.connect();

// Register our event handlers (defined below)
client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);
client.on("disconnected", (reason) => {
    onDisconnectedHandler(reason);
});
client.on("reconnect", () => {
    reconnectHandler();
});

//events
client.on("hosted", (channel, username, viewers, autohost) => {
    if (ANNOUNCE_ENABLED.includes(channel.substring(1))) {
        onHostedHandler(channel, username, viewers, autohost);
    }
});

client.on("subscription", (channel, username, method, msg, user) => {
    if (ANNOUNCE_ENABLED.includes(channel.substring(1))) {
        onSubscriptionHandler(channel, username, method, msg, user);
    }
});

client.on("raided", (channel, username, viewers) => {
    if (ANNOUNCE_ENABLED.includes(channel.substring(1))) {
        onRaidedHandler(channel, username, viewers);
    }
});

client.on("cheer", (channel, user, msg) => {
    if (ANNOUNCE_ENABLED.includes(channel.substring(1))) {
        onCheerHandler(channel, user, msg);
    }
});

client.on("giftpaidupgrade", (channel, username, sender, user) => {
    if (ANNOUNCE_ENABLED.includes(channel.substring(1))) {
        onGiftPaidUpgradeHandler(channel, username, sender, user);
    }
});

client.on("hosting", (channel, target, viewers) => {
    if (ANNOUNCE_ENABLED.includes(channel.substring(1))) {
        onHostingHandler(channel, target, viewers);
    }
});

client.on("resub", (channel, username, months, msg, user, methods) => {
    if (ANNOUNCE_ENABLED.includes(channel.substring(1))) {
        resubHandler(channel, username, months, msg, user, methods);
    }
});

client.on(
    "subgift",
    (channel, username, streakMonths, recipient, methods, user) => {
        if (ANNOUNCE_ENABLED.includes(channel.substring(1))) {
            subGiftHandler(
                channel,
                username,
                streakMonths,
                recipient,
                methods,
                user
            );
        }
    }
);

// Called every time a message comes in
async function onMessageHandler(channel, user, msg, self) {
    // Remove whitespace from chat message
    msg = msg.toLowerCase().split(" ");
    let commandName = msg[0];
    msg.shift();
    let args = msg;

    //console.log(user);
    //console.log(channel);
    react.add_user(user);
    if (BOT_USERNAME === user.username && user.mod === false) {
        await tool.sleep(2000);
    }
    react.perform(channel, user, commandName, args, client);
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`.green);
}

function onDisconnectedHandler(reason) {
    console.log(`* Disconnected: ${reason}`.red);
}

function reconnectHandler() {
    console.log(`Reconnecting...`.green);
}

function onHostedHandler(channel, username, viewers, autohost) {
    client.say(
        channel,
        `/me Thank you ${username} for the host of ${viewers}!`
    );
    console.log(
        `${channel} was hosted by ${username} with ${viewers} viewers`.green
    );
}

function onRaidedHandler(channel, username, viewers) {
    client.say(
        channel,
        `/me interyPOP A RAID OF ${viewers}! interyPOP Thank you ${username} for the RAID!!! interyISCREAM`
    );
    console.log(
        `${channel} was raided by ${username} with ${viewers} viewers`.green
    );
}

function onSubscriptionHandler(channel, username, method, msg, user) {
    if (user["msg-param-sub-plan"] === "Prime") {
        client.say(
            channel,
            `/me interyPOP NEW PRIME SUB interyPOP ${username}, thank you for supporting the stream! interyISCREAM`
        );
        console.log(`${username} has subbed to ${channel} with PRIME`.green);
    } else if (user["msg-param-sub-plan"] === "1000") {
        client.say(
            channel,
            `/me interyPOP NEW TIER 1 SUB! interyPOP ${username}, thank you for supporting the stream!`
        );
        console.log(`${username} has subbed to ${channel} with TIER 1`.green);
    } else if (user["msg-param-sub-plan"] === "2000") {
        client.say(
            channel,
            `/me interyPOP NEW TIER 2 SUB! interyPOP ${username}, thank you for supporting the stream!`
        );
        console.log(`${username} has subbed to ${channel} with TIER 2`.green);
    } else if (user["msg-param-sub-plan"] === "3000") {
        client.say(
            channel,
            `/me interyPOP NEW TIER 3 SUB! interyPOP ${username}, thank you for supporting the stream!`
        );
        console.log(`${username} has subbed to ${channel} with TIER 3`.green);
    }
}

function onCheerHandler(channel, user, msg) {
    client.say(
        channel,
        `/me interyPOP OMG OMG OMG interyPOP ${user.username} with the ${user.bits} bits! interyISCREAM`
    );
    console.log(
        `${user.username} has cheered ${user.bits} to ${channel}`.green
    );
}

function onGiftPaidUpgradeHandler(channel, username, sender, user) {
    client.say(
        channel,
        `/me Thank you ${username} for continuing your gifted sub from ${user["msg-param-sender-name"]}!`
    );
    console.log(`${username} has continued gifted sub to ${channel}`.green);
}

function onHostingHandler(channel, target, viewers) {
    client.say(
        channel,
        `/me We are now hosting ${target} with ${viewers} viewers!`
    );
    console.log(
        `${channel} is hosting ${target} with ${viewers} viewers!`.green
    );
}

function resubHandler(channel, username, months, msg, user, methods) {
    const cumulativeMonths = user["msg-param-cumulative-months"];

    if (user["msg-param-sub-plan"] === "Prime") {
        client.say(
            channel,
            `/me interyPOP PRIME SUB interyPOP ${username}, thanks for the ${cumulativeMonths} month sub! interyISCREAM`
        );
        console.log(`${username} has resubbed to ${channel} with PRIME`.green);
    } else if (user["msg-param-sub-plan"] === "1000") {
        client.say(
            channel,
            `/me interyPOP TIER 1 SUB interyPOP ${username}, thanks for the ${cumulativeMonths} month sub! interyISCREAM`
        );
        console.log(`${username} has resubbed to ${channel} with TIER 1`.green);
    } else if (user["msg-param-sub-plan"] === "2000") {
        client.say(
            channel,
            `/me interyPOP TIER 2 SUB interyPOP ${username}, thanks for the ${cumulativeMonths} month sub! interyISCREAM`
        );
        console.log(`${username} has resubbed to ${channel} with TIER 2`.green);
    } else if (user["msg-param-sub-plan"] === "3000") {
        client.say(
            channel,
            `/me interyPOP TIER 3 SUB interyPOP ${username}, thanks for the ${cumulativeMonths} month sub! interyISCREAM`
        );
        console.log(`${username} has resubbed to ${channel} with TIER 3`.green);
    }
}

function subGiftHandler(
    channel,
    username,
    streakMonths,
    recipient,
    methods,
    user
) {
    if (user["msg-param-sub-plan"] === "1000") {
        client.say(
            channel,
            `/me interyPOP GIFTED TIER 1 SUB interyPOP ${username}, thank you for gifting a TIER 1 SUB to ${recipient}! interyISCREAM`
        );
        console.log(
            `${username} has gifted sub to ${recipient} in ${channel} with TIER 1`
                .green
        );
    } else if (user["msg-param-sub-plan"] === "2000") {
        client.say(
            channel,
            `/me interyPOP GIFTED TIER 2 SUB interyPOP ${username}, thank you for gifting a TIER 2 SUB to ${recipient}! interyISCREAM`
        );
        console.log(
            `${username} has gifted sub to ${recipient} in ${channel} with TIER 2`
                .green
        );
    } else if (user["msg-param-sub-plan"] === "3000") {
        client.say(
            channel,
            `/me interyPOP GIFTED TIER 3 SUB interyPOP ${username}, thank you for gifting a TIER 3 SUB to ${recipient}! interyISCREAM`
        );
        console.log(
            `${username} has gifted sub to ${recipient} in ${channel} with TIER 3`
                .green
        );
    }
}
*/
