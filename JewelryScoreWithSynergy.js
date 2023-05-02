
function getValue()
    {
    var perfect = 1.9;
    var amazing = 1.6;
    var great = 1.3;
    var good = 1.2
    var meh = 1.0
    //Orion.WaitForAddObject('myTarget');
    //var exampleString = Orion.FindObject('myTarget').Properties();
    const exampleString = "Bracelet\nWeight: 1 Stone\nMagery +20\nSwordsmanship +20\nAntique\nMysticism +20\nResisting Spells +20\nFaster Casting 1\nFaster Cast Recovery 4\nLower Mana Cost 10%\nLower Reagent Cost 25%\nDurability 255 / 255\nMajor Artifact";
    //const exampleString = "Bracelet\nWeight: 1 Stone\nMagery +20\nMysticism +20\nSwordsmanship +20\nResisting Spells +20\nDurability 255 / 255\nMajor Artifact";
    const modWeights =
        {
        Magery: 4,
        MaceFighting: 1,
        Fencing: 1,
        Musicianship: 0,
        Swordsmanship: 3,
        AnimalTaming: 0,
        SpiritSpeak: 2,
        Tactics: 1,
        Wrestling: 3,
        AnimalLore: 0,
        Discordance: 0,
        Focus: 4,
        Parrying: 4,
        Stealth: 1,
        Meditation: 1,
        Anatomy: 2,
        Bushido: 2,
        EvaluateIntelligence: 4,
        Mysticism: 4,
        Necromancy: 2,
        Archery: 1,
        Chivalry: 1,
        Healing: 1,
        Ninjitsu: 2,
        ResistingSpells: 4,
        ManaIncrease: 3,
        StaminaIncrease: 3,
        StrengthBonus: 4,
        DexterityBonus: 3,
        IntelligenceBonus: 4,
        ManaRegeneration: 12,
        EnhancePotions: 2,
        HitChanceIncrease: 2,
        DefenseChanceIncrease: 2,
        SwingSpeedIncrease: 5,
        DamageIncrease: 1.5,
        SpellDamageIncrease: 1.3,
        FasterCastRecovery: 14,
        FasterCasting: 38,
        LowerManaCost: 4,
        LowerReagentCost: 1.6,
        PhysicalResist: .2,
        FireResist: .2,
        ColdResist: .2,
        PoisonResist: .2,
        EnergyResist: .2,
        };

    const modMaxValues =
        {
        Magery: 20,
        MaceFighting: 20,
        Fencing: 20,
        Musicianship: 20,
        Swordsmanship: 20,
        AnimalTaming: 20,
        SpiritSpeak: 20,
        Tactics: 20,
        Wrestling: 20,
        AnimalLore: 20,
        Discordance: 20,
        Focus: 20,
        Parrying: 20,
        Stealth: 20,
        Anatomy: 20,
        Bushido: 20,
        EvaluateIntelligence: 20,
        Mysticism: 20,
        Necromancy: 20,
        Archery: 20,
        Chivalry: 20,
        Healing: 20,
        Ninjitsu: 20,
        ResistingSpells: 20,
        ManaIncrease: 5,
        StaminaIncrease: 5,
        StrengthBonus: 10,
        DexterityBonus: 10,
        IntelligenceBonus: 10,
        ManaRegeneration: 4,
        EnhancePotions: 35,
        HitChanceIncrease: 20,
        DefenseChanceIncrease: 20,
        SwingSpeedIncrease: 10,
        DamageIncrease: 35,
        SpellDamageIncrease: 18,
        FasterCastRecovery: 4,
        FasterCasting: 1,
        LowerManaCost: 10,
        LowerReagentCost: 25,
        PhysicalResist: 20,
        FireResist: 20,
        ColdResist: 20,
        PoisonResist: 20,
        EnergyResist: 20,
        };
      
    //const synergyMatrix = {}
    const synergyMatrix =
        {
        Magery:
            {
            Swordsmanship: 2,
            Mysticism: 2,
            ResistingSpells: 2,
            },
        Mysticism:
            {
            Swordsmanship: 2,
            ResistingSpells: 2,
            Magery: 2,
            },
        Swordsmanship:
            {
            Mysticism: 2,
            ResistingSpells: 2,
            Magery: 2,
            },
        ResistingSpells:
            {
            Mysticism: 2,
            Swordsmanship: 2,
            Magery: 2,
            },
        // Anatomy:
        //     {

        //     },
        // Bushido:
        //     {

        //     },
        // EvaluateIntelligence:
        //     {
        //     },
        // Mysticism:
        //     {
        //     },
        // Necromancy:
        //     {

        //     },
        // Archery:
        //     {
                
        //     },
        // Chivalry:
        //     {
                
        //     },
        // Healing:
        //     {
                
        //     },
        // Ninjitsu:
        //     {
                
        //     },
        // ResistingSpells:
        //     {
                
        //     },
        // ManaIncrease:
        //     {
                
        //     },
        // StaminaIncrease:
        //     {
                
        //     },
        // StrengthBonus:
        //     {
                
        //     },
        // DexterityBonus:
        //     {
                
        //     },
        // IntelligenceBonus:
        //     {
                
        //     },
        // ManaRegeneration:
        //     {
                
        //     },
        // EnhancePotions:
        //     {
                
        //     },
        // HitChanceIncrease:
        //     {
                
        //     },
        // DefenseChanceIncrease:
        //     {
                
        //     },
        // SwingSpeedIncrease:
        //     {
                
        //     },
        // DamageIncrease:
        //     {
                
        //     },
        // SpellDamageIncrease:
        //     {
                
        //     },
        // FasterCastRecovery:
        //     {
                
        //     },
        // FasterCasting:
        //     {
                
        //     },
        // LowerManaCost:
        //     {
                
        //     },
        // LowerReagentCost:
        //     {
                
        //     },
        // PhysicalResist:
        //     {
                
        //     },
        // FireResist:
        //     {
                
        //     },
        // ColdResist:
        //     {
                
        //     },
        // PoisonResist:
        //     {
                
        //     },
        // EnergyResist:
        //     {
                
        //     },
        // Add more skills and their respective synergy values
        };
      
    const modsObject = parseJewelryProperties(exampleString);
    const maxValue = 100;
    const maxPossibleWeightedValue = Object.keys(modMaxValues).filter(function(mod)
        {
        return modsObject[mod];
        }).reduce(function (total, mod)
            {
            return total + (modMaxValues[mod] * (modWeights[mod] || 1));
            }, 0);
        const totalValueWithSynergy = calculateTotalWeightedValueWithSynergy(modsObject, modWeights, synergyMatrix);
    //const maxPossibleWeightedValue = 474
    const addSynergyWeight = totalValueWithSynergy[1];
    const normalizedValueWithSynergy = (totalValueWithSynergy[0] / (maxPossibleWeightedValue + addSynergyWeight)) * maxValue;
    Debug('(' + totalValueWithSynergy[0] + '/' + (maxPossibleWeightedValue + addSynergyWeight) + ')*' + maxValue + '=' + normalizedValueWithSynergy)
    }


