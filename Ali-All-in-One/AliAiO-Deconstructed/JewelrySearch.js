// Created by Ali

function JewelryModSearch() 
	{
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/AliJewelrySavedSearches.json';
    var tmpFile = Orion.NewFile();
    tmpFile.Open(tmpFilePath);
    var savedSearches = [];
    var fileString = tmpFile.ReadAll(); 
    if(fileString)
        savedSearches = JSON.parse(fileString);
    var skills =
        [
        'Anatomy','AnimalLore','AnimalTaming','Archery','Bushido','Chivalry','Discordance','EvaluateIntelligence','Fencing','Focus','Healing','MaceFighting',
        'Magery','Musicianship','Mysticism','Necromancy','Ninjitsu','Parrying','ResistingSpells','SpiritSpeak','Stealth','Swordsmanship','Tactics','Throwing','Wrestling',
        'Clear'
        ]
    var mods = 
        [
        'StrengthBonus','DexterityBonus','IntelligenceBonus','ManaIncrease','StaminaIncrease',
        'ManaRegeneration','EnhancePotions','HitChanceIncrease','DefenseChanceIncrease',
        'FasterCastRecovery','FasterCasting','LowerManaCost','SpellDamageIncrease','LowerReagentCost','SwingSpeedIncrease','DamageIncrease',
        'Clear'
        ]

    var title = "Ali Jewelry Search"
    //var startTime = Orion.Now();
    var gump = Orion.CreateCustomGump(10420); 
	var rowStart = 40;
	var columnStart = 25;
    var height = 650;
    var width = 285;

    gump.Clear();
    gump.SetCallback('JewelryModSearchCallback');
    gump.AddResizepic(0, 0, 'a3c', width, height); //background 0xDAC 0x254e 0x2560 9bf5 
    gump.AddColoredPolygone(10, 12, width - 20, 15, '#FF660066', 0, 1, 0, 0, 0); //title background
    gump.AddColoredPolygone(10, 12, width - 20, 15, '#FF666600', 1, 2, 0, 0, 0); //title border
    gump.AddColoredPolygone(10, 12, width - 20, height - 24, '#FF666600', 1, 2, 0, 0, 0); //gump border
    gump.AddHtmlGump(0,0,9,width,height,'a3c',0,0) //these next 3 lines are a workaround for positioning html text
    gump.Select('htmlgump');
    gump.AddHtmlText('doesnt matter what', 'i put here', width, height, 554, "<center>" + title + "</center>"); //x,y arguments are bugged and don't do anything
    gump.Select('gump');
    
    //Custom Assets
	//gump.AddButton(100, width - 95, height - 35,'0x2EE0','0x2EE0','0x2EE1','0x0487'); //accept
	//gump.AddButton(101, 21, height - 35,'0x2EE3','0x2EE3','0x2EE4','0x0487'); //clear
    var xPos = columnStart;
    var yPos = rowStart;
    
    var heightAdjust;
    var value;
    var shared;

    heightAdjust = 25;

    for(var i=0;i<8;i++)
        {
        var responseCode = i + 1;
        shared = 'Skill ' + responseCode;
        value = Shared.GetVar(shared,undefined);
        gump.AddText(xPos,yPos,554,shared);
        gump.AddComboBox(responseCode, xPos + 50, yPos, '0x0BB8', 0, '0x0BB8', 150, -3,skills.length);
        for(var j=0;j<skills.length;j++)
            gump.AddComboBoxText(skills[j],0,value == skills[j] ? 1 : 0,115,'left');
        gump.AddResizepic(xPos + 205, yPos , '0x0BB8', 28, 19);
        gump.AddTextEntry(responseCode + 500, xPos + 205 + 3, yPos, 0, Shared.GetVar(shared + ' Value',''), 28, 20);
        gump.AddTooltip('Skill Minimum Value');
        yPos += heightAdjust;
        }
    
    gump.AddText(xPos + 35,yPos,554,'Minimum Total Skill Amount');
    gump.AddResizepic(xPos + 205, yPos , '0x0BB8', 28, 19);
    gump.AddTextEntry(2000, xPos + 205 + 3, yPos, 0, Shared.GetVar('Skill Amount',''), 28, 20);
    gump.AddTooltip('The sum of any combination of the above skills must be at least this amount to pass');
    yPos += heightAdjust * 2;

    for(var i=0;i<8;i++)
        {
        var responseCode = i + 101;
        shared = 'Mod ' + (responseCode - 100);
        value = Shared.GetVar(shared,undefined);
        gump.AddText(xPos,yPos,554,shared);
        gump.AddComboBox(responseCode, xPos + 50, yPos, '0x0BB8', 0, '0x0BB8', 150, -3,mods.length);
        for(var j=0;j<mods.length;j++)
            gump.AddComboBoxText(mods[j],0,value == mods[j] ? 1 : 0,150,'left');
        gump.AddResizepic(xPos + 205, yPos , '0x0BB8', 28, 19);
        gump.AddTextEntry(responseCode + 500, xPos + 205 + 3, yPos, 0, Shared.GetVar(shared + ' Value',''), 28, 20);
        gump.AddTooltip('Mod Minimum Value');
        yPos += heightAdjust;
        }
    yPos += heightAdjust;

    gump.AddText(30,yPos - 20,554,'Saved Searches');
    shared = Shared.GetVar('Save Name',undefined);
    gump.AddComboBox(20000, xPos, yPos, '0x0BB8', 0, '0x0BB8', 160, -3,savedSearches.length);
    for(var j=0;j<savedSearches.length;j++)
        gump.AddComboBoxText(savedSearches[j][0],0,shared == savedSearches[j][0] ? 1 : 0,160,'left');
    gump.AddButton(999, xPos + 170, yPos - 1, '40028', '40028', '40018', '0x0000');
    gump.AddTooltip('Load Saved Criteria');
    gump.AddText(211,yPos - 1,554,'Load');
    gump.AddTooltip('Load Saved Criteria');

    yPos += heightAdjust;
    gump.AddResizepic(xPos, yPos , '0x0BB8', 160, 19);
    gump.AddTextEntry(20001, xPos + 3, yPos, 0, '', 160, 20);
    gump.AddTooltip('Enter Saved Search Name');
    gump.AddButton(998, xPos + 170, yPos - 1, '40028', '40028', '40018', '0x0000');
    gump.AddTooltip('Save Current Criteria');
    gump.AddText(211,yPos - 1,554,'Save');
    gump.AddTooltip('Save Current Criteria. Enter name to the left');

    yPos += heightAdjust;
    gump.AddButton(1000, xPos + 170, yPos + 20, '40028', '40028', '40018', '0x0000');
    gump.AddTooltip('Highlight items that meet the criteria above');
    gump.AddText(xPos + 170 + 11,yPos + 20,554,'Search');
    gump.AddTooltip('Highlight items that meet the criteria above');
    gump.AddButton(1001, xPos + 85, yPos + 20, '40028', '40028', '40018', '0x0000');
    gump.AddTooltip('Clear the search menu');
    gump.AddText(xPos + 85 + 15,yPos + 20,554,'Clear');
    gump.AddTooltip('Clear the search menu');
    gump.AddButton(997, xPos, yPos + 20, '40028', '40028', '40018', '0x0000');
    gump.AddTooltip('Delete currently selected saved search');
    gump.AddText(xPos + 11,yPos + 20,554,'Delete');
    gump.AddTooltip('Delete currently selected saved search');

    gump.Update();
    
    //Orion.Print('interval: ' + (Orion.Now() - startTime))
	}

