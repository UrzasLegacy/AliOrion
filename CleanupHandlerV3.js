//v3
function CleanupGump()
    {
    var gump = Orion.CreateCustomGump(15000);
    gump.Clear();
    gump.SetCallback('GumpCallback');
    var widest = Math.max.apply(Math, CleanupGumpButtons.map(function (rows)
        {
        return rows.length
        }));
    gump.AddHtmlGump(1, 0, 0, widest * 105 + 1, CleanupGumpButtons.length * 30 + 1, '0x0BB8', 1, 0);
    gump.Select('htmlgump', 1);
    var row = 0;
    var column = 0;
    CleanupGumpButtons.forEach(function(rowLayer)
        {
        rowLayer.forEach(function(button)
            {
            gump.AddResizepic(gridX(column), gridY(row), '0x24EA', button[0], button[1], button[2], 1);
            gump.AddText(gridTX(column), gridTY(row), '0', button[3]);
            column++;
            });
        column = 0;
        row++;
        });
    gump.Select('gump');
    gump.Update();
    }

Orion.Exec('GMJournalScan',true);
var i = 0;
var incrementOne = 2;
var incrementTwo = 5;
var incrementThree = 3;
var gpPerCleanupPoint = 45;
var itemList =
    [
      //['itemGraphicID', 'colorID', 0, redeemButtonCode, pointCost, quantityToStock, salePrice, 'itemName', 'vendorName', x, y, gridIndex],
        ['0x4142', '0x0000', 0, 100, 1000, 2, false,      'Mailbox', 'Low End', 52, 60, i],
        ['0x1F03', 'any',    0, 101, 1000, 2, false,      'Elves Are Our', 'Low End', 109, 60, i += incrementOne],
        ['0x1F03', 'any',    0, 102, 1000, 2, false,      'Gargoyles Are Our', 'Low End', 153, 60, i += incrementOne],
        ['0x1F03', 'any',    0, 103, 1000, 2, false,      'We Are Pirates!', 'Low End', 197, 60, i += incrementOne],
        ['0x1F03', 'any',    0, 104, 1000, 2, false,      'Follower of Bane', 'Low End', 241, 60, i += incrementOne],
        ['0x1F03', 'any',    0, 105, 1000, 2, false,      'Queen Dawn Forever', 'Low End', 285, 60, i += incrementOne],
        ['0x14F0', 'any',    0, 106, 1000, 2, false,      'Mannequin Deed', 'Low End', 85, 113, i += incrementOne],
        ['0x0DBC', '0x0000', 0, 107, 5000, 2, false,     'Lilly Pad', 'Low End', 401, 74, i += incrementOne],
        ['0x0DBE', '0x0000', 0, 108, 5000, 2, false,     'Lilly Pads', 'Low End', 332, 60, i += incrementOne],
        ['0x0D0F', '0x0000', 0, 109, 5000, 2, false,     'Mushrooms', 'Low End', 151, 117, i += incrementOne],
        ['0x0D12', '0x0000', 0, 110, 5000, 2, false,     'Mushrooms', 'Low End', 173, 117, i += incrementOne],
        ['0x0D11', '0x0000', 0, 111, 5000, 2, false,     'Mushrooms', 'Low End', 192, 118, i += incrementOne],
        ['0x0D10', '0x0000', 0, 112, 5000, 2, false,     'Mushrooms', 'Low End', 225, 114, i += incrementOne],
        ['0x0D13', '0x0000', 0, 113, 5000, 2, false,     'Mushrooms', 'Low End', 262, 119, i += incrementOne],
        ['0x1087', '0x03E5', 0, 114, 5000, 2, false,     'Nocturne Earrings', 'Low End', 363, 170, i += incrementOne],
        ['0x20D0', '0x0B8F', 0, 115, 10000, 2, false,    'The Mouse Statue', 'Low End', 493, 66, i += incrementOne],
        ['0x9966', '0x0480', 0, 116, 10000, 2, false,    'Refinement Amalgamator', 'Low End', 444, 60, i += incrementOne],
        ['0x14EF', 'any',    0, 117, 10000, 2, false,    'Chaos Tile', 'Low End', 295, 115, i += incrementOne],
        ['0x14EF', 'any',    0, 118, 10000, 2, false,    'Honesty Virtue Tile', 'Low End', 320, 115, i += incrementOne],
        ['0x14EF', 'any',    0, 119, 10000, 2, false,    'Compassion Virtue Tile', 'Low End', 345, 115, i += incrementOne],
        ['0x14EF', 'any',    0, 120, 10000, 2, false,    'Justice Virtue Tile', 'Low End', 370, 115, i += incrementOne],
        ['0x14EF', 'any',    0, 121, 10000, 2, false,    'Valor Virtue Tile', 'Low End', 395, 115, i += incrementOne],
        ['0x14EF', 'any',    0, 122, 10000, 2, false,    'Spirituality Virtue Tile', 'Low End', 420, 115, i += incrementOne],
        ['0x14EF', 'any',    0, 123, 10000, 2, false,    'Honor Virtue Tile', 'Low End', 445, 115, i += incrementOne],
        ['0x14EF', 'any',    0, 124, 10000, 2, false,    'Humility Virtue Tile', 'Low End', 470, 115, i += incrementOne],
        ['0x14EF', 'any',    0, 125, 10000, 2, false,    'Sacrifice Virtue Tile', 'Low End', 495, 115, i += incrementOne],
        ['0x14F0', 'any',    0, 126, 10000, 2, false,    'Steward Deed', 'Low End', 116, 112, i += incrementOne], //27
        ['0x0D37', '0x0000', 0, 154, 15000, 2, false,    'Yucca', 'Low End', 50, 178, i += incrementOne],
        ['0x49C2', '0x0000', 0, 155, 15000, 2, false,    'Table Lamp', 'Low End', 158, 251, i += incrementOne],
        ['0x246D', '0x0000', 0, 156, 15000, 2, false,    'Bamboo', 'Low End', 81, 189, i += incrementOne],
        ['0x14EF', 'any',    0, 157, 20000, 2, false,    'Horse Barding', 'Low End', 157, 197, i += incrementOne],
        //['0x14EF', '0x04AB', 0, 158, 20000, 2, false,  'Scroll of Alacrity', 'Low End', 0, 0, i += incrementOne],
        ['0x170B', 'any',    0, 159, 20000, 2, false,    'Snake Skin Boots', 'Low End', 195, 195, i += incrementOne],
        ['0x170B', 'any',    0, 160, 20000, 2, false,    'the Lava Lizard', 'Low End', 225, 195, i += incrementOne],
        ['0x170B', 'any',    0, 161, 20000, 2, false,    'the Ice Wyrm', 'Low End', 255, 195, i += incrementOne],
        ['0x170B', 'any',    0, 162, 20000, 2, false,    'the Crystal Hydra', 'Low End', 285, 195, i += incrementOne],
        ['0x170B', 'any',    0, 163, 20000, 2, false,    'the Thrasher', 'Low End', 315, 195, i += incrementOne],
        ['any', '0x081B',    0, 164, 20000, 2, false,    "Nature's Tears", 'Low End', 360, 203, i += incrementOne],
        ['any', '0x0787',    0, 165, 20000, 2, false,    'Primordial Decay', 'Low End', 419, 206, i += incrementOne],
        ['any', '0x0798',    0, 166, 20000, 2, false,    'Arachnid Doom', 'Low End', 383, 250, i += incrementOne],
        ['0x2D70', '0x0000', 0, 167, 50000, 2, false,   'Sophisticated Elven Tapestry', 'Low End', 492, 187, i += incrementOne],
        ['0x2D72', '0x0000', 0, 168, 50000, 2, false,   'Ornate Elven Tapestry', 'Low End', 464, 196, i += incrementOne],
        ['0x0A2C', '0x0000', 0, 169, 50000, 2, false,   'Chest of Drawers', 'Low End', 218, 233, i += incrementOne],
        ['0x0A30', '0x0000', 0, 170, 50000, 2, false,   'Chest of Drawers', 'Low End', 277, 233, i += incrementOne],
        ['0x14EF', 'any',    0, 171, 50000, 2, false,   'Dragon Head', 'Low End', 317, 252, i += incrementOne],
        ['0x1AD4', '0x096F', 0, 172, 50000, 2, false,   'Nest with Eggs', 'Low End', 361, 256, i += incrementOne], //19

        ['0x1408', '0x047E', 0, 127, 10000, 2, false,    "Close Helm [Replica]", 'Suits', 94, 62, i *= 0],
        ['0x140E', '0x047E', 0, 128, 10000, 2, false,    "Norse Helm  [Replica]", 'Suits', 63, 60, i += incrementOne],
        ['0x1412', '0x047E', 0, 129, 10000, 2, false,    "Plate Helm [Replica]", 'Suits', 50, 60, i += incrementOne],
        ['0x140D', '0x047E', 0, 130, 10000, 2, false,    "Bascinet [Replica]", 'Suits', 78, 60, i += incrementOne],
        ['0x1413', '0x047E', 0, 131, 10000, 2, false,    "Knight's Gorget [Replica]", 'Suits', 77, 100, i += incrementOne],
        ['0x1414', '0x047E', 0, 132, 10000, 2, false,    "Knight's Gloves [Replica]", 'Suits', 74, 213, i += incrementOne],
        ['0x1410', '0x047E', 0, 133, 10000, 2, false,    "Knight's Arms [Replica]", 'Suits', 74, 175, i += incrementOne],
        ['0x1411', '0x047E', 0, 134, 10000, 2, false,    "Knight's Legs [Replica]", 'Suits', 72, 249, i += incrementOne],
        ['0x1415', '0x047E', 0, 135, 10000, 2, false,    "Knight's Breastplate [Replica]", 'Suits', 51, 128, i += incrementOne], //male
        ['0x1C04', '0x047E', 0, 136, 10000, 2, false,    "Knight's Breastplate [Replica]", 'Suits', 91, 132, i += incrementOne], //female
        ['0x2B6E', '0x047C', 0, 137, 10000, 2, false,    "Scout's Circlet [Replica]", 'Suits', 163, 60, i += incrementOne],
        ['0x27CF', '0x047C', 0, 138, 10000, 2, false,    "Plate Jingasa [Replica]", 'Suits', 201, 60, i += incrementOne],
        ['0x13D6', '0x047C', 0, 139, 10000, 2, false,    "Studded Gorget [Replica]", 'Suits', 188, 101, i += incrementOne],
        ['0x13D4', '0x047C', 0, 140, 10000, 2, false,    "Studded Sleeves [Replica]", 'Suits', 182, 177, i += incrementOne],
        ['0x13DB', '0x047C', 0, 141, 10000, 2, false,    "Studded Tunic [Replica]", 'Suits', 174, 131, i += incrementOne],
        ['0x13D5', '0x047C', 0, 142, 10000, 2, false,    "Studded Gloves [Replica]", 'Suits', 183, 211, i += incrementOne],
        ['0x13DA', '0x047C', 0, 143, 10000, 2, false,    "Studded Leggings [Replica]", 'Suits', 174, 248, i += incrementOne],
        ['0x1C03', '0x047C', 0, 144, 10000, 2, false,    "Studded Armor [Replica]", 'Suits', 221, 132, i += incrementOne],
        ['0x1C0C', '0x047C', 0, 145, 10000, 2, false,    "Studded Bustier [Replica]", 'Suits', 137, 133, i += incrementOne],
        ['0x1718', '0x048D', 0, 146, 10000, 2, false,    "Sorcerer's Hat [Replica]", 'Suits', 294, 60, i += incrementOne],
        ['0x13C7', '0x048D', 0, 147, 10000, 2, false,    "Sorcerer's Gorget [Replica]", 'Suits', 304, 98, i += incrementOne],
        ['0x13C5', '0x048D', 0, 148, 10000, 2, false,    "Sorcerer's Sleeves [Replica]", 'Suits', 293, 173, i += incrementOne],
        ['0x13CC', '0x048D', 0, 149, 10000, 2, false,    "Sorcerer's Tunic [Replica]", 'Suits', 268, 127, i += incrementOne],
        ['0x1C06', '0x048D', 0, 150, 10000, 2, false,    "Female Armor [Replica]", 'Suits', 317, 132, i += incrementOne],
        ['0x13C6', '0x048D', 0, 151, 10000, 2, false,    "Sorcerer's Gloves [Replica]", 'Suits', 295, 208, i += incrementOne],
        ['0x1C08', '0x048D', 0, 152, 10000, 2, false,    "Sorcerer's Skirt [Replica]", 'Suits', 321, 258, i += incrementOne],
        ['0x13CB', '0x048D', 0, 153, 10000, 2, false,    "Sorcerer's Leggings [Replica]", 'Suits', 267, 250, i += incrementOne], //18
        ['0x13C6', '0x0A12', 0, 173, 50000, 2, false,   "Fisherman's Eelskin Gloves", 'Suits', 462, 225, i += incrementOne],
        ['0x1716', '0x0A12', 0, 174, 50000, 2, false,   "Fisherman's Tall Straw", 'Suits', 384, 223, i += incrementOne],
        ['0x13DA', '0x0A12', 0, 175, 50000, 2, false,   "Fisherman's Trousers", 'Suits', 492, 222, i += incrementOne],
        ['0x13CC', '0x0A12', 0, 176, 50000, 2, false,   "Fisherman's Vest", 'Suits', 418, 217, i += incrementOne],
        ['0x4052', '0x0A12', 0, 177, 50000, 2, false,   "Fisherman's Chestguard", 'Suits', 426, 264, i += incrementOne],
        ['0x4064', '0x0A12', 0, 178, 50000, 2, false,   "Fisherman's Kilt", 'Suits', 505, 262, i += incrementOne],
        ['0x4048', '0x0A12', 0, 179, 50000, 2, false,   "Fisherman's Arms", 'Suits', 467, 267, i += incrementOne],
        ['0x4213', '0x0A12', 0, 180, 50000, 2, false,   "Fisherman's Earrings", 'Suits', 381, 268, i += incrementOne],
        ['0x1545', '0x07DA', 0, 181, 50000, 2, false,   'Bestial Helm', 'Suits', 382, 60, i += incrementOne],
        ['0x13C6', '0x07DA', 0, 182, 50000, 2, false,   'Bestial Gloves', 'Suits', 456, 63, i += incrementOne],
        ['0x13CB', '0x07DA', 0, 183, 50000, 2, false,   'Bestial Leggings', 'Suits', 492, 60, i += incrementOne],
        ['0x13D6', '0x07DA', 0, 184, 50000, 2, false,   'Bestial Gorget', 'Suits', 425, 69, i += incrementOne],
        ['0x4213', '0x07DA', 0, 185, 50000, 2, false,   'Bestial Earrings', 'Suits', 379, 103, i += incrementOne],
        ['0x4047', '0x07DA', 0, 186, 50000, 2, false,   'Bestial Arms', 'Suits', 461, 102, i += incrementOne],
        ['0x030C', '0x07DA', 0, 187, 50000, 2, false,   'Bestial Kilt', 'Suits', 503, 99, i += incrementOne],
        ['0x4210', '0x07DA', 0, 188, 50000, 2, false,   'Bestial Necklace', 'Suits', 418, 100, i += incrementOne],
        ['0x171C', '0x055E', 0, 189, 50000, 2, false,   "Virtuoso's Cap", 'Suits', 384, 142, i += incrementOne],
        ['0x13DB', '0x055E', 0, 190, 50000, 2, false,   "Virtuoso's Tunic", 'Suits', 452, 136, i += incrementOne],
        ['0x13C6', '0x055E', 0, 191, 50000, 2, false,   "Virtuoso's Kid Gloves", 'Suits', 499, 142, i += incrementOne],
        ['0x13C7', '0x055E', 0, 192, 50000, 2, false,   "Virtuoso's Collar", 'Suits', 425, 144, i += incrementOne],
        ['0x4210', '0x055E', 0, 193, 50000, 2, false,   "Virtuoso's Necklace", 'Suits', 421, 179, i += incrementOne],
        ['0x4213', '0x055E', 0, 194, 50000, 2, false,   "Virtuoso's Earpieces", 'Suits', 382, 182, i += incrementOne],
        ['0x4050', '0x055E', 0, 195, 50000, 2, false,   "Virtuoso's Armbands", 'Suits', 461, 185, i += incrementOne],
        ['0x4064', '0x055E', 0, 196, 50000, 2, false,   "Virtuoso's Kilt", 'Suits', 505, 180, i += incrementOne], //24

        ['0x19BD', 'any',    0, 197, 75000, 2, false,   'Giant Toad Costume', 'High End', 71, 65, i *= 0],
        ['0x19BD', 'any',    0, 198, 75000, 2, false,   'Zombie Costume', 'High End', 83, 65, i += incrementOne],
        ['0x14EF', 'any',    0, 199, 75000, 2, false,   'Fire Pit', 'High End', 111, 65, i += incrementOne],
        ['0x32F2', '0x0000', 0, 200, 75000, 2, false,   'Presentation Stone', 'High End', 44, 65, i += incrementOne],
        ['0x091A', '0x0000', 0, 201, 80000, 2, false,   'Beehive', 'High End', 91, 73, i += incrementOne],
        ['0x14EF', 'any',    0, 202, 80000, 2, false,   'Archery Butte', 'High End', 122, 65, i += incrementOne],
        ['0x108A', '0x048D', 0, 203, 150000, 5, 4999989,  'Etoile Bleue', 'High End', 142, 90, i += incrementOne],
        ['0x1086', '0x048D', 0, 204, 150000, 5, 4999989,  'Novo Bleue', 'High End', 142, 82, i += incrementTwo],
        ['0x108A', '0x048E', 0, 205, 150000, 5, 4999989,  'Lune Rouge', 'High End', 142, 75, i += incrementTwo],
        ['0x1086', '0x048E', 0, 206, 150000, 5, 4999989,  'Soleil Rouge', 'High End', 142, 65, i += incrementTwo],
        ['0x2F5B', '0x0783', 0, 231, 300000, 5, 7999989,  'Lucky Charm', 'High End', 100, 100, i += incrementTwo],
        ['0x2F5B', '0x076E', 0, 232, 300000, 5, 12000000,  "Soldier's Medal", 'High End', 72, 100, i += incrementTwo],
        ['0x2F58', '0x076E', 0, 233, 300000, 5, 12000000,  "Duelist's Edge", 'High End', 129, 100, i += incrementTwo],
        ['0x2F5A', '0x0778', 0, 234, 300000, 5, 12000000,  "Necromancer's Phylactery", 'High End', 99, 121, i += incrementTwo], 
        ['0x2F58', '0x0778', 0, 235, 300000, 5, 12000000,  "Wizard's Curio", 'High End', 129, 125, i += incrementTwo],
        ['0x2F5B', '0x0778', 0, 236, 300000, 5, 12000000,  "Mystic's Memento", 'High End', 72, 125, i += incrementTwo],
        ['0x1F19', '0x0482', 0, 237, 500000, 2, false, 'Vollem Held in', 'High End', 44, 119, i += incrementTwo], //17

        ['0x0EFF', '0x0A83', 0, 207, 250000, 3, false, 'Intense Teal Pigment', 'Dyes', 44, 65, i *= 0],
        ['0x0EFF', '0x0A9C', 0, 208, 250000, 3, false, 'Tyrian Purple Pigment', 'Dyes', 58, 65, i += incrementThree],
        ['0x0EFF', '0x0A9A', 0, 209, 250000, 3, false, 'Sunset Blue Pigment', 'Dyes', 72, 65, i += incrementThree],
        ['0x0EFF', '0x0A7C', 0, 210, 250000, 3, false, 'Mossy Green Pigment', 'Dyes', 86, 65, i += incrementThree],
        ['0x0EFF', '0x0AA5', 0, 211, 250000, 3, false, 'Vibrant Ocher Pigment', 'Dyes', 100, 65, i += incrementThree],
        ['0x0EFF', '0x0A95', 0, 212, 250000, 3, false, 'Olive Green Pigment', 'Dyes', 114, 65, i += incrementThree],
        ['0x0EFF', '0x0798', 0, 213, 250000, 3, false, 'Polished Bronze Pigment', 'Dyes', 128, 65, i += incrementThree],
        ['0x0EFF', '0x077C', 0, 214, 250000, 3, false, 'Glossy Blue Pigment', 'Dyes', 142, 65, i += incrementThree],
        ['0x0EFF', '0x07BB', 0, 215, 250000, 3, false, 'and Green Pigment', 'Dyes', 44, 88, i += incrementThree],
        ['0x0EFF', '0x0789', 0, 216, 250000, 3, false, 'Deep Violet Pigment', 'Dyes', 58, 88, i += incrementThree],
        ['0x0EFF', '0x07AF', 0, 217, 250000, 3, false, 'of Amber Pigment', 'Dyes', 72, 88, i += incrementThree],
        ['0x0EFF', '0x07C8', 0, 218, 250000, 3, false, 'Murky Seagreen Pigment', 'Dyes', 86, 88, i += incrementThree],
        ['0x0EFF', '0x07A8', 0, 219, 250000, 3, false, 'Shadowy Blue Pigment', 'Dyes', 100, 88, i += incrementThree],
        ['0x0EFF', '0x078A', 0, 220, 250000, 3, false, 'Gleaming Fuchsia Pigment', 'Dyes', 114, 88, i += incrementThree],
        ['0x0EFF', '0x077F', 0, 221, 250000, 3, false, 'Glossy Fuchsia Pigment', 'Dyes', 128, 88, i += incrementThree],
        ['0x0EFF', '0x0793', 0, 222, 250000, 3, false, 'Deep Blue Pigment', 'Dyes', 142, 88, i += incrementThree],
        ['0x0EFF', '0x07B2', 0, 223, 250000, 3, false, 'Vibrant Seagreen Pigment', 'Dyes', 44, 111, i += incrementThree],
        ['0x0EFF', '0x07C5', 0, 224, 250000, 3, false, 'Murky Amber Pigment', 'Dyes', 58, 111, i += incrementThree],
        ['0x0EFF', '0x07AC', 0, 225, 250000, 3, false, 'Vibrant Crimson Pigment', 'Dyes', 72, 111, i += incrementThree],
        ['0x0EFF', '0x0776', 0, 226, 250000, 3, false, 'Reflective Shadow Pigment', 'Dyes', 86, 111, i += incrementThree],
        ['0x0EFF', '0x0AA3', 0, 227, 250000, 3, false, 'Star Blue Pigment', 'Dyes', 100, 111, i += incrementThree],
        ['0x0EFF', '0x0AA0', 0, 228, 250000, 3, false, 'of Pearl Pigment', 'Dyes', 114, 111, i += incrementThree],
        ['0x0EFF', '0x0783', 0, 229, 250000, 3, false, 'Liquid Sunshine Pigment', 'Dyes', 128, 111, i += incrementThree],
        ['0x0EFF', '0x0814', 0, 230, 250000, 3, false, 'Dark Void Pigment', 'Dyes', 142, 111, i += incrementThree], //24
    ]

