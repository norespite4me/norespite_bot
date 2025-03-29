import WebSocket from "ws";
import credentials from "../../twitch_bot_files/credentials.json" with { type: 'json' };
import * as react from "../lib/react.js";
import { BOT_ID, BOT_USERNAME, CHANNEL_ID } from "./constants.js";
import * as tool from "./tools.js";
//let credentials = fetch('../../twitch_bot_files/credentials.json').then(res => res.json());

const EVENTSUB_WEBSOCKET_URL = "wss://eventsub.wss.twitch.tv/ws";

var websocketSessionID;

(async () => {
	while (true) {
		await checkToken();
		await getAuth();
		const websocketClient = startWebSocketClient();
		await tool.sleep(7200000);
		websocketClient.close();
	}
})();

async function checkToken() {
	await fetch("https://id.twitch.tv/oauth2/token", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: credentials.refresh_token,
			client_id: credentials.client_id,
			client_secret: credentials.client_secret
		})
	})
	.then(response => response.json())
	.then(data => {
		credentials.access_token = data.access_token;
		credentials.refresh_token = data.refresh_token;
	})
	.catch(error => console.error(`Error refreshing token: `, error));
}

async function getAuth() {
    let response = await fetch("https://id.twitch.tv/oauth2/validate", {
        method: "GET",
        headers: {
            Authorization: "OAuth " + credentials.access_token,
        },
    });	//597mu8v2z2fdpacyoe6ldlwzxxrj53

    if (response.status != 200) {
        let data = await response.json();
        console.error(
            "Token is not valid. /oauth2/validate returned status code " +
                response.status
        );
        console.error(data);

        if (response.status != 200) {
            let data = await response.json();
            console.error(
                "Token is not valid. /oauth2/validate returned status code " +
                    response.status
            );
            console.error(data);

            process.exit(1);c
        }
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
		if (data.includes("PING")) {
			websocketClient.pong;
			console.log("* PONGED");
		}
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
                        BOT_USERNAME === data.payload.event.chatter_user_login
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
            Authorization: "Bearer " + credentials.access_token,
            "Client-Id": credentials.client_id,
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
                    Authorization: "Bearer " + credentials.access_token,
                    "Client-Id": credentials.client_id,
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
            let data = await response[i].json();
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
}
