function Catalogue()
    {
    var startTime = Orion.Now();
    var safes = Orion.FindTypeEx('0x9C18|0x9C19',any,ground,'item',20)
        .map(function(safe)
            {
            var gump = Orion.GetGump(any);
            while(gump)
                {
                Orion.Print('Closing gump: ' + gump.ID());
                gump.Select(Orion.CreateGumpHook(0));
                Orion.Wait(200);
                gump = Orion.GetGump(any);
                }
            while(safe.Distance() > 2)
                {
                Orion.WalkTo(safe.X(),safe.Y(),0,2)
                Orion.Wait(500);
                }
            while(!Orion.GumpExists('generic', safe.Serial(), '0x000F3ED6'))
                {
                Orion.Wait(1300 - (Orion.Now() - startTime))
                Orion.UseObject(safe.Serial());
                startTime = Orion.Now();
                Orion.WaitForGump(1300);
                }
            var gump = Orion.GetGump(any, '0x000F3ED6');
            var textList = gump.TextList();
            var platBid = textList[0] || 0;
            var goldBid = textList[1] || 0;
            var platBuy = textList[2] || 0;
            var goldBuy = textList[3] || 0;
            Orion.SetSearchArea(safe.X(),safe.Y(),safe.X(),safe.Y());
            var items = Orion.FindTypeEx(any,any,ground,'item',20);
            var bookInd = items.filter(function(item){return item.Graphic() == '0x0FF1'})[0];
            var saleItem = items.filter(function(item){return !Orion.Contains(item.Graphic(),'0x0FF1|0x9C18|0x9C19') && item.Z() < 40})[0];
            Orion.ResetSearchArea();
            if(bookInd)
                bookInd = +bookInd.Name();
            else
                bookInd = 'MissingIndex';
            if(saleItem)
                var saleItemProps = saleItem.Properties();
            else
                var saleItemProps = 'MissingItem';
            var outStr = '*' + bookInd + '\nBid: ' + platBid + 'p ' + goldBid + 'gp\n' + 'B/O: ' + platBuy + 'p ' + goldBuy + 'gp\n' + saleItemProps + '\n';
            if(saleItem)
                return [bookInd, outStr, saleItem.Serial()];
            return [bookInd, outStr, 'No Item'];
            })
        .sort(function(a,b)
            {
            return a[0] - b[0];
            });
    TextWindow.Open();
    TextWindow.Print('\\*');
    safes.forEach(function(safe)
        {
        TextWindow.Print(safe[1])
        });
    TextWindow.Print('*/');
    TextWindow.Print('var prevCatalogue = [')
    safes.forEach(function(safe)
        {
        TextWindow.Print(JSON.stringify(safe) + ',');
        })
    TextWindow.Print(']\n\n')
    }

function CatalogueRowColumn()
    {
    var ownerFlag = true;
    var startTime = Orion.Now();
    var safes = RowColumnScanEnumerateSafes();
    var outArr = [];
    var index = 1;
    TextWindow.Open();
    TextWindow.Print('\\*');
    for(var i=0;i<safes.length;i++)
        {
        var safeRow = safes[i];
        for(var j=0;j<safeRow.length;j++)
            {
            var safe = Orion.FindObject(safeRow[j][0]);
            var gump = Orion.GetGump(any);
            while(gump)
                {
                Orion.Print('Closing gump: ' + gump.ID());
                gump.Select(Orion.CreateGumpHook(0));
                Orion.Wait(200);
                gump = Orion.GetGump(any);
                }
            while(safe.Distance() > 4)
                {
                Orion.WalkTo(safe.X(),safe.Y(),0,2)
                Orion.Wait(500);
                }
            while(!Orion.GumpExists('generic', safe.Serial(), '0x000F3ED6'))
                {
                Orion.Wait(1300 - (Orion.Now() - startTime))
                Orion.UseObject(safe.Serial());
                startTime = Orion.Now();
                Orion.WaitForGump(1300);
                }
            var gump = Orion.GetGump(any, '0x000F3ED6');
            var textList = gump.TextList();
            if(ownerFlag)
                {
                var platBid = textList[0] || 0;
                var goldBid = textList[1] || 0;
                var platBuy = textList[2] || 0;
                var goldBuy = textList[3] || 0;
                }
            else
                {
                var platBid = textList[4] ? textList[4].slice(24) : 0;
                var goldBid = textList[5] ? textList[5].slice(24) : 0;
                var platBuy = textList[7] ? textList[7].slice(24) : 0;
                var goldBuy = textList[8] ? textList[8].slice(24) : 0;
                }
            Orion.SetSearchArea(safe.X(),safe.Y(),safe.Z(),safe.X(),safe.Y(),safe.Z() + 12);
            var saleItem = Orion.FindTypeEx(any,any,ground,'item',20).filter(function(item)
                {
                return !Orion.Contains(item.Graphic(),'0x0FF1|0x9C18|0x9C19');
                })[0];
            Orion.ResetSearchArea();
            if(saleItem)
                var saleItemProps = saleItem.Properties();
            else
                var saleItemProps = 'MissingItem';
            Orion.CharPrint(self,1159,index + '/' + safes.length + ' ETA: ' + ((safes.length - index) * 3) + 's');
            var outStr = '*' + index + '\nBid: ' + platBid + 'p ' + goldBid + 'gp\n' + 'B/O: ' + platBuy + 'p ' + goldBuy + 'gp\n' + JSON.parse(JSON.stringify(saleItemProps)) + '\n';
            if(saleItem)
                outArr.push([index++, outStr, saleItem.Serial()]);
            else
                outArr.push([index++, outStr, 'No Item']);
            TextWindow.Print(outStr);
            }
        }
    //outArr.forEach(function(safe){TextWindow.Print(safe[1])});
    TextWindow.Print('*/');
    TextWindow.Print('var prevCatalogue = [')
    outArr.forEach(function(safe)
        {
        TextWindow.Print(JSON.stringify(safe) + ',');
        })
    TextWindow.Print(']\n\n')
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/CatalogueJSON' + '.json';
    var tmpFile = Orion.NewFile();
    tmpFile.Open(tmpFilePath);
    Orion.Print("Recording To File: " + tmpFilePath); 
    Orion.Print("Recording catalogue");
    tmpFile.Write(JSON.stringify(outArr));
    tmpFile.Close();
    }