var serialIndex = 1;
var CleanupGumpButtons = //[ xsize, ysize, CallBackID, 'Text', 'FunctionName', [arguments] ]
    [
        [ [100, 30, serialIndex++, "RelicTurnin", 'RelicTurnin'], [100, 30, serialIndex++, "EssenceTurnin", 'EssenceTurnin'] ],
        [],
        [ [100, 30, serialIndex++, "CleanupToVendor", "CleanupToVendor"], [100, 30, serialIndex++, "GetAllVendorGold", "GetAllVendorGold"] ],
        [],
        [ [100, 30, serialIndex++, "MoveMallets", "MoveMallets"], [100, 30, serialIndex++, "MoveAll", "MoveAll"] ],
        [],
        [ [100, 30, serialIndex++, "VSResultCleanup", "VSResultCleanup"] ],
    ]
    
function GumpCallback(_) 
    {
    var code = CustomGumpResponse.ReturnCode();
    if(code == 0) 
        {
        var gump = Orion.CreateCustomGump(15);
        gump.Close();
        }
    CleanupGumpButtons.forEach(function(rowLayer)
        {
        rowLayer.forEach(function(button)
            {
            if (button[2] == code)
                {
                Orion.Print('Toggle ' + button[3]);
                Orion.ToggleScript(button[4], false, button[5]);
                return;
                }
            })
        });
    }

