function HouseShouter()
    {
    Orion.RemoveDisplayTimer('shout');
    var plot = '17x18 Trammel SE of Yew Moongate';
    var price = '1p';
    var text = 'wts ' + plot + ' ' + price + '. Gate up at Luna stables';
    var interval = 0;
    var rune = Orion.FindTypeEx('0x1F14').filter(function(part)
        {
        return Orion.Contains(part.Properties(), 'house');
        })[0];
    if(!rune)
        return Orion.CharPrint(self,1159,"Couldn't find rune titled 'House'! Halting...")
    var runeSerial = rune.Serial();
    while(true)
        {
        if(!Orion.DisplayTimerExists('shout'))
            {
            Orion.Say(',' + text);
            interval = 300000 + (Orion.Random(-10,11) * 1000);
	        Orion.AddDisplayTimer('shout', interval, 'AboveChar', 'bar', 'Next Shout');
            }
        if(!Orion.FindType('0x0F6C',any,ground,'',0)[0])
            {
            var startTime = Orion.Now();
            Orion.Cast('Gate Travel');
            Orion.WaitForTarget(6000) && Orion.TargetObject(runeSerial);
            Orion.WaitJournal('You open a magical gate to another location|The spell fizzles.',startTime,Orion.Now() + 6000,'my|sys');
            }
        Orion.Wait(1000);
        }
    }

function ProspectMonitor()
    {
    var hook = '1054570293462581269';
    var key = 'LoiZt4nFioMgO37jRPfgOKsqsrw7j8QgAUt_W7Rbh4vZAxenTWzAXbVNhMOvPAbC182H';
    var bot =
        "https://discordapp.com/api/webhooks/"
        + hook
        + "/"
        + key; // Webhook url
    var GMhook = '941921319463841843';
    var GMkey = '7edeWcihk41muJgZGU2RouSAzICkLSAH8P4GoEKbv_OyRTa_kMumiQhWHcb4XEYispwI';
    var GMbot =
        "https://discordapp.com/api/webhooks/"
        + GMhook
        + "/"
        + GMkey; // Webhook url
    while(true)
        {
        //Orion.ClearJournal(' ', 'my|item');
        for(var i=0;i<Orion.JournalCount();i++)
			{
			var msg = Orion.JournalLine(i);
            if(!msg)
                continue;
            var msgText = msg.Text();
            if(Orion.Contains(msgText, 'GM '))
                {
                Orion.HttpPost(GMbot, "content=" + Player.Name() + ": GM")
                Orion.PauseScript('all');
                }
            var msgFlag = msg.Flags()
            if(msgFlag != 0x04)
                continue;
			var msgSerial = msg.Serial();
			if(Orion.GetDistance(msgSerial) < 5)
				{
				var mobileObj = Orion.FindObject(msgSerial);
                var paramText = "content=" + Player.Name() + ': Potential Prospect: ' + mobileObj.Name() + ' said: ' + msgText;
                Orion.HttpPost(bot, paramText)
                Orion.Wait(1000);
				}
            Orion.ClearJournal(msgText);
            Orion.Wait(10);
			}
        Orion.Wait(1000);
        }
    }