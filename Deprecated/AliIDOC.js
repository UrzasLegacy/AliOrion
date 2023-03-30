function Autostart()
	{
    while(!Orion.GumpExists('container',backpack))
        {
        Orion.UseObject(backpack)
        Orion.Wait(1300);
        }
    Orion.Wait(2000);
	var sign = Orion.FindTypeEx(any,any,ground,'item',24).filter(function(item)
		{
        var itemProps = item.Properties();
		return Orion.Contains(itemProps, 'a house sign') && Orion.Contains(itemProps, 'Collapsing In:');
		})[0];
    if(!sign)
        return Orion.CharPrint(self,1159,'No sign found!');
	if(sign)
        {
        var signSerial = sign.Serial();
        var signObj = Orion.FindObject(signSerial);
        while(signObj)
            {
           	var timeLeft = signObj.Properties().match(/.+$/) || [];
           	if(timeLeft[0])
           		Orion.Print(timeLeft[0]);
           	else
           		Orion.Print('Waiting for house to fall');
            if(!Player.Hidden())
                Orion.UseSkill('Hiding');
            Orion.Wait(2000);
            signObj = Orion.FindObject(signSerial);
            }
        Orion.Print('House Fell!');
        Orion.Wait(1000);
        }
	Orion.Exec('IDOCBarrels',true)
	}

function IDOCBarrels()
 	{
    var startX
    var startY
 	var barrels = Orion.FindTypeEx('0x0FAE|0x0E77|0x1EB5', any, ground, ' ', '24');
	if(!barrels[0])
        {
        Orion.Wait(5000);
		return IDOCBarrels();
        }
	var Wbound = barrels.sort(function(a,b){return a.X()-b.X()})[0].X();
	var Nbound = barrels.sort(function(a,b){return a.Y()-b.Y()})[0].Y();
	var Ebound = barrels.sort(function(a,b){return b.X()-a.X()})[0].X();
	var Sbound = barrels.sort(function(a,b){return b.Y()-a.Y()})[0].Y();
	Orion.ClearFakeMapObjects();
	var i = 0;
	Orion.GetTilesInRect('land', Wbound+1, Nbound+1, Ebound-1, Sbound-1)
    	.concat(Orion.GetTilesInRect('land', Wbound, Sbound-2, Wbound, Sbound-2))
      		.forEach(function(tile) 
      			{
           		Orion.AddFakeMapObject(i++, '0x051A', 1159, tile.X(), tile.Y(), tile.Z());
				});
	Orion.Wait(100);
    while(!Player.Dead()) 
    	{
        Orion.SetSearchArea(Wbound, Sbound-2, Wbound, Sbound-2);
	    var barrel = Orion.FindTypeEx('0x0FAE|0x0E77|0x1EB5', any, ground, 'near', '24')[0];
	    Orion.ResetSearchArea();
        if(!barrel)
            break;
        startX = barrel.X() - 1;
        startY = barrel.Y();
        if(Orion.GetDistance(startX,startY) > 0)
            Orion.WalkTo(startX,startY,0,0);
        else
            Orion.Attack(barrel.Serial());
       Orion.Wait(250);
        }
    while(!Player.Dead())
        {
        Orion.SetSearchArea(Wbound+1, Nbound+1, Ebound-1, Sbound-1)
	    var barrel = Orion.FindTypeEx('0x0FAE|0x0E77|0x1EB5', any, ground, 'near', '24')[0];
	    Orion.ResetSearchArea()
        if(!barrel)
            break;
        if(barrel.Distance() > 1)
            Orion.WalkTo(barrel.X(), barrel.Y(), 0);
        else
            Orion.Attack(barrel.Serial());
        Orion.Wait(250);
	 	}
    while(!Player.Hidden())
        {
        Orion.UseSkill('Hiding');
        Orion.Wait(1000);
        }
    Orion.WalkTo(startX,startY,0,0);
	}

