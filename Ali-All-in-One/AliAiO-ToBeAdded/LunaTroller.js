function LunaTroller()
    {
    var taunts = [
        "Begin GM Chat",
        "Are you there?",
        "i wish to resize my house",
        "GM Check",
        ".",
        "What do you want to use this item on?",
        "You destroy the item.",
        "GM Check",
    ]
    Orion.Exec('StayLoggedInUsingBackpack',true);
    Orion.Exec('StayHidden',true);
    Orion.Exec('BoxPickerUpper',true);
    Orion.Exec('GMScan',true);
    while(true)
        {
        Orion.Say(taunts[Orion.Random(0,taunts.length)])
        var waitTime = Orion.Random(5,30) * 10000
        Orion.AddDisplayTimer('idoc', waitTime, 'AboveChar', 'circle', 'Taunting again in:',0,40,1159);
        Orion.Wait(waitTime)
        }
    }

function StayLoggedInUsingBackpack()
    {
    while(true)
        {
        Orion.UseObject(backpack)
        Orion.Wait(60000);
        }
    }

function BoxPickerUpper()
    {
    while(true)
        {
        var item = Orion.FindTypeEx(any,any,ground,'item',2).filter(function(item)
        	{
        	return Orion.Contains(item.Properties(),"Contents:")
        	})
        if(item.length)
            {
            //Orion.Print(item[0].Properties())
            Orion.DragItem(item[0].Serial())
            Orion.Wait(1300)
            }
        Orion.Wait(1)
        }
    }

function StayHidden()
    {
    while(!Player.Dead())
        {
        while(!Orion.BuffExists('Hiding'))
            {
            Orion.UseSkill('Hiding');
            Orion.Wait(500);
            }
        Orion.Wait(500);
        }
    }

function GMScan()
	{
	var useDiscordPush = true//profile.useDiscordPush;
    var closeUO = false;
    var timeStamp = 0;
    var gmCheck;
	while(true)
		{
        gmCheck = Orion.FindTypeEx(any,any,ground,'mobile',10,'yellow').filter(function(mob)
            {
            return mob.Properties().indexOf('GM ') > -1;
            }).length || Orion.InJournal('GM ', 'sys', '0', 'any', timeStamp - 3500, Orion.Now() + 500);
        timeStamp = Orion.Now();    
        if(gmCheck)
            {
			 if(useDiscordPush)
			    DiscordPush(Player.Name() + ": GM");
			Orion.PauseScript('all','GMScan');
			Orion.Wait(500);
			Orion.Terminate('all', 'GMScan');
			Orion.StopWalking();
			Orion.Wait(5000);
			if(closeUO)
			    {
			    Orion.OAOptionSet('AutoReconnect', '0');
			    Orion.CloseUO();
			    }
			}
        Orion.Wait(3000);
		}
	}

function DiscordPush(message)
	{
	var bot = Orion.RegRead('discordConfig') || SetDiscordRegistryEntry();
	Orion.HttpPost(bot, "content=" + message);
	}

function SetDiscordRegistryEntry()
    {
    var discordConfig = "https://discordapp.com/api/webhooks/" + "941921319463841843" + '/' + "7edeWcihk41muJgZGU2RouSAzICkLSAH8P4GoEKbv_OyRTa_kMumiQhWHcb4XEYispwI";
    var registryName = 'discordConfig';
    Orion.RegWrite(registryName, discordConfig);
    return discordConfig;
    }