function JewelryModSearchCallback(_) 
	{
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/AliJewelrySavedSearches.json';
    var skills =
        [
        'Anatomy','AnimalLore','AnimalTaming','Archery','Bushido','Chivalry','Discordance','EvaluateIntelligence','Fencing','Focus','Healing','MaceFighting',
        'Magery','Musicianship','Mysticism','Necromancy','Ninjitsu','Parrying','ResistingSpells','SpiritSpeak','Stealth','Swordsmanship','Tactics','Throwing','Wrestling',
        'Clear',
        ]
    var mods = 
        [
        'StrengthBonus','DexterityBonus','IntelligenceBonus','ManaIncrease','StaminaIncrease',
        'ManaRegeneration','EnhancePotions','HitChanceIncrease','DefenseChanceIncrease',
        'FasterCastRecovery','FasterCasting','LowerManaCost','SpellDamageIncrease','LowerReagentCost','SwingSpeedIncrease','DamageIncrease',
        'Clear',
        ]
    var code = CustomGumpResponse.ReturnCode();
    //Orion.Print('Code: ' + code)
    if(code == 0)
        return;
    else if(code == 1000)
        {
        var skillObj = {};
        var modObj = {};
        var skillCheck = false;
        for(var i=0;i<8;i++)
            {
            var responseCode = i + 1;
            var combo = CustomGumpResponse.ComboBox(responseCode);
            var textEntry = CustomGumpResponse.Text(responseCode+500) || '1';
            if(combo > -1)
                {
                if(skills[combo] == 'Clear')
                    {
                    Shared.RemoveVar('Skill ' + responseCode);
                    Shared.RemoveVar('Skill ' + responseCode + ' Value');
                    continue;
                    }
                skillCheck = true;
                Shared.AddVar('Skill ' + responseCode,skills[combo]);
                Shared.AddVar('Skill ' + responseCode + ' Value',textEntry);
                skillObj[skills[combo]] = +textEntry;
                }
            }
        for(var i=0;i<8;i++)
            {
            var responseCode = i + 101;
            var combo = CustomGumpResponse.ComboBox(responseCode);
            //if(i==0) Orion.Print('combo: ' + combo)
            var textEntry = CustomGumpResponse.Text(responseCode+500) || '1';
            if(combo > -1)
                {
                if(mods[combo] == 'Clear')
                    {
                    Shared.RemoveVar('Mod ' + (i + 1));
                    Shared.RemoveVar('Mod ' + (i + 1) + ' Value');
                    continue;
                    }
                Shared.AddVar('Mod ' + (i + 1),mods[combo]);
                Shared.AddVar('Mod ' + (i + 1) + ' Value',textEntry);
                modObj[mods[combo]] = +textEntry;
                }
            }
        var skillAmount = CustomGumpResponse.Text(2000) || (skillCheck ? '1' : 0);
        Shared.AddVar('Skill Amount', skillAmount)
        SearchJewelry(+skillAmount,skillObj,modObj)
        //Orion.Print(JSON.stringify(skillObj) + '\n' + JSON.stringify(modObj))
        }
    else if(code == 1001)
        {
        Shared.ClearVars();
        }
    else if(code == 999) //Apply saved search
        {
        var tmpFile = Orion.NewFile();
        tmpFile.Open(tmpFilePath);
        var savedSearches = [];
        var fileString = tmpFile.ReadAll(); 
        if(fileString)
            savedSearches = JSON.parse(fileString);
        
        Shared.ClearVars();
        var combo = CustomGumpResponse.ComboBox(20000);
        var savedSearch = savedSearches[combo];
        if(!savedSearch)
            return Orion.CharPrint(self,1159,'Couldn\'t find saved search')

        var searchName = savedSearch[0];
        var skillAmount = savedSearch[1];
        var skillObj = savedSearch[2];
        var modObj = savedSearch[3];
        var i = 1;
        for(prop in skillObj)
            {
            if(i > 9)
                break;
            Shared.AddVar('Skill ' + i,prop);
            Shared.AddVar('Skill ' + i + ' Value',skillObj[prop]);
            i++;
            }
        i = 1;
        for(prop in modObj)
            {
            if(i > 9)
                break;
            Shared.AddVar('Mod ' + i,prop);
            Shared.AddVar('Mod ' + i + ' Value',modObj[prop]);
            i++;
            }
        Shared.AddVar('Skill Amount', skillAmount);
        Shared.AddVar('Save Name',searchName);
        }
    else if(code == 998) //Save Search
        {
        var tmpFile = Orion.NewFile();
        tmpFile.Open(tmpFilePath);
        var savedSearches = [];
        var fileString = tmpFile.ReadAll(); 
        if(fileString)
            savedSearches = JSON.parse(fileString);
        var skillObj = {};
        var modObj = {};
        var skillCheck = false;
        for(var i=0;i<8;i++)
            {
            var responseCode = i + 1;
            var combo = CustomGumpResponse.ComboBox(responseCode);
            var textEntry = CustomGumpResponse.Text(responseCode+500) || '1';
            if(combo > -1)
                {
                if(skills[combo] == 'Clear')
                    {
                    Shared.RemoveVar('Skill ' + responseCode);
                    Shared.RemoveVar('Skill ' + responseCode + ' Value');
                    continue;
                    }
                Shared.AddVar('Skill ' + responseCode,skills[combo]);
                Shared.AddVar('Skill ' + responseCode + ' Value',textEntry);
                skillObj[skills[combo]] = +textEntry;
                }
            }
        for(var i=0;i<8;i++)
            {
            var responseCode = i + 101;
            var combo = CustomGumpResponse.ComboBox(responseCode);
            var textEntry = CustomGumpResponse.Text(responseCode+500) || '1';
            if(combo > -1)
                {
                if(mods[combo] == 'Clear')
                    {
                    Shared.RemoveVar('Mod ' + (i + 1));
                    Shared.RemoveVar('Mod ' + (i + 1) + ' Value');
                    continue;
                    }
                Shared.AddVar('Mod ' + (i + 1),mods[combo]);
                Shared.AddVar('Mod ' + (i + 1) + ' Value',textEntry);
                modObj[mods[combo]] = +textEntry;
                }
            }
        var skillAmount = CustomGumpResponse.Text(2000) || (skillCheck ? '1' : 0);
        var saveName = CustomGumpResponse.Text(20001)
        if(!saveName)
            return Orion.CharPrint(self,1159,'You must choose a name for the save');
        var overwrite = false;
        for(var i=0;i<savedSearches.length;i++)
            {
            var savedSearch = savedSearches[i];
            if(saveName == savedSearch[0])
                {
                savedSearch[1] = skillAmount;
                savedSearch[2] = skillObj;
                savedSearch[3] = modObj;
                overwrite = true;
                break;
                }
            }
        if(!overwrite)
            {
            savedSearches.push(
                [
                    saveName,
                    skillAmount,
                    skillObj,
                    modObj
                ])
            }
        Shared.AddVar('Skill Amount', skillAmount)
        tmpFile.Remove();
        tmpFile.Open(tmpFilePath);
        Orion.Print("Recording To File: " + tmpFilePath); 
        tmpFile.Write(JSON.stringify(savedSearches));
        tmpFile.Close();
        }
    else if(code == 997) //Delete Saved Search
        {
        var tmpFile = Orion.NewFile();
        tmpFile.Open(tmpFilePath);
        var savedSearches = [];
        var fileString = tmpFile.ReadAll(); 
        if(fileString)
            savedSearches = JSON.parse(fileString);
        tmpFile.Close()
        
        var combo = CustomGumpResponse.ComboBox(20000);
        var savedSearch = savedSearches[combo];
        if(!savedSearch)
            return Orion.CharPrint(self,1159,'Couldn\'t find saved search')

        var outArr = savedSearches.filter(function(item)
            {
            return item[0] !== savedSearch[0];
            })
        tmpFile.Remove();
        tmpFile.Open(tmpFilePath);
        Orion.Print("Recording To File: " + tmpFilePath); 
        tmpFile.Write(JSON.stringify(outArr));
        tmpFile.Close();
        }
    //Orion.Print(gumpButtons);
    //Shared.AddArray('gumpValues',gumpButtons);
    Orion.Wait(50);
    JewelryModSearch();
	}

