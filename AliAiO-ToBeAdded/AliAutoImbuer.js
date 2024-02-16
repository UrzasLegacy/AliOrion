//gump.AddButton(code, x, y, 0x4B9, 0x4BA, 0x4B9, 0x0000); //gem button
//settings.AddButton(code, x, y, 0x847, 0x849, 0x848, 0x0000); //cancel button
//settings.AddButton(code, x, y, 0x84A, 0x84C, 0x84B, 0x0000); //apply button
//settings.AddButton(code, x, y, 0x84D, 0x84F, 0x84E, 0x0000); //default button
//settings.AddButton(code, x, y, 0xFA5, 0xFA7, 0xFA6, 0x0000); //Confirm button


function Demonaxe()
    {
    Orion.CharPrint(self,1159,'Target supply container. It should contain gems and basic imbuing mats.\nAdvanced mats must be in your backpack already!')
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,'Target item to imbue.')
    Orion.WaitForAddObject('myTarget');
    var itemSerial = Orion.GetSerial('myTarget');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Stamina Leech'], [Button.IncrementMax], '50%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Life Leech'], [Button.IncrementMax], '81%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Mana Leech'], [Button.IncrementMax], '81%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Demon Slayer'], []); //mods that dont have a value to verify, dont need the verification string
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Cold Area'], [Button.IncrementMax], '50%');
    PressGumpInitialButton(Button.Close);
    }
    
function Reptileaxe()
    {
    Orion.CharPrint(self,1159,'Target supply container. It should contain gems and basic imbuing mats.\nAdvanced mats must be in your backpack already!')
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,'Target item to imbue.')
    Orion.WaitForAddObject('myTarget');
    var itemSerial = Orion.GetSerial('myTarget');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Stamina Leech'], [Button.IncrementMax], '50%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Life Leech'], [Button.IncrementMax], '81%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Mana Leech'], [Button.IncrementMax], '81%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Reptile Slayer'], []); //mods that dont have a value to verify, dont need the verification string
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Cold Area'], [Button.IncrementMax], '50%');
    PressGumpInitialButton(Button.Close);
    }
    
function Repondaxe()
    {
    Orion.CharPrint(self,1159,'Target supply container. It should contain gems and basic imbuing mats.\nAdvanced mats must be in your backpack already!')
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,'Target item to imbue.')
    Orion.WaitForAddObject('myTarget');
    var itemSerial = Orion.GetSerial('myTarget');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Stamina Leech'], [Button.IncrementMax], '50%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Life Leech'], [Button.IncrementMax], '81%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Mana Leech'], [Button.IncrementMax], '81%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Repond Slayer'], []); //mods that dont have a value to verify, dont need the verification string
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Cold Area'], [Button.IncrementMax], '50%');
    PressGumpInitialButton(Button.Close);
    }
    
function Undeadaxe()
    {
    Orion.CharPrint(self,1159,'Target supply container. It should contain gems and basic imbuing mats.\nAdvanced mats must be in your backpack already!')
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,'Target item to imbue.')
    Orion.WaitForAddObject('myTarget');
    var itemSerial = Orion.GetSerial('myTarget');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Stamina Leech'], [Button.IncrementMax], '50%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Life Leech'], [Button.IncrementMax], '81%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Mana Leech'], [Button.IncrementMax], '81%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Undead Slayer'], []); //mods that dont have a value to verify, dont need the verification string
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Fire Area'], [Button.IncrementMax], '50%');
    PressGumpInitialButton(Button.Close);
    }
    
function Feyaxe()
    {
    Orion.CharPrint(self,1159,'Target supply container. It should contain gems and basic imbuing mats.\nAdvanced mats must be in your backpack already!')
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,'Target item to imbue.')
    Orion.WaitForAddObject('myTarget');
    var itemSerial = Orion.GetSerial('myTarget');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Stamina Leech'], [Button.IncrementMax], '50%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Life Leech'], [Button.IncrementMax], '81%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Mana Leech'], [Button.IncrementMax], '81%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Fey Slayer'], []); //mods that dont have a value to verify, dont need the verification string
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Fire Area'], [Button.IncrementMax], '50%');
    PressGumpInitialButton(Button.Close);
    }
    
function Arachnidaxe()
    {
    Orion.CharPrint(self,1159,'Target supply container. It should contain gems and basic imbuing mats.\nAdvanced mats must be in your backpack already!')
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,'Target item to imbue.')
    Orion.WaitForAddObject('myTarget');
    var itemSerial = Orion.GetSerial('myTarget');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Stamina Leech'], [Button.IncrementMax], '50%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Life Leech'], [Button.IncrementMax], '81%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Mana Leech'], [Button.IncrementMax], '81%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Arachnid Slayer'], []); //mods that dont have a value to verify, dont need the verification string
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Fire Area'], [Button.IncrementMax], '50%');
    PressGumpInitialButton(Button.Close);
    }
    
