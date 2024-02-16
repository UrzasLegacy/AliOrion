function SignShouter()
    {
    var hash = {};
    var maps = ['Felucca', 'Trammel', 'Ilshenar', 'Malas', 'Tokuno', 'TerMur'];
    var facetEnc = {'Trammel': 'tr','Felucca': 'fe','Malas': 'ma','TerMur': 'sa','Tokuno': 'to'}
    var shard = Orion.ShardName();
    var map = maps[Player.Map()];
    var URLEnc = 'https://uovm.info/map/?g=' + facetEnc[map]; //credit to https://uovm.info/map/
    var interval = 30000;
    var discordRole = '<@%26' + '1044026979764158544> '; //@IDOC role
    var bot = "https://discordapp.com/api/webhooks/"
        + '1044022516240363591' //hook 1044022516240363591
        + "/"
        + '1YAXh8kTt4kx0VzW2X9IsF3Pz16EaDpo_dJB0qFNAHatZITWPiGuXeidvAZ1Ukudkuck'; //key 1YAXh8kTt4kx0VzW2X9IsF3Pz16EaDpo_dJB0qFNAHatZITWPiGuXeidvAZ1Ukudkuck
    var paramText = "content=";

	var sign = Orion.FindTypeEx(any,any,ground,'item',24).filter(function(item)
		{
        var itemProps = item.Properties();
		return Orion.Contains(itemProps, 'a house sign') && Orion.Contains(itemProps, 'Collapsing In:');
		})[0];
    while(!sign)
        {
        Orion.CharPrint(self,1159,'Searching for IDOC sign...')
        Orion.Wait(2000);
        sign = Orion.FindTypeEx(any,any,ground,'item',24).filter(function(item)
            {
            var itemProps = item.Properties();
            return Orion.Contains(itemProps, 'a house sign') && Orion.Contains(itemProps, 'Collapsing In:');
            })[0];
        }
    var signSerial = sign.Serial();
    var signObj = Orion.FindObject(signSerial);
    var locX = signObj.X();
    var locY = signObj.Y();
    var sextant = Orion.XYToSextant(locX, locY, map);
    var sextantURL = sextant.replace(/[ ,']/g, '');
    var fullURL = URLEnc + sextantURL;
    var first = true;
    while(signObj)
        {
        var timeLeft = signObj.Properties().match(/.+$/) || [];
        var timeStr = timeLeft[0];
        if(timeStr)
            {
            if(!hash[timeStr])
                {
                hash[timeStr] = true;
                var outMsg = discordRole + ' ' + shard + ' IDOC ' + timeStr + ' at: ' + locX + ',' + locY + ' in ' + map;
                if(first) outMsg = outMsg + '\n' + fullURL;
                if(Orion.Contains(timeStr, 'second'))
                    {
                    Orion.HttpPost(bot, paramText + outMsg + ' LAST CALL!');
                    break;
                    }
                else if(Orion.Contains(timeStr, 'minute'))
                    {
                    interval = 600000;
                    }
                Orion.HttpPost(bot, paramText + outMsg);
                first = false;
                }
            Orion.Print(timeLeft[0]);
            }
        else
            Orion.Print('Waiting for house to fall');
        if(!Player.Hidden())
            Orion.UseSkill('Hiding');
        Orion.AddDisplayTimer('idoc', interval, 'AboveChar', 'circle', 'Checking again in:',0,40,1159);
        Orion.Wait(10);
        while(Orion.DisplayTimerExists('idoc') && !Orion.Contains(signObj.Properties(),'second'))
            Orion.Wait(500);
        signObj = Orion.FindObject(signSerial);
        }
    }