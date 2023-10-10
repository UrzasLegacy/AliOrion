//Setup:
//Engrave 'Imbuing' on a leather backpack and put it in your pack. This will hold your imbuing mats
//Be near a soulforge and a secured container full of gems and basic imbuing mats to restock from. The script will ask you to target this container OR you can engrave this container 'Special Mats' to automatically use it
//Describe your imbuing specs in the initImbueFavorites function object imbueFavorites
//Call ImbueItemsByFavorite() with the name of your saved imbuing spec as the argument e.g., ImbueItemsByFavorite('AsukaArmor')
//Follow the instructions that appear over your character

    //Mod Name: Exactly as it appears in the imbuing menu
    //Verification String: New Value exactly as it appears with symbols and everything if they exist. i.e. 20% OR -30 OR 15 OR false if nothing
    //Buttons pressed: how the script interacts with the gump buttons to get to the target value in order
    //example
    //'Name': [
    //  ['Mod Name', 'Verification string', [buttons pressed to get to target value]],
    //  ['Mod Name', 'Verification string', [buttons pressed to get to target value]],
    //]
    //Buttons:
    // Button.IncrementOne
    // Button.IncrementTen
    // Button.IncrementMax
    // Button.DecrementOne
    // Button.DecrementTen
    // Button.DecrementMax
function initImbueFavorites(_)
    {
    const imbueFavorites =
        {
        'AsukaArmor':   [
                ['Lower Mana Cost', '7%', [Button.IncrementMax, Button.DecrementOne] ],
                ['Mana Increase', '7', [Button.IncrementMax, Button.DecrementOne] ],
                ['Mana Regeneration', '1', [Button.DecrementMax]],
                ['Lower Reagent Cost', '17%', [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne, Button.DecrementOne] ],
            ],
        'AsukaJewels':	[
                ['Magery', '+13', [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne]],
            ],
        'PhysResistMaxMinus2':	[ //max resist without using boura pelts
                ['Physical Resist', false, [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne]],
            ],
        'FireResistMaxMinus2':	[
                ['Fire Resist', false, [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne]],
            ],
        'ColdResistMaxMinus2':	[
                ['Cold Resist', false, [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne]],
            ],
        'PoisResistMaxMinus2':	[
                ['Poison Resist', false, [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne]],
            ],
        'EnerResistMaxMinus2':	[
                ['Energy Resist', false, [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne]],
            ],
        }
    return imbueFavorites;
    }

function AsukaArmor()
    {
    ImbueItemsByFavorite('AsukaArmor');
    }
    
function AsukaJewels()
    {
    ImbueItemsByFavorite('AsukaJewels');
    }

function PhysResistMaxMinus2()
    {
    ImbueItemsByFavorite('PhysResistMaxMinus2')
    }

function FireResistMaxMinus2()
    {
    ImbueItemsByFavorite('FireResistMaxMinus2')
    }

function ColdResistMaxMinus2()
    {
    ImbueItemsByFavorite('ColdResistMaxMinus2')
    }

function PoisResistMaxMinus2()
    {
    ImbueItemsByFavorite('PoisResistMaxMinus2')
    }

function EnerResistMaxMinus2()
    {
    ImbueItemsByFavorite('EnerResistMaxMinus2')
    }

// Do not edit below
const Button =
    {
    'Close': 0,
    'ImbueItem': 1,
    'ReimbueLast': 4,
    'ImbueLastItem': 3,
    'ImbueLastProperty': 5,
    'UnravelItem': 2,
    'UnravelContainer': 6,
    
    'IncrementOne': 312,
    'IncrementTen': 315,
    'IncrementMax': 313,
    'DecrementOne': 311,
    'DecrementTen': 314,
    'DecrementMax': 310,
    'Back': 301,
    'Confirm': 302,
    }

function ImbueItemsByFavorite(imbueFavoriteName)
    {
    var imbueFavorite = initImbueFavorites()[imbueFavoriteName];
    var supplyContainerObj = Orion.FindTypeEx(any,any,ground,'item',2).filter(function(item)
        {
        return Orion.Contains(item.Properties(), 'Engraved: Special Mats');
        })[0];
    if(!supplyContainerObj)
        {
        Orion.CharPrint(self,1159,'Target resupply container. It should contain gems and basic imbuing mats.\nAdvanced mats must be in your backpack already!')
        Orion.WaitForAddObject('myTarget');
        var supplyContainer = Orion.GetSerial('myTarget');
        }
    else
        var supplyContainer = supplyContainerObj.Serial();
    Orion.CharPrint(self,1159,'Target item or container full of items to imbue.');
    Orion.WaitForAddObject('myTarget');
    var itemObj = Orion.FindObject('myTarget');
    var itemSerial = itemObj.Serial();
    if(!itemObj || itemObj.Mobile())
        return Orion.CharPrint(self,1159,'Invalid target! Halting...');
    else if(Orion.Contains(itemObj.Properties(), 'Contents: '))
        {
        while(!Orion.GumpExists('container',itemSerial))
            {
            Orion.UseObject(itemSerial);
            Orion.Wait(1300);
            }
        var items = Orion.FindType(any,any,itemSerial);
        for(var i=0;i<items.length;i++)
            {
            var item = items[i];
            var itemMod = initImbueMods(item);
            for(var ii=0;ii<imbueFavorite.length;ii++)
                ImbueModByIncrements(item, supplyContainer, itemMod[imbueFavorite[ii][0]], imbueFavorite[ii][2], imbueFavorite[ii][1]);
            var itemObj = Orion.FindObject(item);
            while(!Orion.Contains(itemObj.Properties(),'<b>Insured</b>'))
                {
                Orion.WaitContextMenuID(self, 418);
                Orion.RequestContextMenu(self);
                if(Orion.WaitForTarget(3000))
                    Orion.TargetObject(item);
                Orion.Wait(1300);
                }
            }
        }
    else
        {
        var itemMod = initImbueMods(itemSerial);
        for(var i=0;i<imbueFavorite.length;i++)
            ImbueModByIncrements(itemSerial, supplyContainer, itemMod[imbueFavorite[i][0]], imbueFavorite[i][2], imbueFavorite[i][1]);
        }
    PressGumpInitialButton(Button.Close);
    }