function SearchJewelry(skillsThreshold,skillsSearchObject,modsSearchObject) //30,{'Magery':10,'EvaluatingIntelligence':10,'Mysticism':10},{'HitChanceIncrease':15}
    {
    var groundContainers = Orion.FindTypeEx(any,any,ground,'item', 4, '', true).filter(function(item)
        {
        return item.Properties().indexOf('Contents: ') > -1 && Orion.GumpExists('container', item.Serial());
        });
    var packContainers = Orion.FindTypeEx(any, any, self, 'item', 'finddistance', '', true).filter(function(item)
        {
        return item.Properties().indexOf('Contents: ') > -1 && Orion.GumpExists('container', item.Serial());
        });
    var npcContainers = Orion.FindTypeEx(any,any,ground,'mobile',4,'yellow').filter(function(npc)
        {
        return Orion.ObjAtLayer('backpack',npc.Serial())
        }).map(function(npc)
            {
            var npcPack = Orion.ObjAtLayer('backpack',npc.Serial());
            return npcPack;
            });
    var containers = groundContainers.concat(packContainers).concat(npcContainers);
    var items = [];
    for(var i=0;i<containers.length;i++)
        {
        var container = containers[i];
        if(!container)
            Orion.Print(container);
        Orion.FindType('0x1F06|0x1086|0x108A|0x1F09',any,container.Serial(),'item', 'finddistance', '',true).forEach(function(item)
            {
            items.push(item);
            });
        }
    Orion.FindType('0x1F06|0x1086|0x108A|0x1F09',any,ground,'item', 22).forEach(function(item)
        {
        items.push(item);
        });
    var pass = items.filter(function(item)
        {
        var itemObj = Orion.FindObject(item);
        var itemProps = itemObj.Properties();
        var itemPropsObject = parseJewelryProperties(itemProps);
        //Orion.Print(JSON.stringify(itemPropsObject))
        var bool = AliCompareJewels(itemPropsObject,skillsThreshold,skillsSearchObject,modsSearchObject);
        if(!bool)
            Orion.TestItemColor(item,itemObj.Color());
        return bool;
        })
    Orion.Print('Items Found: ' + pass.length);
    pass.forEach(function(keeper)
        {
        Orion.TestItemColor(keeper, 1152);
        });
    }