function gridX(x){
    return x * 105 + 2
    }
function gridY(y){
    return y * 30
    }
function gridTX(x){
    return x * 105 + 7
    }
function gridTY(y){
    return y * 30 + 4
    }

function ContainerPlacement()
    {
    Orion.WaitForAddObject('myTarget');
    var container = Orion.GetSerial('myTarget');
    Orion.UseObject(container);
    Orion.Wait(500);
    TextWindow.Open();
    var items = Orion.FindTypeEx(any,any,container);
    for(var i=0;i<items.length;i++)
        {
        var item = items[i];
        TextWindow.Print(item.Name() + ':' + item.X() + ', ' + item.Y()); 
        }
    }

function ContainerGumpToggle()
	{
	if (Orion.ClientOptionGet('GriddedContainers') == 1)
		Orion.ClientOptionSet('GriddedContainers', 0)
	else
		Orion.ClientOptionSet('GriddedContainers', 1)
	}
function DropDraggedToContainer()
	{
	var dropcontainer = Orion.FindObject('dropContainer');
	if(dropcontainer && Orion.Dragging())
		Orion.DropDraggedItem('dropContainer');	
	else
		Orion.WaitForAddObject('dropContainer');
	}
function toost()
	{
	while(true)
		{
		if (Orion.WaitForPrompt(1000))
			Orion.SendPrompt('30000');
		}
	}
