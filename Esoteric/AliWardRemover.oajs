function RemoveWardsFromLastTarget()
    {
    //These functions are for managing multiple ward removal talismans. Once a talisman is used, it must be either equipped on a player or a mannequin for 15 minutes to recharge 
    //This will avoid using any talisman already on cooldown, BUT the only way the script can know this is if it has already attempted to use that talisman.
    //Use ForceCheckTalis function to check and update the status of all ward removal talismans.
    //Talisman status memory will be wiped when you completely close the client.
    //Use ClearTaliHash function to manually wipe the client's talisman status memory. It'll then assume all talis are ready, so use ForceCheckTalis if you know some are on cooldown.
    //Talisman status will NOT be automatically updated once the talisman comes off cooldown. Use ForceCheckTalis function.

    //Set this to true to attempt to re-equip the original talisman you were wearing when you played this function.
    var reEquipLastTali = true;

    //No edit below
    Orion.Exec("HighlightTalisByStatus",true)
    var taliHash = Shared.GetVar("taliHash",{}); //stores used tali serials until you close the client or run the ClearTaliHash or ForceCheckTalis function
    var endTime = 0;
    var nextTali = null;
    var currentTali = Orion.ObjAtLayer(9);
    var replaceTali = null;
    if(currentTali
        && currentTali.Properties().indexOf("Talisman Of Ward Removal") > -1
        && currentTali.Properties().indexOf("Fully Charged") > -1)
        {
        nextTali = currentTali.Serial();
        }
    else
        {
        var talis = Orion.FindTypeEx(any,any,backpack).filter(function(item)
            {
            return !taliHash[item.Serial()] && item.Properties().indexOf("Talisman Of Ward Removal") > -1;
            });
        if(!talis.length)
            return Orion.CharPrint(self,32,"Out of charged talis!")
        replaceTali = true;
        nextTali = talis[0].Serial();
        Orion.TestItemColor(nextTali,1159)
        endTime = Orion.Now() + 1200;
        while(!Orion.ObjAtLayer(9) || (currentTali && Orion.ObjAtLayer(9).Serial() == currentTali.Serial()))
            {
            Orion.Equip(nextTali);
            Orion.Wait(500);
            if(Orion.Now() > endTime)
                return Orion.CharPrint(self,32,"Tali failed to equip!");
            }
        }
    if(nextTali)
        {
        while(Orion.Now() < endTime)
            Orion.Wait(50);
        Orion.UseObject(nextTali)
        if(!Orion.WaitForTarget(1000))
            {
            if(Orion.InJournal('for this to recharge.', 'sys', 0, 'any', Orion.Now() - 2000, Orion.Now() + 2000))
                {
                taliHash[nextTali] = true;
                Shared.AddVar("taliHash",taliHash)
                if(reEquipLastTali && replaceTali)
                    {
                    while(Orion.Now() < endTime + 700)
                        Orion.Wait(50)
                    Orion.Equip(currentTali.Serial())
                    }
                return Orion.CharPrint(self,32,"Tali on cooldown!")
                }
            return Orion.CharPrint(self,1159,"Target cursor failed to appear!")
            }
        var lastTarget = Orion.ClientLastTarget();
        var lastTargetObj = Orion.FindObject(lastTarget);
        if(lastTargetObj != null)
            {
            var timeStamp = Orion.Now();
            endTime = timeStamp + 500;
            Orion.TargetObject(lastTarget);
            var successCheck = Orion.WaitJournal('wards have been removed!',timeStamp,endTime,'sys')
            if(successCheck)
                {
                taliHash[nextTali] = true;
                Shared.AddVar("taliHash",taliHash)
                Orion.CharPrint(self,1159,lastTargetObj.Name() + " wards removed!");
                if(reEquipLastTali && currentTali.Serial() != nextTali)
                    {
                    while(Orion.Now() < endTime + 700)
                        Orion.Wait(50)
                    Orion.Equip(currentTali.Serial())
                    }
                }
            }
        else
            {
            Orion.CancelTarget();
            Orion.CharPrint(self,32,"Last target not found");
            }
        }
    }