function GetIDOCLoc()
    {
    var shardName = Orion.ShardName();
    var hash = {};
    var returnArr = [];
    var i = 0;
    var minister = Orion.FindTypeEx(any,any,ground,'mobile',20).filter(function(npc)
        {
        return Orion.Contains(npc.Properties(), 'Minister of Trade')
        })[0];
    if(!minister)
        return Orion.CharPrint(self,1159,'No minister nearby');
    var startX = minister.X();
    var startY = minister.Y() - 5;
    var ministerSerial = minister.Serial();
    while(Player.X() != startX || Player.Y() != startY)
        {
        Orion.WalkTo(startX,startY,0,0);
        Orion.Wait(500);
        }
    while(true)
        {
        var startTime = Orion.Now();
        Orion.WalkTo(startX, startY + 1, 0,0)
        Orion.Wait(500);
        Orion.Resend();
        var msg = Orion.InJournal('Royal Engineers', 'mobile', ministerSerial, any, startTime, Orion.Now());
        if(msg)
            {
            var msgText = msg.Text();
            if(hash[msgText])
                continue;
            hash[msgText] = true;
            i = 0;
            var parse = msgText.match(/a structure in danger of collapsing near ([\w', ]+) at ([\w', ]+)/)
            if(!parse.shift())
                continue;
            var locationText = parse[0];
            var locationSextantCoords = parse[1];
            var coords = Orion.SextantToXY(locationSextantCoords, 1);
            var X = coords.X();
            var Y = coords.Y();
            Orion.Print(X + ',' + Y);
            if(Orion.Contains(locationText, 'Malas'))
                var targetMap = 'Malas';
            else if(Orion.Contains(locationText, 'Ter Mur'))
                var targetMap = 'TerMur';
            else if(Orion.Contains(locationText, 'Tokuno'))
                var targetMap = 'Tokuno';
            else
                var targetMap = 'Trammel';
            Orion.SetWorldMapPointerPosition(X, Y, targetMap);
            Orion.Wait(500);
            var tempArr = [shardName, locationText, X, Y, targetMap, locationSextantCoords];
            var charMsg = shardName + '\n' + locationText + '\n' + X + ',' + Y;
            var outMsg = shardName + ': ' + locationText + ': ' + X + ',' + Y;
            returnArr.push(tempArr);
            //Orion.CharPrint(self,1159,charMsg)
            //Orion.Screenshot();
            //TextWindow.Open();
            //TextWindow.Print(outMsg);
            //DiscordPush(outMsg);
            Shared.AddArray('locs',returnArr);
            IDOCGump(returnArr)
            }
        Orion.Print('i: ' + i)
        if(i > 2)
            break;
        Orion.WalkTo(startX,startY,0,0);
        Orion.Wait(250);
        Orion.Resend();
        Orion.Wait(5000);
        i++;
        }
    //return returnArr;
    }

function IDOCGump(locs)
    {// gem 0x4B9, 0x4BA, 0x4B9
    var width = 470;
    var height = 37 + 30 * locs.length;
    Orion.CreateCustomGump(5001);
    var gump = Orion.CreateCustomGump(12001);
    gump.SetCallback('GumpCallback');
    gump.Clear();
    gump.AddResizepic(0, 0, 0xBB8, width, height);
    gump.AddText(12, 8, 0, 'Show/Go/Post', 500, 20000 + i);
    gump.AddText(125, 8, 0, 'Shard', 500, 20000 + i);
    gump.AddText(199, 8, 0, 'Location', 500, 20000 + i);
    gump.AddText(375, 8, 0, 'Coords', 500, 20000 + i);
    for(var i=0;i<locs.length;i++)
        {
        var loc = locs[i];
        var posX = 10;
        var posY = 38 + 30*i;
        gump.AddButton(i + 1, posX + 3, posY - 3, 0x5FC, 0x5FB, 0x5FC, 0x0000);
        gump.AddButton(i + 15, posX + 33, posY - 3, 0x604, 0x603, 0x604, 0x0000);
        gump.AddButton(i + 30, posX + 63, posY - 3, 0x5FE, 0x5FD, 0x5FE, 0x0000);
        gump.AddText(posX + 115, posY - 3, 1159, loc[0], 200, 20000 + i);
        gump.AddText(posX + 189, posY - 3, 1159, loc[1], 200, 30000 + i);
        gump.AddText(posX + 365, posY - 3, 1159, loc[2] + ',' + loc[3], 200, 40000 + i);
        }
    gump.Update();
    }