function SumPoints()
    {
    var a = itemList.reduce(function(a,b)
      {
      return a + (b[4] * b[5]);
      }, 0);
    Orion.Print(a)
    }

function SumStockCount()
    {
    var a = itemList.reduce(function(a,b)
      {
      return a + b[5];
      }, 0);
    Orion.Print(a)
    }

function GMJournalScan()
	{
	var bot = "https://discordapp.com/api/webhooks/"
        + '941921319463841843' //hook
        + "/"
        + '7edeWcihk41muJgZGU2RouSAzICkLSAH8P4GoEKbv_OyRTa_kMumiQhWHcb4XEYispwI'; //key
    var paramText = "content=" + Player.Name() + ": GM";
	var msg = 'GM';
	while(true)
		{
		var check = Orion.WaitJournal(msg, Orion.Now(), 0, '');
		Orion.Wait(100);
        if(check)
            {
            Orion.HttpPost(bot, paramText);
            //Orion.PlayWav('Alarm09.wav');
            Orion.PauseScript('all', 'GMJournalScan');
            Orion.Wait(1000);
            Orion.StopWalking();
            Orion.OAOptionSet('AutoReconnect', '0');
            Orion.Wait(2000);
            }
		}
	}

function GetAllVendorGold()
	{
	var gump = Orion.GetGump('any','0x000002AB');
	if(gump !== null)
		{
		var gold = Orion.Split(gump.Text(3), ',').join('');
		gump.Select(Orion.CreateGumpHook(7));
		if(Orion.WaitJournal('How much of the', Orion.Now(), Orion.Now() + 2000))
            {
            Orion.Wait(100);
			Orion.SendPrompt(gold);
            }
		}
	if(Orion.PromptExists())
        Orion.SendPrompt(' ');
	Orion.CancelWaitPrompt();
	}

function VSResultCleanup()
	{
    var showEqual = true;
	TextWindow.Open();
    TextWindow.Print('--START VS--');
	for(var i=0;i<itemList.length;i++)
		{
        var itemLine = itemList[i];
        var tab = '\t';
        var currentPrice = itemLine[6] || gpPerCleanupPoint * itemLine[4];
		var searchText = itemLine[7];
		var resultArr = VSsearch(searchText);
		Orion.Print(searchText + ':' + resultArr);
		if(resultArr.length)
			{
			if(resultArr[0] == 'No items matched')
				{
				TextWindow.Print('\\\t' + currentPrice + ':\t' + searchText + ': No items matched : Current: ' + currentPrice);
				}
			else if(resultArr[0] == 'Timed Out')
				{
                Orion.CharPrint(self,1159,'Search Timed Out, trying again...')
				i--;
				continue;
				}
			else
				{
				var lowestPrice = resultArr[3] || resultArr[2] || resultArr[1] || resultArr[0];
				if(lowestPrice < currentPrice)
					{
                    if(lowestPrice - 1 < 1000000)
                        tab = '\t\t';
					TextWindow.Print("-\t" + (lowestPrice-1) + ':' + tab + searchText + ': [' + resultArr + '] : Current: ' + currentPrice);
					}
				else if(showEqual && (lowestPrice == currentPrice || lowestPrice - 1 == currentPrice))
                    {
                    if(currentPrice < 1000000)
                        tab = '\t\t';
                    TextWindow.Print("=\t" + currentPrice +":" + tab + searchText + ': [' + resultArr + '] : Current: ' + currentPrice);
                    }
                else if(lowestPrice > currentPrice)
                    {
                    if(lowestPrice - 1 < 1000000)
                        var tab = '\t\t';
					TextWindow.Print("+\t" + (lowestPrice-1) + ':' + tab + searchText + ': [' + resultArr + '] : Current: ' + currentPrice);
                    }
				}
			}
		else
			Orion.Print('false')
		Orion.Wait(500);
		}
    TextWindow.Print('--END VS--');
	}

function VSsearch(text)
	{
	Orion.WaitContextMenuID(self, 1016);
	Orion.RequestContextMenu(self);
	var vendorSearchGump = WaitForSpecificGump(5000, 'generic', self, '0x000F3EC8')
	if(vendorSearchGump)
		{
		var gumpHook = Orion.CreateGumpHook(1);
		gumpHook.AddEntry(1, text);
		vendorSearchGump.Select(gumpHook);
		Orion.Wait(500);
		}
	Orion.AddDisplayTimer('searchWait', 120000, 'AboveChar', 'bar', 'Waiting for Vendor Search');
	var vendorSearchGump = WaitForSpecificGump(120000, 'generic', self, '0x000F3EC8')
	if(vendorSearchGump)
		{
		var cmdList = vendorSearchGump.CommandList()
		var noItemsMatched = cmdList.filter(function(cmdLine)
			{
			return Orion.Contains(cmdLine, '1154587');
			});
		if(noItemsMatched[0])
			{
			CloseAllGumps();
			return ['No items matched'];
			}
		}
	else
		{
        CloseAllGumps();
		return ['Timed Out'];
		}
	Orion.Wait(200);
	var vendorSearchResults = WaitForSpecificGump(2000, 'generic', self, '0x000F3EC9')
	if(vendorSearchResults)
		{
		Orion.RemoveDisplayTimer('searchWait');
		var cmdList = vendorSearchResults.CommandList()
		var prices = cmdList.filter(function(cmdLine)
			{
			return Orion.Contains(cmdLine, '1043304');
			}).map(function(cmdLine)
				{
				var numberString = (cmdLine.match(/@([\d,]+)/) || [])[1]
				var commaNeg = numberString.replace(/,/g, "");
				return +commaNeg
				});
		}
    CloseAllGumps();
	return prices;
	}

function WaitForSpecificGump(delay, type, serial, id)
    {
    var endTime = Orion.Now() + delay
    while(!Orion.GumpExists(type, serial, id) && Orion.Now() < endTime)
    	Orion.Wait(100);
    if(Orion.GumpExists(type, serial, id))
        return Orion.GetGump(serial, id);
    return false;
    }

