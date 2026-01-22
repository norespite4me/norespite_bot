import colors from "colors";
import { sendChatMessage } from "../../src/app.js";
import * as tools from "../../src/tools.js";
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

export function join_raffle(channel) {
    tools.sleep(Math.floor(Math.random() * 5000) + 2500);
    sendChatMessage(channel, "!join");
}

export function join_fish(channel) {
    tools.sleep(2000);
    sendChatMessage(channel, `!guess ${Math.floor(Math.random() * 40) + 125}`);
}

// OSRS XP Formula: 
// TotalXP(level) = sum from i=1 to level-1 of floor((i + 300 * 2^(i/7)) / 4)
// Where each term floor((i + 300 * 2^(i/7)) / 4) is the XP needed to go from level i to level i+1
// Inverse calculation: level = find level where TotalXP(level) <= totalXP < TotalXP(level+1)
function calculateOSRSLevel(totalXP) {
    if (totalXP <= 0) return 1;
    
    // OSRS level 99 requires exactly 13,034,431 XP
    // If XP exceeds that, cap at 99
    const MAX_XP = 13034431;
    if (totalXP >= MAX_XP) return 99;
    
    let level = 1;
    let cumulativeXP = 0;
    
    // Calculate cumulative XP for each level until we exceed totalXP
    // Start from level 1, calculate XP needed to reach level 2, 3, etc.
    while (level < 99) {
        // XP needed to go from current level to next level
        // Formula: floor((level + 300 * 2^(level/7)) / 4)
        let xpForNextLevel = Math.floor(
            (level + 300 * Math.pow(2, level / 7)) / 4
        );
        
        // If adding this XP would exceed totalXP, we've found the level
        if (cumulativeXP + xpForNextLevel > totalXP) {
            break;
        }
        
        cumulativeXP += xpForNextLevel;
        level++;
    }
    
    return level;
}