function ForceCheckTalis()
    {
    var talis = GetAllTalis();
    var currentTali = null;
    var lastTali = null;
    if(Orion.ObjAtLayer(9))
        currentTali = Orion.ObjAtLayer(9).Serial();
    var taliHash = Shared.GetVar("taliHash",{})
    Orion.ClearJournal("That is not a valid target.")
    for(var i=0;i<talis.length;i++)
        {
        var tali = talis[i];
        if(tali.Layer() != 9)
            {
            Orion.Equip(tali.Serial())
            Orion.Wait(1300);
            }
        if(lastTali)
            {
            if(Orion.InJournal('That is not a valid target.'))
                {
                Orion.ClearJournal("That is not a valid target.")
                Orion.TestItemColor(lastTali,1914)
                }
            else
                Orion.TestItemColor(lastTali,1922)
            }
        var timeStamp = Orion.Now();
        Orion.UseObject(tali.Serial());
        if(!Orion.WaitForTarget(1000))
            {
            if(Orion.InJournal('for this to recharge.', 'sys', 0, 'any', timeStamp, Orion.Now() + 2000))
                {
                taliHash[tali.Serial()] = true;
                Shared.AddVar("taliHash",taliHash);
                Orion.CharPrint(self,32,"Tali on cooldown!");
                lastTali = tali.Serial();
                continue;
                }
            Orion.CharPrint(self,32,"Target cursor failed to appear and no recharge message! Trying again...");
            if(!Orion.WaitForTarget(2000))
                {
                if(Orion.InJournal('for this to recharge.', 'sys', 0, 'any', timeStamp, Orion.Now() + 2000))
                    {
                    taliHash[tali.Serial()] = true;
                    Shared.AddVar("taliHash",taliHash);
                    Orion.CharPrint(self,32,"Tali on cooldown!");
                    lastTali = tali.Serial();
                    continue;
                    }
                Orion.CharPrint(self,32,"Target cursor failed to appear and no recharge message! Marking as on cooldown");
                taliHash[tali.Serial()] = true;
                Shared.AddVar("taliHash",taliHash);
                lastTali = tali.Serial();
                continue
                }
            }
        Orion.CancelTarget();
        lastTali = tali.Serial();
        delete taliHash[tali.Serial()];
        }
    Orion.Wait(1000);
    if(currentTali)
        Orion.Equip(currentTali)
    Orion.Wait(500);
    var taliCount = 0;
    talis.forEach(function(tali)
        {
        if(taliHash[tali.Serial()])
            Orion.TestItemColor(tali.Serial(),1922);
        else
            {
            Orion.TestItemColor(tali.Serial(),1914);
            taliCount++;
            }
        })
    Orion.Print("Charged Talis: " + taliCount);
    Orion.Wait(1000);
    ClearHighlightedItems();
    }

function HighlightTalisByStatus()
    {
    var taliHash = Shared.GetVar("taliHash",{})
    if(!taliHash)
        return Orion.CharPrint(self,1159,"Tali Hash Table is Empty!")
    GetAllTalis().forEach(function(tali)
        {
        if(taliHash[tali.Serial()])
            Orion.TestItemColor(tali.Serial(),1922)
        else
            Orion.TestItemColor(tali.Serial(),1914)
        });
    Orion.Wait(1000);
    ClearHighlightedItems()
    }

function ClearTaliHash()
    {
    Shared.AddVar("taliHash",{});
    }

function ClearHighlightedItems()
	{
	Orion.FindTypeEx(any,any,self,"",0,"",true).forEach(function(item)
		{
		Orion.TestItemColor(item.Serial(),item.Color());
		})
	}

function GetAllTalis(_helper)
    { //helper function, not for direct calling
    var talis = Orion.FindTypeEx(any,any,backpack).filter(function(item)
        {
        return item.Properties().indexOf("Talisman Of Ward Removal") > -1;
        });
    var currentTali = Orion.ObjAtLayer(9);
    if(currentTali && currentTali.Properties().indexOf("Talisman Of Ward Removal") > -1)
        talis.unshift(currentTali);
    return talis;
    }