function Elementalaxe()
    {
    Orion.CharPrint(self,1159,'Target supply container. It should contain gems and basic imbuing mats.\nAdvanced mats must be in your backpack already!')
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,'Target item to imbue.')
    Orion.WaitForAddObject('myTarget');
    var itemSerial = Orion.GetSerial('myTarget');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Stamina Leech'], [Button.IncrementMax], '50%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Life Leech'], [Button.IncrementMax], '81%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Mana Leech'], [Button.IncrementMax], '81%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Elemental Slayer'], []); //mods that dont have a value to verify, dont need the verification string
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Energy Area'], [Button.IncrementMax], '50%');
    PressGumpInitialButton(Button.Close);
    }
    
function Demonstaff()
    {
    Orion.CharPrint(self,1159,'Target supply container. It should contain gems and basic imbuing mats.\nAdvanced mats must be in your backpack already!')
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,'Target item to imbue.')
    Orion.WaitForAddObject('myTarget');
    var itemSerial = Orion.GetSerial('myTarget');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Stamina Leech'], [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne, Button.DecrementOne], '44%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Life Leech'], [Button.IncrementMax], '75%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Mana Leech'], [Button.IncrementMax], '75%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Demon Slayer'], []); //mods that dont have a value to verify, dont need the verification string
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Lower Attack'], [Button.IncrementMax], '50%');
    PressGumpInitialButton(Button.Close);
    }
    
function Reptilestaff()
    {
    Orion.CharPrint(self,1159,'Target supply container. It should contain gems and basic imbuing mats.\nAdvanced mats must be in your backpack already!')
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,'Target item to imbue.')
    Orion.WaitForAddObject('myTarget');
    var itemSerial = Orion.GetSerial('myTarget');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Stamina Leech'], [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne, Button.DecrementOne], '44%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Life Leech'], [Button.IncrementMax], '75%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Mana Leech'], [Button.IncrementMax], '75%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Reptile Slayer'], []); //mods that dont have a value to verify, dont need the verification string
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Lower Attack'], [Button.IncrementMax], '50%');
    PressGumpInitialButton(Button.Close);
    }
    
function Repondstaff()
    {
    Orion.CharPrint(self,1159,'Target supply container. It should contain gems and basic imbuing mats.\nAdvanced mats must be in your backpack already!')
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,'Target item to imbue.')
    Orion.WaitForAddObject('myTarget');
    var itemSerial = Orion.GetSerial('myTarget');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Stamina Leech'], [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne, Button.DecrementOne], '44%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Life Leech'], [Button.IncrementMax], '75%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Mana Leech'], [Button.IncrementMax], '75%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Repond Slayer'], []); //mods that dont have a value to verify, dont need the verification string
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Lower Attack'], [Button.IncrementMax], '50%');
    PressGumpInitialButton(Button.Close);
    }
    
function Undeadstaff()
    {
    Orion.CharPrint(self,1159,'Target supply container. It should contain gems and basic imbuing mats.\nAdvanced mats must be in your backpack already!')
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,'Target item to imbue.')
    Orion.WaitForAddObject('myTarget');
    var itemSerial = Orion.GetSerial('myTarget');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Stamina Leech'], [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne, Button.DecrementOne], '44%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Life Leech'], [Button.IncrementMax], '75%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Mana Leech'], [Button.IncrementMax], '75%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Undead Slayer'], []); //mods that dont have a value to verify, dont need the verification string
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Lower Attack'], [Button.IncrementMax], '50%');
    PressGumpInitialButton(Button.Close);
    }
    
function Feystaff()
    {
    Orion.CharPrint(self,1159,'Target supply container. It should contain gems and basic imbuing mats.\nAdvanced mats must be in your backpack already!')
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,'Target item to imbue.')
    Orion.WaitForAddObject('myTarget');
    var itemSerial = Orion.GetSerial('myTarget');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Stamina Leech'], [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne, Button.DecrementOne], '44%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Life Leech'], [Button.IncrementMax], '75%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Mana Leech'], [Button.IncrementMax], '75%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Fey Slayer'], []); //mods that dont have a value to verify, dont need the verification string
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Lower Attack'], [Button.IncrementMax], '50%');
    PressGumpInitialButton(Button.Close);
    }
    