function AliCompareJewels(itemToCompare, skillsThreshold,skillsSearchObject,modsSearchObject)//{'Magery':10,'EvaluatingIntelligence':10,'Mysticism':10},{'HitChanceIncrease':15}
    {
    var skillAmount = 0;
    for(var prop in skillsSearchObject)
        {
        if(itemToCompare.hasOwnProperty(prop))
            {
            if(itemToCompare[prop] < skillsSearchObject[prop])
                return false;
            else
                skillAmount += itemToCompare[prop];
            }
        }
    if(skillAmount < skillsThreshold)
        return false;
    for (var prop in modsSearchObject)
        {
        if(!itemToCompare.hasOwnProperty(prop) || itemToCompare[prop] < modsSearchObject[prop]) 
            return false;
        }
    return true;
    }

function parseJewelryProperties(jewelryProperties)
    {
    var targetMods = 
        {
        //good mods
        Magery:true,MaceFighting:true,Fencing:true,Swordsmanship:true,AnimalTaming:true,AnimalLore:true,SpiritSpeak:true,Tactics:true,
        Focus:true,Parrying:true,Stealth:true,Anatomy:true,Bushido:true,EvaluateIntelligence:true,Mysticism:true,Wrestling:true,
        Necromancy:true,Archery:true,Chivalry:true,Healing:true,Ninjitsu:true,Throwing:true,ResistingSpells:true,ManaIncrease:true,
        StaminaIncrease:true,StrengthBonus:true,DexterityBonus:true,IntelligenceBonus:true,ManaRegeneration:true,EnhancePotions:true,
        HitChanceIncrease:true,DefenseChanceIncrease:true,SwingSpeedIncrease:true,DamageIncrease:true,SpellDamageIncrease:true,
        FasterCastRecovery:true,FasterCasting:true,LowerManaCost:true,LowerReagentCost:true,Musicianship:true,Discordance:true,
        //bad mods
        NightSight:true,Luck:true,PoisonResist:true,PhysicalResist:true,FireResist:true,EnergyResist:true,ColdResist:true,
        Provocation:true,Meditation:true,Veterinary:true,Stealing:true,Peacemaking:true
        }
    var lines = jewelryProperties.split("\n");
    var modsObj = {};
    lines.forEach(function(line)
        {
        var modMatch = line.match(/([a-zA-Z\s]+):?\s*\+?\s*([0-9]+)?/);
        if(modMatch)
            {
            var modName = modMatch[1].replace(/\s/g, '');
            if(targetMods[modName])
                {
                var modValue = parseInt(modMatch[2]) || 1;
                modsObj[modName] = modValue;
                }
            }
        });
    return modsObj; //[{goodMods},totalModsInt]
    }