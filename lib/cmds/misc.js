import colors from "colors";
import { sendChatMessage } from "../../src/app.js";
import { db } from "../db.js";

colors.enable();

export function squirt(username, cmd, args, channel) {
    let randy = Math.floor(Math.random() * 36) + 1;
    if (!args[0]) {
        if (username == "norespite") {
            sendChatMessage(
                channel,
                `/me ${username}'s squirt distance is 50 feet!  noresp8POP`
            );
        } else {
            sendChatMessage(
                channel,
                `/me ${username}'s squirt distance is ${randy} feet! ${randemote()}`
            );
        }
    } else {
        var target = args[0];
        if (target == "norespite" || target == "@norespite") {
            sendChatMessage(
                channel,
                `/me ${target}'s squirt distance is 50 feet!  noresp8POP`
            );
        } else {
            sendChatMessage(
                channel,
                `/me ${target}'s squirt distance is ${randy} feet!  ${randemote()}`
            );
        }
    }
    console.log(`* Executed ${cmd} command`);
}

export async function hit(broadcaster, username, cmd, args, channel) {
    var target;
    try {
        if (!args[0]) {
            target = broadcaster;
            console.log(target);
        } else {
            target = args[0];
        }

        let key = cmd === "!hit" ? "hit" : "bonked";

        var item;
        if (target.includes("respite")) {
            item = "nothing but love and affection ah ha ha noresp8POP";
        } else {
            item = randitem();
        }

        sendChatMessage(
            channel,
            `/me ${username} has ${key} ${target} with ${item}`
        );
        console.log(`* Executed ${cmd} command`);
    } catch (e) {
        console.log("Error: ", e, target);
    }
}
/*
export function level(channel, user, cmd, args, client) {
    //17462 messages to reach prestige
    //equation to get level -> y = 0.907783x^0.462992 where y is level and x is messages sent
    var PRESTIGE_MSG = 15892;
    var target;
    var level;
    if (args[0]) {
        target = args[0][0] == "@" ? args[0].substring(1) : args[0];
    } else {
        target = user.username;
    }

    db.get(
        "SELECT MessagesSent FROM users WHERE UserName = ?",
        target,
        function (err, row) {
            if (err) {
                client.say(channel, `/me ${target} has not typed in chat`);
                console.log(`exit on error 1: ${err.message}`.red);
                return;
            } else {
                try {
                    var prestige = Math.floor(row.MessagesSent / PRESTIGE_MSG);
                    var msgs = row.MessagesSent % PRESTIGE_MSG;

                    if (prestige <= 10) {
                        level = Math.floor(0.907783 * Math.pow(msgs, 0.462992));
                        client.say(
                            channel,
                            `/me ${target} is Prestige ${prestige} level ${level} with ${tool.intFormat(
                                row.MessagesSent * 100
                            )} xp`
                        );
                    } else {
                        level = Math.floor(80 + msgs / 505);
                        client.say(
                            channel,
                            `/me ${target} is Master Prestige level ${tool.intFormat(
                                level
                            )} with ${tool.intFormat(
                                row.MessagesSent * 100
                            )} xp`
                        );
                    }
                } catch (err) {
                    client.say(channel, `${target} is an undefined user`);
                }
                return;
            }
        }
    );
}
*/
function randemote() {
    let emotes = [
        "noresp8POP",
        "noresp8ISCREAM",
        "vleyCry",
        "FortOne",
        "PogChamp",
        "BOP",
        "TPFufun",
        "Squid1 Squid2 Squid3 Squid2 Squid4",
        "PunOko",
        "KonCha",
        "BegWan",
        "BrainSlug",
        "LUL",
        "Jebaited",
        "cmonBruh",
        "OhMyDog",
        "CoolCat",
        "SoBayed",
        "BibleThump",
        "PJSalt",
        "Keepo",
        ":tf:",
        "AngelThump",
        "ariW",
        "BroBalt",
        "bttvNice",
        "bUrself",
        "CandianRage",
        "CiGrip",
        "ConcernDoge",
        "CruW",
        "cvHazmat",
        "cvL",
        "cvMask",
        "cvR",
        "D:",
        "DatSauce",
        "DogChamp",
        "DuckerZ",
        "FeelsAmazingMan",
        "FeelsBadMan",
        "FeelsBirthdayMan",
        "FeelsGoodMan",
        "FireSpeed",
        "FishMoley",
        "ForeverAlone",
        "GabeN",
        "haHAA",
        "HailHelix",
        "Hhhehehe",
        "KappaCool",
        "KaRappa",
        "KKona",
        "LuL",
        "M&Mjc",
        "monkaS",
        "NaM",
        "notsquishY",
        "PoleDoge",
        "RarePepe",
        "RonSmug",
        "SaltyCorn",
        "ShoopDaWhoop",
        "sosGame",
        "SourPls",
        "SqShy",
        "TaxiBro",
        "tehPoleCat",
        "TwaT",
        "VisLaud",
        "WatChuSay",
        "Wowee",
        "WubTF",
    ];
    return emotes[Math.floor(Math.random() * (emotes.length - 1))];
}

