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
        "an armoire",
        "a bag of delicious snickers. You're not you when you're hungry",
        "a bar of soap. They need it.",
        "their BEAR hands",
        "a bucket of chum",
        "a butter-filled sock",
        "an adirondack",
        "a chancla",
        "a credenza",
        "a garbage disposal unit. Why is there a fork in it?",
        "a clove of garlic",
        "a high dosage of KETAMINE",
        "a keyboard",
        "a light switch",
        "a marriage proposal",
        "a mobile home",
        "a monopoly thimble",
        "nothing but love and affection ah ha ha",
        "a pair of yo momma's underwear",
        "a raw egg",
        "a roll of toilet paper",
        "a rubber ducky",
        "a sandal",
        "a scandal",
        "a sousaphone",
        "a toilet",
        "a tomato",
        "a toothbrush. Their breath stinks.",
        "toothpaste",
        "a redwood tree",
        "a trombone",
        "a truck",
        "a trumpet",
        "a turkey",
        "a walrus",
        "an aglet. you know, the plastic tip at the end of a shoelace?",
        "a porta potty",
        "The Piano Man",
        "a crate labeled FRAGILE. Must be Italian!",
        "a thesaurus (for variety)",
        "a cuckoo clock",
        "a cart from Home Depot",
        "a manhole cover",
        "the Empire State Building",
        "a roundabout",
        "a TARDIS",
        "a tombstone",
        "a coffin (empty, probably)",
        "a cannon",
        "a tank (non-operational, still heavy)",
        "a pinball machine",
        "a boom mic",
        "a wind turbine blade",
        "a crate labeled OH NO",
        "a warranty that just expired",
        "a pop-up ad",
        "a CAPTCHA",
        "accountability (physical)",
        "a crowbar",
        "a semi truck",
        "THA MOON (shrunk)",
        "the moon",
        "a dragon",
        "a dentist appointment",
        "a bathtub",
        "child support fees",
        "a warden",
        "a can of sodie pop",
        "a Lord of the Rings marathon",
        "chicken feet",
        "an ottoman (not the empire)",
        "betelgeuse",
        "beetlejuice...beetlejuice...beetlejuice...",
        "The Titanic",
        "an unskippable ad",
        "The Leaning Tower of Pisa",
        "a cat turd",
        "Shawn Spencer",
        "Burton Guster",
        "Bruton Gaster",
        "a smoldering look",
        "a waxing session",
        "a dog fart",
        "a spider",
        "a hoverboard",
        "Sofia Vergara",
        "The Liberty Bell",
        "The Declaration of Independence",
        "a Yield sign, because most stop signs could be replaced by yield signs",
        "a wet fart",
        "a shart curse",
        "a used plunger",
        "a smelly sock. WE HAVE A CODE 2319! 2319!",
        "a text from their ex",
        "a hangover",
        "a slice of stargazy pie",
        "a bedframe to the toe",
        "a foot with no body",
        "a jumpscare. Chat, you know what to do",
        "the stench from a Magic The Gathering tournament",
        "a used band-aid",
        "a clump of wet hair from the shower drain",
        "a memory of when they accidentally called their teacher 'Mom'",
        "the Ender Dragon",
        "a dirt block",
        "a crafting table",
        "an anvil",
        "a shark attack! EVERYONE! OUT OF THE WATER!",
        "a dragon scimmy",
        "the Wabbajack",
        "some green eco",
        "some red eco",
        "some blue eco",
        "some yellow eco",
        "a precursor orb",
        "a bucket of milk",
        "a burnt shrimp",
        "a dragon scale",
        "a mammoth tusk",
        "a giant's toe",
        "Alduin",
        "the Ice Troll on the 7,000 steps to High Hrothgar",
        "a stolen sweetroll",
        "an arrow to the knee",
        "Spongebob's spatula",
        "a Krabby Patty",
        "Squidward's clarinet",
        "The Magic Conch. What will they ask?",
        "Appa",
        "Sokka's boomeraing",
        "a cabbage cart",
        "the Omnitrix",
        "Ice King's Crown",
        "Finn's sword",
        "the Enchiridion",
        "...a platypus? *puts on hat* Perry the Platypus???",
        "Thomas the Tank Engine",
        "one of Benson's gumballs",
        "Da Rules",
        "Goddard",
        "Rufus the naked mole rat",
        "The Slab. Retuuuurn The Slab!",
        "a Pokeball",
        "a creeper",
        "an enderman",
        "a skeleton",
        "a draugr",
        "a slime",
        "a pressure washer",
        "a witty pop culture reference",
        "Taylor Swift",
        "Taylor Swift's private jet",
        "The Wither",
        "a blaze rod",
        "The Curse of The Black Pearl",
        "an unwanted lecture",
        "Midge",
        "The Fibonacci Sequence",
        "a Rick Roll. NEVER GONNA GIVE YOU UP! NEVER GONNA LET YOU DOOOWN!",
        "a bolt of lightning",
        "Mjolnir",
        "Loki's Sceptre",
        "a weird fanfic of them and their favorite streamer",
        "Doofenshmirtz Evil Incorporated! (I know you all just sang that in your heads)",
        "a danger noodle",
        "The Lich",
        "a cockadoodledoo",
        "the bubbleguts",
        "a flash mob",
        "Gibbeehhh!",
        "a case of sentient hotdogs",
        "Torchy",
        "Anaklusmos",
        "the intro to Up",
        "The Goblet of Fire",
        "The Chamber of Secrets",
        "The Philosopher's Stone",
        "The Prisoner of Azkaban",
        "The Order of the Phoenix",
        "The Half Blood Prince",
        "One of the Deathly Hallows",
        "Auriel's Bow",
        "the Blade of Woe",
        "Wuuthrad",
        "the Staff of Magnus",
        "a diamond shovel",
        "a diamond pickaxe",
        "a diamond hoe",
        "a diamond axe",
        "The Golden Claw"
    ];

    return items[Math.floor(Math.random() * (items.length - 1))];
}