function ReadCatalogue()
    {
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/CatalogueJSON' + '.json';
    var tmpFile = Orion.NewFile();
    tmpFile.Open(tmpFilePath);
    var outArr = [];
    var fileString = tmpFile.ReadAll(); 
    if(fileString)
        outArr = JSON.parse(fileString);
    TextWindow.Print('*/');
    TextWindow.Print('var prevCatalogue = [')
    outArr.forEach(function(safe)
        {
        TextWindow.Print(JSON.stringify(safe) + ',');
        })
    TextWindow.Print(']\n\n')
    tmpFile.Close();
    }

function SalesCheck()
    {
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/CatalogueJSON' + '.json';
    var tmpFile = Orion.NewFile();
    tmpFile.Open(tmpFilePath);
    var prevCatalogue = [];
    var fileString = tmpFile.ReadAll(); 
    if(fileString)
        prevCatalogue = JSON.parse(fileString);
    var sold = [];
    for(var i=0;i<prevCatalogue.length;i++)
        {
        var item = prevCatalogue[i];
        if(item[2] != 'No Item' && !Orion.FindObject(item[2]))
            sold.push(item);
        }
    TextWindow.Open();
    sold.forEach(function(item)
        {
        TextWindow.Print(item[1])
        });
    }

function NumberSafes()
    {
    var books = Orion.FindTypeEx('0x0FF1',any,ground,'item',20).filter(function(item)
        {
        Orion.SetSearchArea(item.X(),item.Y(),item.Z(),item.X(),item.Y(),item.Z())
        var safe = Orion.FindTypeEx('0x9C18|0x9C19',any,ground,'item',20)[0];
        Orion.ResetSearchArea();
        return safe;
        }).forEach(function(book)
            {
            Orion.CharPrint(book.Serial(), 1159, book.Name())
            //Orion.PrintFast(book.Serial(), 1159, 0, book.Name())
            });
    }

function ChronoEnumerateSafes()
    {
    TextWindow.Open();
    var safes = Orion.FindTypeEx('0x9C18|0x9C19',any,ground,'item',20).sort(function(a,b)
            {
            return +a.Serial() - +b.Serial();
            })
        .forEach(function(item,ind)
            {
            Orion.CharPrint(item.Serial(), 1159, ind+1)
            TextWindow.Print(item.Serial())
            Orion.Wait(100);
            //Orion.PrintFast(book.Serial(), 1159, 0, book.Name())
            });
    
    }

function RowColumnScanEnumerateSafes()
    {
    var safes = Orion.FindTypeEx('0x9C18|0x9C19',any,ground,'item',20).map(function(safe)
        {
        return [safe.Serial(), safe.X(), safe.Y()];
        })
    var safeRows = safes.sort(function(a,b)
        {
        return a[2] - b[2];
        })
    var rowHash = {};
    var safesSorted = [];
    for(var i=0;i<safeRows.length;i++)
        {
        var tempRow = [];
        if(!rowHash[safeRows[i][2]])
            {
            rowHash[safeRows[i][2]] = true;
            var tempSafes = safes.filter(function(safe)
                {
                return safe[2] == safeRows[i][2];
                })
            tempSafes.sort(function(a,b)
                    {
                    return a[1] - b[1];
                    })
                .forEach(function(safe)
                    {
                    tempRow.push(safe);
                    });
            }
        safesSorted.push(tempRow);
        }
    var index = 1;
    safesSorted.forEach(function(row)
        {
        row.forEach(function(column)
            {
            Orion.CharPrint(column[0], 1159, index++)
            //Orion.Wait(100);
            })
        });
    return safesSorted;
    }
    

function BookEnumerateSafes()
    {
    var safes = [];
    TextWindow.Open();
    var books = Orion.FindTypeEx('0x0FF1',any,ground,'item',20).filter(function(item)
        {
        Orion.SetSearchArea(item.X(),item.Y(),item.Z(),item.X(),item.Y(),item.Z())
        var safe = Orion.FindTypeEx('0x9C18|0x9C19',any,ground,'item',20)[0];
        Orion.ResetSearchArea();
        return safe;
        }).sort(function(a,b)
            {
            return +a.Name() - +b.Name();
            })
        .forEach(function(item)
            {
            Orion.SetSearchArea(item.X(),item.Y(),item.Z(),item.X(),item.Y(),item.Z())
            var safe = Orion.FindTypeEx('0x9C18|0x9C19',any,ground,'item',20)[0];
            Orion.ResetSearchArea();
            safes[+item.Name()] = safe.Serial();
            TextWindow.Print(safes[+item.Name()])
            //Orion.PrintFast(book.Serial(), 1159, 0, book.Name())
            });
    
    }

function drrar()
    {
    Orion.DropDraggedItemRelative(1,1)
    }

function OpenBook()
	{
	Orion.SetSearchArea(Player.X()+1,Player.Y()+1,Player.X()+1,Player.Y()+1)
	var book = Orion.FindType('0x0FF1',any,ground)[0];
	Orion.ResetSearchArea();
	if(book)
		{
		Orion.UseObject(book);
		}
	}

function LowerBooks()
	{
	Orion.ResetSearchArea()
	var book = Orion.FindTypeEx('0x0FF1',any,ground,'item',20).filter(function(item)
		{
		return item.Z() != 12 && item.Z() != 32;
		})[0];
	while(book)
		{
		if(Orion.WaitForTarget(1000))
			Orion.TargetObject(book.Serial());
		Orion.Wait(10);
		book = Orion.FindTypeEx('0x0FF1',any,ground,'item',20).filter(function(item)
			{
			return item.Z() != 12 && item.Z() != 32;
			})[0];
		}
	}

