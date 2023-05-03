function Butler()
    {
    var butleeList = 
        {
        '0x02F464AE': true,
        }
    while(true)
        {
        var butlees = Orion.FindTypeEx(any,any,ground,'mobile',5).filter(function(mob)
            {
            return butleeList[mob.Serial()];
            });
        if(butlees.length)
            {
            if(Player.Hidden())
                Orion.SayWhisper('Hello! Is there anything I can help you with?');
            //accept trades
            if(Orion.TradeCheckState('0','left') && butleeList[Orion.TradeOpponent('0')])
                {
                Orion.TradeCheck('0', true);
                Orion.Wait(1000);
                }
            //give requested goods
            }
        else
            {
            if(!Player.Hidden())
                Orion.UseSkill('Hiding');
            }
        Orion.Wait(500);
        }
    }

function DropLootButler()
    {
    var butlerMode = true;
    if(butlerMode)
        {
        var butler = Orion.FindObject(butlerSerial);
        while(!butler)
            {
            Orion.Wait(500);
            butler = Orion.FindObject(butlerSerial);
            }
        AliWalkTo(butler.X(),butler.Y(),0,1);
        var loot = Orion.FindList('BotLoot')[0];
        while(loot)
            {
            Orion.CharPrint(self,1159,'Moving loot');
            Orion.MoveItem(loot,0,butlerSerial);
            Orion.Wait(1100);
            loot = Orion.FindList('BotLoot')[0];
            }
        while(!Orion.TradeCheckState('0','right') && Orion.TradeOpponent('0') == butlerSerial)
            {
            Orion.TradeCheck('0', true);
            Orion.Wait(1300);
            }
        loot = Orion.FindList('BotLoot')[0];
        if(!loot)
            return true;
        else
            return DropLoot();
        }
    else
        {
        var woodenBoxes = Orion.FindTypeEx('0x0E7D|0x09AA',any,ground,'item',10).filter(function(box)
            {
            return !Orion.Contains(box.Properties(),'Contents: 125')
            }).sort(function(a,b)
                {
                var aContents = (a.Properties.match(/Contents: (\d+)/) || [])[1] || 0;
                var bContents = (b.Properties.match(/Contents: (\d+)/) || [])[1] || 0;
                return bContents - aContents;
                });
        while(woodenBoxes.length)
            {
            var box = woodenBoxes[0];
            var boxSerial = box.Serial();
            while(box.Distance() > 2)
                AliWalkTo(box.X(),box.Y(),0,1);
            VerifyOpenContainer(boxSerial);
            var loot = Orion.FindList('BotLoot')[0];
            while(loot && !Orion.Contains(box.Properties(),'Contents: 125'))
                {
                Orion.CharPrint(self,1159,'Moving loot');
                Orion.MoveItem(loot,0,boxSerial);
                Orion.Wait(1100);
                loot = Orion.FindList('BotLoot')[0];
                }
            if(!loot)
                return true;
            woodenBoxes = Orion.FindTypeEx('0x0E7D|0x09AA',any,ground,'item',10).filter(function(box)
                {
                return !Orion.Contains(box.Properties(),'Contents: 125')
                }).sort(function(a,b)
                    {
                    var aContents = (a.Properties.match(/Contents: (\d+)/) || [])[1] || 0;
                    var bContents = (b.Properties.match(/Contents: (\d+)/) || [])[1] || 0;
                    return bContents - aContents;
                    });
            }
        DiscordPush('Out of containers to put loot!');
        return false;
        }
    }