function Arachnidstaff()
    {
    Orion.CharPrint(self,1159,'Target supply container. It should contain gems and basic imbuing mats.\nAdvanced mats must be in your backpack already!')
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,'Target item to imbue.')
    Orion.WaitForAddObject('myTarget');
    var itemSerial = Orion.GetSerial('myTarget');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Stamina Leech'], [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne, Button.DecrementOne], '44%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Life Leech'], [Button.IncrementMax], '75%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Mana Leech'], [Button.IncrementMax], '75%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Arachnid Slayer'], []); //mods that dont have a value to verify, dont need the verification string
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Lower Attack'], [Button.IncrementMax], '50%');
    PressGumpInitialButton(Button.Close);
    }
    
function Elementalstaff()
    {
    Orion.CharPrint(self,1159,'Target supply container. It should contain gems and basic imbuing mats.\nAdvanced mats must be in your backpack already!')
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,'Target item to imbue.')
    Orion.WaitForAddObject('myTarget');
    var itemSerial = Orion.GetSerial('myTarget');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Stamina Leech'], [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne, Button.DecrementOne], '44%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Life Leech'], [Button.IncrementMax], '75%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Mana Leech'], [Button.IncrementMax], '75%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Elemental Slayer'], []); //mods that dont have a value to verify, dont need the verification string
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Lower Attack'], [Button.IncrementMax], '50%');
    PressGumpInitialButton(Button.Close);
    }
    
function Dragonstaff()
    {
    Orion.CharPrint(self,1159,'Target supply container. It should contain gems and basic imbuing mats.\nAdvanced mats must be in your backpack already!')
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,'Target item to imbue.')
    Orion.WaitForAddObject('myTarget');
    var itemSerial = Orion.GetSerial('myTarget');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Stamina Leech'], [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne, Button.DecrementOne], '44%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Life Leech'], [Button.IncrementMax], '75%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Mana Leech'], [Button.IncrementMax], '75%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Dragon Slayer'], []); //mods that dont have a value to verify, dont need the verification string
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Lower Attack'], [Button.IncrementMax], '50%');
    PressGumpInitialButton(Button.Close);
    }
    
function Spiderstaff()
    {
    Orion.CharPrint(self,1159,'Target supply container. It should contain gems and basic imbuing mats.\nAdvanced mats must be in your backpack already!')
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,'Target item to imbue.')
    Orion.WaitForAddObject('myTarget');
    var itemSerial = Orion.GetSerial('myTarget');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Stamina Leech'], [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne, Button.DecrementOne], '44%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Life Leech'], [Button.IncrementMax], '75%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Mana Leech'], [Button.IncrementMax], '75%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Spider Slayer'], []); //mods that dont have a value to verify, dont need the verification string
    ImbueModByIncrements(itemSerial, supplyContainer, weapon2hMod['Hit Lower Attack'], [Button.IncrementMax], '50%');
    PressGumpInitialButton(Button.Close);
    }