//['Low End', 'Suits', 'Low End', 'Suits', 'High End', 'Dyes']
function RewardToVendor()
    {
	if(Orion.PromptExists())
        Orion.SendPrompt(' ');
	Orion.CancelWaitPrompt();
    Orion.CharPrint(self,1159,'Select vendor to restock')
    Orion.WaitForAddObject('myTarget');
    var vendor = Orion.FindObject('myTarget');
    var vendorSerial = vendor.Serial();
    var vendorName = vendor.Name()//(vendor.Properties().match(/Shop Name: (.+)/) || [])[1];
    if(!vendor || Orion.GetDistance(vendorSerial) > 2)
        return Orion.CharPrint('Vendor not found or too far away! Halting...');
    var vendorBackpackObj = Orion.ObjAtLayer(21, vendorSerial);
    if(!vendorBackpackObj)
        return Orion.CharPrint(self,1159,'Something went wrong with vendor backpack! Halting...');
    var vendorBackpack = vendorBackpackObj.Serial();
    VerifyOpenContainer(vendorBackpack);
    var vendorContainer = Orion.FindType('0x0A2C|0x0E75',any,vendorBackpack)[0];
    if(!vendorContainer)
        vendorContainer = vendorBackpack;
    VerifyCleanupPrices(vendorContainer);
    var verifyCheck = false;
	while(PutCleanupToVendor(vendorContainer,vendorName))
        {
        verifyCheck = true;
        Orion.Wait(100);
        }
    var currentInv = itemList.filter(function(item)
        {
        return item[8] == vendorName;
        });
    var requestArr = CleanupRequestCount(currentInv,vendorContainer);
    var checkEmptyRequestArr = requestArr.every(function(ele)
        {
        return ele[2] == 0;
        });
    if(!checkEmptyRequestArr)
        {
        Orion.CharPrint(self,1159,'Recalling to Cleanup NPC to restock');
        GetCleanupRewards(requestArr);
        while(Orion.GetDistance(vendorSerial) > 2)
            {
            Orion.WalkTo(vendor.X(),vendor.Y());
            Orion.Wait(500);
            }
        VerifyOpenContainer(vendorBackpack);
        VerifyOpenContainer(vendorContainer);
        }
	while(PutCleanupToVendor(vendorContainer,vendorName))
        {
        verifyCheck = true;
        Orion.Wait(100);
        }
    if(verifyCheck)
        {
        Orion.CharPrint(self,1159,'Finished putting items on vendor! Verifying prices...');
        Orion.CloseGump('container', vendorContainer);
        Orion.Wait(100);
        VerifyCleanupPrices(vendorContainer);
        }
    }

function GetCleanupRewards(requestArr)
    {
    CloseAllGumps();
    //var requestArr = itemList;
    RecallByGump('Main','Cleanup','Main','Cleanup2');
    var npc = Orion.FindTypeEx(any,any,ground,'live',20).filter(function(mob)
        {
        return Orion.Contains(mob.Properties(), 'the Cleanup Officer')
        })[0];
    if(!npc)
        return Orion.CharPrint(self,1159,'No NPC Found!');
    while(npc.Distance() > 2)
        {
        Orion.WalkTo(npc.X(),npc.Y())
        Orion.Wait(500);
        }
    var vendorSerial = npc.Serial();
    for(var i=0;i<requestArr.length;i++)
        {
        while(!Orion.GumpExists('generic', vendorSerial))
            {
            Orion.UseObject(vendorSerial);
            Orion.Wait(1300);
            }
        var currentItem = requestArr[i];
        for(var j=0;j<currentItem[2];j++)
            {
            if(Orion.WaitForGump(2000))
                {
                var gump = Orion.GetGump(vendorSerial, '0x00004268');
                if(gump !== null)
                    {
                    gump.Select(Orion.CreateGumpHook(currentItem[3]));
                    Orion.Wait(500);
                    }
                }
            if(Orion.WaitForGump(2000))
                {
                var gump = Orion.GetGump(any, '0x00004269');
                if(gump !== null)
                    {
                    gump.Select(Orion.CreateGumpHook(7));
                    Orion.Wait(500);
                    }
                }
            Orion.Wait(100);
            }
        }
    Orion.Wait(500);
    CloseAllGumps();
    Orion.Wait(500);
    RecallByGump('Main','Home','Main','Home2');
    while(Player.X() != 763 || Player.Y() != 699)
		{
		Orion.WalkTo(763,699,0,0);
		Orion.Wait(500);
		}
		//7,27
    while(Player.Z() != 27)
        {
        Orion.Wait(100);
        }
    }

function PutCleanupToVendor(vendorContainer, vendorName)
	{
    var tempItemList = itemList.filter(function(itemArr)
        {
        return itemArr[8] == vendorName;
        })
    var items = Orion.FindTypeEx(any)
    for(var i=0;i<items.length;i++)
        {
        var currentItem = items[i];
        var currentItemArr = tempItemList.filter(function(itemArr)
            {
            var itemGraphic = itemArr[0];
            var itemColor = itemArr[1];
            if(itemGraphic == 'any')
                itemGraphic = currentItem.Graphic();
            if(itemColor == 'any')
                itemColor = currentItem.Color();
            return itemGraphic == currentItem.Graphic() && itemColor == currentItem.Color() && Orion.Contains(currentItem.Properties(), itemArr[7]);
            })[0];
        if(currentItemArr)
            break;
        }
	if(currentItemArr)
        {
        Orion.CancelWaitPrompt();
        if(Orion.PromptExists())
            Orion.SendPrompt(' ');
        var price = currentItemArr[6] || currentItemArr[4] * gpPerCleanupPoint;
        var xPos = currentItemArr[9];
        var yPos = currentItemArr[10];
        var gridPos = currentItemArr[11];
        if(Orion.Contains(currentItem.Properties(), 'Owned by No One'))
            {
            price += 10000000;
            xPos += 10;
            gridPos += 40
            }
        Orion.WaitPrompt(price);
        Orion.Wait(600);
        Orion.MoveItem(currentItem.Serial(), 0, vendorContainer, xPos, yPos, -1, gridPos);
        Orion.Wait(600);
        Orion.CancelWaitPrompt();
        Orion.Wait(600);
        if(Orion.PromptExists())
            Orion.SendPrompt(' ');
        return true;
        }
    else
        return false;
	}

function CleanupRequestCount(currentInv,vendorContainer)
	{
    for(var i=0;i<currentInv.length;i++)
        {
        var item = currentInv[i];
        var countVendor = Orion.FindTypeEx(item[0],item[1],vendorContainer).filter(function(part){return Orion.Contains(part.Properties(), item[7]) && !Orion.Contains(part.Properties(),'Owned by No One')}).length;
        var countBackpack = Orion.FindTypeEx(item[0],item[1],backpack).filter(function(part){return Orion.Contains(part.Properties(), item[7]) && !Orion.Contains(part.Properties(),'Owned by No One')}).length;
        var needed = item[5] - countVendor - countBackpack;
        item[2] = Math.max(needed,0);
        }
	return currentInv;
	}

function CloseAllGumps(_)
    {
    while(Orion.GetGump(any))
        {
        Orion.Print(Orion.GetGump(any).ID());
        Orion.GetGump(any).Select(Orion.CreateGumpHook(0));
        Orion.Wait(100);
        }
    }

function VerifyCleanupPrices(vendorContainer)
    {
    VerifyOpenContainer(vendorContainer);
    var verify = Orion.FindTypeEx(any,any,vendorContainer);
    for(var v=0;v<verify.length;v++)
        {
        var item = verify[v];
        if(item)
            {
            var itemArr = itemList.filter(function(part)
                {
                var itemGraphic = part[0];
                var itemColor = part[1];
                if(itemGraphic == 'any')
                    itemGraphic = item.Graphic();
                if(itemColor == 'any')
                    itemColor = item.Color();
                return itemGraphic == item.Graphic() && itemColor == item.Color() && Orion.Contains(item.Properties(), part[7]);
                })[0];
            var itemPriceRaw = item.Properties().match(/Price: ([\d,]+)/);
            if(itemPriceRaw[1])
                {
                var priceTarget = itemArr[6] || itemArr[4] * gpPerCleanupPoint;
                var itemPrice = Orion.Split(itemPriceRaw[1], ',').join('');
                if(Orion.Contains(item.Properties(),'Owned by No One'))
                    priceTarget += 10000000;
                if(+itemPrice != priceTarget)
                    {
                    Orion.Print('Moving incorrectly priced item to backpack: ' + item.Name());
                    Orion.MoveItem(item.Serial());
                    Orion.Wait(1300);
                    }
                }
            }
        }
    }

function VendorGumpButton(button, ms)
    {
    if(!ms)
        ms = 100;
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump('last');
        if((gump !== null) && (!gump.Replayed()) && (gump.ID() === '0x000002AB'))
            {
            gump.Select(Orion.CreateGumpHook(button));
            Orion.Wait(ms);
            }
        }   
    }