export function level(channel, user, args) {
    // Old School RuneScape skill level algorithm (1-99)
    // XP formula: XP(level) = floor(sum from i=1 to level-1 of floor(i + 300 * 2^(i/7))) / 4
    // Level 99 requires exactly 13,034,431 XP
    // Each message = 58 XP (calibrated for ~225,000 messages to reach level 99)
    // Calculation: 13,034,431 XP ÷ 225,000 messages ≈ 58 XP/message
    var target;
    var level;

    if (args[0] != undefined) {
        target = args[0][0] == "@" ? args[0].substring(1) : args[0];
    } else {
        target = user;
    }

    db.get(
        "SELECT MessagesSent FROM users WHERE UserName = ?",
        target,
        function (err, row) {
            if (err) {
                sendChatMessage(channel, `/me ${target} has not typed in chat`);
                console.log(`exit on error 1: ${err.message}`.red);
                return;
            } else {
                try {
                    // Convert messages to XP (58 XP per message)
                    var totalXP = row.MessagesSent * 58;
                    
                    // Calculate OSRS level from total XP
                    level = calculateOSRSLevel(totalXP);
                    
                    sendChatMessage(
                        channel,
                        `/me ${target} is level ${level} with ${tools.intFormat(
                            totalXP
                        )} xp`
                    );
                } catch (err) {
                    sendChatMessage(
                        channel,
                        `/me ${target} has not typed in chat`
                    );
                    console.log(`exit on error 1: ${err.message}`.red);
                    return;
                }
                return;
            }
        }
    );
}

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
        "a mop",
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
        "toothpaste",
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
        "a brick",
        "a cinder block",
        "a traffic cone",
        "a mailbox",
        "a shopping cart",
        "a folding chair",
        "a park bench",
        "a refrigerator",
        "a freezer",
        "a vending machine",
        "a filing cabinet",
        "a bookshelf (fully loaded)",
        "a mattress",
        "a water heater",
        "a lawn mower",
        "a snowblower",
        "a wheelbarrow",
        "a fire hydrant",
        "a street lamp",
        "a street sign",
        "a road barrier",
        "a construction barricade",
        "a shipping pallet",
        "a stack of tires",
        "a dumpster",
        "a porta potty",
        "a hot tub",
        "a grill",
        "a propane tank",
        "a satellite dish",
        "a washing machine on spin cycle",
        "a dryer full of bricks",
        "a shopping mall kiosk",
        "a piano bench (with intent)",
        "a filing cabinet full of secrets",
        "a crate labeled FRAGILE. Must be Italian!",
        "a suspiciously heavy box",
        "a cardboard box reinforced with spite",
        "a microwave set to popcorn",
        "a microwave set incorrectly",
        "a ladder",
        "a step ladder (emotionally supportive)",
        "a wheel",
        "a hubcap",
        "a stack of textbooks",
        "a dictionary",
        "a thesaurus (for variety)",
        "a ream of printer paper",
        "a printer that smells like ozone",
        "a scanner lid",
        "a keyboard with missing keys",
        "a server rack",
        "a modem",
        "a router with blinking lights",
        "a tower PC",
        "a monitor stand",
        "a TV stand",
        "a desk drawer",
        "a rolling office chair",
        "a beanbag chair",
        "a floor lamp",
        "a ceiling fan (somehow)",
        "a chandelier",
        "a grandfather clock",
        "a cuckoo clock",
        "a microwave cart",
        "a cart from Home Depot",
        "a pallet jack",
        "a forklift (emotionally)",
        "a golf cart",
        "a canoe",
        "a kayak",
        "a rowboat",
        "a jet ski",
        "a lawn chair",
        "a patio table",
        "a picnic table",
        "a mailbox full of junk mail",
        "a sack of potatoes",
        "a bag of ice",
        "a frozen turkey",
        "a cast iron skillet",
        "a cauldron",
        "a barrel",
        "a keg",
        "a crate of oranges",
        "a stack of bricks",
        "a concrete pillar",
        "a manhole cover",
        "the Empire State Building",
        "a roundabout",
        "a surprise physics lesson",
        "a reality check",
        "a brick wrapped in duct tape",
        "a concrete slab",
        "a steel beam",
        "a parking meter",
        "a street curb",
        "a guardrail",
        "a toll booth",
        "a phone booth (full)",
        "a bus stop shelter",
        "a city bus",
        "a school bus",
        "a delivery truck",
        "a semi trailer",
        "a forklift with confidence",
        "a bulldozer",
        "a steamroller",
        "a wrecking ball",
        "a shipping container",
        "a cargo crate",
        "a missile silo door",
        "a slab of marble",
        "a granite countertop",
        "a tombstone",
        "a coffin (empty, probably)",
        "a church pew",
        "a confessional booth",
        "a pulpit",
        "a baptismal font",
        "a throne",
        "a guillotine (historical)",
        "a medieval battering ram",
        "a siege ladder",
        "a trebuchet (scaled down slightly)",
        "a cannon",
        "a crate of cannonballs",
        "a knight’s shield",
        "a suit of armor",
        "a broadsword (flat side)",
        "a mace",
        "a flail (unfortunate)",
        "a warhammer",
        "a pike",
        "a halberd",
        "a spear rack",
        "a shield wall",
        "a tank tread",
        "a tank (non-operational, still heavy)",
        "a jet engine",
        "a propeller",
        "a helicopter door",
        "an airplane wing",
        "a baggage carousel",
        "a TSA bin",
        "a runway light",
        "a control tower chair",
        "a flight simulator cockpit",
        "a casino slot machine",
        "a poker table",
        "a roulette wheel",
        "a craps table",
        "a vending machine that steals money",
        "a stack of arcade cabinets",
        "a pinball machine",
        "a jukebox",
        "a speaker stack",
        "a subwoofer",
        "a bass amp",
        "a drum kit (assembled)",
        "a concert riser",
        "a stage monitor",
        "a fog machine",
        "a lighting truss",
        "a road case",
        "a camera rig",
        "a boom mic pole",
        "a teleprompter",
        "a green screen frame",
        "a server blade",
        "a rack-mounted UPS",
        "a battery array",
        "a telecom cabinet",
        "a fiber spool",
        "a spool of copper wire",
        "a transformer (the boring kind)",
        "a power substation panel",
        "a breaker box",
        "a fuse box",
        "a generator",
        "a wind turbine blade",
        "a solar panel",
        "a satellite (grounded)",
        "a weather balloon",
        "a research probe",
        "a cryogenic freezer",
        "a lab centrifuge",
        "a containment unit",
        "a hazardous waste barrel",
        "a biohazard bin",
        "a radiation warning sign",
        "a decontamination shower",
        "a police barricade",
        "a riot shield",
        "a squad car door",
        "a jail cell door",
        "a courthouse bench",
        "a judge’s bench (symbolic)",
        "a filing cabinet labeled EVIDENCE",
        "a box labeled DO NOT OPEN",
        "a box labeled OPEN FIRST",
        "a crate labeled EXPERIMENTAL",
        "a crate labeled GOVERNMENT PROPERTY",
        "a crate labeled OH NO",

        // cursed but self-contained bonks
        "a legally binding document",
        "a strongly worded subpoena",
        "a cease and desist letter",
        "a tax form",
        "an audit",
        "an HR meeting",
        "a performance review",
        "a termination letter",
        "a resignation letter (printed)",
        "a student loan statement",
        "a medical bill",
        "an insurance deductible",
        "a parking ticket",
        "a boot on your car",
        "a tow notice",
        "a lease agreement",
        "a rent increase",
        "a mortgage payment",
        "a warranty that just expired",
        "a terms of service update",
        "a privacy policy",
        "a pop-up ad",
        "a captcha",
        "a firmware update",
        "a forced restart",
        "a blue screen",
        "a kernel panic",
        "a 404 error",
        "a missing semicolon",
        "a merge conflict",
        "a corrupted backup",
        "a production outage",
        "a surprise meeting invite",
        "a reply-all email",
        "a group chat screenshot",
        "a notification at 3am",
        "a voicemail that says “call me”",
        "a calendar reminder you forgot",
        "a consequence",
        "a reckoning",
        "a wake-up call",
        "a reality adjustment",
        "a moment of clarity",
        "the weight of your choices",
        "accountability (physical)",
        "a crowbar",
        "a semi truck",
        "the moon (shrunk)",
        "the moon",
        "a dragon",
        "a dentist appointment",
        "a bathtub",
        "a bad case of the Mondays",
        "a divorce",
        "child support",
        "a warden",
        "a can of sodie pop",
        "a Lord of the Rings marathon",
        "chicken feet",
        "an ottoman (not the empire)"
    ];

    return items[Math.floor(Math.random() * (items.length - 1))];
}


