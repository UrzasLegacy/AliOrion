function AutoTracker()
    {
    while(true)
        {
        for(var i=1;i<5;i++)
            {
            if(i == 3)
                continue;
            var msg = 'Searching for ';
            if(i == 1)
                msg += 'Animals';
            else if(i == 2)
                msg += 'Monsters';
            else
                msg += 'Players'
            Orion.CharPrint(self,1159,msg);
            Orion.UseSkill('Tracking')
            var check = Orion.WaitJournal('What do you wish to track?',Orion.Now(),Orion.Now() + 2000,'sys');
            if(!check)
                {
                i--;
                continue;
                }
            var gump = WaitForSpecificGump(2000, 'generic', 'any', '0x00BC7230')
            if(gump)
                {
                gump.Select(Orion.CreateGumpHook(i));
                var check = Orion.WaitJournal('Select the one you would like to track.|You see no evidence of those in the area.',Orion.Now(),Orion.Now() + 5000,'sys');
                if(check && check.Text() == 'Select the one you would like to track.')
                    {
                    gump = WaitForSpecificGump(2000, 'generic', any, '0x00BC7231')
                    if(gump)
                        {
                        var textList = gump.TextList();
                        if(textList[0])
                            {
                            var outMsg = '';
                            for(var j=0;j<textList.length;j++)
                                {
                                var text = textList[j];
                                outMsg = text + '\n';
                                }
                            if(outMsg.length)
                                { 
                                var msg = '';
                                if(i == 1)
                                    msg += 'Animals';
                                else if(i == 2)
                                    msg += 'Monsters';
                                else
                                    msg += 'Players'
                                outMsg = msg + ':\n' + outMsg;
                                DiscordPush(outMsg);
                                }
                            }
                        gump.Select(Orion.CreateGumpHook(1));
                        }
                    }
                }
            }
        }
    }

function WaitForSpecificGump(delay, type, serial, id)
    {
    var endTime = Orion.Now() + delay
    while(!Orion.GumpExists(type, serial, id) && Orion.Now() < endTime)
    	Orion.Wait(100);
    if(Orion.GumpExists(type, serial, id))
        return Orion.GetGump(serial, id);
    return false;
    }

    // Gump information:
    // Serial=0x039AEAA2
    // ID=0x00BC7231
    // X=20
    // Y=30
    
    // Gump buttons:
    // [1]	 button 20 130 4005 4007 1 0 1 
    
    // Gump checks & radios:
    
    // Gump entries:
    
    // Gump all commands:
    //  resizepic 0 0 5054 440 155 
    //  resizepic 10 10 2620 420 75 
    //  resizepic 10 85 3000 420 45 
    //  tilepichue 20 20 8454 1002 
    //  button 20 130 4005 4007 1 0 1 
    //  htmlgump 20 90 90 40 0 0 0 
    
    // Gump text:
    // [0]	Disco Stu