function RecallByGump(bookName,runeName,backupBook,backupRune) 
    {
    if(typeof runeName != 'string')
        runeName = String(runeName);
    if(typeof backupRune != 'string')
        backupRune = String(runeName);
    var x = Player.X();
    var y = Player.Y();
    var runeItem = Orion.FindTypeEx('0x22C5').filter(function(part)
                {
                return Orion.Contains(part.Properties(), bookName)
                });
    if(!runeItem[0])
        {
        Orion.Print("Runebook named '" + bookName + "' not found!");
        return;    
        }
    if(Orion.SkillValue('Magery', 'base') >= 600)
        var startInd = 50; //recall index
    else
        var startInd = 75; //sacred journey index
    Orion.Wait(1300);
    Orion.CharPrint(self, 1159, "Recalling to: " + runeName + ' in Book: ' + bookName);
    Orion.UseObject(runeItem[0].Serial());
    if(Orion.WaitForGump(1000))
        {
        var gump = Orion.GetGump('last');
        var runeCheck = gump.TextList().indexOf(runeName) - 2;
        if(runeCheck == -1)
            Orion.Print("Can't find rune named '" + runeName + "' in book named '" + bookName + "'!");
        if((gump !== null) && (!gump.Replayed()) && (gump.ID() === '0x00000059'))
            {
            gump.Select(Orion.CreateGumpHook(startInd + runeCheck));
            Orion.Wait(200);
            }
        Orion.CloseGump('generic', gump.Serial());
        }
    var startJournal = Orion.Now();
    var endWait = startJournal + 5000;
    while(x == Player.X() && y == Player.Y() && Orion.Now() < endWait)
        {
        if(Orion.InJournal('Something is blocking the location.', 'sys', 0, any, startJournal))
            {
            Orion.Wait(2000);
            var backup = Orion.FindTypeEx('0x9C16').filter(function(part)
                {
                return part.Properties().match(/.+$/) == backupBook;
                });
            if(backup)
                return RecallByGump(backupBook, backupRune);
            else
                Orion.Print("No backup runebook named '" + backupBook + "' found!");
            }
        else if(Orion.InJournal('You cannot teleport into that area.', 'sys', 0, any, startJournal))
            {
            Orion.Wait(2000);
            return RecallByGump(backupBook, backupRune);
            }
        Orion.Wait(500);
        }
    Orion.Wait(1500);
    Orion.Resend();
    Orion.Wait(500);
    if(x == Player.X() && y == Player.Y())
        return RecallByGump(bookName,runeName,backupBook,backupRune);
    }

function RelicTurnin()
	{
    Shared.AddVar('quests_Completed',0);
    Shared.AddVar('chisels',0);
    Shared.AddVar('total_Points',0);
    Orion.Exec('TurninGump',true);
	while(true)
		{
		while(Orion.Count('0x2DB3') < 50)
			{
            var banker = Orion.FindTypeEx(any,any,ground,'mobile',20).filter(function(npc)
                {
                return Orion.Contains(npc.Properties(), 'the banker');
                })[0];
			if(!banker)
				RecallByGump('Main','Bank','Main','Bank2');
			while(!Orion.GumpExists('container', Player.BankSerial()))
				{
				Orion.Say('bank');
				Orion.Wait(1300);
				}
            var maxChisel = Orion.FindTypeEx('0x12B3').filter(function(chisel)
                {
                return Orion.Contains(chisel.Properties(), 'Uses Remaining: 100');
                })[0];
            while(maxChisel)
                {
                while(!Orion.GumpExists('container', Player.BankSerial()))
                    {
                    Orion.Say('bank');
                    Orion.Wait(1300);
                    }
                Orion.MoveItem(maxChisel.Serial(),0,Player.BankSerial());
                Orion.Wait(1300);
                maxChisel = Orion.FindTypeEx('0x12B3').filter(function(chisel)
                    {
                    return Orion.Contains(chisel.Properties(), 'Uses Remaining: 100');
                    })[0];
                }
			var frags = Orion.FindType('0x2DB3',any,Player.BankSerial())[0];
			Orion.MoveItem(frags,450 - Orion.Count('0x2DB3'),backpack);
			Orion.Wait(1300);
			if(Player.Weight() > Player.MaxWeight())
				{
				var items = Orion.FindTypeEx(any).filter(function(item)
					{
					return !Orion.Contains(item.Properties(),'blessed|contents:')
					});
				while(items[0])
					{
					Orion.MoveItem(items[0].Serial(), 0, Player.BankSerial());
					Orion.Wait(1300);
					items = Orion.FindTypeEx(any).filter(function(item)
						{
						return !Orion.Contains(item.Properties(),'blessed|contents:')
						});
					}
				}
			}
		//if(Player.X() != 798 && Player.Y() != 3434)
			//RecallByGump('Main','Soulforge','Main','Soulforge2');
        var time = Orion.Now();
		while(Orion.Count('0x2DB3') >= 50)
			{
			var npc = Orion.FindTypeEx(any,any,ground,'mobile',2).filter(function(check)
				{
				return Orion.Contains(check.Properties(), 'Ansikart the Artificer');
				})[0];
			if(!npc)
                {
			    RecallByGump('Main','Soulforge','Main','Soulforge2');
                Orion.Wait(1000);
                continue;
                }
				//return Orion.CharPrint('Quest NPC not nearby! Halting...');
            var runicOne = Orion.FindTypeEx('0x12B3',any).filter(function(part)
                {
                var charges = +part.Properties().match(/Uses Remaining: (\d+)/)[1]
                return charges == 10;
                })[0];
            if(runicOne)
                MalletCombiner();
            Orion.Wait(1300 - (Orion.Now() - time));
			Orion.UseObject(npc.Serial());
			time = Orion.Now();
			if(Orion.WaitForGump(2000))
				{
				Orion.Wait(250);
				if(CheckGumpCliloc('0x00000320', '@@#1112537'))
					{
					var gump = Orion.GetGump('any', '0x00000320');
					if(gump !== null)
						{
						gump.Select(Orion.CreateGumpHook(1));
						Orion.Wait(100);
						}
					Orion.Wait(1300 - (Orion.Now() - time));
					Orion.WaitContextMenuID(self, 801);
					Orion.RequestContextMenu(self);
					time = Orion.Now();
					if(Orion.WaitForTarget(2000))
						{
						Orion.TargetType('0x2DB3');
						Orion.Wait(200);
						if(Orion.WaitForTarget(2000))
							Orion.CancelTarget();
						}
					Orion.Wait(1300 - (Orion.Now() - time));
					Orion.UseObject(npc.Serial());
                    time = Orion.Now();
					if (Orion.WaitForGump(2000))
						{
						var gump = Orion.GetGump('any', '0x0000032A');
						if(gump !== null)
							{
							gump.Select(Orion.CreateGumpHook(4));
							Orion.Wait(100);
							}
						}
					if(Orion.WaitForGump(2000))
						{
						var gump = Orion.GetGump('any', '0x00000323');
						if(gump !== null)
							{
							gump.Select(Orion.CreateGumpHook(1));
							Orion.Wait(100);
							}
						}
					}
				else
					{
					var gump = Orion.GetGump('any', '0x00000320');
					if(gump !== null)
						{
						gump.Select(Orion.CreateGumpHook(2));
						Orion.Wait(100);
						}
					if(Orion.WaitForGump(2000))
						{
						var gump = Orion.GetGump('any', '0x00000326');
						if(gump !== null)
							{
							gump.Select(Orion.CreateGumpHook(3));
							Orion.Wait(100);
							}
						}
					Orion.Wait(1300);
					}
				}
			}
		if(Orion.FindType('0x0E75')[0])
			{
            var banker = Orion.FindTypeEx(any,any,ground,'mobile',20).filter(function(npc)
                {
                return Orion.Contains(npc.Properties(), 'the banker');
                })[0];
            if(!banker)
				RecallByGump('Main','Bank','Main','Bank2');
			var chiselBackpacks = Orion.FindTypeEx('0x0E75').filter(function(chiselBackpack)
				{
				return Orion.Contains(chiselBackpack.Properties(), 'Contents: 2/');
				});
			for(var i=0;i<chiselBackpacks.length;i++)
				{
				var pack = chiselBackpacks[i];
				var packSerial = pack.Serial();
				while(!Orion.GumpExists('container',packSerial))
					{
					Orion.UseObject(packSerial);
					Orion.Wait(1300);
					}
				var chiselInBackpack = Orion.FindType('0x12B3',any,packSerial)[0];
                Shared.AddVar('chisels',chiselInBackpack.length + Shared.GetVar('chisels'))
				while(chiselInBackpack)
					{
					Orion.MoveItem(chiselInBackpack);
					Orion.Wait(1300);
					chiselInBackpack = Orion.FindType('0x12B3',any,packSerial)[0];
					}
				}
            var maxChisel = Orion.FindTypeEx('0x12B3').filter(function(chisel)
                {
                return Orion.Contains(chisel.Properties(), 'Uses Remaining: 100');
                })[0];
            while(maxChisel)
                {
                while(!Orion.GumpExists('container', Player.BankSerial()))
                    {
                    Orion.Say('bank');
                    Orion.Wait(1300);
                    }
                Orion.MoveItem(maxChisel.Serial(),0,Player.BankSerial());
                Orion.Wait(1300);
                maxChisel = Orion.FindTypeEx('0x12B3').filter(function(chisel)
                    {
                    return Orion.Contains(chisel.Properties(), 'Uses Remaining: 100');
                    })[0];
                }
			var trash = Orion.FindTypeEx(any,any,ground,'item').filter(function(trashCheck)
				{
				return Orion.Contains(trashCheck.Properties(), 'trash')
				})[0];
			if(!trash)
				return Orion.CharPrint(self,1159,'Trash barrel missing! Halting...');
			var leftOverPacks = Orion.FindType('0x0E75')[0];
			while(leftOverPacks)
				{
                var startTime = Orion.Now();
                var endTime = startTime + 1300;
				Orion.MoveItem(leftOverPacks,0,trash.Serial());
                if(Orion.WaitJournal('Your Clean Up Britannia point total is now 10000000!', startTime, endTime, 'sys'))
                    return DiscordPush(Player.Name() + ': Max Cleanup Points Reached!');
				leftOverPacks = Orion.FindType('0x0E75')[0];
				}
            if(Orion.FindType(any).length > 120)
                {
                while(!Orion.GumpExists('container', Player.BankSerial()))
                    {
                    Orion.Say('bank');
                    Orion.Wait(1300);
                    }
                Orion.CharPrint(self,1159,'Tidying inventory to bank');
                var tidy = Orion.FindType('0x12B3')[0];
                while(tidy)
                    {
                    Orion.MoveItem(tidy,0,Player.BankSerial());
                    Orion.Wait(1300);
                    tidy = Orion.FindType('0x12B3')[0];
                    }
                }
			}
		}
	}