function GumpCallback(_) 
    {
    var code = CustomGumpResponse.ReturnCode();
    var gump = Orion.CreateCustomGump(12001);
    var locs = Shared.GetArray('locs');
    locs.unshift('');
    if(code == 0) 
        gump.Close();
    for(var i=1;i<locs.length;i++)
        {//[shardName, locationText, X, Y, facet, sextantcoords]
        var loc = locs[i]
        if(code == i)
            {
            Orion.SetWorldMapPointerPosition(loc[2], loc[3], loc[4]);
            DiscordPush(ScreenshotLinkFormatter(loc[2],loc[3],loc[4]));
            //var tempArr = [shardName, locationText, X, Y]
            //var charMsg = loc[0] + '\n' + loc[1] + '\n' + loc[2] + ',' + loc[3];
            //var outMsg = loc[0] + ': ' + loc[1] + ': ' + loc[2] + ',' + loc[3];
            //Orion.Screenshot();
            //TextWindow.Open();
            //TextWindow.Print(outMsg);
            //DiscordPush(outMsg);
            }
        else if(code == i + 14)
            {
            //Orion.StopWalking();
            //Orion.ToggleScript('AliAtlas', true, [[loc[2],loc[3],loc[1]]]);
            AliAtlas([loc[2],loc[3],loc[4]])
            }
        else if(code == i + 29)
            {
            DiscordPush(loc[0] + ': ' + loc[1] + ': ' + loc[2] + ',' + loc[3])
            }
        }
    }