var prevCatalogue = [
    [1,"*1\nBid: 0p 250000000gp\nB/O: 0p 250000000gp\nRing\nWeight: 1 Stone\nAuction Item\nAnatomy +15\nAntique\nIntelligence Bonus 8\nStamina Increase 5\nMana Regeneration 3\nEnhance Potions 25%\nDefense Chance Increase 15%\nFaster Cast Recovery 3\nFaster Casting 1\nDurability 255 / 255\nMajor Artifact\n","0x453DF5BF"],
    [2,"*2\nBid: 0p 300000000gp\nB/O: 0p 300000000gp\nRing\nWeight: 1 Stone\nAuction Item\nMagery +15\nAntique\nStrength Bonus 10\nMana Regeneration 3\nLuck 150\nEnhance Potions 25%\nDefense Chance Increase 15%\nFaster Cast Recovery 4\nLower Reagent Cost 20%\nDurability 255 / 255\nLegendary Artifact\n","0x453DF5BD"],
    [3,"*3\nBid: 0p 250000000gp\nB/O: 0p 250000000gp\nRing\nWeight: 1 Stone\nAuction Item\nAntique\nDexterity Bonus 10\nStamina Increase 4\nMana Regeneration 3\nEnhance Potions 25%\nHit Chance Increase 15%\nDefense Chance Increase 15%\nSwing Speed Increase 10%\nDamage Increase 25%\nDurability 255 / 255\nMajor Artifact\n","0x453DF5B7"],
    [4,"*4\nBid: 0p 275000000gp\nB/O: 0p 275000000gp\nRing\nWeight: 1 Stone\nAuction Item\nAntique\nIntelligence Bonus 8\nEnhance Potions 25%\nHit Chance Increase 20%\nDefense Chance Increase 15%\nFaster Casting 1\nLower Mana Cost 8%\nSwing Speed Increase 10%\nDamage Increase 25%\nDurability 255 / 255\nLegendary Artifact\n","0x453DF407"],
    [5,"*5\nBid: 0p 300000000gp\nB/O: 0p 300000000gp\nRing\nWeight: 1 Stone\nAuction Item\nAnatomy +15\nParrying +15\nMace Fighting +20\nAntique\nStrength Bonus 8\nMana Regeneration 3\nDefense Chance Increase 15%\nFaster Cast Recovery 3\nLower Reagent Cost 20%\nDurability 255 / 255\nLegendary Artifact\n","0x455EAB41"],
    [6,"*6\nBid: 0p 300000000gp\nB/O: 0p 300000000gp\nRing\nWeight: 1 Stone\nAuction Item\nMysticism +15\nWrestling +15\nAntique\nStrength Bonus 8\nDexterity Bonus 8\nStamina Increase 4\nDefense Chance Increase 20%\nFaster Cast Recovery 4\nSwing Speed Increase 10%\nDurability 255 / 255\nLegendary Artifact\n","0x45BAE14D"],
    [7,"*7\nBid: 0p 250000000gp\nB/O: 0p 250000000gp\nBracelet\nWeight: 1 Stone\nAuction Item\nWrestling +15\nAntique\nIntelligence Bonus 10\nLuck 100\nEnhance Potions 25%\nDefense Chance Increase 15%\nFaster Cast Recovery 3\nFaster Casting 1\nSwing Speed Increase 10%\nDurability 255 / 255\nLegendary Artifact\n","0x45DB8D37"],
    [8,"*8\nBid: 0p 300000000gp\nB/O: 0p 300000000gp\nBracelet\nWeight: 1 Stone\nAuction Item\nResisting Spells +15\nStealth +15\nAntique\nDexterity Bonus 10\nEnhance Potions 25%\nDefense Chance Increase 15%\nSpell Damage Increase 15%\nFaster Cast Recovery 3\nDamage Increase 25%\nDurability 255 / 255\nMajor Artifact\n","0x417B2ADB"],
    [9,"*9\nBid: 0p 250000000gp\nB/O: 0p 250000000gp\nRing\nWeight: 1 Stone\nAuction Item\nWrestling +15\nSwordsmanship +15\nAntique\nEnhance Potions 25%\nHit Chance Increase 15%\nDefense Chance Increase 20%\nSpell Damage Increase 15%\nSwing Speed Increase 10%\nDamage Increase 35%\nDurability 255 / 255\nLegendary Artifact\n","0x447671B2"],
    [10,"*10\nBid: 0p 200000000gp\nB/O: 0p 200000000gp\nBracelet\nWeight: 1 Stone\nAuction Item\nNecromancy +15\nParrying +15\nAntique\nHit Chance Increase 15%\nSpell Damage Increase 15%\nFaster Casting 1\nSwing Speed Increase 10%\nDamage Increase 25%\nCold Resist 15%\nDurability 255 / 255\nMajor Artifact\n","0x4624E997"],
    [11,"*11\nBid: 0p 250000000gp\nB/O: 0p 250000000gp\nRing\nWeight: 1 Stone\nAuction Item\nChivalry +15\nMace Fighting +20\nAntique\nMana Increase 4\nMana Regeneration 3\nEnhance Potions 35%\nDefense Chance Increase 15%\nFaster Cast Recovery 3\nLower Mana Cost 8%\nDurability 255 / 255\nLegendary Artifact\n","0x46A76CBD"],
    [12,"*12\nBid: 0p 350000000gp\nB/O: 0p 350000000gp\nRing\nWeight: 1 Stone\nAuction Item\nEvaluate Intelligence +15\nMagery +15\nAntique\nStrength Bonus 8\nMana Increase 4\nEnhance Potions 25%\nDefense Chance Increase 15%\nFaster Cast Recovery 3\nCold Resist 15%\nDurability 255 / 255\nMajor Artifact\n","0x4376A436"],
    [13,"*13\nBid: 0p 350000000gp\nB/O: 0p 350000000gp\nBracelet\nWeight: 1 Stone\nAuction Item\nParrying +15\nMusicianship +15\nAntique\nStamina Increase 4\nMana Regeneration 3\nEnhance Potions 25%\nHit Chance Increase 15%\nDefense Chance Increase 15%\nFaster Cast Recovery 3\nDurability 255 / 255\nMajor Artifact\n","0x453DF5CE"],
    [14,"*14\nBid: 0p 250000000gp\nB/O: 0p 250000000gp\nBracelet\nWeight: 1 Stone\nAuction Item\nParrying +15\nMusicianship +20\nAntique\nLuck 150\nEnhance Potions 25%\nHit Chance Increase 15%\nDefense Chance Increase 15%\nFaster Cast Recovery 3\nLower Reagent Cost 20%\nDurability 255 / 255\nLegendary Artifact\n","0x453DF41E"],
    [15,"*15\nBid: 0p 250000000gp\nB/O: 0p 250000000gp\nBracelet\nWeight: 1 Stone\nAuction Item\nNinjitsu +15\nParrying +15\nAntique\nMana Regeneration 3\nLuck 100\nEnhance Potions 25%\nDefense Chance Increase 15%\nFaster Cast Recovery 4\nLower Reagent Cost 20%\nDurability 255 / 255\nMajor Artifact\n","0x453DF5AC"],
    [16,"*16\nBid: 0p 300000000gp\nB/O: 0p 300000000gp\nBracelet\nWeight: 1 Stone\nAuction Item\nSwordsmanship +20\nAntique\nMana Regeneration 3\nEnhance Potions 35%\nHit Chance Increase 15%\nDefense Chance Increase 15%\nSpell Damage Increase 15%\nFaster Cast Recovery 3\nLower Mana Cost 8%\nDurability 255 / 255\nLegendary Artifact\n","0x453DF5C3"],
    [17,"*17\nBid: 0p 250000000gp\nB/O: 0p 250000000gp\nRing\nWeight: 1 Stone\nAuction Item\nArchery +15\nMagery +15\nAntique\nEnhance Potions 25%\nDefense Chance Increase 15%\nFaster Casting 1\nLower Mana Cost 8%\nSwing Speed Increase 10%\nDamage Increase 25%\nDurability 255 / 255\nMajor Artifact\n","0x453DF40D"],
    [18,"*18\nBid: 0p 350000000gp\nB/O: 0p 350000000gp\nBracelet\nWeight: 1 Stone\nAuction Item\nSwordsmanship +15\nAntique\nMana Regeneration 4\nEnhance Potions 25%\nHit Chance Increase 20%\nDefense Chance Increase 15%\nSpell Damage Increase 15%\nFaster Cast Recovery 3\nLower Reagent Cost 20%\nDurability 255 / 255\nLegendary Artifact\n","0x453DF5C4"],
    [19,"*19\nBid: 0p 350000000gp\nB/O: 0p 350000000gp\nBracelet\nWeight: 1 Stone\nAuction Item\nArchery +15\nEvaluate Intelligence +15\nAntique\nIntelligence Bonus 8\nEnhance Potions 25%\nDefense Chance Increase 15%\nFaster Cast Recovery 3\nFaster Casting 1\nLower Mana Cost 8%\nDurability 255 / 255\nMajor Artifact\n","0x453DF5B3"],
    [20,"*20\nBid: 0p 350000000gp\nB/O: 0p 350000000gp\nRing\nWeight: 1 Stone\nAuction Item\nSpirit Speak +15\nMagery +15\nAntique\nDexterity Bonus 8\nIntelligence Bonus 8\nEnhance Potions 25%\nDefense Chance Increase 15%\nFaster Cast Recovery 3\nLower Mana Cost 10%\nDurability 255 / 255\nMajor Artifact\n","0x45BB4B65"],
    [21,"*21\nBid: 0p 250000000gp\nB/O: 0p 250000000gp\nBracelet\nWeight: 1 Stone\nAuction Item\nResisting Spells +15\nAntique\nDexterity Bonus 10\nMana Regeneration 3\nLuck 100\nEnhance Potions 25%\nDefense Chance Increase 15%\nFaster Cast Recovery 3\nLower Reagent Cost 25%\nDurability 255 / 255\nMajor Artifact\n","0x453DF5D1"],
    [22,"*22\nBid: 0p 250000000gp\nB/O: 0p 250000000gp\nRing\nWeight: 1 Stone\nAuction Item\nEvaluate Intelligence +15\nSpirit Speak +15\nAntique\nNight Sight\nDefense Chance Increase 15%\nFaster Cast Recovery 3\nLower Mana Cost 8%\nSwing Speed Increase 10%\nDamage Increase 25%\nDurability 255 / 255\nMajor Artifact\n","0x45F6481C"],
    [23,"*23\nBid: 0p 275000000gp\nB/O: 0p 275000000gp\nRing\nWeight: 1 Stone\nAuction Item\nNinjitsu +15\nProvocation +15\nAntique\nEnhance Potions 25%\nHit Chance Increase 15%\nDefense Chance Increase 15%\nFaster Cast Recovery 4\nFaster Casting 1\nDamage Increase 25%\nDurability 255 / 255\nLegendary Artifact\n","0x453DF3F4"],
    [24,"*24\nBid: 0p 450000000gp\nB/O: 0p 450000000gp\nBracelet\nWeight: 1 Stone\nAuction Item\nResisting Spells +20\nSpirit Speak +15\nMusicianship +15\nAntique\nDexterity Bonus 8\nEnhance Potions 25%\nHit Chance Increase 15%\nDefense Chance Increase 20%\nFaster Cast Recovery 3\nDurability 255 / 255\nLegendary Artifact\n","0x45F64911"],
    [25,"*25\nBid: 0p 450000000gp\nB/O: 0p 450000000gp\nRing\nWeight: 1 Stone\nAuction Item\nAnimal Taming +15\nAntique\nDexterity Bonus 10\nStamina Increase 4\nMana Regeneration 3\nEnhance Potions 25%\nDefense Chance Increase 15%\nFaster Cast Recovery 3\nFaster Casting 1\nDurability 255 / 255\nMajor Artifact\n","0x453DF5CD"],
    [26,"*26\nBid: 2p 0gp\nB/O: 2p 0gp\nVicious Bokuto\nWeight: 7 Stones\nAuction Item\nDurability +100%\nSplintering Weapon 25%\nHit Lightning 50%\nHit Poison Area 50%\nPrized\nLower Mana Cost 4%\nPhysical Damage 100%\nWeapon Damage 10 - 12\nWeapon Speed 2s\nStrength Requirement 20\nOne-handed Weapon\nSkill Required: Swordsmanship\nDurability 80 / 80\n* Requires The \"Stygian Abyss\" Expansion\nLesser Artifact\n","0x44B2F312"],
    [27,"*27\nBid: 1p 0gp\nB/O: 1p 0gp\nVicious Bokuto Of Wizardry\nWeight: 7 Stones\nAuction Item\nBrittle\nSplintering Weapon 20%\nHit Harm 70%\nHit Fire Area 20%\nSpell Channeling\nHit Chance Increase 15%\nDamage Increase 20%\nPhysical Damage 100%\nWeapon Damage 10 - 12\nWeapon Speed 2s\nStrength Requirement 20\nOne-handed Weapon\nSkill Required: Swordsmanship\nDurability 255 / 255\n* Requires The \"Stygian Abyss\" Expansion\nGreater Artifact\n","0x453DF419"],
    [28,"*28\nBid: 0p 500000000gp\nB/O: 0p 500000000gp\nVicious Bokuto Of Quality\nWeight: 7 Stones\nAuction Item\nBrittle\nSplintering Weapon 20%\nHit Harm 50%\nSpell Channeling\nMage Weapon -20 Skill\nBattle Lust\nFaster Casting -1\nPhysical Damage 100%\nWeapon Damage 10 - 12\nWeapon Speed 2s\nStrength Requirement 20\nOne-handed Weapon\nSkill Required: Swordsmanship\nDurability 255 / 255\n* Requires The \"Stygian Abyss\" Expansion\nMajor Magic Item\n","0x434BC72C"],
    [29,"*29\nBid: 0p 300000000gp\nB/O: 0p 300000000gp\nVicious No-dachi Of Aegis\nWeight: 10 Stones\nAuction Item\nSplintering Weapon 20%\nReactive Paralyze\nPhysical Damage 100%\nWeapon Damage 16 - 19\nWeapon Speed 3.5s\nStrength Requirement 40\nTwo-handed Weapon\nSkill Required: Swordsmanship\nDurability 80 / 80\n* Requires The \"Stygian Abyss\" Expansion\nLesser Magic Item\n","0x45F64832"],
    [30,"*30\nBid: 0p 250000000gp\nB/O: 0p 250000000gp\nBracelet\nWeight: 1 Stone\nAuction Item\nParrying +20\nMusicianship +15\nAntique\nDexterity Bonus 8\nEnhance Potions 25%\nHit Chance Increase 15%\nDefense Chance Increase 15%\nFaster Cast Recovery 3\nLower Reagent Cost 20%\nDurability 255 / 255\nLegendary Artifact\n","0x45F648DA"],
    [31,"*31\nBid: 0p 300000000gp\nB/O: 0p 300000000gp\nRing\nWeight: 1 Stone\nAuction Item\nArchery +15\nStealing +15\nMagery +15\nAntique\nEnhance Potions 25%\nHit Chance Increase 20%\nDefense Chance Increase 20%\nFaster Cast Recovery 3\nFire Resist 15%\nDurability 255 / 255\nLegendary Artifact\n","0x453DF5B4"],
    [32,"*32\nBid: 0p 250000000gp\nB/O: 0p 250000000gp\nWakizashi\nWeight: 5 Stones\nAuction Item\nSplintering Weapon 20%\nHit Fireball 50%\nHit Lower Defense 50%\nPrized\nStamina Regeneration 6\nDefense Chance Increase 15%\nPhysical Damage 100%\nWeapon Damage 10 - 14\nWeapon Speed 2.5s\nStrength Requirement 20\nOne-handed Weapon\nSkill Required: Swordsmanship\nDurability 50 / 50\n* Requires The \"Stygian Abyss\" Expansion\nLesser Artifact\n","0x44B2F2DD"],
    [33,"*33\nBid: 0p 350000000gp\nB/O: 0p 350000000gp\nBracelet\nWeight: 1 Stone\nAuction Item\nNinjitsu +15\nFocus +15\nAntique\nIntelligence Bonus 8\nEnhance Potions 25%\nHit Chance Increase 15%\nDefense Chance Increase 15%\nFaster Cast Recovery 3\nDamage Increase 25%\nDurability 255 / 255\nMajor Artifact\n","0x45F64859"],
    [34,"*34\nBid: 0p 300000000gp\nB/O: 0p 300000000gp\nBracelet\nWeight: 1 Stone\nAuction Item\nMysticism +15\nStealth +15\nAntique\nDexterity Bonus 8\nMana Increase 4\nMana Regeneration 3\nEnhance Potions 25%\nDefense Chance Increase 15%\nFaster Cast Recovery 3\nDurability 255 / 255\nMajor Artifact\n","0x453DF415"],
    [35,"*35\nBid: 0p 600000000gp\nB/O: 0p 600000000gp\nBokuto\nWeight: 7 Stones\nAuction Item\nSplintering Weapon 20%\nHit Harm 50%\nHit Lower Defense 50%\nLuck 90\nPoison Resist 5%\nPhysical Damage 100%\nWeapon Damage 10 - 12\nWeapon Speed 2s\nStrength Requirement 20\nOne-handed Weapon\nSkill Required: Swordsmanship\nDurability 40 / 40\n* Requires The \"Stygian Abyss\" Expansion\nMajor Magic Item\n","0x453DF2D7"],
    [36,"*36\nBid: 7p 500000000gp\nB/O: 7p 500000000gp\nBokuto\nWeight: 7 Stones\nAuction Item\nSplintering Weapon 20%\nHit Lightning 50%\nHit Lower Defense 50%\nPrized\nHit Point Regeneration 3\nPhysical Damage 30%\nFire Damage 70%\nWeapon Damage 10 - 12\nWeapon Speed 2s\nStrength Requirement 20\nOne-handed Weapon\nSkill Required: Swordsmanship\nDurability 40 / 40\n* Requires The \"Stygian Abyss\" Expansion\nMajor Magic Item\n","0x4670F5AA"],
    [37,"*37\nBid: 0p 400000000gp\nB/O: 0p 400000000gp\nSparkle\nWeight: 2 Stones\nLocked Down\n","0x461A7EB2"],
    [38,"*38\nBid: 0p 500000000gp\nB/O: 0p 500000000gp\nHatchet\nWeight: 4 Stones\nAuction Item\nSplintering Weapon 20%\nHit Lightning 50%\nSpell Channeling\nPrized\nLuck 100\nPhysical Damage 100%\nWeapon Damage 13 - 16\nWeapon Speed 2.75s\nStrength Requirement 20\nTwo-handed Weapon\nSkill Required: Swordsmanship\nDurability 51 / 51\n* Requires The \"Stygian Abyss\" Expansion\nMajor Magic Item\n","0x453DF3F0"],
    [39,"*39\nBid: 0p 600000000gp\nB/O: 0p 600000000gp\nBokuto\nWeight: 7 Stones\nAuction Item\nSplintering Weapon 20%\nHit Fireball 50%\nSpell Channeling\nPrized\nDefense Chance Increase 15%\nFaster Casting -1\nLower Requirements 70%\nPhysical Damage 100%\nWeapon Damage 10 - 12\nWeapon Speed 2s\nStrength Requirement 6\nOne-handed Weapon\nSkill Required: Swordsmanship\nDurability 40 / 40\n* Requires The \"Stygian Abyss\" Expansion\nMajor Magic Item\n","0x468FB1B8"],
    [40,"*40\nBid: 1p 0gp\nB/O: 1p 0gp\nRing\nWeight: 1 Stone\nAuction Item\nChivalry +15\nBushido +15\nAnimal Taming +15\nMagery +15\nAntique\nEnhance Potions 25%\nDefense Chance Increase 15%\nFaster Cast Recovery 3\nLower Reagent Cost 20%\nDurability 255 / 255\nMajor Artifact\n","0x45F6484A"],
    [41,"*41\nBid: 0p 300000000gp\nB/O: 0p 300000000gp\nRing\nWeight: 1 Stone\nAuction Item\nParrying +15\nAntique\nLuck 100\nEnhance Potions 35%\nHit Chance Increase 15%\nDefense Chance Increase 15%\nSpell Damage Increase 18%\nFaster Cast Recovery 3\nCold Resist 15%\nDurability 255 / 255\nLegendary Artifact\n","0x453DF5D0"],
    [42,"*42\nBid: 0p 250000000gp\nB/O: 0p 250000000gp\nNo-dachi\nWeight: 10 Stones\nAuction Item\nSplintering Weapon 20%\nHit Lower Defense 50%\nSpell Channeling\nReactive Paralyze\nPrized\nFaster Casting -1\nPhysical Damage 30%\nFire Damage 70%\nWeapon Damage 16 - 19\nWeapon Speed 3.5s\nStrength Requirement 40\nTwo-handed Weapon\nSkill Required: Swordsmanship\nDurability 80 / 80\n* Requires The \"Stygian Abyss\" Expansion\nMajor Magic Item\n","0x45F64853"],
    [43,"*43\nBid: 5p 0gp\nB/O: 5p 0gp\nBokuto\nWeight: 7 Stones\nAuction Item\nSplintering Weapon 20%\nHit Lightning 50%\nHit Lower Defense 50%\nStamina Regeneration 6\nPhysical Damage 30%\nPoison Damage 70%\nWeapon Damage 10 - 12\nWeapon Speed 2s\nStrength Requirement 125\nOne-handed Weapon\nSkill Required: Swordsmanship\nDurability 40 / 40\n* Requires The \"Stygian Abyss\" Expansion\nLesser Artifact\n","0x4670F5AC"],
    [44,"*44\nBid: 2p 400000000gp\nB/O: 2p 400000000gp\nVicious Pickaxe\nUses Remaining: 50\nWeight: 11 Stones\nAuction Item\nSplintering Weapon 25%\nHit Fireball 70%\nHit Lower Defense 50%\nBattle Lust\nPrized\nMana Regeneration 3\nPhysical Damage 100%\nWeapon Damage 12 - 16\nWeapon Speed 3s\nStrength Requirement 50\nOne-handed Weapon\nSkill Required: Swordsmanship\nDurability 48 / 48\n* Requires The \"Stygian Abyss\" Expansion\nLesser Artifact\n","0x45E605F9"],
    [45,"*45\nBid: 0p 600000000gp\nB/O: 0p 600000000gp\nBokuto\nWeight: 7 Stones\nAuction Item\nSplintering Weapon 20%\nHit Fireball 50%\nSpell Channeling\nStamina Regeneration 3\nFaster Casting -1\nFire Resist 10%\nPhysical Damage 100%\nWeapon Damage 10 - 12\nWeapon Speed 2s\nStrength Requirement 20\nOne-handed Weapon\nSkill Required: Swordsmanship\nDurability 40 / 40\n* Requires The \"Stygian Abyss\" Expansion\nGreater Magic Item\n","0x45F64932"],
    [46,"*46\nBid: 0p 250000000gp\nB/O: 0p 250000000gp\nBracelet\nWeight: 1 Stone\nAuction Item\nEvaluate Intelligence +15\nAntique\nStrength Bonus 8\nDexterity Bonus 8\nHit Chance Increase 20%\nDefense Chance Increase 15%\nFaster Cast Recovery 4\nFaster Casting 1\nDamage Increase 25%\nDurability 255 / 255\nLegendary Artifact\n","0x453DF52F"],
    [47,"*47\nBid: 0p 400000000gp\nB/O: 0p 400000000gp\nBracelet\nWeight: 1 Stone\nAuction Item\nParrying +15\nAntique\nIntelligence Bonus 8\nEnhance Potions 35%\nDefense Chance Increase 15%\nSpell Damage Increase 18%\nFaster Cast Recovery 3\nFaster Casting 1\nSwing Speed Increase 10%\nDurability 255 / 255\nLegendary Artifact\n","0x453DF40C"],
    [48,"*48\nBid: 0p 400000000gp\nB/O: 0p 400000000gp\nBokuto\nWeight: 7 Stones\nAuction Item\nSplintering Weapon 20%\nHit Fireball 50%\nHit Mana Leech 50%\nHit Lower Defense 50%\nPrized\nMana Regeneration 3\nPhysical Damage 100%\nWeapon Damage 10 - 12\nWeapon Speed 2s\nStrength Requirement 20\nOne-handed Weapon\nSkill Required: Swordsmanship\nDurability 40 / 40\n* Requires The \"Stygian Abyss\" Expansion\nMajor Magic Item\n","0x45F6474D"],
    [49,"*49\nBid: 6p 0gp\nB/O: 6p 0gp\nBokuto\nWeight: 7 Stones\nAuction Item\nSplintering Weapon 30%\nHit Lightning 50%\nPrized\nIntelligence Bonus 4\nHit Point Regeneration 3\nStamina Regeneration 3\nPhysical Damage 100%\nWeapon Damage 10 - 12\nWeapon Speed 2s\nStrength Requirement 20\nOne-handed Weapon\nSkill Required: Swordsmanship\nDurability 40 / 40\n* Requires The \"Stygian Abyss\" Expansion\nLesser Artifact\n","0x45E610B7"],
    [50,"*50\nBid: 0p 750000000gp\nB/O: 0p 750000000gp\nBokuto\nWeight: 7 Stones\nAuction Item\nSplintering Weapon 20%\nHit Harm 50%\nSpell Channeling\nHit Point Regeneration 3\nEnhance Potions 5%\nFaster Casting -1\nPhysical Damage 100%\nWeapon Damage 10 - 12\nWeapon Speed 2s\nStrength Requirement 20\nOne-handed Weapon\nSkill Required: Swordsmanship\nDurability 40 / 40\n* Requires The \"Stygian Abyss\" Expansion\nGreater Magic Item\n","0x45F648C5"],
    [51,"*51\nBid: 0p 300000000gp\nB/O: 0p 300000000gp\nRing\nWeight: 1 Stone\nAuction Item\nResisting Spells +20\nAntique\nStrength Bonus 8\nMana Increase 4\nEnhance Potions 25%\nHit Chance Increase 15%\nSpell Damage Increase 15%\nFaster Cast Recovery 3\nLower Mana Cost 8%\nDurability 255 / 255\nMajor Artifact\n","0x453DF41A"],
    [52,"*52\nBid: 0p 250000000gp\nB/O: 0p 250000000gp\nRing\nWeight: 1 Stone\nAuction Item\nParrying +20\nMusicianship +20\nAntique\nStrength Bonus 8\nMana Increase 4\nMana Regeneration 4\nEnhance Potions 25%\nDefense Chance Increase 15%\nFaster Cast Recovery 3\nDurability 255 / 255\nLegendary Artifact\n","0x46780FF0"],
    [53,"*53\nBid: 0p 350000000gp\nB/O: 0p 350000000gp\nBokuto\nWeight: 7 Stones\nAuction Item\nDurability +100%\nSplintering Weapon 20%\nHit Fireball 50%\nHit Lower Defense 50%\nFire Resist 5%\nPhysical Damage 100%\nWeapon Damage 10 - 12\nWeapon Speed 2s\nStrength Requirement 20\nOne-handed Weapon\nSkill Required: Swordsmanship\nDurability 80 / 80\n* Requires The \"Stygian Abyss\" Expansion\nMajor Magic Item\n","0x45BB4B68"],
    [54,"*54\nBid: 0p 350000000gp\nB/O: 0p 350000000gp\nExquisite Bokuto Of Slaughter\nWeight: 7 Stones\nAuction Item\nBrittle\nSplintering Weapon 20%\nHit Harm 70%\nSpell Channeling\nFaster Casting -1\nLower Requirements 70%\nPhysical Damage 30%\nChaos Damage 70%\nWeapon Damage 10 - 12\nWeapon Speed 2s\nStrength Requirement 6\nOne-handed Weapon\nSkill Required: Swordsmanship\nDurability 255 / 255\n* Requires The \"Stygian Abyss\" Expansion\nLesser Artifact\n","0x45F646E7"],
    [55,"*55\nBid: 0p 350000000gp\nB/O: 0p 350000000gp\nRing\nWeight: 1 Stone\nAuction Item\nParrying +20\nAntique\nDexterity Bonus 8\nNight Sight\nEnhance Potions 25%\nHit Chance Increase 15%\nDefense Chance Increase 15%\nFaster Cast Recovery 3\nFaster Casting 1\nDurability 255 / 255\nMajor Artifact\n","0x453DF2DA"],
    [56,"*56\nBid: 0p 300000000gp\nB/O: 0p 300000000gp\nBracelet\nWeight: 1 Stone\nAuction Item\nBushido +20\nFocus +15\nAntique\nIntelligence Bonus 8\nEnhance Potions 25%\nDefense Chance Increase 15%\nFaster Cast Recovery 3\nFaster Casting 1\nLower Reagent Cost 20%\nDurability 255 / 255\nLegendary Artifact\n","0x463C004B"],
    [57,"*57\nBid: 2p 200000000gp\nB/O: 2p 200000000gp\nBokuto\nWeight: 7 Stones\nAuction Item\nSplintering Weapon 20%\nHit Lightning 50%\nHit Fatigue 50%\nHit Lower Defense 50%\nPrized\nSwing Speed Increase 30%\nPhysical Damage 100%\nWeapon Damage 10 - 12\nWeapon Speed 2s\nStrength Requirement 20\nOne-handed Weapon\nSkill Required: Swordsmanship\nDurability 40 / 40\n* Requires The \"Stygian Abyss\" Expansion\nLesser Artifact\n","0x45F6492D"],
    [58,"*58\nBid: 0p 250000000gp\nB/O: 0p 250000000gp\nWakizashi\nWeight: 5 Stones\nAuction Item\nSplintering Weapon 20%\nHit Harm 50%\nSpell Channeling\nPrized\nStrength Bonus 4\nMana Regeneration 3\nFaster Casting -1\nPhysical Damage 100%\nWeapon Damage 10 - 14\nWeapon Speed 2.5s\nStrength Requirement 20\nOne-handed Weapon\nSkill Required: Swordsmanship\nDurability 50 / 50\n* Requires The \"Stygian Abyss\" Expansion\nMajor Magic Item\n","0x44B2F33A"],
    [59,"*59\nBid: 0p 450000000gp\nB/O: 0p 450000000gp\nClub\nWeight: 9 Stones\nAuction Item\nSplintering Weapon 30%\nHit Harm 50%\nPrized\nIntelligence Bonus 4\nLuck 60\nDamage Increase 50%\nPhysical Damage 100%\nWeapon Damage 10 - 14\nWeapon Speed 2.5s\nStrength Requirement 40\nOne-handed Weapon\nSkill Required: Mace Fighting\nDurability 39 / 39\n* Requires The \"Stygian Abyss\" Expansion\nLesser Artifact\n","0x434BCCBA"],
    [60,"*60\nBid: 0p 350000000gp\nB/O: 0p 350000000gp\nLajatang\nWeight: 12 Stones\nAuction Item\nBrittle\nSplintering Weapon 20%\nHit Lightning 50%\nHit Lower Defense 50%\nReactive Paralyze\nSwing Speed Increase 30%\nCold Resist 18%\nPhysical Damage 100%\nWeapon Damage 16 - 19\nWeapon Speed 3.5s\nStrength Requirement 65\nTwo-handed Weapon\nSkill Required: Fencing\nDurability 255 / 255\n* Requires The \"Stygian Abyss\" Expansion\nLesser Artifact\n","0x458A621E"],
    [61,"*61\nBid: 0p 785000000gp\nB/O: 0p 785000000gp\nBokuto Of Slaughter\nExceptional\nWeight: 7 Stones\nAuction Item\nHit Lightning 70%\nDamage Increase 40%\nPhysical Damage 30%\nPoison Damage 70%\nWeapon Damage 10 - 12\nWeapon Speed 2s\nStrength Requirement 20\nOne-handed Weapon\nSkill Required: Swordsmanship\nDurability 48 / 48\nReforged (Lesser)\n","0x468FB088"],
    [62,"*62\nBid: 0p 500000000gp\nB/O: 0p 500000000gp\nVicious Bokuto\nExceptional\nWeight: 7 Stones\nAuction Item\nHit Lightning 70%\nDamage Increase 40%\nPhysical Damage 30%\nCold Damage 70%\nWeapon Damage 10 - 12\nWeapon Speed 2s\nStrength Requirement 20\nOne-handed Weapon\nSkill Required: Swordsmanship\nDurability 48 / 48\nReforged (Lesser)\n","0x46593252"],
    [63,"*63\nBid: 0p 400000000gp\nB/O: 0p 400000000gp\nBracelet\nWeight: 1 Stone\nAuction Item\nParrying +15\nMana Regeneration 3\nLuck 100\nEnhance Potions 25%\nDefense Chance Increase 15%\nSpell Damage Increase 15%\nFaster Cast Recovery 3\nLower Mana Cost 8%\nDurability 255 / 255\nGreater Artifact\n","0x428D58C2"],
    [64,"*64\nBid: 0p 350000000gp\nB/O: 0p 350000000gp\nBracelet\nWeight: 1 Stone\nAuction Item\nParrying +15\nAntique\nStrength Bonus 8\nIntelligence Bonus 8\nEnhance Potions 25%\nHit Chance Increase 15%\nDefense Chance Increase 15%\nFaster Cast Recovery 3\nSwing Speed Increase 10%\nDurability 255 / 255\nMajor Artifact\n","0x4639DBE7"],
    [65,"*65\nBid: 0p 350000000gp\nB/O: 0p 350000000gp\nA Crate Of Valuable Artifacts Taken From The Cult Of Vereor\nWeight: 1 Stone\nAuction Item\nYou Hear The Faint Sound Of Whispers Coming From Within The Crate \n","0x4601C389"],
    [66,"*66\nBid: 0p 200000000gp\nB/O: 0p 200000000gp\nStuffed Fish With Gareth's Remains\nWeight: 1 Stone\nAuction Item\n","0x46290B44"],
    [67,"*67\nBid: 1p 0gp\nB/O: 1p 0gp\nThe Fish That Ate The Remains Of Gareth.\nWeight: 1 Stone\nAuction Item\n","0x466B7F0A"],
    [68,"*68\nBid: 1p 350000000gp\nB/O: 1p 350000000gp\nLieutenant Of The Britannian Royal Guard\nBlessed\nWeight: 1 Stone\nAuction Item\nIntelligence Bonus 5\nMana Regeneration 2\nLower Reagent Cost 10%\nStrength Requirement 10\n","0x469C07DF"],
    [69,"*69\nBid: 0p 210000000gp\nB/O: 0p 210000000gp\nAlchemy Station\nBlessed\n7th Year Veteran Reward \nUses Remaining: 2358\nWeight: 1 Stone\nAuction Item\n","0x46AFAA48"],
    [70,"*70\nBid: 0p 210000000gp\nB/O: 0p 210000000gp\nFletching Station\nBlessed\n7th Year Veteran Reward \nUses Remaining: 3349\nWeight: 1 Stone\nAuction Item\n","0x46AFAC1F"],
    [71,"*71\nBid: 0p 210000000gp\nB/O: 0p 210000000gp\nSewing Machine\nBlessed\n7th Year Veteran Reward \nUses Remaining: 4664\nWeight: 1 Stone\nAuction Item\n","0x46AFAC3C"],
    ]