function EssenceTurnin()
	{
    Shared.AddVar('quests_Completed',0);
    Shared.AddVar('chisels',0);
    Shared.AddVar('total_Points',0);
    Orion.Exec('TurninGump',true,[true]);
	while(true)
		{
		while(Orion.Count('0x2DB2') < 50)
			{
            var banker = Orion.FindTypeEx(any,any,ground,'mobile',20).filter(function(npc)
                {
                return Orion.Contains(npc.Properties(), 'the banker');
                })[0];
			if(!banker)
				RecallByGump('Main','Bank','Main','Bank2');
			while(!Orion.GumpExists('container', Player.BankSerial()))
				{
				Orion.Say('bank');
				Orion.Wait(1300);
				}
            var maxChisel = Orion.FindTypeEx('0x12B3').filter(function(chisel)
                {
                return Orion.Contains(chisel.Properties(), 'Uses Remaining: 100');
                })[0];
            while(maxChisel)
                {
                while(!Orion.GumpExists('container', Player.BankSerial()))
                    {
                    Orion.Say('bank');
                    Orion.Wait(1300);
                    }
                Orion.MoveItem(maxChisel.Serial(),0,Player.BankSerial());
                Orion.Wait(1300);
                maxChisel = Orion.FindTypeEx('0x12B3').filter(function(chisel)
                    {
                    return Orion.Contains(chisel.Properties(), 'Uses Remaining: 100');
                    })[0];
                }
			var essences = Orion.FindType('0x2DB2',any,Player.BankSerial())[0];
			Orion.MoveItem(essences,450 - Orion.Count('0x2DB2'),backpack);
			Orion.Wait(1300);
			if(Player.Weight() > Player.MaxWeight())
				{
				var items = Orion.FindTypeEx(any).filter(function(item)
					{
					return !Orion.Contains(item.Properties(),'blessed|contents:')
					});
				while(items[0])
					{
					Orion.MoveItem(items[0].Serial(), 0, Player.BankSerial());
					Orion.Wait(1300);
					items = Orion.FindTypeEx(any).filter(function(item)
						{
						return !Orion.Contains(item.Properties(),'blessed|contents:')
						});
					}
				}
			}
		//if(Player.X() != 798 && Player.Y() != 3434)
			//RecallByGump('Main','Soulforge','Main','Soulforge2');
        var time = Orion.Now();
		while(Orion.Count('0x2DB2') >= 50)
			{
			var npc = Orion.FindTypeEx(any,any,ground,'mobile',2).filter(function(check)
				{
				return Orion.Contains(check.Properties(), 'Aurvidlem the Artificer');
				})[0];
			if(!npc)
                {
			    RecallByGump('Main','Soulforge3','Main','Soulforge4');
                Orion.Wait(1000);
                continue;
                }
				//return Orion.CharPrint('Quest NPC not nearby! Halting...');
            var runicOne = Orion.FindTypeEx('0x12B3',any).filter(function(part)
                {
                var charges = +part.Properties().match(/Uses Remaining: (\d+)/)[1]
                return charges == 10;
                })[0];
            if(runicOne)
                MalletCombiner();
            Orion.Wait(1300 - (Orion.Now() - time));
			Orion.UseObject(npc.Serial());
			time = Orion.Now();
			if(Orion.WaitForGump(5000))
				{
                var gump = Orion.GetGump('any', '0x00000320');
                if(gump !== null)
                    {
                    gump.Select(Orion.CreateGumpHook(1));
                    Orion.Wait(100);
                    }
                Orion.Wait(1300 - (Orion.Now() - time));
                Orion.WaitContextMenuID(self, 801);
                Orion.RequestContextMenu(self);
                time = Orion.Now();
                if(Orion.WaitForTarget(5000))
                    {
                    Orion.TargetType('0x2DB2');
                    Orion.Wait(200);
                    if(Orion.WaitForTarget(5000))
                        Orion.CancelTarget();
                    }
                Orion.Wait(1300 - (Orion.Now() - time));
                Orion.UseObject(npc.Serial());
                time = Orion.Now();
                if (Orion.WaitForGump(5000))
                    {
                    var gump = Orion.GetGump('any', '0x0000032A');
                    if(gump !== null)
                        {
                        gump.Select(Orion.CreateGumpHook(4));
                        Orion.Wait(100);
                        }
                    }
                if(Orion.WaitForGump(5000))
                    {
                    var gump = Orion.GetGump('any', '0x00000323');
                    if(gump !== null)
                        {
                        gump.Select(Orion.CreateGumpHook(1));
                        Orion.Wait(100);
                        }
                    }
				}
			}
		if(Orion.FindType('0x0E75')[0])
			{
            var banker = Orion.FindTypeEx(any,any,ground,'mobile',20).filter(function(npc)
                {
                return Orion.Contains(npc.Properties(), 'the banker');
                })[0];
            if(!banker)
				RecallByGump('Main','Bank','Main','Bank2');
			var chiselBackpacks = Orion.FindTypeEx('0x0E75').filter(function(chiselBackpack)
				{
				return Orion.Contains(chiselBackpack.Properties(), 'Contents: 2/');
				});
			for(var i=0;i<chiselBackpacks.length;i++)
				{
				var pack = chiselBackpacks[i];
				var packSerial = pack.Serial();
				while(!Orion.GumpExists('container',packSerial))
					{
					Orion.UseObject(packSerial);
					Orion.Wait(1300);
					}
				var chiselInBackpack = Orion.FindType('0x12B3',any,packSerial)[0];
                Shared.AddVar('chisels',chiselInBackpack.length + Shared.GetVar('chisels'))
				while(chiselInBackpack)
					{
					Orion.MoveItem(chiselInBackpack);
					Orion.Wait(1300);
					chiselInBackpack = Orion.FindType('0x12B3',any,packSerial)[0];
					}
				}
            var maxChisel = Orion.FindTypeEx('0x12B3').filter(function(chisel)
                {
                return Orion.Contains(chisel.Properties(), 'Uses Remaining: 100');
                })[0];
            while(maxChisel)
                {
                while(!Orion.GumpExists('container', Player.BankSerial()))
                    {
                    Orion.Say('bank');
                    Orion.Wait(1300);
                    }
                Orion.MoveItem(maxChisel.Serial(),0,Player.BankSerial());
                Orion.Wait(1300);
                maxChisel = Orion.FindTypeEx('0x12B3').filter(function(chisel)
                    {
                    return Orion.Contains(chisel.Properties(), 'Uses Remaining: 100');
                    })[0];
                }
			var trash = Orion.FindTypeEx(any,any,ground,'item').filter(function(trashCheck)
				{
				return Orion.Contains(trashCheck.Properties(), 'trash')
				})[0];
			if(!trash)
				return Orion.CharPrint(self,1159,'Trash barrel missing! Halting...');
			var leftOverPacks = Orion.FindType('0x0E75')[0];
			while(leftOverPacks)
				{
                var startTime = Orion.Now();
                var endTime = startTime + 1300;
				Orion.MoveItem(leftOverPacks,0,trash.Serial());
                if(Orion.WaitJournal('Your Clean Up Britannia point total is now 10000000!', startTime, endTime, 'sys'))
                    return DiscordPush(Player.Name() + ': Max Cleanup Points Reached!');
				leftOverPacks = Orion.FindType('0x0E75')[0];
				}
            if(Orion.FindType(any).length > 120)
                {
                while(!Orion.GumpExists('container', Player.BankSerial()))
                    {
                    Orion.Say('bank');
                    Orion.Wait(1300);
                    }
                Orion.CharPrint(self,1159,'Tidying inventory to bank');
                var tidy = Orion.FindType('0x12B3')[0];
                while(tidy)
                    {
                    Orion.MoveItem(tidy,0,Player.BankSerial());
                    Orion.Wait(1300);
                    tidy = Orion.FindType('0x12B3')[0];
                    }
                }
			}
		}
	}

