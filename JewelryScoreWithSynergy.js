function CalculateScore()
    {
    //Orion.WaitForAddObject('myTarget');
    //var exampleString = Orion.FindObject('myTarget').Properties();
    var exampleString = "Bracelet\nWeight: 1 Stone\nMagery +20\nEvaluateIntelligence +20\nAntique\nMysticism +20\nResisting Spells +20\nFaster Casting 1\nFaster Cast Recovery 4\nLower Mana Cost 10%\nLower Reagent Cost 25%\nDurability 255 / 255\nMajor Artifact";
    Debug(exampleString + '\n')
    var parse = parseJewelryProperties(exampleString)
    var value = calculateTotalValueExclusiveSynergy(parse,modWeightsExampleArchetype,synergiesExampleArchetypeComplex)
    Orion.Print(value)
    }

var modWeightsExampleArchetype =
    { //weight for this archetype per point of a mod
    Magery: 5,
    MaceFighting: 1,
    Fencing: 1,
    Musicianship: 0,
    Swordsmanship: 4,
    AnimalTaming: 1,
    SpiritSpeak: 3,
    Tactics: 1,
    Wrestling: 5,
    AnimalLore: 0,
    Discordance: 0,
    Focus: 5,
    Parrying: 5,
    Stealth: 1,
    Meditation: 1,
    Anatomy: 2,
    Bushido: 2,
    EvaluateIntelligence: 5,
    Mysticism: 5,
    Necromancy: 3,
    Stealing: 0,
    Veterinary: 0,
    Archery: 3,
    Chivalry: 1,
    Healing: 1,
    Ninjitsu: 4,
    Peacemaking: 0,
    Throwing: 2,
    ResistingSpells: 10, //Resisting spells is higher because it is not considered for synergies/Everyone can use it
    ManaIncrease: 12,
    StaminaIncrease: 12,
    StrengthBonus: 7,
    DexterityBonus: 6,
    IntelligenceBonus: 6,
    ManaRegeneration: 20,
    EnhancePotions: 2.5,
    HitChanceIncrease: 4,
    DefenseChanceIncrease: 4.5,
    SwingSpeedIncrease: 7,
    DamageIncrease: 2,
    SpellDamageIncrease: 2,
    FasterCastRecovery: 25,
    FasterCasting: 60,
    LowerManaCost: 8,
    LowerReagentCost: 2.5,
    PhysicalResist: .1,
    FireResist: .1,
    ColdResist: .1,
    PoisonResist: .1,
    EnergyResist: .1,
    };

var skillGroups = 
    {
    One:
        [
        'Fencing',
        'MaceFighting',
        'Magery',
        'Musicianship',
        'Swordsmanship',
        ],
    Two:
        [
        'AnimalTaming',
        'Provocation',
        'SpiritSpeak',
        'Tactics',
        'Wrestling',
        ],
    Three:
        [
        'AnimalLore',
        'Discordance',
        'Focus',
        'Meditation',
        'Parrying',
        'Stealth',
        ],
    Four:
        [
        'Anatomy',
        'Bushido',
        'EvaluateIntelligence',
        'Mysticism',
        'Necromancy',
        'Stealing',
        'Veterinary',
        ],
    Five:
        [
        'Archery',
        'Chivalry',
        'Healing',
        'Ninjitsu',
        'Peacemaking',
        'ResistingSpells',
        'Throwing',
        ],
    }

// Caster archetype:
// 'Magery',
// 'SpiritSpeak',
// 'Wrestling',
// 'Focus',
// 'Meditation',
// 'Parrying',
// 'Anatomy',
// 'Bushido',
// 'EvaluateIntelligence',
// 'Mysticism',
// 'Necromancy',
// 'Ninjitsu',


var synergiesExampleArchetypeComplex =
    [
        {
        mods: ['Magery', 'EvaluateIntelligence'],
        bonus: 1.3, // 20% bonus when Magery and EvaluateIntelligence are combined
        },
        {
        mods: ['Magery', 'Mysticism'],
        bonus: 1.3, // 20% bonus when Magery and Mysticism are combined
        },
        {
        mods: ['Magery', 'Focus'],
        bonus: 1.3,
        },
        {
        mods: ['Magery', 'Wrestling'],
        bonus: 1.3,
        },
        {
        mods: ['Magery', 'Necromancy'],
        bonus: 1.2,
        },
        {
        mods: ['Magery', 'SpiritSpeak'],
        bonus: 1.2,
        },
        {
        mods: ['Magery', 'Ninjitsu'],
        bonus: 1.2,
        },
        {
        mods: ['Magery', 'Bushido'],
        bonus: 1.2,
        },
        {
        mods: ['Magery', 'Anatomy'],
        bonus: 1.1,
        },
        {
        mods: ['Magery', 'AnimalTaming'],
        bonus: 1.1,
        },
        {
        mods: ['Magery', 'AnimalLore'],
        bonus: 1.1,
        },
        {
        mods: ['Mysticism', 'Focus'],
        bonus: 1.3,
        },
        {
        mods: ['Mysticism', 'Wrestling'],
        bonus: 1.3,
        },
        {
        mods: ['Mysticism', 'Ninjitsu'],
        bonus: 1.2,
        },
        {
        mods: ['Magery', 'Mysticism', 'EvaluateIntelligence'],
        bonus: 1.3, // 50% bonus when Magery, Mysticism, and EvaluateIntelligence are combined
        },
        {
        mods: ['Magery', 'Mysticism', 'EvaluateIntelligence', 'Focus'],
        bonus: 1.8, // 80% bonus when Magery, Mysticism, and EvaluateIntelligence are combined
        },
        {
        mods: ['FasterCasting', 'FasterCastRecovery'],
        bonus: 1.1, // 10% bonus when FasterCasting and FasterCastRecovery are combined
        },
        {
        mods: ['FasterCasting', 'FasterCastRecovery'],
        bonus: 1.1, // 10% bonus when FasterCasting and FasterCastRecovery are combined
        },
        // ... add more synergies as needed
    ];

