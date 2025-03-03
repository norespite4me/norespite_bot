import {
    Client
} from 'tmi.js';
import * as tools from '../../src/tools.js';
import {
    db
} from '../db.js';
var curr = "¥";
var colors = require('colors');

function get_coins(target, callback) {
    db.get("SELECT Coins FROM users WHERE UserName = ?", target, function(err, row) {
        if (err || row == undefined) {
            return callback(null, null);
        } else {
            console.log(`got curr`.green);
            return callback(row.Coins);
        }
    });
}


export function return_coins(channel, user, cmd, args, client) {
    var coins;

    if (!args[0]) {
        get_coins(user.username, function(res) {
            if (res == null) {
                console.log("undefined user");
                client.say(channel, `/me undefined user BibleThump`);
            } else {
                coins = res;
                client.say(channel,
                    `/me ${user.username} has ${curr}${tools.intFormat(coins)}!`);
                console.log(`${user.username}: `.cyan, `${curr}${tools.intFormat(coins)}`.yellow);
            }
        });
    } else {
        var target = (args[0][0] == '@') ? args[0].substring(1) : args[0];
        get_coins(target, function(res) {
            if (res == null) {
                console.log("undefined user");
                client.say(channel, `/me undefined user BibleThump`);
            } else {
                coins = res;
                client.say(channel,
                    `/me ${args[0]} has ${curr}${tools.intFormat(coins)}!`);
                console.log(`${args[0]}: `.cyan, `${curr}${tools.intFormat(coins)}`.yellow);
            }
        });
    }
    console.log(`* Executed ${cmd} command`.green);
}


function update_coins(target, amount) {
    db.run("UPDATE users SET Coins = Coins + ? WHERE UserName = ?", amount, target, err => {
        if (err) {
            console.log(`${err}`.red);
        }
    });
}


export function gamble(channel, user, cmd, args, client) {
    if (!args[0]) {
        client.say(channel,
            `/me ${user.username}, you must specify a bidding amount`);
    } else {
        get_coins(user.username, function(res) {
            if (res == null) {
                console.log("undefined user");
                client.say(channel, `/me undefined user BibleThump`);
            } else {
                let coins = res;
                const roll = 50;
                var bet;
                if (args[0][args[0].length - 1] == 'k') {
                    bet = parseInt(args[0], 10) * 1000;
                } else if (args[0][args[0].length - 1] == 'm') {
                    bet = parseInt(args[0], 10) * 1000000;
                } else if (args[0][args[0].length - 1] == 'b') {
                    bet = parseInt(args[0], 10) * 1000000000;
                } else if (args[0][args[0].length - 1] == '%') {
                    bet = Math.floor(parseInt(args[0], 10) * coins / 100);
                } else {
                    bet = parseInt(args[0], 10);
                }

                let randy = Math.floor(Math.random() * 101);

                if (isNaN(bet) && args[0] != "all" && args[0] != "half" && args[0] != "quarter") {
                    client.say(channel,
                        `/me ${user.username}, you must specify a bidding amount`);
                } else if (bet < 10 && args[0] != "all" && args[0] != "half" && args[0] != "quarter") {
                    client.say(channel,
                        `/me ${user.username}, you have to bid more than 10 points`);
                } else if (args[0] != "all" && args[0] != "half" && args[0] != "quarter" && coins < 10) {
                    client.say(channel,
                        `/me ${user.username}, you don't have enough ${curr} to make a bid`);
                } else if (bet > coins && args[0] != "all" && args[0] != "half" && args[0] != "quarter") {
                    client.say(channel,
                        `/me ${user.username}, you are trying to bet more than you have! PunOko`);
                } else {
                    if (args[0] == "all") {
                        bet = coins;
                    } else if (args[0] == "half") {
                        bet = Math.floor(coins / 2);
                    } else if (args[0] == "quarter") {
                        bet = Math.floor(coins / 4);
                    }

                    if (randy >= roll) {
                        console.log(`${user.username}: `.cyan, `${curr}${tools.intFormat(coins)} => ${curr}${tools.intFormat(coins + bet)}`.yellow);
                        coins = coins + bet;
                        update_coins(user.username, bet);
                        client.say(channel,
                            `/me Winner! ${user.username} just bet ${curr}${tools.intFormat(bet)}, and now has ${curr}${tools.intFormat(coins)}!`);
                    } else {
                        console.log(`${user.username}: `.cyan, `${curr}${tools.intFormat(coins)} => ${curr}${tools.intFormat(coins - bet)}`.yellow);
                        coins = coins - bet;
                        update_coins(user.username, bet * -1);
                        client.say(channel,
                            `/me Too bad! ${user.username} bet and lost ${curr}${tools.intFormat(bet)}. They now have ${curr}${tools.intFormat(coins)}`);
                    }
                }
            }
        });
    }

    console.log(`* Executed ${cmd} command`.green);
}

export function addpoints(channel, user, cmd, args, client) {
    if (!args[1] || !args[0]) {
        client.say(channel,
            `/me you gotta specify a name and amount, dummy`
        );
    } else {
        let target = args[0];
        var amount;
        if (args[1][args[1].length - 1] == 'k') {
            amount = parseInt(args[1], 10) * 1000;
        } else if (args[1][args[1].length - 1] == 'm') {
            amount = parseInt(args[1], 10) * 1000000;
        } else if (args[1][args[1].length - 1] == 'm') {
            amount = parseInt(args[1], 10) * 1000000000;
        } else {
            amount = parseInt(args[1], 10);
        }

        if (isNaN(amount)) {
            client.say(channel,
                `/me did it wrong dumbass`);
        } else {
            get_coins(target, function(res) {
                if (res == null) {
                    console.log(`undefined user`.red);
                    client.say(channel, `/me undefined user BibleThump`);
                } else {
                    let coins = res;
                    let ncoins = coins + amount;
                    console.log(`${target}: `.cyan, `${curr}${tools.intFormat(coins)} => ${curr}${tools.intFormat(ncoins)}`.yellow);
                    update_coins(target, amount);
                    client.say(channel,
                        `/me gave ${target} ${curr}${tools.intFormat(amount)}. they now have ${curr}${tools.intFormat(ncoins)}`);
                }
            });
        }
    }
    console.log(`* Executed ${cmd} command`.green);
}

