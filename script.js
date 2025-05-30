let xp = 0;
let health = 50;
let money = 30;
let currentWeapon = 0;
let caveLevel = 1;
let monstersDefeated = 0;
let currentMonster = 0;

function PowerCalculation(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const locations = [
    {
        name: "Town Square",
        "button text": ["Go to Store", "Go to Cave", "Fight Dragon"],
        "button functions": [GoStore, GoCave, FightDragon],
        message: "You are at the town square. You see a sign that says store. You also see a forked path leading to a cave and a dragon's lair."
    },
    {
        name: "Store",
        "button text": ["Upgrade Weapon (30 Gold)", "Buy Health Potion (5 Gold)", "Go to Town Square"],
        "button functions": [BuyWeapon, BuyHealthPotion, GoTown],
        message: "You are at the store."
    },
    {
        name: "Cave",
        "button text": ["Explore Deeper", "Fight Monster", "Go back to Town"],
        "button functions": [ExploreDeeper, FightMonster, ExitCave],
        message: ""
    },
    {
        name: "Monster Fight",
        "button text": ["Attack", "Block", "Withdraw"],
        "button functions": [Attack, Block, Withdraw],
        message: ""
    },
    {
        name: "Dragon Fight",
        "button text": ["Attack", "Block", "Withdraw"],
        "button functions": [AttackDragon, BlockDragon, WithdrawDragon],
        message: "The dragon roars as you approach. You feel its infernal dread seeping you life essence slowly."
    }
]

const weapons = [
    {
        name: "Hands",
        min: 0,
        max: 5,
        get power() { return PowerCalculation(this.min, this.max) }
    },
    {
        name: "Stick",
        min: 5,
        max: 10,
        get power() { return PowerCalculation(this.min, this.max); }
    },
    {
        name: "Dagger",
        min: 25,
        max: 30,
        get power() { return PowerCalculation(this.min, this.max); }
    },
    {
        name: "Claw Hammer",
        min: 45,
        max: 50,
        get power() { return PowerCalculation(this.min, this.max); }
    },
    {
        name: "Sword",
        min: 90,
        max: 100,
        get power() { return PowerCalculation(this.min, this.max); }
    }
]

const monsters = [
    {
        name: "Bat",
        health: 5,
        minLevel: 1,
        get power() { return PowerCalculation(5, 10); }
    },
    {
        name: "Goblin",
        health: 10,
        minLevel: 2,
        get power() { return PowerCalculation(10, 30); }
    },
    {
        name: "Orc",
        health: 25,
        minLevel: 3,
        get power() { return PowerCalculation(40, 50); }
    }
]

const boss = [
    {
        name: "Dragon",
        health: 50,
        get power() { return PowerCalculation(90, 100); }
    }
]

function Update(location) {
    document.getElementById('message').innerHTML = location.message;
    document.getElementById('button1').innerHTML = location["button text"][0];
    document.getElementById('button2').innerHTML = location["button text"][1];
    document.getElementById('button3').innerHTML = location["button text"][2];
    document.getElementById('button1').onclick = location["button functions"][0];
    document.getElementById('button2').onclick = location["button functions"][1];
    document.getElementById('button3').onclick = location["button functions"][2];
}

function CheckWeaponStats() {

    document.getElementById('message').innerHTML = "Current weapon: " + weapons[currentWeapon].name + " | " +
        "Power: " + weapons[currentWeapon].min + "-" + weapons[currentWeapon].max;
}
function GoTown() {
    Update(locations[0]);
}

function GoStore() {
    Update(locations[1]);
}

function GoCave() {

    EnableButtons();
    Update(locations[2]);
    document.getElementById('message').innerHTML = "You are exploring the cave. You are currently at cave level " + caveLevel + ".";
}

function FightDragon() {

    EnableButtons();
    Update(locations[4]);
}

function BuyWeapon() {

    if (currentWeapon >= weapons.length - 1) {
        document.getElementById('message').innerHTML = "You have the strongest weapon available.";
    }
    if (money < 30) {
        document.getElementById('message').innerHTML = "Your poor ahh does not have enough gold to buy a weapon.";
    } else {
        money -= 30;
        document.getElementById('money').innerHTML = money;
        let newWeapon = weapons[++currentWeapon].name;
        document.getElementById('message').innerHTML = "You purchased " + newWeapon + ".";
    }
}

function BuyHealthPotion() {

    if (money < 5) {
        document.getElementById('message').innerHTML = "You do not have enough gold to buy a potion.";
    } else {
        if (health < 100) {
            money -= 5;
            health += 20;
            document.getElementById('money').innerHTML = money;
            document.getElementById('healthValue').innerHTML = health;
            document.getElementById('message').innerHTML = "You have purchased a potion. You gain 20 health";
        } else {
            health = 100;
            document.getElementById('healthValue').innerHTML = health;
            document.getElementById('message').innerHTML = "You are at maximum health.";
        }
    }
}

function ExploreDeeper() {

    if (monstersDefeated < 10) {
        document.getElementById('message').innerHTML = "You need to clear out the level first. Defeat 10 monsters. You currently have " + monstersDefeated + " monsters defeated.";
        return;
    } else {
        caveLevel++;
        monstersDefeated = 0;
        document.getElementById('message').innerHTML = "You are now at cave level " + caveLevel + ".";
    }
}

function FightMonster() {
    currentMonster = GetRandomMonster();
    Update(locations[3]);

    document.getElementById('message').innerHTML = "A " + currentMonster.name + " has appeared!"
    document.getElementById('monsterName').innerHTML = currentMonster.name;
    document.getElementById('monsterHealth').innerHTML = currentMonster.health;
    document.getElementById('monsterStats').style.display = "inline-block"
}

function GetRandomMonster() {

    const chosenMonster = monsters.filter(monster => caveLevel >= monster.minLevel);
    const index = Math.floor(Math.random() * chosenMonster.length);
    return { ...chosenMonster[index] };
}

function ExitCave() {

    caveLevel = 1;
    GoTown();
}

function Attack() {

    const playerPower = weapons[currentWeapon].power;
    const monsterPower = currentMonster.power;

    if (monsterPower > playerPower) {

        document.getElementById('message').innerHTML = "You lost 5 HP.";
        health -= 5;
        document.getElementById('healthValue').innerHTML = health;

    } else if (monsterPower === playerPower) {

        document.getElementById('message').innerHTML = "Both of you lost 5 HP."
        currentMonster.health -= 5;
        document.getElementById('healthValue').innerHTML = health;
        document.getElementById('monsterHealth').innerHTML = currentMonster.health;

    } else {

        document.getElementById('message').innerHTML = "The " + currentMonster.name + " loses 5 hp.";
        currentMonster.health -= 5;
        document.getElementById('monsterHealth').innerHTML = currentMonster.health;
    }

    if (currentMonster.health <= 0) {

        monstersDefeated++;
        xp += 10;
        money += 10;
        document.getElementById('xpValue').innerHTML = xp;
        document.getElementById('money').innerHTML = money;
        document.getElementById('message').innerHTML = "You defeated the " + currentMonster.name + "! Gained 10 XP.";
        document.getElementById('monsterStats').style.display = "none";
        MonsterDefeat();

    }

    if (health <= 0) {

        DefeatScreen();
        return;
    }
}

function DisableButtons() {

    document.getElementById('button1').style.display = "none";
    document.getElementById('button2').style.display = "none";
    document.getElementById('button3').style.display = "none";
    document.getElementById('button4').style.display = "none";
}

function EnableButtons() {

    document.getElementById('button1').style.display = "inline-block";
    document.getElementById('button2').style.display = "inline-block";
    document.getElementById('button3').style.display = "inline-block";
    document.getElementById('button4').style.display = "inline-block";
}

function MonsterDefeat() {

    DisableButtons();
    document.getElementById('button1').style.display = "inline-block";
    document.getElementById('button1').innerHTML = "Continue exploring.";
    document.getElementById('button1').onclick = GoCave;
}

function DefeatScreen() {

    DisableButtons();
    document.getElementById('message').innerHTML = "You died!";
    document.getElementById('button1').style.display = "inline-block";
    document.getElementById('button1').innerHTML = "Restart Game."
    document.getElementById('button1').onclick = () => location.reload();
}

function Block() {

    let blockHealChance = Math.floor(Math.random() * (100 - 0 + 1)) + 0;

    if (blockHealChance >= 95) {

        health += 5;
        document.getElementById('healthValue').innerHTML = health;
        document.getElementById('message').innerHTML = "Critical Block! You healed by 5 hp.";
    } else if (blockHealChance <= 10) {

        health -= 5;
        document.getElementById('healthValue').innerHTML = health;
        document.getElementById('message').innerHTML = "Block failure. You lose 5 hp.";

        if (health <= 0) {

            DefeatScreen();
            return;
        }
    } else {

        document.getElementById('message').innerHTML = "You blocked the " + currentMonster.name + "'s attack.";
    }
}

function Withdraw() {

    const escapeChance = Math.floor(Math.random() * (100 - 0 + 1)) + 0;

    if (escapeChance >= 10) {

        GoCave();
        document.getElementById('monsterStats').style.display = "none";
        document.getElementById('message').innerHTML = "You ran away from the " + currentMonster.name + " safely.";
    } else {

        document.getElementById('message').innerHTML = "The " + currentMonster.name + " manages to catch you and slash you. You lose 5 hp.";
        health -= 5;
        document.getElementById('healthValue').innerHTML = health;
    }
}

function FightDragon() {

    Update(locations[4]);

}

function AttackDragon() {
    
    const dragon = boss[0];
    const playerPower = weapons[currentWeapon].power;
    const dragonPower = dragon.power;

    if (dragonPower > playerPower) {

        document.getElementById('message').innerHTML = "The dragon bites hard. You lose 10 HP.";
        health -= 10;
        document.getElementById('healthValue').innerHTML = health;

    } else if (dragonPower === playerPower) {

        document.getElementById('message').innerHTML = "The dragon's tail knocks you back as you attack. You lose 5 hp."
        currentMonster.health -= 5;
        document.getElementById('healthValue').innerHTML = health;
        document.getElementById('monsterHealth').innerHTML = dragon.health;

    } else {

        document.getElementById('message').innerHTML = "Your weapon pierces the dragon's scales. It loses 5 hp.";
        dragon.health -= 5;
        document.getElementById('monsterHealth').innerHTML = dragon.health;
    }

    if (dragon.health <= 0) {

        VictoryScreen();
        return;
    }

    if (health <= 0) {

        DefeatScreen();
        return;
    }
}

function VictoryScreen() {

    DisableButtons();
    document.getElementById('message').innerHTML = "The dragon has been slain and you successfully protect the village!";
    document.getElementById('button1').style.display = "inline-block";
    document.getElementById('button1').innerHTML = "Play again."
    document.getElementById('button1').onclick = () => location.reload();
}

function BlockDragon() {

    let blockHealChance = Math.floor(Math.random() * (100 - 0 + 1)) + 0;

    if (blockHealChance >= 98) {

        health += 5;
        document.getElementById('healthValue').innerHTML = health;
        document.getElementById('message').innerHTML = "You manage to dodge the dragon's attack and heal 5 hp.";
    } else if (blockHealChance <= 20) {

        health -= 10;
        document.getElementById('healthValue').innerHTML = health;
        document.getElementById('message').innerHTML = "The dragon breaks through your cover. You lose 10 hp";

        if (health <= 0) {

            DefeatScreen();
            return;
        }
    } else {

        document.getElementById('message').innerHTML = "You barely dodge the dragon's attack.";
    }
}

function WithdrawDragon() {

    const escapeChance = Math.floor(Math.random() * (100 - 0 + 1)) + 0;

    if (escapeChance >= 5) {

        GoTown();
        document.getElementById('monsterStats').style.display = "none";
        document.getElementById('message').innerHTML = "You managed to escape the dragon's lair.";
    } else {

        document.getElementById('message').innerHTML = "The dragon sees your escape attempt and knocks you down with his tail. You lose 10 hp.";
        health -= 10;
        document.getElementById('healthValue').innerHTML = health;
    }
}