function parseJewelryProperties(jewelryString)
    {
    const lines = jewelryString.split("\n");
    const modsObject = {};
    lines.forEach(function (line)
        {
        const modMatch = line.match(/([a-zA-Z\s]+):?\s*\+?\s*([0-9]+)/);
        if(modMatch)
            {
            const modName = modMatch[1].replace(/\s/g, '');
            const modValue = parseInt(modMatch[2]);
            modsObject[modName] = modValue;
            }
        });

    return modsObject;
    }

function hasSynergy(mods, synergyMods) {
    return synergyMods.every(function (mod) {
        return mods.hasOwnProperty(mod);
    });
}


function calculateTotalValue(mods, modWeights, synergies) {
    var totalValue = 0;
    
    // Calculate the individual mod values
    for (var mod in mods) {
        if (modWeights.hasOwnProperty(mod)) {
            var modValue = mods[mod] * modWeights[mod];
            totalValue += modValue;
            Debug('Mod: ' + mod + ', Value: ' + modValue + ', Total Value: ' + totalValue);
        }
    }

    // Calculate the synergistic values
    for (var i = 0; i < synergies.length; i++) {
        var synergy = synergies[i];

        if (hasSynergy(mods, synergy.mods)) {
            var combinedValue = synergy.mods.reduce(function (sum, mod) {
                return sum + mods[mod] * modWeights[mod];
            }, 0);

            var synergyBonus = synergy.bonus;
            var synergyValue = combinedValue * synergyBonus - combinedValue;
            totalValue += synergyValue;

            Debug('Synergy: ' + synergy.mods.join(', ') + ', Synergy Value: ' + synergyValue + ', Total Value: ' + totalValue);
        }
    }

    return totalValue;
}

function calculateTotalValueExclusiveSynergy(mods, modWeights, synergies) {
    var totalValue = 0;
    var appliedMods = {};

    // Sort synergies by the number of mods in descending order
    synergies.sort(function (a, b) {
        return b.mods.length - a.mods.length;
    });
    var modNum = 1;
    // Calculate the individual mod values
    for (var mod in mods) {
        if (modWeights.hasOwnProperty(mod)) {
            var modValue = mods[mod] * modWeights[mod];
            totalValue += modValue;
            Debug('Mod ' + modNum++ + ': ' + mod + ' ' + mods[mod] + ', Weight: ' + modWeights[mod] + ', Value: ' + modValue + ', Total Value: ' + totalValue);
        }
    }

    // Calculate the synergistic values
    for (var i = 0; i < synergies.length; i++) {
        var synergy = synergies[i];

        if (hasSynergy(mods, synergy.mods) && !hasSynergy(appliedMods, synergy.mods)) {
            var combinedValue = synergy.mods.reduce(function (sum, mod) {
                return sum + mods[mod] * modWeights[mod];
            }, 0);

            var synergyBonus = synergy.bonus;
            var synergyValue = combinedValue * synergyBonus - combinedValue;
            totalValue += synergyValue;

            Debug('Synergy: [' + synergy.mods.join(', ') + '], Modifier: ' + synergyBonus + ', Synergy Value: ' + synergyValue + ', Total Value: ' + totalValue);

            // Mark the mods in this synergy as applied
            for (var j = 0; j < synergy.mods.length; j++) {
                appliedMods[synergy.mods[j]] = true;
            }
        }
    }

    return totalValue;
}

function Debug(msg)
    {
    if(!TextWindow.IsOpened())
        TextWindow.Open();
    TextWindow.Print(msg);
    }

var modValueRanges =
    { //[minimum,cap,overcap] OR [minimum,cap] OR [one possible value]
    Magery: [5,15,20],
    MaceFighting: [5,15,20],
    Fencing: [5,15,20],
    Musicianship: [5,15,20],
    Swordsmanship: [5,15,20],
    AnimalTaming: [5,15,20],
    SpiritSpeak: [5,15,20],
    Tactics: [5,15,20],
    Wrestling: [5,15,20],
    AnimalLore: [5,15,20],
    Discordance: [5,15,20],
    Focus: [5,15,20],
    Parrying: [5,15,20],
    Stealth: [5,15,20],
    Anatomy: [5,15,20],
    Bushido: [5,15,20],
    EvaluateIntelligence: [5,15,20],
    Mysticism: [5,15,20],
    Necromancy: [5,15,20],
    Archery: [5,15,20],
    Chivalry: [5,15,20],
    Healing: [5,15,20],
    Ninjitsu: [5,15,20],
    ResistingSpells: [5,15,20],
    ManaIncrease: [1,5],
    StaminaIncrease: [1,5],
    StrengthBonus: [1,8,10],
    DexterityBonus: [1,8,10],
    IntelligenceBonus: [1,8,10],
    ManaRegeneration: [1,3,44],
    EnhancePotions: [15,25,35],
    HitChanceIncrease: [5,15,20],
    DefenseChanceIncrease: [5,15,20],
    SwingSpeedIncrease: [5,10],
    DamageIncrease: [15,25,35],
    SpellDamageIncrease: [8,15,18],
    FasterCastRecovery: [1,3,4],
    FasterCasting: [1],
    LowerManaCost: [1,8,10],
    LowerReagentCost: [10,20,25],
    PhysicalResist: [5,15,20],
    FireResist: [5,15,20],
    ColdResist: [5,15,20],
    PoisonResist: [5,15,20],
    EnergyResist: [5,15,20],
    };
    