function initImbueMods(itemSerial)
    {
    const jewelryMod =
        {
        'Spell Damage Increase': [1114248, 205, 'Crystal Shards', '0x5738', '0x0000'],
        'Lower Reagent Cost': [1114248, 204, 'Faery Dust', '0x5745', '0x0000'],
        'Lower Mana Cost': [1114248, 203, 'Essence Of Order', '0x571C', '0x0481'],
        'Faster Casting': [1114248, 202, 'Essence Of Achievement', '0x571C', '0x002F'],
        'Faster Cast Recovery': [1114248, 201, 'Essence Of Diligence', '0x571C', '0x048E'],

        'Damage Increase': [1114249, 203, 'Crystal Shards', '0x5738', '0x0000'],
        'Hit Chance Increase': [1114249, 202, 'Essence Of Precision', '0x571C', '0x0016'],
        'Defense Chance Increase': [1114249, 201, 'Essence Of Singularity', '0x571C', '0x0497'],

        'Night Sight': [1114252, 203, 'Bottle Of Ichor', '0x5748', '0x0000'],
        'Luck': [1114252, 202, 'Chaga Mushroom', '0x5743', '0x0000'],
        'Enhance Potions': [1114252, 201, 'Crushed Glass', '0x573B', '0x0000'],

        'Poison Resist': [1114254, 205, 'Boura Pelt', '0x5742', '0x0000'],
        'Physical Resist': [1114254, 204, 'Boura Pelt', '0x5742', '0x0000'],
        'Fire Resist': [1114254, 203, 'Boura Pelt', '0x5742', '0x0000'],
        'Energy Resist': [1114254, 202, 'Boura Pelt', '0x5742', '0x0000'],
        'Cold Resist': [1114254, 201, 'Boura Pelt', '0x5742', '0x0000'],
        
        'Fencing': [1114255, 205, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Mace Fighting': [1114255, 204, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Swordsmanship': [1114255, 203, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Musicianship': [1114255, 202, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Magery': [1114255, 201, 'Crystalline Blackrock', '0x5732', '0x0000'],

        'Wrestling': [1114256, 205, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Animal Taming': [1114256, 204, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Spirit Speak': [1114256, 203, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Tactics': [1114256, 202, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Provocation': [1114256, 201, 'Crystalline Blackrock', '0x5732', '0x0000'],

        'Focus': [1114257, 206, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Parrying': [1114257, 205, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Stealth': [1114257, 204, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Meditation': [1114257, 203, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Animal Lore': [1114257, 202, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Discordance': [1114257, 201, 'Crystalline Blackrock', '0x5732', '0x0000'],

        'Mysticism': [1114258, 207, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Bushido': [1114258, 206, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Necromancy': [1114258, 205, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Veterinary': [1114258, 204, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Stealing': [1114258, 203, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Eval Intelligence': [1114258, 202, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Anatomy': [1114258, 201, 'Crystalline Blackrock', '0x5732', '0x0000'],

        'Peacemaking': [1114259, 207, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Throwing': [1114259, 206, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Ninjitsu': [1114259, 205, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Chivalry': [1114259, 204, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Archery': [1114259, 203, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Resisting Spells': [1114259, 202, 'Crystalline Blackrock', '0x5732', '0x0000'],
        'Healing': [1114259, 201, 'Crystalline Blackrock', '0x5732', '0x0000'],

        'Strength Bonus': [1114262, 203, 'Fire Ruby', '0x3197', '0x0000'],
        'Intelligence Bonus': [1114262, 202, 'Blue Diamond', '0x3198', '0x0000'],
        'Dexterity Bonus': [1114262, 201, 'Turquoise', '0x3193', '0x0000'],
        }

    const armorMod =
        {
        'Lower Reagent Cost': [1114248, 202, 'Faery Dust', '0x5745', '0x0000'],
        'Lower Mana Cost': [1114248, 201, 'Essence Of Order', '0x571C', '0x0481'],

        'Reflect Physical Damage': [1114252, 203, 'Reflective Wolf Eye', '0x5749', '0x0000'],
        'Night Sight': [1114252, 202, 'Bottle Of Ichor', '0x5748', '0x0000'],
        'Luck': [1114252, 201, 'Chaga Mushroom', '0x5743', '0x0000'],

        'Poison Resist': [1114254, 205, 'Boura Pelt', '0x5742', '0x0000'],
        'Physical Resist': [1114254, 204, 'Boura Pelt', '0x5742', '0x0000'],
        'Fire Resist': [1114254, 203, 'Boura Pelt', '0x5742', '0x0000'],
        'Energy Resist': [1114254, 202, 'Boura Pelt', '0x5742', '0x0000'],
        'Cold Resist': [1114254, 201, 'Boura Pelt', '0x5742', '0x0000'],

        'Stamina Increase': [1114262, 206, 'Luminescent Fungi', '0x3191', '0x0000'],
        'Hit Point Regeneration': [1114262, 205, 'Seed Of Renewal', '0x5736', '0x0000'],
        'Stamina Regeneration': [1114262, 204, 'Seed Of Renewal', '0x5736', '0x0000'],
        'Mana Regeneration': [1114262, 203, 'Seed Of Renewal', '0x5736', '0x0000'],
        'Mana Increase': [1114262, 202, 'Luminescent Fungi', '0x3191', '0x0000'],
        'Hit Point Increase': [1114262, 201, 'Luminescent Fungi', '0x3191', '0x0000'],
        }

    const shieldMod =
        {
        'Spell Channeling': [1114248, 202, 'Silver Snake Skin', '0x5744', '0x0000'],
        'Faster Casting': [1114248, 201, 'Essence Of Achievement', '0x571C', '0x002F'],

        'Defense Chance Increase': [1114249, 201, 'Essence Of Singularity', '0x571C', '0x0497'],

        'Reflect Physical Damage': [1114252, 203, 'Reflective Wolf Eye', '0x5749', '0x0000'],
        'Lower Requirements': [1114252, 202, 'Elven Fletching', '0x5737', '0x0000'],
        'Durability': [1114252, 201, 'Powdered Iron', '0x573D', '0x0000'],
        }

    const weapon2hMod =
        {
        'Spell Channeling': [1114248, 203, 'Silver Snake Skin', '0x5744', '0x0000'],
        'Mage Weapon': [1114248, 202, 'Arcanic Rune Stone', '0x573C', '0x0000'],
        'Faster Casting': [1114248, 201, 'Essence Of Achievement', '0x571C', '0x002F'],

        'Damage Increase': [1114249, 206, 'Crystal Shards', '0x5738', '0x0000'],
        'Swing Speed Increase': [1114249, 205, 'Essence Of Control', '0x571C', '0x048D'],
        'Balanced': [1114249, 204, 'Essence Of Balance', '0x571C', '0x0043'],
        'Hit Chance Increase': [1114249, 203, 'Essence Of Precision', '0x571C', '0x0016'],
        'Defense Chance Increase': [1114249, 202, 'Essence Of Singularity', '0x571C', '0x0497'],
        'Use Best Weapon Skill': [1114249, 201, 'Delicate Scales', '0x573A', '0x0000'],

        'Hit Poison Area': [1114250, 205, 'Raptor Teeth', '0x5747', '0x0000'],
        'Hit Physical Area': [1114250, 204, 'Raptor Teeth', '0x5747', '0x0000'],
        'Hit Fire Area': [1114250, 203, 'Raptor Teeth', '0x5747', '0x0000'],
        'Hit Energy Area': [1114250, 202, 'Raptor Teeth', '0x5747', '0x0000'],
        'Hit Cold Area': [1114250, 201, 'Raptor Teeth', '0x5747', '0x0000'],

        'Hit Stamina Leech': [1114251, 215, 'Void Orb', '0x573E', '0x0000'],
        'Hit Mana Leech': [1114251, 213, 'Void Orb', '0x573E', '0x0000'],
        'Hit Magic Arrow': [1114251, 212, 'Essence Of Feeling', '0x571C', '0x0034'],
        'Hit Lower Defense': [1114251, 211, 'Parasitic Plant', '0x3190', '0x0000'],
        'Hit Lower Attack': [1114251, 210, 'Parasitic Plant', '0x3190', '0x0000'],
        'Hit Lightning': [1114251, 209, 'Essence Of Passion', '0x571C', '0x0489'],
        'Hit Life Leech': [1114251, 208, 'Void Orb', '0x573E', '0x0000'],
        'Hit Harm': [1114251, 207, 'Parasitic Plant', '0x3190', '0x0000'],
        'Hit Fireball': [1114251, 206, 'Fire Ruby', '0x3197', '0x0000'],
        'Hit Dispel': [1114251, 202, 'Slith Tongue', '0x5746', '0x0000'],

        'Luck': [1114252, 201, 'Chaga Mushroom', '0x5743', '0x0000'],

        'Poison Resist': [1114254, 205, 'Boura Pelt', '0x5742', '0x0000'],
        'Physical Resist': [1114254, 204, 'Boura Pelt', '0x5742', '0x0000'],
        'Fire Resist': [1114254, 203, 'Boura Pelt', '0x5742', '0x0000'],
        'Energy Resist': [1114254, 202, 'Boura Pelt', '0x5742', '0x0000'],
        'Cold Resist': [1114254, 201, 'Boura Pelt', '0x5742', '0x0000'],
        
        'Water Elemental Slayer': [1114263, 220, 'White Pearl', '0x3196', '0x0000'],
        'Troll Slayer': [1114263, 219, 'White Pearl', '0x3196', '0x0000'],
        'Terathan Slayer': [1114263, 218, 'White Pearl', '0x3196', '0x0000'],
        'Spider Slayer': [1114263, 217, 'White Pearl', '0x3196', '0x0000'],
        'Snow Elemental Slayer': [1114263, 216, 'White Pearl', '0x3196', '0x0000'],
        'Snake Slayer': [1114263, 215, 'White Pearl', '0x3196', '0x0000'],
        'Scorpion Slayer': [1114263, 214, 'White Pearl', '0x3196', '0x0000'],
        'Poison Elemental Slayer': [1114263, 213, 'White Pearl', '0x3196', '0x0000'],
        'Orc Slayer': [1114263, 212, 'White Pearl', '0x3196', '0x0000'],
        'Ophidian Slayer': [1114263, 211, 'White Pearl', '0x3196', '0x0000'],
        'Ogre Slayer': [1114263, 210, 'White Pearl', '0x3196', '0x0000'],
        'Lizardman Slayer': [1114263, 209, 'White Pearl', '0x3196', '0x0000'],
        'Gargoyle Slayer': [1114263, 208, 'White Pearl', '0x3196', '0x0000'],
        'Fire Elemental Slayer': [1114263, 207, 'White Pearl', '0x3196', '0x0000'],
        'Earth Elemental Slayer': [1114263, 206, 'White Pearl', '0x3196', '0x0000'],
        'Dragon Slayer': [1114263, 205, 'White Pearl', '0x3196', '0x0000'],
        'Blood Elemental Slayer': [1114263, 203, 'White Pearl', '0x3196', '0x0000'],
        'Air Elemental Slayer': [1114263, 201, 'White Pearl', '0x3196', '0x0000'],

        'Undead Slayer': [1114264, 207, 'Undying Flesh', '0x5731', '0x0000'],
        'Reptile Slayer': [1114264, 206, 'Lava Serpent Crust', '0x572D', '0x0000'],
        'Repond Slayer': [1114264, 205, 'Goblin Blood', '0x572C', '0x0000'],
        'Fey Slayer': [1114264, 204, 'Fey Wings', '0x5726', '0x0000'],
        'Elemental Slayer': [1114264, 203, 'Vial Of Vitriol', '0x5722', '0x0000'],
        'Demon Slayer': [1114264, 202, 'Daemon Claw', '0x5721', '0x0000'],
        'Arachnid Slayer': [1114264, 201, 'Spider Carapace', '0x5720', '0x0000'],
        }

    const weapon1hMod =
        {
        'Spell Channeling': [1114248, 203, 'Silver Snake Skin', '0x5744', '0x0000'],
        'Mage Weapon': [1114248, 202, 'Arcanic Rune Stone', '0x573C', '0x0000'],
        'Faster Casting': [1114248, 201, 'Essence Of Achievement', '0x571C', '0x002F'],

        'Damage Increase': [1114249, 205, 'Crystal Shards', '0x5738', '0x0000'],
        'Swing Speed Increase': [1114249, 204, 'Essence Of Control', '0x571C', '0x048D'],
        'Hit Chance Increase': [1114249, 203, 'Essence Of Precision', '0x571C', '0x0016'],
        'Defense Chance Increase': [1114249, 202, 'Essence Of Singularity', '0x571C', '0x0497'],
        'Use Best Weapon Skill': [1114249, 201, 'Delicate Scales', '0x573A', '0x0000'],

        'Hit Poison Area': [1114250, 205, 'Raptor Teeth', '0x5747', '0x0000'],
        'Hit Physical Area': [1114250, 204, 'Raptor Teeth', '0x5747', '0x0000'],
        'Hit Fire Area': [1114250, 203, 'Raptor Teeth', '0x5747', '0x0000'],
        'Hit Energy Area': [1114250, 202, 'Raptor Teeth', '0x5747', '0x0000'],
        'Hit Cold Area': [1114250, 201, 'Raptor Teeth', '0x5747', '0x0000'],

        'Hit Stamina Leech': [1114251, 215, 'Void Orb', '0x573E', '0x0000'],
        'Hit Mana Leech': [1114251, 213, 'Void Orb', '0x573E', '0x0000'],
        'Hit Magic Arrow': [1114251, 212, 'Essence Of Feeling', '0x571C', '0x0034'],
        'Hit Lower Defense': [1114251, 211, 'Parasitic Plant', '0x3190', '0x0000'],
        'Hit Lower Attack': [1114251, 210, 'Parasitic Plant', '0x3190', '0x0000'],
        'Hit Lightning': [1114251, 209, 'Essence Of Passion', '0x571C', '0x0489'],
        'Hit Life Leech': [1114251, 208, 'Void Orb', '0x573E', '0x0000'],
        'Hit Harm': [1114251, 207, 'Parasitic Plant', '0x3190', '0x0000'],
        'Hit Fireball': [1114251, 206, 'Fire Ruby', '0x3197', '0x0000'],
        'Hit Dispel': [1114251, 202, 'Slith Tongue', '0x5746', '0x0000'],

        'Luck': [1114252, 201, 'Chaga Mushroom', '0x5743', '0x0000'],

        'Poison Resist': [1114254, 205, 'Boura Pelt', '0x5742', '0x0000'],
        'Physical Resist': [1114254, 204, 'Boura Pelt', '0x5742', '0x0000'],
        'Fire Resist': [1114254, 203, 'Boura Pelt', '0x5742', '0x0000'],
        'Energy Resist': [1114254, 202, 'Boura Pelt', '0x5742', '0x0000'],
        'Cold Resist': [1114254, 201, 'Boura Pelt', '0x5742', '0x0000'],
        
        'Water Elemental Slayer': [1114263, 220, 'White Pearl', '0x3196', '0x0000'],
        'Troll Slayer': [1114263, 219, 'White Pearl', '0x3196', '0x0000'],
        'Terathan Slayer': [1114263, 218, 'White Pearl', '0x3196', '0x0000'],
        'Spider Slayer': [1114263, 217, 'White Pearl', '0x3196', '0x0000'],
        'Snow Elemental Slayer': [1114263, 216, 'White Pearl', '0x3196', '0x0000'],
        'Snake Slayer': [1114263, 215, 'White Pearl', '0x3196', '0x0000'],
        'Scorpion Slayer': [1114263, 214, 'White Pearl', '0x3196', '0x0000'],
        'Poison Elemental Slayer': [1114263, 213, 'White Pearl', '0x3196', '0x0000'],
        'Orc Slayer': [1114263, 212, 'White Pearl', '0x3196', '0x0000'],
        'Ophidian Slayer': [1114263, 211, 'White Pearl', '0x3196', '0x0000'],
        'Ogre Slayer': [1114263, 210, 'White Pearl', '0x3196', '0x0000'],
        'Lizardman Slayer': [1114263, 209, 'White Pearl', '0x3196', '0x0000'],
        'Gargoyle Slayer': [1114263, 208, 'White Pearl', '0x3196', '0x0000'],
        'Fire Elemental Slayer': [1114263, 207, 'White Pearl', '0x3196', '0x0000'],
        'Earth Elemental Slayer': [1114263, 206, 'White Pearl', '0x3196', '0x0000'],
        'Dragon Slayer': [1114263, 205, 'White Pearl', '0x3196', '0x0000'],
        'Blood Elemental Slayer': [1114263, 203, 'White Pearl', '0x3196', '0x0000'],
        'Air Elemental Slayer': [1114263, 201, 'White Pearl', '0x3196', '0x0000'],

        'Undead Slayer': [1114264, 207, 'Undying Flesh', '0x5731', '0x0000'],
        'Reptile Slayer': [1114264, 206, 'Lava Serpent Crust', '0x572D', '0x0000'],
        'Repond Slayer': [1114264, 205, 'Goblin Blood', '0x572C', '0x0000'],
        'Fey Slayer': [1114264, 204, 'Fey Wings', '0x5726', '0x0000'],
        'Elemental Slayer': [1114264, 203, 'Vial Of Vitriol', '0x5722', '0x0000'],
        'Demon Slayer': [1114264, 202, 'Daemon Claw', '0x5721', '0x0000'],
        'Arachnid Slayer': [1114264, 201, 'Spider Carapace', '0x5720', '0x0000'],
        }

    const bowMod =
        {
        'Spell Channeling': [1114248, 203, 'Silver Snake Skin', '0x5744', '0x0000'],
        'Mage Weapon': [1114248, 202, 'Arcanic Rune Stone', '0x573C', '0x0000'],
        'Faster Casting': [1114248, 201, 'Essence Of Achievement', '0x571C', '0x002F'],

        'Damage Increase': [1114249, 202, 'Crystal Shards', '0x5738', '0x0000'],
        'Swing Speed Increase': [1114249, 201, 'Essence Of Control', '0x571C', '0x048D'],

        'Hit Poison Area': [1114250, 205, 'Raptor Teeth', '0x5747', '0x0000'],
        'Hit Physical Area': [1114250, 204, 'Raptor Teeth', '0x5747', '0x0000'],
        'Hit Fire Area': [1114250, 203, 'Raptor Teeth', '0x5747', '0x0000'],
        'Hit Energy Area': [1114250, 202, 'Raptor Teeth', '0x5747', '0x0000'],
        'Hit Cold Area': [1114250, 201, 'Raptor Teeth', '0x5747', '0x0000'],

        'Hit Stamina Leech': [1114251, 215, 'Void Orb', '0x573E', '0x0000'],
        'Hit Mana Leech': [1114251, 213, 'Void Orb', '0x573E', '0x0000'],
        'Hit Magic Arrow': [1114251, 212, 'Essence Of Feeling', '0x571C', '0x0034'],
        'Hit Lower Defense': [1114251, 211, 'Parasitic Plant', '0x3190', '0x0000'],
        'Hit Lower Attack': [1114251, 210, 'Parasitic Plant', '0x3190', '0x0000'],
        'Hit Lightning': [1114251, 209, 'Essence Of Passion', '0x571C', '0x0489'],
        'Hit Life Leech': [1114251, 208, 'Void Orb', '0x573E', '0x0000'],
        'Hit Harm': [1114251, 207, 'Parasitic Plant', '0x3190', '0x0000'],
        'Hit Fireball': [1114251, 206, 'Fire Ruby', '0x3197', '0x0000'],
        'Hit Dispel': [1114251, 202, 'Slith Tongue', '0x5746', '0x0000'],

        'Luck': [1114252, 201, 'Chaga Mushroom', '0x5743', '0x0000'],

        'Velocity': [1114253, 204],
        'Hit Chance Increase': [1114253, 203, 'Essence Of Precision', '0x571C', '0x0016'],
        'Defense Chance Increase': [1114253, 202, 'Essence Of Singularity', '0x571C', '0x0497'],
        'Balanced': [1114253, 201, 'Essence Of Balance', '0x571C', '0x0043'],

        'Physical Resist': [1114254, 205, 'Boura Pelt', '0x5742', '0x0000'],
        'Poison Resist': [1114254, 204, 'Boura Pelt', '0x5742', '0x0000'],
        'Fire Resist': [1114254, 203, 'Boura Pelt', '0x5742', '0x0000'],
        'Energy Resist': [1114254, 202, 'Boura Pelt', '0x5742', '0x0000'],
        'Cold Resist': [1114254, 201, 'Boura Pelt', '0x5742', '0x0000'],
        
        'Water Elemental Slayer': [1114263, 220, 'White Pearl', '0x3196', '0x0000'],
        'Troll Slayer': [1114263, 219, 'White Pearl', '0x3196', '0x0000'],
        'Terathan Slayer': [1114263, 218, 'White Pearl', '0x3196', '0x0000'],
        'Spider Slayer': [1114263, 217, 'White Pearl', '0x3196', '0x0000'],
        'Snow Elemental Slayer': [1114263, 216, 'White Pearl', '0x3196', '0x0000'],
        'Snake Slayer': [1114263, 215, 'White Pearl', '0x3196', '0x0000'],
        'Scorpion Slayer': [1114263, 214, 'White Pearl', '0x3196', '0x0000'],
        'Poison Elemental Slayer': [1114263, 213, 'White Pearl', '0x3196', '0x0000'],
        'Orc Slayer': [1114263, 212, 'White Pearl', '0x3196', '0x0000'],
        'Ophidian Slayer': [1114263, 211, 'White Pearl', '0x3196', '0x0000'],
        'Ogre Slayer': [1114263, 210, 'White Pearl', '0x3196', '0x0000'],
        'Lizardman Slayer': [1114263, 209, 'White Pearl', '0x3196', '0x0000'],
        'Gargoyle Slayer': [1114263, 208, 'White Pearl', '0x3196', '0x0000'],
        'Fire Elemental Slayer': [1114263, 207, 'White Pearl', '0x3196', '0x0000'],
        'Earth Elemental Slayer': [1114263, 206, 'White Pearl', '0x3196', '0x0000'],
        'Dragon Slayer': [1114263, 205, 'White Pearl', '0x3196', '0x0000'],
        'Blood Elemental Slayer': [1114263, 203, 'White Pearl', '0x3196', '0x0000'],
        'Air Elemental Slayer': [1114263, 201, 'White Pearl', '0x3196', '0x0000'],

        'Undead Slayer': [1114264, 207, 'Undying Flesh', '0x5731', '0x0000'],
        'Reptile Slayer': [1114264, 206, 'Lava Serpent Crust', '0x572D', '0x0000'],
        'Repond Slayer': [1114264, 205, 'Goblin Blood', '0x572C', '0x0000'],
        'Fey Slayer': [1114264, 204, 'Fey Wings', '0x5726', '0x0000'],
        'Elemental Slayer': [1114264, 203, 'Vial Of Vitriol', '0x5722', '0x0000'],
        'Demon Slayer': [1114264, 202, 'Daemon Claw', '0x5721', '0x0000'],
        'Arachnid Slayer': [1114264, 201, 'Spider Carapace', '0x5720', '0x0000'],
        }

    const throwMod =
        {
        'Spell Channeling': [1114248, 203, 'Silver Snake Skin', '0x5744', '0x0000'],
        'Mage Weapon': [1114248, 202, 'Arcanic Rune Stone', '0x573C', '0x0000'],
        'Faster Casting': [1114248, 201, 'Essence Of Achievement', '0x571C', '0x002F'],

        'Damage Increase': [1114249, 202, 'Crystal Shards', '0x5738', '0x0000'],
        'Swing Speed Increase': [1114249, 201, 'Essence Of Control', '0x571C', '0x048D'],

        'Hit Poison Area': [1114250, 205, 'Raptor Teeth', '0x5747', '0x0000'],
        'Hit Physical Area': [1114250, 204, 'Raptor Teeth', '0x5747', '0x0000'],
        'Hit Fire Area': [1114250, 203, 'Raptor Teeth', '0x5747', '0x0000'],
        'Hit Energy Area': [1114250, 202, 'Raptor Teeth', '0x5747', '0x0000'],
        'Hit Cold Area': [1114250, 201, 'Raptor Teeth', '0x5747', '0x0000'],

        'Hit Stamina Leech': [1114251, 215, 'Void Orb', '0x573E', '0x0000'],
        'Hit Mana Leech': [1114251, 213, 'Void Orb', '0x573E', '0x0000'],
        'Hit Magic Arrow': [1114251, 212, 'Essence Of Feeling', '0x571C', '0x0034'],
        'Hit Lower Defense': [1114251, 211, 'Parasitic Plant', '0x3190', '0x0000'],
        'Hit Lower Attack': [1114251, 210, 'Parasitic Plant', '0x3190', '0x0000'],
        'Hit Lightning': [1114251, 209, 'Essence Of Passion', '0x571C', '0x0489'],
        'Hit Life Leech': [1114251, 208, 'Void Orb', '0x573E', '0x0000'],
        'Hit Harm': [1114251, 207, 'Parasitic Plant', '0x3190', '0x0000'],
        'Hit Fireball': [1114251, 206, 'Fire Ruby', '0x3197', '0x0000'],
        'Hit Dispel': [1114251, 202, 'Slith Tongue', '0x5746', '0x0000'],

        'Luck': [1114252, 201, 'Chaga Mushroom', '0x5743', '0x0000'],

        'Hit Chance Increase': [1114253, 202, 'Essence Of Precision', '0x571C', '0x0016'],
        'Defense Chance Increase': [1114253, 201, 'Essence Of Singularity', '0x571C', '0x0497'],

        'Physical Resist': [1114254, 205, 'Boura Pelt', '0x5742', '0x0000'],
        'Poison Resist': [1114254, 204, 'Boura Pelt', '0x5742', '0x0000'],
        'Fire Resist': [1114254, 203, 'Boura Pelt', '0x5742', '0x0000'],
        'Energy Resist': [1114254, 202, 'Boura Pelt', '0x5742', '0x0000'],
        'Cold Resist': [1114254, 201, 'Boura Pelt', '0x5742', '0x0000'],
        
        'Water Elemental Slayer': [1114263, 220, 'White Pearl', '0x3196', '0x0000'],
        'Troll Slayer': [1114263, 219, 'White Pearl', '0x3196', '0x0000'],
        'Terathan Slayer': [1114263, 218, 'White Pearl', '0x3196', '0x0000'],
        'Spider Slayer': [1114263, 217, 'White Pearl', '0x3196', '0x0000'],
        'Snow Elemental Slayer': [1114263, 216, 'White Pearl', '0x3196', '0x0000'],
        'Snake Slayer': [1114263, 215, 'White Pearl', '0x3196', '0x0000'],
        'Scorpion Slayer': [1114263, 214, 'White Pearl', '0x3196', '0x0000'],
        'Poison Elemental Slayer': [1114263, 213, 'White Pearl', '0x3196', '0x0000'],
        'Orc Slayer': [1114263, 212, 'White Pearl', '0x3196', '0x0000'],
        'Ophidian Slayer': [1114263, 211, 'White Pearl', '0x3196', '0x0000'],
        'Ogre Slayer': [1114263, 210, 'White Pearl', '0x3196', '0x0000'],
        'Lizardman Slayer': [1114263, 209, 'White Pearl', '0x3196', '0x0000'],
        'Gargoyle Slayer': [1114263, 208, 'White Pearl', '0x3196', '0x0000'],
        'Fire Elemental Slayer': [1114263, 207, 'White Pearl', '0x3196', '0x0000'],
        'Earth Elemental Slayer': [1114263, 206, 'White Pearl', '0x3196', '0x0000'],
        'Dragon Slayer': [1114263, 205, 'White Pearl', '0x3196', '0x0000'],
        'Blood Elemental Slayer': [1114263, 203, 'White Pearl', '0x3196', '0x0000'],
        'Air Elemental Slayer': [1114263, 201, 'White Pearl', '0x3196', '0x0000'],

        'Undead Slayer': [1114264, 207, 'Undying Flesh', '0x5731', '0x0000'],
        'Reptile Slayer': [1114264, 206, 'Lava Serpent Crust', '0x572D', '0x0000'],
        'Repond Slayer': [1114264, 205, 'Goblin Blood', '0x572C', '0x0000'],
        'Fey Slayer': [1114264, 204, 'Fey Wings', '0x5726', '0x0000'],
        'Elemental Slayer': [1114264, 203, 'Vial Of Vitriol', '0x5722', '0x0000'],
        'Demon Slayer': [1114264, 202, 'Daemon Claw', '0x5721', '0x0000'],
        'Arachnid Slayer': [1114264, 201, 'Spider Carapace', '0x5720', '0x0000'],
        }
    var itemObj = Orion.FindObject(itemSerial);
    var itemProps = itemObj.Properties();
    if(Orion.Contains(itemProps, 'Skill Required: Throwing'))
        return throwMod;
    else if(Orion.Contains(itemProps, 'One-handed Weapon'))
        return weapon1hMod;
    else if(Orion.Contains(itemProps, 'Skill Required: Archery'))
        return bowMod;
    else if(Orion.Contains(itemProps, 'Two-handed Weapon'))
        return weapon2hMod;
    else if(Orion.Contains('0x1F06|0x1086|0x108A|0x1F09', itemObj.Graphic()))
        return jewelryMod;
    else if(Orion.Contains('0x1B72|0x1BC3|0x1BC4|0x1B7B|0x1B73|0x1B74|0x1B77|0x1B78|0x1B75|0x1B76|0x1BC5|0x1B79|0x1B7A', itemObj.Graphic()))
        return shieldMod;
    else if(Orion.Contains(itemProps, ' Resist '))
        return armorMod;
    else
        return Orion.CharPrint(self,1159,'Error in Type initImbueMods')
    }
    
function ImbueModByIncrements(itemSerial, supplyContainerSerial, mod, incrementArr, verificationString)
    { //incrementArr example: [Button.IncrementOne,Button.IncrementTen,Button.IncrementMax,Button.DecrementOne,Button.DecrementTen,Button.DecrementMax]
    var gemAmount = 200;
    var essenceAmmount = 30; //residue, essence, and relics
    var imbuingContainer = Orion.FindTypeEx(0x0E75).filter(function(container)
        {
        return Orion.Contains(container.Properties(), 'Engraved: Imbuing');
        })[0];
    if(!imbuingContainer)
        {
        Orion.CharPrint(self,1159,"Engrave a backpack 'Imbuing' and restart script! Halting...");
        Orion.Terminate('all');
        }
    var imbuingContainerSerial = imbuingContainer.Serial();
    if(Shared.GetVar('NewItemCheck') != itemSerial || (!Orion.GumpExists('generic', self, '0x000F3E93') && !Orion.GumpExists('generic', self, '0x000F3E90')))
        {
        SetImbue(itemSerial);
        Shared.AddVar('NewItemCheck', itemSerial);
        }
    else if(Orion.GumpExists('generic', self, '0x000F3E93'))
        PressGumpInitialButton(Button.ImbueLastItem);
    PressGumpSubButton(Button.Back);
    PressGumpSubButton(mod[0]);
    PressGumpSubButton(mod[1]);
    if(ParseGump().SuccessChance == undefined)
        {
        Orion.Print('SuccessChance Failed');
        return ImbueModByIncrements(itemSerial, supplyContainerSerial, mod, incrementArr, verificationString);
        }
    if(incrementArr)
        {
        for(var i = 0;i<incrementArr.length;i++)
            {
            PressGumpSubButton(incrementArr[i]);
            }
        }
    if(verificationString && ParseGump().CurrentValue != verificationString)
        {
        Orion.Print('verificationString Failed');
        PressGumpSubButton(Button.Back);
        return ImbueModByIncrements(itemSerial, supplyContainerSerial, mod, incrementArr, verificationString);
        }
    PressGumpSubButton(Button.Confirm);
    var journalCheck = Orion.WaitJournal("You do not have enough resources to imbue this item.|You successfully imbue the item!|You attempt to imbue the item, but fail.|You must be near a soulforge to imbue an item.", Orion.Now() - 500, Orion.Now() + 5000, 'sys');
    if(journalCheck)
        {
        switch(journalCheck.Text())
            {
            case "You do not have enough resources to imbue this item.":
                if(!Restock('Amethyst', '0x0F16', supplyContainerSerial, gemAmount, false,  imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Diamond', '0x0F26', supplyContainerSerial, gemAmount, false,  imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Citrine', '0x0F15', supplyContainerSerial, gemAmount, false, imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Amber', '0x0F25', supplyContainerSerial, gemAmount, false,  imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Tourmaline', '0x0F18', supplyContainerSerial, gemAmount, false, imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Star Sapphire', '0x0F0F', supplyContainerSerial, gemAmount, false,  imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Emerald', '0x0F10', supplyContainerSerial, gemAmount, false,  imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Ruby', '0x0F13', supplyContainerSerial, gemAmount, false,  imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Sapphire', '0x0F11', supplyContainerSerial, gemAmount, false,  imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Magical Residue', '0x2DB1', supplyContainerSerial, essenceAmmount, false,  imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Enchanted Essence', '0x2DB2', supplyContainerSerial, essenceAmmount, false,  imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Relic Fragment', '0x2DB3', supplyContainerSerial, essenceAmmount, false,  imbuingContainerSerial))
                    Orion.PauseScript('all');
                GetImbueGump(true);
                return ImbueModByIncrements(itemSerial, supplyContainerSerial, mod, incrementArr, verificationString);
            case "You successfully imbue the item!":
                GetImbueGump(true);
                return true;
            case "You attempt to imbue the item, but fail.":
                GetImbueGump(true);
                return ImbueModByIncrements(itemSerial, supplyContainerSerial, mod, incrementArr, verificationString);
            case "You must be near a soulforge to imbue an item.":
                Orion.CharPrint(self,1159,'Move closer to a soulforge and resume script!')
                Orion.PauseScript('all');
                GetImbueGump(true);
                return ImbueModByIncrements(itemSerial, supplyContainerSerial, mod, incrementArr, verificationString);
            default:
                TextWindow.Open();
                TextWindow.Print('TypeError in imbueModByIncrements journalCheck! Halting...')
                Orion.Terminate('all');
                break;
            }
        }
    else
        {
        TextWindow.Open();
        TextWindow.Print('WaitJournal timed out in imbueModByIncrements! Halting...')
        Orion.Terminate('all');
        }
    }

function SetImbue(itemSerial)
    {
    CloseAllGumps();
    Orion.Wait(1000);
    Orion.UseSkill('Imbuing')
    PressGumpInitialButton(Button.ImbueItem);
    if(Orion.WaitForTarget(2000))
        Orion.TargetObject(itemSerial);
    }

function ParseGump()
	{
	var gump = GetImbueGump();
	var text = gump.TextList();
	var parseObj =
		{
		'CurrentValue': text[0],
        'Property': text[1],
		'Weight': text[2],
		'Intensity': text[3],
		'CurrentProperties': Orion.Split(text[10], '/')[0],
		'MaxProperties': Orion.Split(text[10], '/')[1],
		'CurrentWeight': Orion.Split(text[11], '/')[0],
		'MaxWeight': Orion.Split(text[11], '/')[1],
		'CurrentTimes': Orion.Split(text[12], '/')[0],
		'MaxTimes': Orion.Split(text[12], '/')[1],
		'SuccessChance': text[13],
		}
	return parseObj;
	}

function GetImbueGump(initialBool, delay)
	{
    if(!delay)
        var delay = 3000;
    if(initialBool) //true for first imbuing gump window (categories), false for second
        var id = '0x000F3E93';
    else
        var id = '0x000F3E90';
	var endTime = Orion.Now() + delay;
    while(!Orion.GumpExists('generic', self, id) && Orion.Now() < endTime)
	    Orion.Wait(100);
	if(Orion.GumpExists('generic', self, id))
		return Orion.GetGump(self, id);
	return false;
	}

function PressGumpInitialButton(buttonCode, delay)
    {
    if(!delay)
        var delay = 300;
    var gump = GetImbueGump(true);
    if(gump)
        {
        gump.Select(Orion.CreateGumpHook(buttonCode));
        Orion.Wait(delay);
        }
    }

function PressGumpSubButton(buttonCode, delay)
    {
    if(!delay)
        var delay = 300;
    var gump = GetImbueGump();
    if(gump)
        {
        gump.Select(Orion.CreateGumpHook(buttonCode));
        Orion.Wait(delay);
        }
    }

function CloseAllGumps()
    {
    while(Orion.GetGump(any))
        {
        Orion.Print(Orion.GetGump(any).ID());
        Orion.GetGump(any).Select(Orion.CreateGumpHook(0));
        Orion.Wait(100);
        }
    }

function Restock(itemName, graphicID, supplyContainerSerial, amount, colorID, destinationContainerSerial)
    {
    if(!colorID)
        var colorID = any;
    if(!destinationContainerSerial)
        var destinationContainerSerial = Orion.GetSerial(backpack);
    while(!Orion.GumpExists('container', supplyContainerSerial))
        {
        Orion.CharPrint(self,1159,'Opening Supply Container');
        if(supplyContainerSerial == Player.BankSerial())
            Orion.Say('bank')
        else
            Orion.UseObject(supplyContainerSerial);
        Orion.Wait(1300);
        }
    while(!Orion.GumpExists('container', destinationContainerSerial))
        {
        Orion.UseObject(destinationContainerSerial);
        Orion.Wait(1300);
        }
    var needed = amount - Orion.Count(graphicID, colorID, destinationContainerSerial, 0, false);
    var restockItem = Orion.FindType(graphicID, colorID, supplyContainerSerial);
    if((needed > 0 || amount == 0) && !restockItem[0])
        {
        TextWindow.Open();
        TextWindow.Print("Couldn't restock item: " + itemName);
        Orion.Wait(100);
        return false;
        }
    if(amount === 0)
        {
        Orion.MoveItem(restockItem[0], 0, destinationContainerSerial);
        Orion.Wait(1300);
        }
    else if(needed > 0)
        {
        Orion.MoveItem(restockItem[0], needed, destinationContainerSerial);
        Orion.Wait(1300);
        }
    Orion.Wait(100);
    return true;
    }