const Button =
    {
    'Close': 0,
    'ImbueItem': 1,
    'Reimbue Last': 4,
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

const jewelryMod =
    {
    'Spell Damage Increase': [1114248, 205],
    'Lower Reagent Cost': [1114248, 204],
    'Lower Mana Cost': [1114248, 203],
    'Faster Casting': [1114248, 202],
    'Faster Cast Recovery': [1114248, 201],

    'Damage Increase': [1114249, 203],
    'Hit Chance Increase': [1114249, 202],
    'Defense Chance Increase': [1114249, 201],

    'Night Sight': [1114252, 203],
    'Luck': [1114252, 202],
    'Enhance Potions': [1114252, 201],

    'Poison Resist': [1114254, 205],
    'Physical Resist': [1114254, 204],
    'Fire Resist': [1114254, 203],
    'Energy Resist': [1114254, 202],
    'Cold Resist': [1114254, 201],
    
    'Fencing': [1114255, 205],
    'Mace Fighting': [1114255, 204],
    'Swordsmanship': [1114255, 203],
    'Musicianship': [1114255, 202],
    'Magery': [1114255, 201],

    'Wrestling': [1114256, 205],
    'Animal Taming': [1114256, 204],
    'Spirit Speak': [1114256, 203],
    'Tactics': [1114256, 202],
    'Provocation': [1114256, 201],

    'Focus': [1114257, 206],
    'Parrying': [1114257, 205],
    'Stealth': [1114257, 204],
    'Meditation': [1114257, 203],
    'Animal Lore': [1114257, 202],
    'Discordance': [1114257, 201],

    'Mysticism': [1114258, 207],
    'Bushido': [1114258, 206],
    'Necromancy': [1114258, 205],
    'Veterinary': [1114258, 204],
    'Stealing': [1114258, 203],
    'Eval Intelligence': [1114258, 202],
    'Anatomy': [1114258, 201],

    'Peacemaking': [1114259, 207],
    'Throwing': [1114259, 206],
    'Ninjitsu': [1114259, 205],
    'Chivalry': [1114259, 204],
    'Archery': [1114259, 203],
    'Resisting Spells': [1114259, 202],
    'Healing': [1114259, 201],

    'Strength Bonus': [1114262, 203],
    'Intelligence Bonus': [1114262, 202],
    'Dexterity Bonus': [1114262, 201],
    }

const armorMod =
    {
    'Lower Reagent Cost': [1114248, 202],
    'Lower Mana Cost': [1114248, 201],

    'Reflect Physical Damage': [1114252, 203],
    'Night Sight': [1114252, 202],
    'Luck': [1114252, 201],

    'Poison Resist': [1114254, 205],
    'Physical Resist': [1114254, 204],
    'Fire Resist': [1114254, 203],
    'Energy Resist': [1114254, 202],
    'Cold Resist': [1114254, 201],

    'Stamina Increase': [1114262, 206],
    'Hit Point Regeneration': [1114262, 205],
    'Stamina Regeneration': [1114262, 204],
    'Mana Regeneration': [1114262, 203],
    'Mana Increase': [1114262, 202],
    'Hit Point Increase': [1114262, 201],
    }

const shieldMod =
    {
    'Spell Channeling': [1114248, 202],
    'Faster Casting': [1114248, 201],

    'Defense Chance Increase': [1114249, 201],

    'Reflect Physical Damage': [1114252, 203],
    'Lower Requirements': [1114252, 202],
    'Durability': [1114252, 201],
    }

const weapon2hMod =
    {
    'Spell Channeling': [1114248, 203],
    'Mage Weapon': [1114248, 202],
    'Faster Casting': [1114248, 201],

    'Damage Increase': [1114249, 206],
    'Swing Speed Increase': [1114249, 205],
    'Balanced': [1114249, 204],
    'Hit Chance Increase': [1114249, 203],
    'Defense Chance Increase': [1114249, 202],
    'Use Best Weapon Skill': [1114249, 201],

    'Hit Poison Area': [1114250, 205],
    'Hit Physical Area': [1114250, 204],
    'Hit Fire Area': [1114250, 203],
    'Hit Energy Area': [1114250, 202],
    'Hit Cold Area': [1114250, 201],

    'Hit Stamina Leech': [1114251, 215],
    'Hit Mana Leech': [1114251, 213],
    'Hit Magic Arrow': [1114251, 212],
    'Hit Lower Defense': [1114251, 211],
    'Hit Lower Attack': [1114251, 210],
    'Hit Lightning': [1114251, 209],
    'Hit Life Leech': [1114251, 208],
    'Hit Harm': [1114251, 207],
    'Hit Fireball': [1114251, 206],
    'Hit Dispel': [1114251, 202],

    'Luck': [1114252, 201],

    'Poison Resist': [1114254, 205],
    'Physical Resist': [1114254, 204],
    'Fire Resist': [1114254, 203],
    'Energy Resist': [1114254, 202],
    'Cold Resist': [1114254, 201],
    
    'Water Elemental Slayer': [1114263, 220],
    'Troll Slayer': [1114263, 219],
    'Terathan Slayer': [1114263, 218],
    'Spider Slayer': [1114263, 217],
    'Snow Elemental Slayer': [1114263, 216],
    'Snake Slayer': [1114263, 215],
    'Scorpion Slayer': [1114263, 214],
    'Poison Elemental Slayer': [1114263, 213],
    'Orc Slayer': [1114263, 212],
    'Ophidian Slayer': [1114263, 211],
    'Ogre Slayer': [1114263, 210],
    'Lizardman Slayer': [1114263, 209],
    'Gargoyle Slayer': [1114263, 208],
    'Fire Elemental Slayer': [1114263, 207],
    'Earth Elemental Slayer': [1114263, 206],
    'Dragon Slayer': [1114263, 205],
    'Blood Elemental Slayer': [1114263, 203],
    'Air Elemental Slayer': [1114263, 201],

    'Undead Slayer': [1114264, 207],
    'Reptile Slayer': [1114264, 206],
    'Repond Slayer': [1114264, 205],
    'Fey Slayer': [1114264, 204],
    'Elemental Slayer': [1114264, 203],
    'Demon Slayer': [1114264, 202],
    'Arachnid Slayer': [1114264, 201],
    }

const weapon1hMod =
    {
    'Spell Channeling': [1114248, 203],
    'Mage Weapon': [1114248, 202],
    'Faster Casting': [1114248, 201],

    'Damage Increase': [1114249, 205],
    'Swing Speed Increase': [1114249, 204],
    'Hit Chance Increase': [1114249, 203],
    'Defense Chance Increase': [1114249, 202],
    'Use Best Weapon Skill': [1114249, 201],

    'Hit Poison Area': [1114250, 205],
    'Hit Physical Area': [1114250, 204],
    'Hit Fire Area': [1114250, 203],
    'Hit Energy Area': [1114250, 202],
    'Hit Cold Area': [1114250, 201],

    'Hit Stamina Leech': [1114251, 215],
    'Hit Mana Leech': [1114251, 213],
    'Hit Magic Arrow': [1114251, 212],
    'Hit Lower Defense': [1114251, 211],
    'Hit Lower Attack': [1114251, 210],
    'Hit Lightning': [1114251, 209],
    'Hit Life Leech': [1114251, 208],
    'Hit Harm': [1114251, 207],
    'Hit Fireball': [1114251, 206],
    'Hit Dispel': [1114251, 202],

    'Luck': [1114252, 201],

    'Poison Resist': [1114254, 205],
    'Physical Resist': [1114254, 204],
    'Fire Resist': [1114254, 203],
    'Energy Resist': [1114254, 202],
    'Cold Resist': [1114254, 201],
    
    'Water Elemental Slayer': [1114263, 220],
    'Troll Slayer': [1114263, 219],
    'Terathan Slayer': [1114263, 218],
    'Spider Slayer': [1114263, 217],
    'Snow Elemental Slayer': [1114263, 216],
    'Snake Slayer': [1114263, 215],
    'Scorpion Slayer': [1114263, 214],
    'Poison Elemental Slayer': [1114263, 213],
    'Orc Slayer': [1114263, 212],
    'Ophidian Slayer': [1114263, 211],
    'Ogre Slayer': [1114263, 210],
    'Lizardman Slayer': [1114263, 209],
    'Gargoyle Slayer': [1114263, 208],
    'Fire Elemental Slayer': [1114263, 207],
    'Earth Elemental Slayer': [1114263, 206],
    'Dragon Slayer': [1114263, 205],
    'Blood Elemental Slayer': [1114263, 203],
    'Air Elemental Slayer': [1114263, 201],

    'Undead Slayer': [1114264, 207],
    'Reptile Slayer': [1114264, 206],
    'Repond Slayer': [1114264, 205],
    'Fey Slayer': [1114264, 204],
    'Elemental Slayer': [1114264, 203],
    'Demon Slayer': [1114264, 202],
    'Arachnid Slayer': [1114264, 201],
    }

const rangedMod =
    {
    'Spell Channeling': [1114248, 203],
    'Mage Weapon': [1114248, 202],
    'Faster Casting': [1114248, 201],

    'Damage Increase': [1114249, 202],
    'Swing Speed Increase': [1114249, 201],

    'Hit Poison Area': [1114250, 205],
    'Hit Physical Area': [1114250, 204],
    'Hit Fire Area': [1114250, 203],
    'Hit Energy Area': [1114250, 202],
    'Hit Cold Area': [1114250, 201],

    'Hit Stamina Leech': [1114251, 215],
    'Hit Mana Leech': [1114251, 213],
    'Hit Magic Arrow': [1114251, 212],
    'Hit Lower Defense': [1114251, 211],
    'Hit Lower Attack': [1114251, 210],
    'Hit Lightning': [1114251, 209],
    'Hit Life Leech': [1114251, 208],
    'Hit Harm': [1114251, 207],
    'Hit Fireball': [1114251, 206],
    'Hit Dispel': [1114251, 202],

    'Luck': [1114252, 201],

    'Velocity': [1114253, 204],
    'Hit Chance Increase': [1114253, 203],
    'Defense Chance Increase': [1114253, 202],
    'Balanced': [1114253, 201],

    'Physical Resist': [1114254, 205],
    'Poison Resist': [1114254, 204],
    'Fire Resist': [1114254, 203],
    'Energy Resist': [1114254, 202],
    'Cold Resist': [1114254, 201],
    
    'Water Elemental Slayer': [1114263, 220],
    'Troll Slayer': [1114263, 219],
    'Terathan Slayer': [1114263, 218],
    'Spider Slayer': [1114263, 217],
    'Snow Elemental Slayer': [1114263, 216],
    'Snake Slayer': [1114263, 215],
    'Scorpion Slayer': [1114263, 214],
    'Poison Elemental Slayer': [1114263, 213],
    'Orc Slayer': [1114263, 212],
    'Ophidian Slayer': [1114263, 211],
    'Ogre Slayer': [1114263, 210],
    'Lizardman Slayer': [1114263, 209],
    'Gargoyle Slayer': [1114263, 208],
    'Fire Elemental Slayer': [1114263, 207],
    'Earth Elemental Slayer': [1114263, 206],
    'Dragon Slayer': [1114263, 205],
    'Blood Elemental Slayer': [1114263, 203],
    'Air Elemental Slayer': [1114263, 201],

    'Undead Slayer': [1114264, 207],
    'Reptile Slayer': [1114264, 206],
    'Repond Slayer': [1114264, 205],
    'Fey Slayer': [1114264, 204],
    'Elemental Slayer': [1114264, 203],
    'Demon Slayer': [1114264, 202],
    'Arachnid Slayer': [1114264, 201],
    }

const imbueFavorites =
    {
    OniShield:  [
                    [shieldMod['Durability'], '90%', [Button.IncrementMax, Button.DecrementTen]],
                    [shieldMod['Defense Chance Increase'], '13%', [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne]] 
                ],
    OniKatana:  [
                    [weapon1hMod['Hit Chance Increase'], '13%', [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne]],
                    [weapon1hMod['Hit Lower Defense'], '44%', [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne, Button.DecrementOne]],
                    [weapon1hMod['Damage Increase'], '1%', []],
                    [weapon1hMod['Hit Stamina Leech'], '44%', [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne, Button.DecrementOne]],
                    [weapon1hMod['Luck'], '90', [Button.IncrementMax, Button.DecrementTen]],
                ],
	PhysResistM2:	[
					 [weapon1hMod['Physical Resist'], '13%', [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne]],
		        ],
	FireResistM2:	[
					 [weapon1hMod['Fire Resist'], '13%', [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne]],
		        ],
	ColdResistM2:	[
					 [weapon1hMod['Cold Resist'], '13%', [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne]],
		        ],
	PoisResistM2:	[
					 [weapon1hMod['Poison Resist'], '13%', [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne]],
		        ],
	EnerResistM2:	[
					 [weapon1hMod['Energy Resist'], '13%', [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne]],
                ]
    }
    
const testGump = Orion.CreateCustomGump(5000);	
function testGumpStart()
	{
	var width = 600, height = 500;
    testGump.Clear();
    testGump.SetCallback('testProcess');
    testGump.AddResizepic(0, 0, 0x9BF5, width, height);
    //testGump.AddResizepic(0, 0, 0x2Ef8, width, height);
    testGump.AddComboBox(5101, 40, 55, '0x0BB8', 0, '0x0BB8', 200, -3, 20);
    testGump.AddComboBoxText('Choose Option:', '0', 1);
    for(var i=1;i<weaponOptions.length;i++)
        {
        testGump.AddComboBoxText(weaponOptions[i][2]);
        }
    testGump.AddButton(5001, 245, 54, 0xFA5, 0xFA5, 0xFA6, 0x0000); //Confirm button
    testGump.AddButton(5002, 460, 450, 0xFA5, 0xFA5, 0xFA6, 0x0000); //Confirm button
    testGump.Update();
	}

function testProcess(_hidden)
	{
     var button = CustomGumpResponse.ReturnCode();
     switch(button)
     	{
     	case 5001:
     		var response = CustomGumpResponse.ComboBox(5101)
     		Orion.SetGlobal('weaponOption', response)
     		//testGump.AddTextEntry(5201, 500, 55, '0', 'Enter Value', 100, 20);
            testGump.AddComboBox(5201, 295, 55, '0x0BB8', 0, '0x0BB8', 200, -3, weaponOptions[response][3].length);
     		for(var i=0;i<weaponOptions[response][3].length;i++)
                {
                testGump.AddComboBoxText(weaponOptions[response][3][i]);
                }
     		testGump.Update();
     		Orion.Print(response);
     		Orion.Print(button);
     		break;
     	case 5002:
            Orion.SetGlobal('weaponOptionValue')
     		Orion.Print(Orion.GetGlobal('testReg'))
     		Orion.Print(button);
     		return testGumpStart();
     		break;
     	}
	}


function test()
    {
    var mod = weapon1hMod['Damage Increase'];
    Orion.WaitForAddObject('myTarget');
    Orion.UseSkill('Imbuing')
    PressGumpInitialButton(Button.ImbueItem);
    if(Orion.WaitForTarget(2000))
    	Orion.TargetObject('myTarget');
    PressGumpSubButton(mod[0])
    PressGumpSubButton(mod[1])
    PressGumpSubButton(Button.IncrementOne);
    if(parse.CurrentValue == '10%')
    
    PressGumpSubButton(Button.IncrementOne);
    }

function test2()
    {
    Orion.CharPrint(self,1159,'Target supply container. It should contain gems and basic imbuing mats.\nAdvanced mats must be in your backpack already!')
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,'Target item to imbue.')
    Orion.WaitForAddObject('myTarget');
    var itemSerial = Orion.GetSerial('myTarget');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon1hMod['Hit Chance Increase'], [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne], '13%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon1hMod['Hit Lower Defense'], [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne, Button.DecrementOne], '44%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon1hMod['Damage Increase'], [], '1%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon1hMod['Hit Stamina Leech'], [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne, Button.DecrementOne], '44%');
    ImbueModByIncrements(itemSerial, supplyContainer, weapon1hMod['Luck'], [Button.IncrementMax, Button.DecrementTen], '90');
    PressGumpInitialButton(Button.Close);
    }