function CheckGumpCliloc(gumpID, clilocID)//check if clilocID is in gump. Return 1 if it is, 0 if not, and null if gump isn't found. 
    {
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump(any, gumpID)
        if(gump !== null)
            return gump.CommandList().filter(function(commandText){return Orion.Contains(commandText, clilocID)}).length;
        }
    return null;
    }

function TurninGump(essence)
    {// gem 0x4B9, 0x4BA, 0x4B9
    var startTime = Orion.Now();
    var width = 315;
    var height = 90;
    var unitMultiplier = 2500;
    var unit = 'Relic Fragments:';
    if(essence)
        {
        unitMultiplier = 500;
        unit = 'Enchanted Essences:';
        }
    while(true)
        {
        var timeStamp = Orion.Now();
        Orion.Wait(497);
        var questsCompleted = Shared.GetVar('quests_Completed');
        var totalPoints = Shared.GetVar('total_Points');
        var units = questsCompleted * 50;
        var cleanupPoints = questsCompleted * unitMultiplier;
        var ms = Orion.Now() - startTime;
        var date = new Date(ms);
        var time = date.toISOString().substring(11, 19);
        var hourDivisor = ms/3600000;
        var gump = Orion.CreateCustomGump(12001);
        gump.Clear();
        gump.AddResizepic(0, 0, 0xBB8, width, height);
        gump.AddText(10, 5, 0, 'Elapsed: ' + time, 150, 1);
        gump.AddText(150, 5, 0, 'Total', 100, 2);
        gump.AddText(225, 5, 0, 'Per hour', 75, 3);
        gump.AddText(10, 20, 0, 'Quests Completed:', 200, 4);
        gump.AddText(150, 20, 0, questsCompleted, 100, 5);
        gump.AddText(225, 20, 0, (questsCompleted/hourDivisor).toFixed(0), 100, 6);
        gump.AddText(10, 35, 0, unit, 150, 7);
        gump.AddText(150, 35, 0, units, 100, 8);
        gump.AddText(225, 35, 0, (units/hourDivisor).toFixed(0), 100, 9);
        gump.AddText(10, 50, 0, 'Cleanup Points:', 100, 10);
        gump.AddText(150, 50, 0, cleanupPoints, 100, 11);
        gump.AddText(225, 50, 0, (cleanupPoints/hourDivisor).toFixed(0), 100, 12);
        gump.AddText(10, 65, 0, 'Total Points: ' + totalPoints, 275, 13);
        gump.Update();
        var msg = Orion.InJournal('You receive a reward: backpack|Your Clean Up Britannia point total is now', 'sys', any, any, timeStamp, Orion.Now());
        //var msg = Orion.WaitJournal('You receive a reward: backpack', Orion.Now(), 0, 'sys');
        if(msg)
            {
            var msgText = msg.Text();
            if(msgText == 'You receive a reward: backpack')
                {
                    Shared.AddVar('quests_Completed',Shared.GetVar('quests_Completed') + 1);
                    Orion.ClearJournal('You receive a reward: backpack');
                }
            else if(Orion.Contains(msgText, 'Your Clean Up Britannia point total is now'))
                {
                var points = msg.Text().match(/total is now (\d+)!/) || [];
                if(points.shift())
                    {
                    Shared.AddVar('total_Points',+points[0]);
                    Orion.ClearJournal('Your Clean Up Britannia point total is now');
                    }
                }
            }
        }
    }

function MoveMallets()
    {
    MoveAll('0x12B3')
    }

function MoveAll(itemGraphic,itemColor)
    {
    var itemGraphicThru = itemGraphic || any;
    var itemColorThru = itemColor || any;
    Orion.CharPrint(self, 1159, 'Target FROM container');
    Orion.WaitForAddObject('fromContainer');
    Orion.CharPrint(self, 1159, 'Target TO container');
    Orion.WaitForAddObject('toContainer');
    var fromSerial = Orion.GetSerial('fromContainer');
    var toSerial = Orion.GetSerial('toContainer');
    VerifyOpenContainer(fromSerial);
    var toCheck = Orion.FindObject(toSerial);
    if(!toCheck.Mobile() && !Orion.Contains(toCheck.Properties(), 'Bulk Order Book'))
        VerifyOpenContainer(toSerial);
    while(Orion.FindType(itemGraphicThru, itemColorThru, fromSerial)[0])
        {
        Orion.MoveItem(Orion.FindType(itemGraphicThru, itemColorThru, fromSerial)[0], 0, toSerial);
        Orion.Wait(1100);
        }
    }

function MalletCombiner()
	{
    var runicGraphic = '0x12B3';
    var runicArr = ['0x0973','0x0966','0x0972','0x096D','0x08A5','0x0979','0x089F','0x08AB'];
    for(var i=0;i<runicArr.length;i++)
        {
        var runicColor = runicArr[i];
        var runicOne = Orion.FindTypeEx(runicGraphic,runicColor).filter(function(part)
            {
            var charges = +part.Properties().match(/Uses Remaining: (\d+)/)[1]
            return charges == 10;
            })[0];
        if(!runicOne)
            continue;
        var runicOneSerial = runicOne.Serial();
        var runicTwo = Orion.FindTypeEx(runicGraphic,runicColor).filter(function(part)
            {
            var charges = +part.Properties().match(/Uses Remaining: (\d+)/)[1]
            return  charges < 100 && part.Serial() != runicOneSerial;
            }).sort(function(a,b)
                {
                var chargesA = +a.Properties().match(/Uses Remaining: (\d+)/)[1];
                var chargesB = +b.Properties().match(/Uses Remaining: (\d+)/)[1];
                return chargesB - chargesA;
                })[0];
        if(runicOne && runicTwo)
            {
            Orion.UseObject(runicOne.Serial())
            Orion.WaitForTarget(2000);
            Orion.TargetObject(runicTwo.Serial());
            i--;
            Orion.Wait(1300);
            }
        }
	}

function VerifyOpenContainer(itemSerial)
    {
    while(!Orion.GumpExists('container', itemSerial))
        {
        Orion.UseObject(itemSerial);
        Orion.Wait(1300);
        }
    }
function DiscordPush(msg)
	{
	var bot = "https://discordapp.com/api/webhooks/"
        + '949444453188390982' //hook
        + "/"
        + 'zBJe--X6khd7MuFOomtx_JFaHUDDIOWXCO4cTK_vJIKa0rdO9MUNgAh6EYF7ZNr8GRTb'; //key
    var paramText = "content=" + msg;
	Orion.HttpPost(bot, paramText);
	}