function randitem() {
    let items = [
        "a CD",
        "an alarm clock",
        "an armoire",
        "a backpack",
        "a bag of delicious snickers. you're not you when you're hungry",
        "a bag of gummy bears",
        "a banana",
        "a bar of soap",
        "their bare hands",
        "a bed",
        "some bedding",
        "a bedspread",
        "a binder",
        "a blanket",
        "blinds",
        "a book",
        "a bookcase",
        "a boom box",
        "a bottle",
        "a box",
        "boxing glove",
        "bread",
        "a broom",
        "a brush",
        "a bucket",
        "a butter-filled sock",
        "a calendar",
        "a candle",
        "a car",
        "a chair",
        "a chancla",
        "a clock",
        "a comfortor",
        "a computer",
        "a controller",
        "a cookie",
        "a couch cushion",
        "a couch",
        "a credenza",
        "a cup",
        "a desk",
        "a dish towel",
        "a dishwasher",
        "a dog",
        "a door stop",
        "a drape",
        "a drill",
        "a dryer",
        "a dust pan",
        "an end table",
        "an extension cord",
        "a fan",
        "a figurine",
        "a file cabinet",
        "a fire extinguisher",
        "a flashlight",
        "flatware",
        "a flower",
        "a fork",
        "a frying pan",
        "a furnace",
        "a gallon of milk",
        "a garlic clove",
        "a glove",
        "a glowstick",
        "a grape",
        "a hairbrush",
        "a hammer",
        "a headset",
        "a heater",
        "a helmet",
        "a high dosage of KETAMINE",
        "a hockey puck",
        "a houseplant",
        "an iphone",
        "an ipod",
        "an iron",
        "an ironing board",
        "a keyboard",
        "a knife",
        "a lamp",
        "a light bulb",
        "a light switch",
        "a magnet",
        "a marker",
        "a marriage proposal",
        "a microwave",
        "a mobile home",
        "a monopoly thimble",
        "mop",
        "a mug",
        "nothing but love and affection ah ha ha",
        "an oven",
        "a painting",
        "a pair of glasses",
        "a pair of pants",
        "a pair of yo momma's underwear",
        "a pan",
        "a pen",
        "a pencil",
        "a piano",
        "a pickle",
        "a potato",
        "a purse",
        "a raw egg",
        "a roll of toilet paper",
        "a rubber duck",
        "a sandal",
        "a screw",
        "a screwdriver",
        "a shelf",
        "a shoe",
        "a slipper",
        "a snare drum",
        "a sousaphone",
        "a sponge",
        "a spoon",
        "a stop sign",
        "a traffic light",
        "a suitcase",
        "a table",
        "a teddy bear",
        "a telephone",
        "a television",
        "a tissue box",
        "a toaster",
        "a toilet",
        "a tomato",
        "a toothbrush",
        "a toothpaste",
        "a toothpick",
        "a toy",
        "a train",
        "a trashcan",
        "a tree",
        "a trombone",
        "a truck",
        "a trumpet",
        "a turkey",
        "a tv",
        "a vacuum",
        "a vase",
        "a wagon",
        "a wallet",
        "a walnut",
        "a walrus",
        "a washer",
        "a washing machine",
        "a tundra",
        "an intervention",
        "an msr",
        "a pelington",
        "an aglet. you know, the plastic tip at the end of a shoelace?",
    ];

    return items[Math.floor(Math.random() * (items.length - 1))];
}