function test3()
    {
    Orion.CharPrint(self,1159,'Target supply container. It should contain gems and basic imbuing mats.\nAdvanced mats must be in your backpack already!')
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,'Target container to imbue.')
    Orion.WaitForAddObject('myTarget');
    var containerSerial = Orion.GetSerial('myTarget');
    while(!Orion.GumpExists('container', containerSerial))
        {
        Orion.UseObject(containerSerial);
        Orion.Wait(1300);
        }
    var items = Orion.FindType(any,any,containerSerial);
    for(var i=0;i<items.length;i++)
        {
        ImbueModByIncrements(items[i], supplyContainer, weapon1hMod['Hit Chance Increase'], [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne], '13%');
        ImbueModByIncrements(items[i], supplyContainer, weapon1hMod['Hit Lower Defense'], [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne, Button.DecrementOne], '44%');
        ImbueModByIncrements(items[i], supplyContainer, weapon1hMod['Damage Increase'], [], '1%');
        ImbueModByIncrements(items[i], supplyContainer, weapon1hMod['Hit Stamina Leech'], [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne, Button.DecrementOne], '44%');
        ImbueModByIncrements(items[i], supplyContainer, weapon1hMod['Luck'], [Button.IncrementMax, Button.DecrementTen], '90');
        PressGumpInitialButton(Button.Close);
        }
    }