export async function givepoints(channel, user, cmd, args, client) {
    if (!args[0]) {
        client.say(channel,
            `${user.username} you must specify a target to give coins to`);
    } else if (args[0] && !args[1]) {
        client.say(channel,
            `${user.username} you must specify an amount to give to ${args[0]}`);
    } else {

        var user1 = user.username;
        var user2 = (args[0][0] == '@') ? args[0].substring(1) : args[0];
        var u1coins;
        var u2coins;

        get_coins(user1, function(res) {
            if (res == null) {
                console.log(`undefined user`.red);
                client.say(channel, `/me undefined user BibleThump`);
            } else {
                u1coins = res;

                var amnt;
                if (args[0][args[1].length - 1] == 'k') {
                    amnt = parseInt(args[1], 10) * 1000;
                } else if (args[1][args[1].length - 1] == 'm') {
                    amnt = parseInt(args[1], 10) * 1000000;
                } else if (args[1][args[1].length - 1] == 'b') {
                    amnt = parseInt(args[1], 10) * 1000000000;
                } else if (args[1][args[1].length - 1] == '%') {
                    amnt = Math.floor(parseInt(args[1], 10) * u1coins / 100);
                } else {
                    amnt = parseInt(args[1], 10);
                }
                console.log(amnt);  

                if (isNaN(amnt) && args[1] != "all" && args[1] != "half" && args[1] != "quarter") {
                    console.log(`amount not a number`.red);
                    client.say(channel, `/me ${user.username}, amount to give must be a number`);
                } else if (u1coins < amnt) {
                    console.log(`not enough ${curr} to transfer`.red);
                    client.say(channel, `/me ${user.username}, you don't have enough ${curr} to transfer!`);
                } else if (amnt < 0) {
                    console.log(`amount too low`.red);
                    client.say(channel, `/me ${user.username}, must give greater than 0`);
                } else {
                    if (args[1] == 'all') {
                        amnt = u1coins;
                    } else if (args[1] == 'half') {
                        amnt = Math.floor(u1coins / 2);
                    } else if (args[1] == 'quarter') {
                        amnt = Math.floor(u1coins / 4);
                    }
                    get_coins(user2, function(res2) {
                        if (res2 == null) {
                            console.log(`undefined user`.red);
                            client.say(channel, `/me undefined user BibleThump`);
                        } else {
                            u2coins = res2;
                            update_coins(user1, amnt * -1);
                            update_coins(user2, amnt);
                            console.log(`${user1}: `.cyan, `${curr}${tools.intFormat(u1coins)} => ${curr}${tools.intFormat(u1coins - amnt)}`.yellow);
                            console.log(`${user2}: `.cyan, `${curr}${tools.intFormat(u2coins)} => ${curr}${tools.intFormat(u2coins + amnt)}`.yellow);
                            client.say(channel, `/me ${user1} has given ${curr}${tools.intFormat(amnt)} to ${user2}!`);
                        }
                    });
                }
            }
        });
    }
}

export async function setpoints(channel, user, cmd, args, client) {
    if (!args[1] || !args[0]) {
        client.say(channel,
            `/me you gotta specify a name and amount, dummy`
        );
    } else {
        let target = args[0];
        var amount;
        if (args[1][args[1].length - 1] == 'k') {
            amount = parseInt(args[1], 10) * 1000;
        } else if (args[1][args[1].length - 1] == 'm') {
            amount = parseInt(args[1], 10) * 1000000;
        } else if (args[1][args[1].length - 1] == 'm') {
            amount = parseInt(args[1], 10) * 1000000000;
        } else {
            amount = parseInt(args[1], 10);
        }

        if (isNaN(amount)) {
            client.say(channel,
                `/me did it wrong dumbass`);
        } else {
            get_coins(target, function(res) {
                if (res == null) {
                    console.log(`undefined user`.red);
                    client.say(channel, `/me undefined user BibleThump`);
                } else {
                    let coins = res;
                    console.log(`${target}: `.cyan, `${curr}${tools.intFormat(coins)} => ${curr}${tools.intFormat(amount)}`.yellow);
                    update_coins(target, coins * -1);
                    update_coins(target, amount);
                    client.say(channel,
                        `/me set ${target} to ${curr}${tools.intFormat(amount)}.`);
                }
            });
        }
    }
    console.log(`* Executed ${cmd} command`.green);
}

export function raffle(joined, amnt, cmd, channel, client) {
    if (joined.length == 0) {
        client.say(
            channel,
            `/me Nobody entered the raffle FeelsBadMan`
        );
    } else {
        var winner = joined[Math.floor(Math.random() * (joined.length - 1))];
        update_coins(winner, amnt);
        client.say(
            channel,
            `/me ${winner} has won the raffle for ${curr}${tools.intFormat(amnt)}! interyPOP`
        );
    }

    get_coins(winner, function(res) {
        if (res == null) {
            console.log(`undefined user`.red);
        } else {
            let coins = res;
            console.log(`${winner}: `.cyan, `${curr}${tools.intFormat(coins - amnt)} => ${curr}${tools.intFormat(coins)}`.yellow);
        }
    });
    console.log(`* Executed ${cmd} command`.green);
}