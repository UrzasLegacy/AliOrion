function initImbueFavorites(_)
    {
    const imbueFavorites =
        {
        'Oni Shield':   [
                            ['Durability', '90%', [Button.IncrementMax, Button.DecrementTen]],
                            ['Defense Chance Increase', '13%', [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne]],
                        ],
        'Oni Katana':   [
                            ['Hit Chance Increase', '13%', [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne]],
                            ['Hit Lower Defense', '44%', [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne, Button.DecrementOne]],
                            ['Damage Increase', '1%'],
                            ['Hit Stamina Leech', '44%', [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne, Button.DecrementOne]],
                            ['Luck', '90', [Button.IncrementMax, Button.DecrementTen]],
                        ],
        'Training Katana':   [
                            ['Hit Chance Increase', '13%', [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne]],
                            ['Hit Lower Defense', '44%', [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne, Button.DecrementOne]],
                            ['Damage Increase', '1%'],
                            ['Swing Speed Increase', '20%', [Button.IncrementOne, Button.IncrementOne, Button.IncrementOne]],
                        ],
        'TrainingSwordsJewels':	[
                            ['Tactics', '+13', [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne]],
                            ['Swordsmanship', '+13', [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne]],
                            ['Hit Chance Increase', '13%', [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne]],
                            ['Dexterity Bonus', '7', [Button.IncrementMax, Button.DecrementOne]],
                        ],
        'TrainingArcherJewels':	[
                            ['Tactics', '+13', [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne]],
                            ['Archery', '+13', [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne]],
                            ['Hit Chance Increase', '13%', [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne]],
                            ['Dexterity Bonus', '7', [Button.IncrementMax, Button.DecrementOne]],
                        ],
        'HouserJewels':	[
                            ['Magery', '+13', [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne]],
                            ['Ninjitsu', '+13', [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne]],
                            ['Stealth', '+13', [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne]],
                            ['Strength Bonus', '7', [Button.IncrementMax, Button.DecrementOne]],
                        ],
        'PhysResist-2':	[
                            ['Physical Resist', false, [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne]],
                        ],
        'FireResist-2':	[
                            ['Fire Resist', false, [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne]],
                        ],
        'ColdResist-2':	[
                            ['Cold Resist', false, [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne]],
                        ],
        'PoisResist-2':	[
                            ['Poison Resist', false, [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne]],
                        ],
        'EnerResist-2':	[
                            ['Energy Resist', false, [Button.IncrementMax, Button.DecrementOne, Button.DecrementOne]],
                        ],
        'Daisho UW':   [
                            ['Hit Harm', '50%', [Button.IncrementMax]],
                            ['Hit Stamina Leech', '50%', [Button.IncrementMax]],
                            ['Hit Mana Leech', '68%', [Button.IncrementMax]],
                            ['Hit Life Leech', '68%', [Button.IncrementMax]],
                            ['Hit Lower Defense', '50%', [Button.IncrementMax]],
                        ],
        }
    return imbueFavorites;
    }

var gumpSerialIndex = 1;
var imbueGumpButtons = //xsize ysize CallBackID Text FunctionName FunctionArgs
    [
        [ [100, 30, gumpSerialIndex++, 'Oni Katana', 'ImbueItemsByFavorite', ['Oni Katana']], [100, 30, gumpSerialIndex++, 'Oni Shield', 'ImbueItemsByFavorite', ['Oni Shield']] ],
        [[100, 30, gumpSerialIndex++, 'Training Katana', 'ImbueItemsByFavorite', ['Training Katana']], [100, 30, gumpSerialIndex++, 'Swords Jewels', 'ImbueItemsByFavorite', ['TrainingSwordsJewels']], [100, 30, gumpSerialIndex++, 'Archery Jewels', 'ImbueItemsByFavorite', ['TrainingArcherJewels']]],
        [ [100,30, gumpSerialIndex++, 'PhysResist-2', 'ImbueItemsByFavorite', ['PhysResist-2']], [100,30, gumpSerialIndex++, 'FireResist-2', 'ImbueItemsByFavorite', ['FireResist-2']], [100,30, gumpSerialIndex++, 'ColdResist-2', 'ImbueItemsByFavorite', ['ColdResist-2']] ],
        [ [100,30, gumpSerialIndex++, 'PoisResist-2', 'ImbueItemsByFavorite', ['PoisResist-2']], [100,30, gumpSerialIndex++, 'EnerResist-2', 'ImbueItemsByFavorite', ['EnerResist-2']] ],
        [],
        [[100,30, gumpSerialIndex++, 'HouserJewels', 'ImbueItemsByFavorite', ['HouserJewels']]],
        [[100,30, gumpSerialIndex++, 'Daisho UW', 'ImbueItemsByFavorite', ['Daisho UW']]],
    ]

function ItemImbueFavoriteExample()
    {
    ImbueItemsByFavorite('Daisho UW');
    }