function ScreenshotLinkFormatter(x,y,facet)
    { //[x,y,'facet']
    Orion.Print('----')
    var sextant = Orion.XYToSextant(x, y, facet);
    var sextantURL = sextant.replace(/[ ,']/g, '');
    Orion.Print('sextant: ' + sextant)
    Orion.Print('sextantURL: ' + sextantURL)
    Orion.Print('----')
    var facetEnc = {
        'Trammel': 'tr',
        'Felucca': 'fe',
        'Malas': 'ma',
        'TerMur': 'sa',
        'Tokuno': 'to'
        }
    var url = 'https://uovm.info/map/?g=' + facetEnc[facet] + sextantURL;
    return url;
    }
//Sextant From Minister:      88o 46'S, 26o 43'E
//Sextant From Function:      88o46S26o43E
//https://uovm.info/map/?g= ma 97o12N 23o24W

function initTest(_)
	{
	AliAtlas([2604,836,'trammel'])
	}

function AliAtlas(target)
    { //[x,y,facet]
    var maps = ['Felucca', 'Trammel', 'Ilshenar', 'Malas', 'Tokuno', 'TerMur'];
    var gateArr = 
        [//location name, facet, facet# x, y
            ['Moonglow', 'Trammel', 1, 4467, 1283],
            ['Britain', 'Trammel', 2, 1421, 1696],
            ['Jhelom', 'Trammel', 3, 1499, 3771],
            ['Yew', 'Trammel', 4, 771, 752],
            ['Minoc', 'Trammel', 5, 2701, 692],
            ['Trinsic', 'Trammel', 6, 1828, 2948],
            ['Skara Brae', 'Trammel', 7, 643, 2067],
            ['New Magincia', 'Trammel', 8, 3566, 2140],
            ['New Haven', 'Trammel', 27, 3450, 2677],
            ['Moonglow', 'Felucca', 9, 4467, 1283],
            ['Britain', 'Felucca', 10, 1421, 1696],
            ['Jhelom', 'Felucca', 11, 1499, 3771],
            ['Yew', 'Felucca', 12, 771, 752],
            ['Minoc', 'Felucca', 13, 2701, 692],
            ['Trinsic', 'Felucca', 14, 1828, 2948],
            ['Skara Brae', 'Felucca', 15, 643, 2067],
            ['New Magincia', 'Felucca', 16, 3566, 2140],
            ['Buccaneers Den', 'Felucca', 26, 2711, 2234],
            ['Compassion', 'Ilshenar', 17, 1215, 467],
            ['Honesty', 'Ilshenar', 18, 772, 1366],
            ['Honor', 'Ilshenar', 19, 744, 724],
            ['Humility', 'Ilshenar', 20, 281, 1016],
            ['Justice', 'Ilshenar', 21, 987, 1011],
            ['Sacrifice', 'Ilshenar', 22, 1174, 1286],
            ['Spirituality', 'Ilshenar', 23, 1532, 1340],
            ['Valor', 'Ilshenar', 24, 528, 216],
            ['Chaos', 'Ilshenar', 25, 1721, 218],
            ['Luna', 'Malas', 28, 1015, 527],
            ['Umbra', 'Malas', 29, 1997, 1386],
            ['Isamu-Jima', 'TerMur', 30, 1169, 998],
            ['Makoto-Jima', 'TerMur', 31, 802, 1204],
            ['Homare-Jima', 'TerMur', 32, 270, 628],
            ['Royal City', 'TerMur', 33, 850, 3525],
            ['Valley of Eodon', 'TerMur', 34, 719, 1863],
        ]

    var x = Player.X();
    var y = Player.Y();
    var map = maps[Player.Map()];
    var targetX = target[0];
    var targetY = target[1];
    var targetMap = target[2];
    
    if(Orion.GetPathArray(targetX, targetY, 256, 0).length && maps[Player.Map()] == targetMap)
        {
        var attempt = 0
        Orion.WarMode(1);
        while(Orion.GetDistance(targetX, targetY) > 20 && attempt < 10)
            {
            attempt++;
            Orion.WalkTo(targetX, targetY, 0,0)
            Orion.Wait(500);
            Orion.Print(1);
            }
        var sign = Orion.FindTypeEx(any,any,ground,'item',24).filter(function(item)
            {
            return Orion.Contains(item.Properties(), 'a house sign') && Orion.Contains(item.Properties(), 'Collapsing In:');
            })[0];
        if(!sign)
            return Orion.CharPrint(self,1159,"Couldn't find house sign!");
        var timeLeft = sign.Properties().match(/Collapsing In: Less Than \d+ Hours/) || [];
        if(timeLeft[0])
            for(var i = 0;i<10;i++)
                {
                Orion.PrintFast(sign.Serial(),1159,0,timeLeft[0])
                Orion.Wait(500);
                }
        return;
        }
    var nearestGate = gateArr.filter(function(gate){return gate[1] == map})
    	//.filter(function(gate)
    	//{
    	//return Orion.GetPathArray(gate[3], gate[4], 256, 0).length
        //return Orion.GetDistance(gate[3],gate[4]) < 1000;
        //})
        .sort(function(a,b)
        	{
	        //return Orion.GetPathArray(a[3], a[4], 256, 0).length - Orion.GetPathArray(b[3], b[4], 256, 0).length
	        return Orion.GetDistance(a[3],a[4]) - Orion.GetDistance(b[3],b[4]);
	        })[0];
    var destinationGate = gateArr.filter(function(gate){return gate[1] == targetMap})
        .sort(function(a,b)
        {
        return DistBetweenPoints(targetX,targetY,a[3],a[4]) - DistBetweenPoints(targetX,targetY,b[3],b[4])
        })[0];
    Orion.Print(nearestGate[1] + ' - ' + nearestGate[0] + ' ' + nearestGate[3] + ', ' + nearestGate[4] + ':' + Orion.GetPathArray(nearestGate[3], nearestGate[4], 256, 0).length)
    Orion.Print(destinationGate[1] + ' - ' + destinationGate[0] + ' ' + destinationGate[3] + ', ' + destinationGate[4])
    var attempt = 0;
    Orion.WarMode(1);
    while(Orion.GetDistance(nearestGate[3], nearestGate[4]) > 2 && attempt < 10)
        {
        attempt++
        Orion.WalkTo(nearestGate[3], nearestGate[4], 0,0);
        Orion.Wait(500);
        }
    var tempX = Player.X();
    var tempY = Player.Y();
    while(Orion.GetDistance(destinationGate[3],destinationGate[4]) > 2)
        {
        if(Orion.WaitForGump(2000))
            {
            var gump0 = Orion.GetGump('last');
            if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00000258'))
                {
                var gumpHook0 = Orion.CreateGumpHook(1);
                gumpHook0.AddCheck(destinationGate[2], true);
                gump0.Select(gumpHook0);
                Orion.Wait(100);
                }
            }
        else
            {
            var gate = Orion.FindTypeEx('0x0F6C', any, ground, 'near', 24);
            if(gate[0])
                {
                while(Orion.GetDistance(gate[0].X(), gate[0].Y()))
                    {
                    Orion.WalkTo(gate[0].X(),gate[0].Y(),0,0);
                    Orion.Wait(500);
                    }
                Orion.Resend();
                Orion.Wait(500);
                Orion.UseObject(gate[0].Serial());
                }
            }
        Orion.Wait(1000);
        }
    Orion.WarMode(1);
    var attempt = 0;
    while(Orion.GetDistance(targetX, targetY) > 20 && attempt < 10)
        {
        attempt++;
        Orion.WalkTo(targetX, targetY, 0,0)
        Orion.Wait(500);
        Orion.Print(1);
        }
    var sign = Orion.FindTypeEx(any,any,ground,'item',24).filter(function(item)
		{
		return Orion.Contains(item.Properties(), 'a house sign') && Orion.Contains(item.Properties(), 'Collapsing In:');
		})[0];
	if(!sign)
		return Orion.CharPrint(self,1159,"Couldn't find house sign!");
    var timeLeft = sign.Properties().match(/Collapsing In: Less Than \d+ Hours/) || [];
    if(timeLeft[0])
        for(var i = 0;i<10;i++)
            {
            Orion.PrintFast(sign.Serial(),1159,0,timeLeft[0])
            Orion.Wait(500);
            }
    }


function SignShouter()
    {
    var hash = {};
    var maps = ['Felucca', 'Trammel', 'Ilshenar', 'Malas', 'Tokuno Islands', 'Ter Mur'];
    var shard = Orion.ShardName();
    var map = maps[Player.Map()];
    var interval = 30000;
    var discordRole = '<@%26' + '1044026979764158544> '; //@IDOC role
    var bot = "https://discordapp.com/api/webhooks/"
        + '887268637315047444' //hook
        + "/"
        + 'SJfWniY7dpD9URmrvXSPb3EFs7DzrZiVH5_Wd4f16Tg695utEVXeLc7quvb8Gwjmg_0Z'; //key
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
    while(signObj)
        {
        var timeLeft = signObj.Properties().match(/.+$/) || [];
        var timeStr = timeLeft[0];
        if(timeStr)
            {
            if(!hash[timeStr])
                {
                hash[timeStr] = true;
                if(Orion.Contains(timeStr, 'second'))
                    {
                    Orion.HttpPost(bot, paramText + discordRole + 'LAST CALL! ' + shard + ' IDOC ' + timeStr + ' at: ' + locX + ',' + locY + ' in ' + map);
                    break;
                    }
                else if(Orion.Contains(timeStr, 'minute'))
                    {
                    interval = 600000;
                    }
                Orion.HttpPost(bot, paramText + discordRole + shard + ' IDOC ' + timeStr + ' at: ' + locX + ',' + locY + ' in ' + map);
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

function hideall()
	{
	while(true)
		{
		var peeps = Orion.FindType(any, any, ground, 'live|ignoreself', 24)
		for(i=0;i<peeps.length;i++)
			{
			Orion.Hide(peeps[i])
			}
		Orion.Wait(500);
		}
	}

function DistBetweenPoints(x1,y1,x2,y2)
    {
    return Math.floor(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)))
    }

function DiscordPush(msg)
	{
	var bot = "https://discordapp.com/api/webhooks/"
        + '887268637315047444' //hook
        + "/"
        + 'SJfWniY7dpD9URmrvXSPb3EFs7DzrZiVH5_Wd4f16Tg695utEVXeLc7quvb8Gwjmg_0Z'; //key
    var paramText = "content=" + msg;
	Orion.HttpPost(bot, paramText);
	}