function ImbueModByIncrements(itemSerial, supplyContainerSerial, mod, incrementArr, verificationString)
    { //incrementArr example: [Button.IncrementOne,Button.IncrementTen,Button.IncrementMax,Button.DecrementOne,Button.DecrementTen,Button.DecrementMax]
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
    if(!Orion.GumpExists('generic', self, '0x000F3E93') || !Orion.GumpExists('generic', self, '0x000F3E90'))
        SetImbue(itemSerial);
    PressGumpSubButton(Button.Back);
    PressGumpSubButton(mod[0]);
    PressGumpSubButton(mod[1]);
    if(ParseGump().SuccessChance == undefined)
        {
        Orion.Print('SuccessChance Failed');
        PressGumpSubButton(Button.Back);
        return ImbueModByIncrements(itemSerial, supplyContainerSerial, mod, incrementArr, verificationString);
        }
    for(var i = 0;i<incrementArr.length;i++)
        {
        PressGumpSubButton(incrementArr[i]);
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
        Orion.Print('t: ' + journalCheck.Text())
        switch(journalCheck.Text())
            {
            case "You do not have enough resources to imbue this item.":
                if(!Restock('Amethyst', ingredient['Amethyst'], supplyContainerSerial, gemAmount, imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Diamond', ingredient['Diamond'], supplyContainerSerial, gemAmount, imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Citrine', ingredient['Citrine'], supplyContainerSerial, gemAmount, imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Amber', ingredient['Amber'], supplyContainerSerial, gemAmount, imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Tourmaline', ingredient['Tourmaline'], supplyContainerSerial, gemAmount, imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Star Sapphire', ingredient['Star Sapphire'], supplyContainerSerial, gemAmount, imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Emerald', ingredient['Emerald'], supplyContainerSerial, gemAmount, imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Ruby', ingredient['Ruby'], supplyContainerSerial, gemAmount, imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Sapphire', ingredient['Sapphire'], supplyContainerSerial, gemAmount, imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Magical Residue', ingredient['Magical Residue'], supplyContainerSerial, 50, imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Enchanted Essence', ingredient['Enchanted Essence'], supplyContainerSerial, 50, imbuingContainerSerial))
                    Orion.PauseScript('all');
                if(!Restock('Relic Fragment', ingredient['Relic Fragment'], supplyContainerSerial, 50, imbuingContainerSerial))
                    Orion.PauseScript('all');
                return ImbueModByIncrements(itemSerial, supplyContainerSerial, mod, incrementArr, verificationString);
            case "You successfully imbue the item!":
                return true;
            case "You attempt to imbue the item, but fail.":
                return ImbueModByIncrements(itemSerial, supplyContainerSerial, mod, incrementArr, verificationString);
            case "You must be near a soulforge to imbue an item.":
                Orion.PauseScript('all');
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

var gemAmount = 200;
var ingredient =
    {
    'Amethyst': '0x0F16',
    'Diamond': '0x0F26',
    'Citrine': '0x0F15',
    'Amber': '0x0F25',
    'Tourmaline': '0x0F18',
    'Star Sapphire': '0x0F0F',
    'Emerald': '0x0F10',
    'Ruby': '0x0F13',
    'Sapphire': '0x0F11',
    'Magical Residue': '0x2DB1',
    'Enchanted Essence': '0x2DB2',
    'Relic Fragment': '0x2DB3',
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
        var delay = 2000;
    if(initialBool)
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
        var delay = 100;
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
        var delay = 200;
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

//ALIBOD COPY HELPERS - DO NOT EDIT
function Restock(itemName, graphicID, supplyContainerSerial, amount, destinationContainerSerial, colorID)
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

    
function ImbueOniKatana()
    {
    ImbueItem(imbueFavorites.OniKatana)
    }
function ImbueALLOniKatana()
    {
    ImbueItemsInContainer(imbueFavorites.OniKatana)
    }
function ImbueOniShield()
    {
    ImbueItem(imbueFavorites.OniShield)
    }


function ImbuePhysResistM2()
    {
    ImbueItem(imbueFavorites.PhysResistM2)
    }

function ImbueFireResistM2()
    {
    ImbueItem(imbueFavorites.FireResistM2)
    }

function ImbueColdResistM2()
    {
    ImbueItem(imbueFavorites.ColdResistM2)
    }

function ImbuePoisResistM2()
    {
    ImbueItem(imbueFavorites.PoisResistM2)
    }

function ImbueEnerResistM2()
    {
    ImbueItem(imbueFavorites.EnerResistM2)
    }

function ImbueItem(imbueFavorite)
    {
    var supplyContainer = Orion.FindTypeEx(any,any,ground,'item',2).filter(function(item)
        {
        return Orion.Contains(item.Properties(), 'Engraved: Special Mats');
        })[0];
    if(!supplyContainer)
        {
        Orion.CharPrint(self,1159,'Target supply container. It should contain gems and basic imbuing mats.\nAdvanced mats must be in your backpack already!')
        Orion.WaitForAddObject('myTarget');
        var supplyContainer = Orion.GetSerial('myTarget');
        }
    Orion.CharPrint(self,1159,'Target item to imbue.');
    Orion.WaitForAddObject('myTarget');
    var itemSerial = Orion.GetSerial('myTarget');
    for(var i=0;i<imbueFavorite.length;i++)
        ImbueModByIncrements(itemSerial, supplyContainer, imbueFavorite[i][0], imbueFavorite[i][2], imbueFavorite[i][1]);
    PressGumpInitialButton(Button.Close);
    }

function ImbueItemsInContainer(imbueFavorite)
    {
    Orion.CharPrint(self,1159,'Target supply container. It should contain gems and basic imbuing mats.\nAdvanced mats must be in your backpack already!')
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,'Target container full of items to imbue.');
    Orion.WaitForAddObject('myTarget');
    var itemContainer = Orion.GetSerial('myTarget');
    while(!Orion.GumpExists('container',itemContainer))
        {
        Orion.UseObject(itemContainer);
        Orion.Wait(1300);
        }
    var items = Orion.FindType(any,any,itemContainer);
    for(var i=0;i<items.length;i++)
        for(var ii=0;ii<imbueFavorite.length;ii++)
            ImbueModByIncrements(items[i], supplyContainer, imbueFavorite[ii][0], imbueFavorite[ii][2], imbueFavorite[ii][1]);
    PressGumpInitialButton(Button.Close);
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