function parseJewelryProperties(jewelryString)
    {
    const lines = jewelryString.split("\n");
    const modsObject = {};

    lines.forEach(function (line)
        {
        const modMatch = line.match(/([a-zA-Z\s]+):?\s*\+?\s*([0-9]+)/);
        if (modMatch) {
        const modName = modMatch[1].replace(/\s/g, '');
        const modValue = parseInt(modMatch[2]);
        modsObject[modName] = modValue;
        }
    });

  return modsObject;
}

function getSynergyFactor(synergyMatrix, skill1, skill2)
    {
    Debug(skill1 + ':' + skill2)
    if (synergyMatrix[skill1] && synergyMatrix[skill1][skill2] !== undefined) 
        return synergyMatrix[skill1][skill2];
    
    if (synergyMatrix[skill2] && synergyMatrix[skill2][skill1] !== undefined)
        return synergyMatrix[skill2][skill1];

    return 0;
    }

function Debug(msg)
    {
    if(!TextWindow.IsOpened())
        TextWindow.Open();
    TextWindow.Print(Orion.Time() + ': ' + msg);
    }

function calculateTotalWeightedValueWithSynergy(modsObject, modWeights, synergyMatrix)
    {
    var totalValue = 0;
    var skillMods = [];

    for (var mod in modsObject)
        {
        var modValue = modsObject[mod];
        var weight = modWeights[mod] || 1;
        var addValue = modValue * weight;
        if(synergyMatrix[mod])
            {
            skillMods.push({ mod: mod, modValue: modValue, weight: weight });
            }
        else if(modWeights[mod])
            {
            totalValue += addValue;
            Debug('Mod Value: ' + mod + ':' + addValue)
            }
        }
    Debug(JSON.stringify(modsObject))
    // Adjust for skill synergy
    var totalSynergy = 0;
    for (var i = 0; i < skillMods.length; i++)
        {
        const mod = skillMods[i].mod;
        const modValue = skillMods[i].modValue;
        const weight = skillMods[i].weight;
        var maxSynergyFactor = 0;

        for (var j = 0; j < skillMods.length; j++)
            {
            if (i !== j)
                {
                const otherMod = skillMods[j].mod;
                const synergyFactor = getSynergyFactor(synergyMatrix, mod, otherMod);
                Debug(synergyFactor)
                maxSynergyFactor = Math.max(maxSynergyFactor, synergyFactor);
                }
            }
        //Orion.Print('ModValue: ' + modValue + '\nWeight: ' +  weight + '\nmaxSynergyFactor:' + maxSynergyFactor)
        var totalAdd = modValue * weight * maxSynergyFactor
        totalSynergy += (modValue * weight * maxSynergyFactor) - (modValue * weight)
        Debug('Mod: ' + mod + '\nModValue: ' + modValue + '\nWeight: ' +  weight + '\nmaxSynergyFactor:' + maxSynergyFactor + '\nTotal Add Weight: ' + totalAdd)
        totalValue += totalAdd;
        }

    return [totalValue,totalSynergy];
    }
