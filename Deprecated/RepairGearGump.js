function RepairGear()
	{//v1
    var RepairGearVersion = '1';
    var durabilityThreshold = 80; //Durability below which to repair
	//Equipment with less than 2 * durabilityThreshold will appear in yellow

    var tinkerLowAlarm = true; //Leave false to ignore this repair type for the alarm
    var blacksmithLowAlarm = true; //Set to true to get an alarm for this repair type running low
    var carpentryLowAlarm = true;
    var tailorLowAlarm = true;
    var masonryLowAlarm = false;
    var glassblowingLowAlarm = false;
    var fletchingLowAlarm  = true;
	
    var alarmThreshold = 20; //If the repair bench gets below this number of scrolls for a repair type, send a discord message

	var flavorText = true; //adds overhead emotes describing the amount of items you need to repair
    
    //tinker: 2001
    //bsmith: 2002
    //carpenter: 2003
    //tailor: 2006
    //fletcher: 2009
    //masonry: 2010
    var repairDict = 
        { //graphicString: buttonCode
        '0x2D2D': 2002,'0x2D21': 2002,'0x0F4A': 2002,'0x0F49': 2002,'0x0F4E': 2002,'0x0F4D': 2002,'0x0F48': 2002,'0x0F47': 2002,'0x0DF0': 2003,'0x0DF1': 2003,'0x26BD': 2002,'0x26C7': 2002,'0x27A8': 2003,'0x26BB': 2002,'0x26C5': 2002,'0x13B1': 2009,'0x13B2': 2009,'0x0F5F': 2002,'0x0F5E': 2002,'0x1B72': 2002,'0x1B73': 2002,
        '0x26CB': 2002,'0x13F4': 2003,'0x13F5': 2003,'0x0F50': 2009,'0x0F4F': 2009,'0x1440': 2002,'0x1441': 2002,'0x0F52': 2002,'0x0F51': 2002,'0x27A9': 2002,'0x2D30': 2002,'0x2D24': 2002,'0x0F4C': 2002,'0x0F4B': 2002,'0x26BF': 2002,'0x26C9': 2002,'0x2D2A': 2009,'0x2D1E': 2009,'0x2D35': 2002,'0x2D29': 2002,'0x2D2C': 2002,
        '0x2D20': 2002,'0x0F46': 2002,'0x0F45': 2002,'0x13F9': 2003,'0x13F8': 2003,'0x143E': 2002,'0x143F': 2002,'0x143C': 2002,'0x143D': 2002,'0x0F44': 2001,'0x0F43': 2001,'0x1B77': 2002,'0x1B76': 2002,'0x13FC': 2009,'0x13FD': 2009,'0x27AD': 2002,'0x13FE': 2002,'0x13FF': 2002,'0x1400': 2002,'0x1401': 2002,'0x27A7': 2002,
        '0x26C0': 2002,'0x26CA': 2002,'0x13FA': 2002,'0x13FB': 2002,'0x2D2E': 2002,'0x2D22': 2002,'0x0F60': 2002,'0x0F61': 2002,'0x0F5D': 2002,'0x0F5C': 2002,'0x2D2B': 2009,'0x2D1F': 2009,'0x143A': 2002,'0x143B': 2002,'0x1B75': 2002,'0x1B74': 2002,'0x1B7B': 2002,'0x27A2': 2002,'0x27AE': 2001,'0x1BC5': 2002,'0x1BC4': 2002,
        '0x2D34': 2002,'0x2D28': 2002,'0x0E85': 2001,'0x0E86': 2001,'0x26BE': 2002,'0x26C8': 2002,'0x0E88': 2001,'0x0E87': 2001,'0x0E8A': 2003,'0x0E89': 2003,'0x2D33': 2002,'0x2D27': 2002,'0x26C3': 2009,'0x26CD': 2009,'0x2D32': 2002,'0x2D26': 2002,'0x27AF': 2002,'0x26BC': 2002,'0x26C6': 2002,'0x13B5': 2002,'0x13B6': 2002,
        '0x26BA': 2002,'0x26C4': 2002,'0x1402': 2002,'0x1403': 2002,'0x0EC5': 2001,'0x0EC4': 2001,'0x0FB4': 2001,'0x0FB5': 2001,'0x13E3': 2001,'0x13E4': 2001,'0x0F63': 2002,'0x0F62': 2002,'0x1B79': 2002,'0x1B78': 2002,'0x27AB': 2002,'0x27A3': 2002,'0x27A6': 2003,'0x1442': 2002,'0x1443': 2002,'0x13BA': 2002,'0x13B9': 2002,
        '0x27A4': 2002,'0x13AF': 2002,'0x13B0': 2002,'0x2D2F': 2002,'0x2D23': 2002,'0x1404': 2002,'0x1405': 2002,'0x1438': 2002,'0x1439': 2002,'0x1406': 2002,'0x1407': 2002,'0x2D31': 2003,'0x2D25': 2003,'0x1B7A': 2003,'0x27A5': 2009,'0x153F': 2006,'0x140D': 2002,'0x140C': 2002,'0x1545': 2006,'0x1454': 2006,'0x144F': 2006,
        '0x144E': 2006,'0x1453': 2006,'0x1450': 2006,'0x1455': 2006,'0x1451': 2006,'0x1456': 2006,'0x1457': 2006,'0x1452': 2006,'0x1F06': 2001,'0x1086': 2001,'0x13BB': 2002,'0x13C0': 2002,'0x2774': 2002,'0x13C3': 2002,'0x13BE': 2002,'0x13C4': 2002,'0x13BF': 2002,'0x1409': 2002,'0x1408': 2002,'0x2778': 2002,'0x1547': 2006,
        '0x171A': 2006,'0x1C07': 2006,'0x1C06': 2006,'0x1C05': 2002,'0x1C04': 2002,'0x1713': 2006,'0x2777': 2002,'0x140B': 2002,'0x140A': 2002,'0x2B75': 2006,'0x2B76': 2006,'0x2B78': 2006,'0x2B77': 2006,'0x2B74': 2006,'0x171C': 2006,'0x2798': 2006,'0x2FC8': 2006,'0x2FC6': 2006,'0x2FC7': 2006,'0x2FC9': 2006,'0x2FCA': 2006,
        '0x2FC5': 2006,'0x1C0B': 2006,'0x1C0A': 2006,'0x1DB9': 2006,'0x1DBA': 2006,'0x277B': 2006,'0x13C6': 2006,'0x13CE': 2006,'0x13C7': 2006,'0x278A': 2006,'0x277E': 2006,'0x2776': 2006,'0x13D2': 2006,'0x13CB': 2006,'0x277A': 2006,'0x278E': 2006,'0x2793': 2006,'0x2792': 2006,'0x2791': 2006,'0x1C01': 2006,'0x1C00': 2006,
        '0x1C09': 2006,'0x1C08': 2006,'0x13C5': 2006,'0x13CD': 2006,'0x2786': 2006,'0x13D3': 2006,'0x13CC': 2006,'0x2781': 2002,'0x140F': 2002,'0x140E': 2002,'0x1F0B': 2006,'0x1F0C': 2006,'0x141B': 2006,'0x1412': 2002,'0x1419': 2002,'0x1410': 2002,'0x1417': 2002,'0x2785': 2002,'0x277D': 2002,'0x1414': 2002,'0x1418': 2002,
        '0x1413': 2002,'0x278D': 2002,'0x2775': 2002,'0x2780': 2002,'0x141A': 2002,'0x1411': 2002,'0x2779': 2002,'0x2788': 2002,'0x1416': 2002,'0x1415': 2002,'0x2B71': 2003,'0x1F09': 2001,'0x108A': 2001,'0x13EB': 2002,'0x13F2': 2002,'0x13F1': 2002,'0x13F0': 2002,'0x13EF': 2002,'0x13EE': 2002,'0x13ED': 2002,'0x13EC': 2002,
        '0x1543': 2006,'0x2784': 2002,'0x2789': 2002,'0x1717': 2006,'0x1C03': 2006,'0x1C0D': 2006,'0x1C0C': 2006,'0x277C': 2006,'0x13D5': 2006,'0x13DD': 2006,'0x13D6': 2006,'0x278B': 2006,'0x277F': 2006,'0x13E1': 2006,'0x13DA': 2006,'0x279D': 2006,'0x13D4': 2006,'0x13DC': 2006,'0x2787': 2006,'0x13E2': 2006,'0x13DB': 2006,
        '0x1716': 2006,'0x1549': 2006,'0x154B': 2006,'0x171B': 2006,'0x2B72': 2003,'0x1714': 2006,'0x2B73': 2003,'0x1718': 2006,'0x2B6C': 2003,'0x2B67': 2003,'0x2B6A': 2003,'0x2B69': 2003,'0x2B6B': 2003,'0x153B': 2006,'0x2643': 2002,'0x1541': 2006,'0x2647': 2002,'0x2FB8': 2001,'0x1087': 2001,'0x4049': 2006,'0x404C': 2006,
        '0x4047': 2006,'0x4D0A': 2010,'0x4066': 2006,'0x4644': 2001,'0x405A': 2010,'0x0284': 2006,'0x4056': 2002,'0x4D0B': 2002,'0x4211': 2001,'0x090A': 2002,'0x030A': 2002,'0x404E': 2006,'0x4050': 2002,'0x405C': 2010,'0x405D': 2010,'0x4058': 2010,'0x46B5': 2006,'0x4062': 2006,'0x404B': 2006,'0x4057': 2010,'0x46B4': 2006,
        '0x4052': 2002,'0x13F7': 2001,'0x13F6': 2001,'0x1BC3': 2002,'0x0EC2': 2001,'0x0EC3': 2001,'0x13B3': 2003,'0x13B4': 2003,'0x26C2': 2009,'0x26CC': 2009,'0x26C1': 2002, '0x2F5B': 2001, '0x1712': 2006,
        }

    //Do not edit below
	var layers = [0,'RightHand','LeftHand','Shoes','Pants','Shirt','Helmet','Gloves','Ring','Talisman','Necklace','Hair','Waist','InnerTorso','Bracelet','Face','Beard','MidTorso','Earrings','Arms','Cloak','Backpack','Robe','Eggs','Legs']
	Orion.Print("Repair threshold set at: " + durabilityThreshold)
    var outStrs = [];
	for(var i=1;i<layers.length;i++)
		{
		if(Orion.ObjAtLayer(i))
			{
			var obj = Orion.ObjAtLayer(i);
			var objProperties = obj.Properties();
			var objDict = repairDict[obj.Graphic()];
            if(!objDict && Orion.Contains(objProperties, 'Durability'))
                Orion.Print('Item needs to be added: ' + obj.Graphic() + ': ' + obj.Name())
			else if(Orion.Contains(objProperties, 'Durability'))
      			{
				var dura = obj.Properties().match(/Durability (\d+) \/ (\d+)/)
				var min = +dura[1];
                var max = +dura[2];
				if(dura[0] && min < durabilityThreshold * 2 && min < max)
                    outStrs.push(layers[obj.Layer()] + ':::' + obj.Name() + ':::' + min + ':::' + max);
      			}
    		}
  		}
    if(!outStrs[0])
    	{
    	var gump = Orion.CreateCustomGump(11420);
    	if(gump)
    		gump.Close()
        if(flavorText)
            return Orion.CharPrint(self,1159,'*You check your equipment and find it is in perfect condition*')
        return Orion.CharPrint(self,1159,'No repairs necessary')
        }
    else if(!flavorText)
        Orion.Wait(1);
    else if(outStrs.length == 1)
        Orion.CharPrint(self,1159,'*You check your equipment and find something in need of repair*')
    else if(outStrs.length < 3)
        Orion.CharPrint(self,1159,'*You check your equipment and find some things that need your attention*')
    else if(outStrs.length < 8)
        Orion.CharPrint(self,1159,"*You check your equipment and make a mental note to not get hit so much in the future*") 
    else if(outStrs.length < 20)
        Orion.CharPrint(self,1159,"*You check what's left of your equipment and marvel that any of it is still attached to you given its abysmal condition*")
    outStrs.sort(function(a,b)
    	{
    	var aSplit = Orion.Split(a,':::');
    	var bSplit = Orion.Split(b,':::');
    	var aMin = aSplit[2];
    	var bMin = bSplit[2];
    	var aMax = aSplit[3];
    	var bMax = bSplit[3];
    	return (aMax - aMin) - (bMax - bMin);
    	});
    var rowAdj = 20;
    var rowMargin = 20;
    var columnMargin = 25;
    var width = 450;
    var height = (outStrs.length * rowAdj) + (rowMargin * 2);
    var gump = Orion.CreateCustomGump(11420);
    gump.Clear();
    gump.AddResizepic(0, 0, 0xBB8, width, height);
    // gump.AddColoredPolygone(1, 2, width - 3, height - 6, '#FF000000', 1, 7, 1); //gump border
    for(var i=0;i<outStrs.length;i++)
        {
        var textColor = '0';
        var str = outStrs[i];
        var strSplit = Orion.Split(str,':::');
        var layerName = strSplit[0];
        var itemName = strSplit[1];
        var minDura = +strSplit[2];
        var maxDura = +strSplit[3];
        if(minDura < durabilityThreshold)
            textColor = '32';
        else if(minDura < durabilityThreshold * 2)
            textColor = '53'
        gump.AddText(columnMargin, rowMargin + (rowAdj * i), '0', layerName, width - 250);
        gump.AddText(columnMargin + 100, rowMargin + (rowAdj * i), textColor, itemName, width - 250);
        gump.AddText(columnMargin + 320, rowMargin + (rowAdj * i), textColor, minDura + '/' + maxDura, width - 250);
        }
    gump.AddText(415 ,height - 25,0,"v" + RepairGearVersion)
    gump.Update();
    for(var i=1;i<layers.length;i++)
		{
		if(Orion.ObjAtLayer(i))
			{
			var obj = Orion.ObjAtLayer(i);
			var objProperties = obj.Properties();
			var objDict = repairDict[obj.Graphic()];
			if(Orion.Contains(objProperties, 'Durability') && objDict)
      			{
				var dura = obj.Properties().match(/Durability (\d+) \/ (\d+)/)
				var min = +dura[1];
                var max = +dura[2];
				if(dura[0] && min < durabilityThreshold * 2 && min < max)
			        {
				    var bench = Orion.FindType('0xA278|0xA277|0xA27F|0xA27E', any, ground, '', 2)[0];
			        if(bench)
			        	{
			        	var repairType = objDict;
                        var endTime = Orion.Now() + 10000;
                        var repairGump = Orion.GetGump(any, '0x00002415');
				        while(!repairGump && Orion.Now() < endTime)
                            {
                            Orion.UseObject(bench);
				        	Orion.WaitForGump(2000);
                            repairGump = Orion.GetGump(any, '0x00002415');
                            }
                        if(repairGump !== null)
                            {
                            repairGump.Select(Orion.CreateGumpHook(repairType));
                            var tinkerCount = tinkerLowAlarm || +repairGump.Text(1) < alarmThreshold;
                            var blacksmithCount =  blacksmithLowAlarm || +repairGump.Text(3) < alarmThreshold;
                            var carpentryCount =  carpentryLowAlarm || +repairGump.Text(5) < alarmThreshold;
                            var tailorCount =  tailorLowAlarm || +repairGump.Text(7) < alarmThreshold;
                            var masonryCount =  masonryLowAlarm || +repairGump.Text(9) < alarmThreshold;
                            var glassblowingCount =  glassblowingLowAlarm || +repairGump.Text(11) < alarmThreshold;
                            var fletchingCount = fletchingLowAlarm || +repairGump.Text(13) < alarmThreshold;
                            if(tinkerCount || blacksmithCount || carpentryCount || tailorCount || masonryCount || glassblowingCount || fletchingCount)
                                Orion.CharPrint(self,32,'Check repair bench!')  //DiscordPush(Orion.ShardName() + ': Check repair bench!');
                            if(Orion.WaitForTarget(2000))
                                Orion.TargetObject(obj.Serial());
                            }
                        Orion.WaitForGump(2000);
				        }		   
			        }
      			}
    		}
        Orion.Wait(100);
  		}
    Orion.Wait(1000);
    for(var i=1;i<layers.length;i++)
        {
        if(Orion.ObjAtLayer(i))
            {
            var obj = Orion.ObjAtLayer(i);
            var objProperties = obj.Properties();
            var objDict = repairDict[obj.Graphic()];
            if(objDict && Orion.Contains(objProperties, 'Durability'))
                {
                var dura = obj.Properties().match(/Durability (\d+) \/ (\d+)/);
                var min = +dura[1];
                var max = +dura[2];
                if(dura[0] && min < durabilityThreshold * 2 && min < max)
                    {
                    var bench = Orion.FindType('0xA278|0xA277|0xA27F|0xA27E', any, ground, '', 2)[0];
                    if(bench)
                        return RepairGear();
                    }                   
                }
            }
        }
    var bench = Orion.FindType('0xA278|0xA277|0xA27F|0xA27E', any, ground, '', 2)[0];
    gump = Orion.CreateCustomGump(11420);
    if(bench && gump)
        gump.Close();
	}