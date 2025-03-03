import { sendChatMessage } from "../src/app.js";
import { SQUIRT_ENABLED } from "../src/constants.js";
import * as tools from "../src/tools.js";
//import * as econ from "./cmds/economy.js";
import * as misc from "./cmds/misc.js";
import { db } from "./db.js";

var version = "1.5.3";
var warning_timers = [1, 5, 60];
var permitted = "";
var curr = "¥";
var perm_time;
var raffle_time = 0;
var joined = [];

export function add_user(user) {
    if (user) {
        db.run(
            "INSERT OR IGNORE INTO users (UserID, UserName) VALUES (?, ?)",
            user.payload.event.chatter_user_id,
            user.payload.event.chatter_user_login
        );
    }
}

export async function perform(client) {
    //update coin count for user and check message count
    var broadcaster = client.payload.event.broadcaster_user_login;
    var channel = client.payload.event.broadcaster_user_id;
    var username = client.payload.event.chatter_user_login;
    var user_id = client.payload.event.chatter_user_id;
    var msg = client.payload.event.message.text.toLowerCase().split(" ");
    var cmd = msg[0];
    msg.shift();
    var args = msg;

    update_records(username, user_id);
    check_activity(user_id);

    //Miscellaneous Commands
    if (SQUIRT_ENABLED.includes(broadcaster)) {
        if (cmd === "!squirt") {
            misc.squirt(username, cmd, args, channel);
        }
    }

    if (cmd === "!bonk" || cmd === "!hit") {
        misc.hit(broadcaster, username, cmd, args, channel);
    }
    /*
    if (cmd === "!level" && !LEVELS_DISABLED.includes(channel.substring(1))) {
        misc.level(channel, user, cmd, args, client);
    }
*/
    /* //Economy Commands
	if (ECONOMY_ENABLED.includes(channel.substring(1))) {
		if (SUPER_MOD.includes(user.username)) {
			if (cmd === "!add" || cmd === "!addpoints") {
				econ.addpoints(channel, user, cmd, args, client);
			}

			if (cmd === "!set" || cmd === "!setpoints") {
				econ.setpoints(channel, user, cmd, args, client);
			}
		}

		//raffle
		if (
			user.mod == true ||
			channel.substring(1) == user.username ||
			user.username == "interyon"
		) {
			if (cmd === "!raffle" && Date.now() > raffle_time) {
				var amnt;
				raffle_time = Date.now() + 30000;
				console.log(`Starting Raffle`.green);
				if (!isNaN(parseInt(args[0]))) {
					var amnt;
					if (args[0][args[0].length - 1] == "k") {
						amnt = parseInt(args[0], 10) * 1000;
					} else if (args[0][args[0].length - 1] == "m") {
						amnt = parseInt(args[0], 10) * 1000000;
					} else if (args[0][args[0].length - 1] == "b") {
						amnt = parseInt(args[0], 10) * 1000000000;
					} else {
						amnt = parseInt(args[0], 10);
					}
					if (amnt < 0) {
						amnt *= -1;
					}
				} else {
					amnt = 500;
				}
				client.say(
					channel,
					`/me interyPOP A Raffle has begun for ${curr}${tools.intFormat(
						amnt
					)} interyPOP it will end in 30 seconds. Enter by typing !join FeelsGoodMan`
				);
				await tools.sleep(7500);
				client.say(
					channel,
					`/me The Raffle for ${curr}${tools.intFormat(
						amnt
					)} will end in 22 seconds. Enter by typing !join FeelsGoodMan`
				);
				await tools.sleep(7500);
				client.say(
					channel,
					`/me The Raffle for ${curr}${tools.intFormat(
						amnt
					)} will end in 15 seconds. Enter by typing !join FeelsGoodMan`
				);
				await tools.sleep(7500);
				client.say(
					channel,
					`/me The Raffle for ${curr}${tools.intFormat(
						amnt
					)} will end in 7 seconds. Enter by typing !join FeelsGoodMan`
				);
				await tools.sleep(7500);
				econ.raffle(joined, amnt, cmd, channel, client);
				raffle_time = 0;
				joined.length = 0;
			}
		}

		if (cmd === "!join" && Date.now() < raffle_time) {
			joined.push(user.username);
		}

		if (cmd === "!coins" || cmd === "!points" || cmd === "!yen") {
			econ.return_coins(channel, user, cmd, args, client);
		}

		if (
			cmd === "!bid" ||
			cmd === "!bet" ||
			cmd === "!gamble" ||
			cmd === "!flip"
		) {
			econ.gamble(channel, user, cmd, args, client);
		}

		if (cmd === "!givepoints" || cmd === "!give") {
			econ.givepoints(channel, user, cmd, args, client);
		}
	}*/
}

function update_records(username, user_id) {
    db.run(
        "UPDATE users SET UserName = ?, MessagesSent = MessagesSent + 1, Coins = Coins + ? WHERE UserID = ?",
        username,
        Math.floor(Math.random() * 4),
        user_id
    );
}

function check_activity(user_id) {
    db.get(
        "SELECT MessagesSent FROM users WHERE UserID = ?",
        user_id,
        (err, row) => {
            if (err || row == undefined) {
                return;
            }
            var count = row.MessagesSent;
        }
    );
}
