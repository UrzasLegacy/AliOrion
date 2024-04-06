//v17 Refactor to Interval Mode
var houseButtons = [3, 5243];
var houseTargetCoords = [762,740,0]; //x,y,z
var placementCooldown = 32000 //milliseconds
var testTime = 7200000 //two hours

var fullAuto = false; //wait for house to fall, do barrels, move only placer to front of house, initiate Checkers, Placer, and Dom, Close Checkers/Dom after attempting placement
var walkToFront = true; //walk all non-EJs to the front of the plot after doing barrels
var castleMode = false; //set to true if the IDOC is a castle, too big to get accurate foundation size the normal way
var limitViewRange = false; //set to true to limit client view range after doing barrels.
var placeRepeatedlyOnFailure = true;

//DISABLED var relogAccounts = false; //relog paid accounts from barrel smackers to another character on that account (i.e. pinks)

function Autostart()
	{
    while(!Orion.GumpExists('container',backpack))
        {
        Orion.UseObject(backpack);
        Orion.Wait(1300);
        }
    Orion.ClientViewRange(24);
    var outMsg = 'House Code: ' + JSON.stringify(houseButtons) + '\nHouse Coords: ' + JSON.stringify(houseTargetCoords) + '\nWalk to Front: ' + walkToFront + '\nCastle Mode: ' + castleMode;
    if(fullAuto)
        outMsg += '\nFull Auto: true';
    Orion.Wait(2000);
    Orion.Print(outMsg);
    Gump();
    //Orion.Exec('GMJournalScan',true);
	var sign = Orion.FindTypeEx(any,any,ground,'item',24).sort(function(a,b)
        {
        return a.Distance() - b.Distance();
        }).filter(function(item)
            {
            var itemProps = item.Properties();
            return Orion.Contains(itemProps, 'a house sign') && Orion.Contains(itemProps, 'Collapsing In:');
            })[0];
    while(!sign)
        {
        Orion.CharPrint(self,1159,'No sign found!');
        if(Orion.GetDistance(3686,1362) < 20)
            AutoGate();
        Orion.Wait(5000);
        var barrels = Orion.FindType('0x0FAE|0x0E77|0x1EB5', any, ground, ' ', '20');
        if(barrels.length > 6)
            break;
        sign = Orion.FindTypeEx(any,any,ground,'item',24).sort(function(a,b)
            {
            return a.Distance() - b.Distance();
            }).filter(function(item)
                {
                var itemProps = item.Properties();
                return Orion.Contains(itemProps, 'a house sign') && Orion.Contains(itemProps, 'Collapsing In:');
                })[0];
        }
	if(sign)
        {
        var signSerial = sign.Serial();
        var signObj = Orion.FindObject(signSerial);
        var interval = 0;
        while(signObj)
            {
           	var timeLeft = signObj.Properties().match(/.+$/) || [];
           	if(timeLeft[0])
           		Orion.CharPrint(self,1159,timeLeft[0]);
           	else
                Orion.CharPrint(self,1159,'Waiting for house to fall');
            if(!Player.Hidden())
                Orion.UseSkill('Hiding');
            if(Orion.Now() > interval)
                {
                Orion.UseObject(backpack);
                Orion.Wait(1300);
                interval = Orion.Now() + 120000;
                }
            Orion.Wait(2000);
            signObj = Orion.FindObject(signSerial);
            }
        Orion.CharPrint(self,1159,'House Fell!');
        Orion.Wait(1000);
        }
	Orion.Exec('IDOCBarrels',true);
	}

//--#Find and Monitor IDOC
function PassiveSignReader()
    {//Will simply read house signs near you and alert if a house is in any of the falling stages
   	Orion.IgnoreReset();
    while(true)
        {
        var signObj = Orion.FindTypeEx(any,any,ground,'item',24).filter(function(item)
            {
            var itemProps = item.Properties();
            return Orion.Contains(itemProps, 'a house sign') && Orion.Contains(itemProps, 'Condition:');
            });
        for(var i=0;i<signObj.length;i++)
            {
            var sign = signObj[i];
            var signProps = sign.Properties();
            Orion.CharPrint(self,1159,'House found!')
            Orion.CharPrint(sign.Serial(),1159,signProps)
            Orion.Ignore(sign.Serial())
            }
        Orion.Wait(500);
        }
    }

function GetIDOCLoc()
    {//Stand near a Minister of Trade and this will grab IDOC coords
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
            else if(Orion.Contains(locationText, 'Tokuno|Makoto'))
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
    //Orion.CreateCustomGump(5001);
    var gump = Orion.CreateCustomGump(12001);
    gump.SetCallback('IDOCGumpCallback');
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

function IDOCGumpCallback(_CallOnly) 
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
            Orion.SetWorldMapPointerPosition(loc[2], loc[3], loc[4]);
        else if(code == i + 14)
            AliAtlas([loc[2],loc[3],loc[4]])
        else if(code == i + 29)
            DiscordPush(loc[0] + ': ' + loc[1] + ': ' + loc[2] + ',' + loc[3] + ' ' + ScreenshotLinkFormatter(loc[2],loc[3],loc[4]))
        }
    }

function ScreenshotLinkFormatter(x,y,facet)
    { //[x,y,'facet']
    var sextant = Orion.XYToSextant(x, y, facet);
    var sextantURL = sextant.replace(/[ ,']/g, '');
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

function AliAtlasTest(_test){
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
    //var tempX = Player.X();
    //var tempY = Player.Y();
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
        Orion.Print(attempt);
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

function IDOC_SignMonitor()
    {//Sends a Discord message at various time thresholds
    var hash = {};
    var maps = ['Felucca', 'Trammel', 'Ilshenar', 'Malas', 'Tokuno', 'TerMur'];
    var facetEnc = {'Trammel': 'tr','Felucca': 'fe','Malas': 'ma','TerMur': 'sa','Tokuno': 'to'}
    var mapURL = 'https://uovm.info/map/?g='; //credit: https://uovm.info/map/
    var interval = 30000;
    var discordRole = '<@%26' + '1044026979764158544> '; //@IDOC role
    var bot = "https://discordapp.com/api/webhooks/"
        + '887268637315047444' //hook 1044022516240363591
        + "/"
        + 'SJfWniY7dpD9URmrvXSPb3EFs7DzrZiVH5_Wd4f16Tg695utEVXeLc7quvb8Gwjmg_0Z'; //key 1YAXh8kTt4kx0VzW2X9IsF3Pz16EaDpo_dJB0qFNAHatZITWPiGuXeidvAZ1Ukudkuck
    var paramText = "content=";
    var shard = Orion.ShardName();
    while(true)
        {
        var signObj = Orion.FindTypeEx(any,any,ground,'item',24).filter(function(item)
            {
            var itemProps = item.Properties();
            return Orion.Contains(itemProps, 'a house sign') && Orion.Contains(itemProps, 'Collapsing In:');
            })[0];
        while(!signObj)
            {
            Orion.CharPrint(self,1159,'Searching for IDOC sign...')
            Orion.Wait(2000);
            signObj = Orion.FindTypeEx(any,any,ground,'item',24).filter(function(item)
                {
                var itemProps = item.Properties();
                return Orion.Contains(itemProps, 'a house sign') && Orion.Contains(itemProps, 'Collapsing In:');
                })[0];
            }
        var msgStep = 0;
        var first = true;
        var outMsg = discordRole + ' ' + shard + ' IDOC ';
        while(signObj && msgStep < 3)
            { 
            var sendMsg = false;
            var timeLeft = signObj.Properties().match(/Collapsing In: (\d+) (\w+)/) || signObj.Properties().match(/Collapsing In: Less Than (\d+) (\w+)/) || [];
            var timeStr = timeLeft[0];
            if(timeStr)
                {
                var timeNum = +timeLeft[1];
                var timeUnit = timeLeft[2];
                var map = maps[Player.Map()];
                var locX = signObj.X();
                var locY = signObj.Y();
                outMsg = outMsg + timeStr + ' at: ' + locX + ',' + locY + ' in ' + map;
                if(timeUnit == 'Seconds')
                    {
                    msgStep = 3;
                    Orion.Ignore(signObj.Serial());
                    Orion.Wait(1000);
                    outMsg = outMsg + ' LAST CALL!';
                    sendMsg = true;
                    }
                else if(timeUnit == 'Hours' && !hash[timeStr])
                    {
                    hash[timeStr] = true;
                    sendMsg = true;
                    }
                else if(timeUnit == 'Minutes' && timeNum <= 15 && msgStep == 1)
                    {
                    msgStep = 2;
                    outMsg += ' 15 MINUTE WARNING!';
                    sendMsg = true;
                    }
                else if(timeUnit == 'Minutes' && msgStep == 0)
                    {
                    msgStep = 1;
                    sendMsg = true;
                    }
                if(first)
                    {
                    var sextant = Orion.XYToSextant(locX, locY, map);
                    var sextantURL = sextant.replace(/[ ,']/g, '');
                    var urlEnc = mapURL + facetEnc[map];
                    var fullURL = urlEnc + sextantURL;
                    outMsg = outMsg + '\n' + fullURL;
                    first = false;
                    }
                if(sendMsg)
                    Orion.HttpPost(bot, paramText + outMsg);
                }
            else
                {
                Orion.Print("Sign wasn't parsed correctly! Trying again...");
                Orion.Wait(1000);
                continue;
                }
            if(!Player.Hidden())
                Orion.UseSkill('Hiding');
            Orion.AddDisplayTimer('idoc', interval, 'AboveChar', 'circle', timeNum + ' ' + timeUnit + '\nChecking again in:',0,40,1159);
            Orion.Wait(10);
            while(Orion.DisplayTimerExists('idoc') && !Orion.Contains(signObj.Properties(),'second'))
                {
                if(!Player.Hidden())
                    Orion.UseSkill('Hiding');
                Orion.Wait(500);
                }
            signObj = Orion.FindTypeEx(any,any,ground,'item',24).filter(function(item)
                {
                var itemProps = item.Properties();
                return Orion.Contains(itemProps, 'a house sign') && Orion.Contains(itemProps, 'Collapsing In:');
                })[0];
            }
        }
    }
  
function IDOC_SignMonitorOLD(_test)
    {
    var hash = {};
    var maps = ['Felucca', 'Trammel', 'Ilshenar', 'Malas', 'Tokuno', 'TerMur'];
    var facetEnc = {'Trammel': 'tr','Felucca': 'fe','Malas': 'ma','TerMur': 'sa','Tokuno': 'to'}
    var mapURL = 'https://uovm.info/map/?g='; //credit to https://uovm.info/map/
    var interval = 30000;
    var discordRole = '<@%26' + '1044026979764158544> '; //@IDOC role
    var bot = "https://discordapp.com/api/webhooks/"
        + '887268637315047444' //hook 1044022516240363591
        + "/"
        + 'SJfWniY7dpD9URmrvXSPb3EFs7DzrZiVH5_Wd4f16Tg695utEVXeLc7quvb8Gwjmg_0Z'; //key 1YAXh8kTt4kx0VzW2X9IsF3Pz16EaDpo_dJB0qFNAHatZITWPiGuXeidvAZ1Ukudkuck
    var paramText = "content=";
    var shard = Orion.ShardName();
    while(true)
        {
        var signObj = Orion.FindTypeEx(any,any,ground,'item',24).filter(function(item)
            {
            var itemProps = item.Properties();
            return Orion.Contains(itemProps, 'a house sign') && Orion.Contains(itemProps, 'Collapsing In:');
            })[0];
        while(!signObj)
            {
            Orion.CharPrint(self,1159,'Searching for IDOC sign...')
            Orion.Wait(2000);
            signObj = Orion.FindTypeEx(any,any,ground,'item',24).filter(function(item)
                {
                var itemProps = item.Properties();
                return Orion.Contains(itemProps, 'a house sign') && Orion.Contains(itemProps, 'Collapsing In:');
                })[0];
            }
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
                    var map = maps[Player.Map()];
                    var urlEnc = mapURL + facetEnc[map];
                    var locX = signObj.X();
                    var locY = signObj.Y();
                    var sextant = Orion.XYToSextant(locX, locY, map);
                    var sextantURL = sextant.replace(/[ ,']/g, '');
                    var fullURL = urlEnc + sextantURL;
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
                {
                if(!Player.Hidden())
                    Orion.UseSkill('Hiding');
                Orion.Wait(500);
                }
            signObj = Orion.FindTypeEx(any,any,ground,'item',24).filter(function(item)
                {
                var itemProps = item.Properties();
                return Orion.Contains(itemProps, 'a house sign') && Orion.Contains(itemProps, 'Collapsing In:');
                })[0];
            }
        }
    }

//--#Barrels
//grey barrel color 0x09C4, brown 0x0000
function IDOCBarrels()
 	{
    Orion.ClientViewRange(24);
    var dragItems = '0x14F6';
 	var barrels = Orion.FindTypeEx('0x0FAE|0x0E77|0x1EB5', any, ground, ' ', '24').filter(function(barrel)
        {
        return !Orion.Contains(barrel.Properties(),'Weight:')
        });
	if(!barrels[0])
        {
        Orion.Wait(5000);
		return IDOCBarrels();
        }
	var Wbound = barrels.sort(function(a,b){return a.X()-b.X()})[0].X();
	var Nbound = barrels.sort(function(a,b){return a.Y()-b.Y()})[0].Y();
	var Ebound = barrels.sort(function(a,b){return b.X()-a.X()})[0].X();
	var Sbound = barrels.sort(function(a,b){return b.Y()-a.Y()})[0].Y();
	if(castleMode)
		{
		Nbound = Sbound - 29;
		Ebound = Wbound + 29;
		}
    var startX = Wbound - 1;
    var startY = Sbound - 2;
	Orion.ClearFakeMapObjects();
	var i = 0;
	Orion.GetTilesInRect('land', Wbound+1, Nbound+1, Ebound-1, Sbound-1)
    	.concat(Orion.GetTilesInRect('land', Wbound, Sbound-2, Wbound, Sbound-2))
      		.forEach(function(tile) 
      			{
           		Orion.AddFakeMapObject(i++, '0x051A', 1159, tile.X(), tile.Y(), tile.Z());
				});
	Orion.Wait(100);
    while(!Player.Dead()) //grey barrel color 0x09C4, brown 0x0000
    	{
        Orion.SetSearchArea(Wbound, Sbound-2, Wbound, Sbound-2);
	    var barrel = Orion.FindTypeEx('0x0FAE|0x0E77|0x1EB5', any, ground, 'near', '24')[0];
	    Orion.ResetSearchArea();
        if(!barrel)
            break;
        var cancelCheck = false;
        var startSearchTime = Orion.Now() + 10000;
        var searchFlag = true;
        while(barrel.Exists() && barrel.Color() != '0x0000')
            {
            if(Orion.GetDistance(startX,startY) > 0)
                Orion.WalkTo(startX,startY,0,0,255,0);
            Orion.Wait(1000);
            if(searchFlag && Orion.Now() > startSearchTime)
                {
                Orion.SetSearchArea(Wbound+1, Nbound+1, Ebound-1, Sbound-1);
                var barrelInside = Orion.FindTypeEx('0x0FAE|0x0E77|0x1EB5', any, ground, 'near', '24')[0];
                Orion.ResetSearchArea();
                if(!barrelInside)
                    {
                    cancelCheck = true;
                    break;
                    }
                searchFlag = false;
                }
            }
        if(cancelCheck)
            break;
        Shared.AddVar('PlacementTimer', Orion.Now());
        if(Orion.GetDistance(startX,startY) > 0)
            Orion.WalkTo(startX,startY,0,0,255,1);
        else
            Orion.Attack(barrel.Serial());
        Orion.Wait(250);
        if(!Orion.Dragging())
            Orion.DragItemType('0x14F6');
        }
    if(Orion.Dragging())
        Orion.DropDraggedItem();
    while(!Player.Dead())
        {
        if(cancelCheck)
            break;
        Orion.SetSearchArea(Wbound+1, Nbound+1, Ebound-1, Sbound-1);
	    barrel = Orion.FindTypeEx('0x0FAE|0x0E77|0x1EB5', any, ground, 'near', '24')[0];
	    Orion.ResetSearchArea()
        if(!barrel)
            break;
        if(barrel.Distance() > 1)
            Orion.WalkTo(barrel.X(), barrel.Y(), 0, 1, 255, 1);
        Orion.Attack(barrel.Serial());
        Orion.Wait(200);
        //Orion.Exec('DropGarbageHere',true);
	 	}
    if(Orion.Dragging())
        Orion.DropDraggedItem();
    while(!Player.Hidden())
        {
        Orion.UseSkill('Hiding');
        Orion.Wait(1000);
        }
    // if(relogAccounts && !fullAuto)
    //     RelogAccountToDifferentShard();
    if(walkToFront)
        {
        var frontX = startX + 6;
        var frontY = startY + 4
        var endTime = Orion.Now() + 20000;
        while(Orion.GetDistance(frontX,frontY) > 0 && Orion.Now() < endTime)
            {
            Orion.WalkTo(frontX,frontY,0,0,255,0);
            Orion.Wait(500);
            }
        }
    else
        {
        var endTime = Orion.Now() + 20000;
        while(Orion.GetDistance(startX,startX) > 0 && Orion.Now() < endTime)
            {
            Orion.WalkTo(startX,startY,0,0,255,0);
            Orion.Wait(500);
            }
        }
	Orion.Wait(1000);
    if(fullAuto)
        {
        Orion.Wait(2000);
        var frontX = startX + 6;
        var frontY = startY + 4
        var endTime = Orion.Now() + 20000;
        while(Orion.GetDistance(frontX,frontY) > 0 && Orion.Now() < endTime)
            {
            Orion.WalkTo(startX + 6,startY + 4,0,0,255,0);
            Orion.Wait(500);
            }
        Orion.Exec('SubPlacer');
        }
    else
        Gump();
    if(limitViewRange)
        Orion.ClientViewRange(5);
	}

function DropGarbageHere(_ExecOnly)
	{
    //var rubbleGraphics = '' || 'any';
    var kegs = Orion.FindTypeEx('0x1940').filter(function(item)
        {
        return Orion.Contains(item.Properties(),'Potion')
        });
    //var rubble = Orion.FindTypeEx(rubbleGraphics).filter(function(item)
      //  {
       // return Orion.Contains(item.Properties(),'rubble');
       // });
    var garbage = kegs//.concat(rubble);
    if(!garbage[0])
        return;
	var validTile = Orion.GetTilesInRect('land', Player.X()-1,Player.Y()-1, Player.X()+1,Player.Y()+1)
		.filter(function(tile)
			{
			Orion.SetSearchArea(tile.X(),tile.Y(),tile.X(),tile.Y());
			var mobCheck = Orion.FindType(any,any,ground,'live').length == 0;
			var itemCheck = Orion.FindType(any,any,ground,'item').length < 5;
			return mobCheck && itemCheck;
			})[0];
    Orion.ResetSearchArea();
	if(validTile)
        Orion.Drop(garbage[0].Serial(), 0, validTile.X(), validTile.Y(), validTile.Z());
	else 
		Orion.CharPrint(self, 1159, 'No free tiles nearby to drop garbage!');
    Orion.Wait(1100);
	}

function MoveAllToContainer()
    {
    Orion.CharPrint(self,1159, "Target 'To' Container");
    Orion.WaitForAddObject('myTarget');
    var toContainer = Orion.GetSerial('myTarget');
    var items = Orion.FindTypeEx('!0x14F6|!0x23A0|!0x22C5|!0x0EFA',any,backpack,'','2','',false).filter(function(item)
        {
        return !Orion.Contains(item.Properties(),'Mount Hue:') && item.Serial() != toContainer;
        })[0];
    while(items)
        {
        Orion.MoveItem(items.Serial(),0,toContainer);
        Orion.Wait(1300);
        items = Orion.FindTypeEx('!0x14F6|!0x23A0|!0x22C5|!0x0EFA',any,backpack,'','2','',false).filter(function(item)
            {
            return !Orion.Contains(item.Properties(),'Mount Hue:') && item.Serial() != toContainer;
            })[0];
        }
    }

function RelogAccountToDifferentShard()
    {
    var characterPairs = {
        'Anson' : ['Annalise','Pacific'],
        'Basil' : ['Beclesia','Pacific'],
        'Callum' : ['Coeur','Pacific'],
        'Desmond' : ['Deyes','Pacific'],
        'Esther' : ['Ephie','Lake Austin'],
        'Fanthi' : ['Finsta','Lake Austin'],
        'Ghinj' : ['Gwinn','Lake Austin'],
        'Hasta' : ['Haichiu','Lake Austin'],
        'Aeolus' : ['Dyson','Lake Austin'],
        'Baccus' : ['Hoover','Hoover'],
        'Cassius' : ['Fly on the Wall','Pacific'],
        'Deimos' : ['Roomba','Baja'],
        'Hound' : ['Trix','Chesapeake'],
        'Ironsides' : ['Purified','Chesapeake'],
        'Torque' : ['Bennett','Chesapeake'],
        'Cujo' : ['Knuckles','Chesapeake'],
        'Cargill' : ['Sirius','Chesapeake'],
        'Auschwitz' : ['Pablo','Baja'],
        'JonSnow' : ['Stanton','Baja'],
        'Ravage' : ['Craniax','Baja'],
        'Solaris' : ['Malice','Baja'],
        'Imposter' : ['Clorox','Baja'],
        'Uprising' : ['Protatoes','Lake Superior'],
        'Ripley' : ['Trink','Lake Superior'],
        'Ballistic' : ['MoxAction','Lake Superior'],
        'Descending' : ['Raza','Lake Superior'],
        'Frenzy' : ['Woozoo','Lake Superior'],
    }
    var rawName = Player.Name();
    var playerName = rawName;
    if(Orion.Contains(rawName, 'Lady|Lord'))
		playerName = rawName.slice(5, rawName.length);
    var relogInfo = characterPairs[playerName];
    if(relogInfo)
        Orion.Relogin(relogInfo[0],relogInfo[1]);
    else
        Orion.LogOut();
    }

//--#Placer
var serialIndex = 1;
var buttons = //[ xsize, ysize, CallBackID, 'Text', 'FunctionName', [arguments] ]
    [
        [ [100, 30, serialIndex++, "Dom", 'DomPlacer'] ],
        [],
        [ [100, 30, serialIndex++, "Placer", "SubPlacer"]],
    ]

function Gump()
    {
    var gump = Orion.CreateCustomGump(12002);
    gump.Clear();
    gump.SetCallback('GumpCallback');
    var widest = Math.max.apply(Math, buttons.map(function (rows)
        {
        return rows.length
        }));
    gump.AddHtmlGump(1, 0, 0, widest * 105 + 1, buttons.length * 30 + 1, '0x0BB8', 1, 0);
    gump.Select('htmlgump', 1);
    var row = 0;
    var column = 0;
    buttons.forEach(function(rowLayer)
        {
        rowLayer.forEach(function(button)
            {
            gump.AddResizepic(column * 105 + 4, row * 29 + 2, '0x24EA', button[0], button[1], button[2], 1);
            gump.AddText(column * 105 + 10, row * 29 + 6, '0', button[3]);
            column++;
            });
        column = 0;
        row++;
        });
    gump.Select('gump');
    gump.Update();
    }

function GumpCallback(_) 
    {
    var code = CustomGumpResponse.ReturnCode();
    if(code == 0) 
        {
        var gump = Orion.CreateCustomGump(15);
        gump.Close();
        }
    buttons.forEach(function(rowLayer)
        {
        rowLayer.forEach(function(button)
            {
            if (button[2] == code)
                {
                Orion.Print('Toggle ' + button[3]);
                Orion.ToggleScript(button[4], false, button[5]);
                return;
                }
            })
        });
    }

function DomPlacer()
    {
    Orion.Exec('StayHidden',true);
    Orion.Exec('GMJournalScan',true);
    Orion.Exec('StayLoggedIn',true);
    Orion.RemoveAllUdpServers();
    var create = Orion.CreateUdpServer('DomPlacer', 60000);
    if(create == 0)
        Orion.Print('Server Creation Success');
    else
        return Orion.Print('Server Creation Fail');
    while(fullAuto && !Orion.UdpRecv('DomPlacer'))
        {
        Orion.Wait(500);
        }
    if(fullAuto)
        {
        Orion.Wait(20000);
        while(Orion.UdpRecv("DomPlacer"))
            Orion.Wait(10)
        }
    for(var i=60001;i<60051;i++)
        {
        Orion.UdpSend(i,'Send Report Back')
        Orion.Wait(10);
        }
    Orion.Wait(2000);
    var playerList = [];
    var namesStr = '';
    var recv = Orion.UdpRecv('DomPlacer');
    while(recv)
        {
        var recvSplit = Orion.Split(recv, ':');
        playerList.push(+recvSplit[0]);
        namesStr += recvSplit[1] + '\n';
        Orion.Wait(10);
        recv = Orion.UdpRecv('DomPlacer');
        }
    if(!playerList.length)
        return Orion.CharPrint(self,1159,'No Subs Connected! Halting...');
    playerList.sort(function(a,b)
        {
        return a - b;
        });
    var interval =  (placementCooldown/playerList.length).toFixed(0);//timeout interval
    TextWindow.Open();
    TextWindow.Print('Players: ' + playerList.length + '\nInterval: ' + interval + 'ms\n' + namesStr)
    Orion.Wait(100);
    while(true)
        {
        //var timeStamp = Orion.Now();
        var player = playerList.shift()
        playerList.push(player);
        //Orion.Print(player)
        Orion.UdpSend(player, 'E')
        Orion.Wait(interval);
        var recv = Orion.UdpRecv('DomPlacer');
        if(recv)
            {
            TextWindow.Print(recv);
            break;
            }
        Orion.Print('Running');
        //Orion.Print('Actual Interval: ' + (Orion.Now() - timeStamp) + 'ms')
        }
    if(fullAuto)
        {
        Orion.Wait(Orion.Random(1,25) * 200);
        Orion.CloseUO();
        }
    }



function SubPlacer()
    { //Interval Method
    var hook = '1060433841111695410';
    var key = 'THDHA-UrLnAcuDpmbbKmRDQyCWCcEqcUhMwp1gOsJjVUSGEfqPjS4RwlmrK6VjEt1jzL';
    var bot =
        "https://discordapp.com/api/webhooks/"
        + hook
        + "/"
        + key; // Webhook url
    var categoryCode = houseButtons[0];
    var houseCode = houseButtons[1];
    Shared.AddVar('categoryCode',categoryCode);
    Shared.AddVar('houseCode',houseCode);
    var coordX = houseTargetCoords[0];
    var coordY = houseTargetCoords[1];
    Shared.AddVar('coordX',coordX);
    Shared.AddVar('coordY',coordY);
    
    var tool = Orion.FindType('0x14F6')[0];
    if(!tool)
        return Orion.CharPrint(self,1159,'Placement Tool missing! Halting...');
    if(Shared.GetVar('PlacementTimer') == false);
        Shared.AddVar('PlacementTimer', Orion.Now())
    var closeGump = Orion.GetGump(any);
    while(closeGump)
        {
        Orion.Print('Closing gump: ' + closeGump.ID());
        closeGump.Select(Orion.CreateGumpHook(0));
        Orion.Wait(200);
        closeGump = Orion.GetGump(any);
        }
    Orion.Exec('StayLoggedIn',true);
    Orion.RemoveAllUdpServers();
    var i = 60000;
    var create = 1;
    var endTime = Orion.Now() + 5000;
    while(create != 0 && Orion.Now() < endTime)
        {
        create = Orion.CreateUdpServer('DomPlacer', ++i);
        Orion.Wait(10);
        }
    var port = i
    Orion.Print('Port: ' + port);
    Orion.Wait(2000);
    if(fullAuto)
        {
        Orion.CharPrint(self,1159,'Waiting 20 seconds before sending Start signal...')
        Orion.Wait(20000);
        Orion.UdpSend(60000,'Start');
        }
    while(true)
        {
        var recv = Orion.UdpRecv('DomPlacer');
        if(recv)
            {
            Orion.Print('Sending Report');
            Orion.UdpSend(60000, port + ':' + Player.Name());
            break;
            }
        Orion.Wait(500);
        }
    Orion.ClearJournal('attempted to place a house too many times recently.');
    Orion.Exec('KeepUpHouseTarget',true);
    while(true) 
        {
        var recv = Orion.UdpRecv('DomPlacer');
        if(recv)
            {
            var placeX = Shared.GetVar('coordX',coordX);
            var placeY = Shared.GetVar('coordY',coordY);
            Orion.TargetTile('any', placeX, placeY, 0);
            var startTime = Orion.Now();
            Orion.PauseScript('KeepUpHouseTarget');
            var gump = Orion.GetGump(any, '0x000001EC'); //accept house placement gump
            while(!gump && Orion.Now() < startTime + 3000 && !Orion.InJournal('This is an invalid location.', 'sys', '0', any, startTime))
                {
                Orion.Print('Catching gump');
                Orion.Wait(1);
                gump = Orion.GetGump(any, '0x000001EC');
                }
            if(gump)
                gump.Select(Orion.CreateGumpHook(1));
            var endTime = Orion.Now();
            var check = Orion.WaitJournal('gold has been removed from your bank box.', startTime, Orion.Now() + 2000);
            if(check)
                break;
            if(recv == "STOPSIGNAL")
                {
                Orion.Wait(2000);
                Orion.RemoveAllUdpServers();
                Orion.Wait(2000);
                Orion.LogOut()
                }
            Orion.ResumeScript('KeepUpHouseTarget');
            Orion.Wait(5000);
            }
        Orion.Wait(10);
        }
    var outStr = "";
    var signObj = Orion.FindTypeEx(any,any,ground,'item',16).filter(function(item)
        {
        var itemProps = item.Properties();
        return Orion.Contains(itemProps, 'a house sign') && Orion.Contains(itemProps, Player.Name());
        })[0];
    if(check && signObj)
        outStr += '\n' + Player.Name() + ' **Success!**';
    var placementTimer = Shared.GetVar('PlacementTimer',0);
    if(placementTimer)
        {
        var ms = startTime - placementTimer;
        var date = new Date(ms);
        var time = date.toISOString().substring(11, 19);
        outStr += '\nTime to Place: ' + time;
        }
    Orion.HttpPost(bot,'content=' + outStr);
    Orion.Wait(2000);
    Orion.UdpSend(60000, Player.Name());
    Orion.Wait(2000);
    Orion.RemoveAllUdpServers();
    // if(fullAuto)
    //     Orion.CloseUO();
    Orion.Terminate('all');
    }

function CoordGump()
    {
    var gump = Orion.CreateCustomGump(12003);
    gump.SetCallback('CoordGumpCallback');
    gump.Clear();
    gump.AddResizepic(0, 0, '0xBB8', 172, 125);
    gump.AddText(12, 8, 0, 'Category:', 165);
    gump.AddText(12, 28, 0, 'House Code:', 165);
    gump.AddText(12, 48, 0, 'X Coord:', 165);
    gump.AddText(12, 68, 0, 'Y Coord:', 165);
    gump.AddTextEntry(3, 115, 8, '0', Shared.GetVar('categoryCode',houseButtons[0]), 40, 20);
    gump.AddTextEntry(4, 115, 28, '0', Shared.GetVar('houseCode',houseButtons[1]), 40, 20);
    gump.AddTextEntry(5, 115, 48, '0', Shared.GetVar('coordX',houseTargetCoords[0]), 40, 20);
    gump.AddTextEntry(6, 115, 68, '0', Shared.GetVar('coordY',houseTargetCoords[1]), 40, 20);
	gump.AddColoredPolygone(111, 8, 49, 19, '#FF666600', 1, 2, 0, 0, 0);
	gump.AddColoredPolygone(111, 28, 49, 19, '#FF666600', 1, 2, 0, 0, 0);
	gump.AddColoredPolygone(111, 48, 49, 19, '#FF666600', 1, 2, 0, 0, 0);
	gump.AddColoredPolygone(111, 68, 49, 19, '#FF666600', 1, 2, 0, 0, 0);
    gump.AddButton(1, 99, 95, 239, 238, 240, '0');
    gump.AddButton(2, 8, 95, 246, 245, 244, '0');
    gump.AddButton(7, 73, 95, 1535, 1535, 1536, '0');
    gump.Update();
    }

function CoordGumpCallback(_)
    {
    var code = CustomGumpResponse.ReturnCode();
    if(code == 1)
        {
        var categoryCode = CustomGumpResponse.Text(3);
        var houseCode = CustomGumpResponse.Text(4);
        var coordX = CustomGumpResponse.Text(5);
        var coordY = CustomGumpResponse.Text(6);
        Shared.AddVar('categoryCode',categoryCode);
        Shared.AddVar('houseCode',houseCode);
        Shared.AddVar('coordX',coordX);
        Shared.AddVar('coordY',coordY);
        Orion.Print('Codes: ' + Shared.GetVar('categoryCode') + ', ' + Shared.GetVar('houseCode') + '\nCoords: ' + Shared.GetVar('coordX') + ', ' + Shared.GetVar('coordY'));
   	 	CoordGump()
        }
    else if(code == 2)
    	{
    	var categoryCode = houseButtons[0];
        var houseCode = houseButtons[1];
        var coordX = houseTargetCoords[0];
        var coordY = houseTargetCoords[1];
        Shared.AddVar('categoryCode',categoryCode);
        Shared.AddVar('houseCode',houseCode);
        Shared.AddVar('coordX',coordX);
        Shared.AddVar('coordY',coordY);
        Orion.Print('Codes: ' + Shared.GetVar('categoryCode') + ', ' + Shared.GetVar('houseCode') + '\nCoords: ' + Shared.GetVar('coordX') + ', ' + Shared.GetVar('coordY'));
    	CoordGump()
    	}
    else if(code == 7)
    	{
    	Orion.AddFakeMapObject(1, '0x051A', '1152',Shared.GetVar('coordX'), Shared.GetVar('coordY'), Player.Z() + 0);
    	Orion.AddFakeMapObject(2, '0x0B24', '1152',Shared.GetVar('coordX'), Shared.GetVar('coordY'), Player.Z() + 4);
    	}
    }

function KeepUpHouseTarget(_)
    {
    while(true) 
        {
        HouseTarget();
        Orion.Wait(1000);
        }
    }

function HouseTarget()
    {
    if(!Orion.HaveTarget())
        {
        if(!Orion.GetGump(any, '0x000001D0'))
            {
            var tool = Orion.FindType('0x14F6')[0];
            if(!tool)
                return Orion.CharPrint(self,1159,'Placement Tool missing! Halting...');
            Orion.UseObject(tool);
            }
        if(Orion.WaitForGump(3000))
            {
            var gump = Orion.GetGump(any, '0x000001D0');
            if(gump !== null && gump.ButtonList().length == 4)
                {
                gump.Select(Orion.CreateGumpHook(Shared.GetVar('categoryCode',houseButtons[0])));
                Orion.Wait(200);
                }
            }
        if(Orion.WaitForGump(3000))
            {
            var gump = Orion.GetGump(any, '0x000001D0');
            if(gump !== null)
                {
                gump.Select(Orion.CreateGumpHook(Shared.GetVar('houseCode',houseButtons[1])));
                Orion.Wait(200);
                }
            }
        Orion.WaitForTarget(3000);
        }
    }

function ManualPlacer()
    {
    var coordX = houseTargetCoords[0];
    var coordY = houseTargetCoords[1];
    Orion.TargetTile('any', coordX, coordY, 0);
    var startTime = Orion.Now();
    var endTime = startTime + 2000;
    Orion.PauseScript('KeepUpHouseTarget');
    var gump = Orion.GetGump(any, '0x000001EC'); //accept house placement gump
    while(!gump && Orion.Now() < endTime && !Orion.InJournal('This is an invalid location.|This area is temporarily unavailable for house placement.|You cannot reach that.', 'sys', '0', any, startTime))
        {
        Orion.Print('Catching gump');
        Orion.Wait(1);
        gump = Orion.GetGump(any, '0x000001EC');
        }
    if(gump)
        gump.Select(Orion.CreateGumpHook(1));
    }

function ScrubUDPServers()
    {
    for(var i=60001;i<60050;i++)
        Orion.UdpSend(i,'removeudp')
    Orion.RemoveAllUdpServers();
    }

function EquipSuitByCharacterName()
    {
    if(Orion.Contains(Player.Name(), 'Lady|Lord'))
        var pName = Player.Name().slice(5, Player.Name().length);
    else
        var pName = Player.Name()
    Orion.Dress(pName);
    }

function GetHouseDimensions()
	{
    var foundations = {
        '0x13EC': ['7x7', 2,5100],
        '0x13ED': ['7x8', 2,5101],
        '0x13EE': ['7x9', 2,5102],
        '0x13EF': ['7x10', 2,5103],
        '0x13F0': ['7x11', 2,5104],
        '0x13F1': ['7x12', 2,5105],
        '0x13F8': ['8x7', 2,5112],
        '0x13F9': ['8x8', 2,5113],
        '0x13FA': ['8x9', 2,5114],
        '0x13FB': ['8x10', 2,5115],
        '0x13FC': ['8x11', 2,5116],
        '0x13FD': ['8x12', 2,5117],
        '0x13FE': ['8x13', 2,5118],
        '0x1404': ['9x7', 2,5124],
        '0x1405': ['9x8', 2,5125],
        '0x1406': ['9x9', 2,5126],
        '0x1407': ['9x10', 2,5127],
        '0x1408': ['9x11', 2,5128],
        '0x1409': ['9x12', 2,5129],
        '0x140A': ['9x13', 2,5130],
        '0x140B': ['9x14', 3,5131],
        '0x1410': ['10x8', 2,5137],
        '0x1411': ['10x9', 2,5138],
        '0x1412': ['10x10', 2,5139],
        '0x1413': ['10x11', 2,5140],
        '0x1414': ['10x12', 2,5141],
        '0x1415': ['10x13', 2,5142],
        '0x1416': ['10x14', 3,5143],
        '0x1417': ['10x15', 3,5144],
        '0x1418': ['10x7', 2,5136],
        '0x141C': ['11x7', 2,5148],
        '0x141D': ['11x8', 2,5149],
        '0x141E': ['11x9', 2,5150],
        '0x141F': ['11x10', 2,5151],
        '0x1420': ['11x11', 2,5152],
        '0x1421': ['11x12', 2,5153],
        '0x1422': ['11x13', 2,5154],
        '0x1423': ['11x14', 3,5155],
        '0x1424': ['11x15', 3,5156],
        '0x1425': ['11x16', 3,5157],
        '0x1428': ['12x7', 2,5160],
        '0x1429': ['12x8', 2,5161],
        '0x142A': ['12x9', 2,5162],
        '0x142B': ['12x10', 2,5163],
        '0x142C': ['12x11', 2,5164],
        '0x142D': ['12x12', 2,5165],
        '0x142E': ['12x13', 2,5166],
        '0x142F': ['12x14', 3,5167],
        '0x1430': ['12x15', 3,5168],
        '0x1431': ['12x16', 3,5169],
        '0x1432': ['12x17', 3,5170],
        '0x1435': ['13x8', 2,5173],
        '0x1436': ['13x9', 2,5174],
        '0x1437': ['13x10', 2,5175],
        '0x1438': ['13x11', 2,5176],
        '0x1439': ['13x12', 2,5177],
        '0x143A': ['13x13', 2,5178],
        '0x143B': ['13x14', 3,5179],
        '0x143C': ['13x15', 3,5180],
        '0x143D': ['13x16', 3,5181],
        '0x143E': ['13x17', 3,5182],
        '0x143F': ['13x18', 3,5183],
        '0x1442': ['14x9', 3,5186],
        '0x1443': ['14x10', 3,5187],
        '0x1444': ['14x11', 3,5188],
        '0x1445': ['14x12', 3,5189],
        '0x1446': ['14x13', 3,5190],
        '0x1447': ['14x14', 3,5191],
        '0x1448': ['14x15', 3,5192],
        '0x1449': ['14x16', 3,5193],
        '0x144A': ['14x17', 3,5194],
        '0x144B': ['14x18', 3,5195],
        '0x144F': ['15x10', 3,5199],
        '0x1450': ['15x11', 3,5200],
        '0x1451': ['15x12', 3,5201],
        '0x1452': ['15x13', 3,5202],
        '0x1453': ['15x14', 3,5203],
        '0x1454': ['15x15', 3,5204],
        '0x1455': ['15x16', 3,5205],
        '0x1456': ['15x17', 3,5206],
        '0x1457': ['15x18', 3,5207],
        '0x145C': ['16x11', 3,5212],
        '0x145D': ['16x12', 3,5213],
        '0x145E': ['16x13', 3,5214],
        '0x145F': ['16x14', 3,5215],
        '0x1460': ['16x15', 3,5216],
        '0x1461': ['16x16', 3,5217],
        '0x1462': ['16x17', 3,5218],
        '0x1463': ['16x18', 3,5219],
        '0x1469': ['17x12', 3,5225],
        '0x146A': ['17x13', 3,5226],
        '0x146B': ['17x14', 3,5227],
        '0x146C': ['17x15', 3,5228],
        '0x146D': ['17x16', 3,5229],
        '0x146E': ['17x17', 3,5230],
        '0x146F': ['17x18', 3,5231],
        '0x1476': ['18x13', 3,5238],
        '0x1477': ['18x14', 3,5239],
        '0x1478': ['18x15', 3,5240],
        '0x1479': ['18x16', 3,5241],
        '0x147A': ['18x17', 3,5242],
        '0x147B': ['18x18', 3,5243],
    }
	var multi = Orion.GetMultisRect().sort(function(a,b)
		{
		var distOne = Math.floor(Math.sqrt(Math.pow(a.x - SelectedTile.X(), 2) + Math.pow(a.y - SelectedTile.Y(), 2)));
		var distTwo = Math.floor(Math.sqrt(Math.pow(b.x - SelectedTile.X(), 2) + Math.pow(b.y - SelectedTile.Y(), 2)));
		return distOne - distTwo;
		})[0];
	if(!multi)
		return Orion.CharPrint(self,1159,"Multi not found! Halting...");
	var foundation = foundations[multi.graphic]
    var outStr = '';
    if(foundation)
	    outStr += 'Dimensions: ' + foundation[0] + '\nCodes: [' + foundation[1] + ', ' + foundation[2] + ']';
    else
        outStr += 'Multi Graphic not found, estimated dimensions: ' + (multi.maxX - multi.minX + 1) + 'x' + (multi.maxY - multi.minY + 1);
    if(!Orion.GetGump(any, '0x000001D0'))
        {
        var tool = Orion.FindType('0x14F6')[0];
        if(!tool)
            return Orion.CharPrint(self,1159,'Placement Tool missing! Halting...');
        Orion.UseObject(tool);
        Orion.WaitForGump(2000);
        }
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump(any, '0x000001D0');
        if(gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(foundation[1]));
            Orion.Wait(200);
            }
        }
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump(any, '0x000001D0');
        if(gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(foundation[2]));
            Orion.Wait(200);
            }
        }
    Orion.WaitForTarget(2000);
    Orion.ClientOptionSet('UseCustomMaxDrawZOffset', 1)
    while(Orion.HaveTarget())
        Orion.Wait(100);
    TextWindow.Open();
    TextWindow.Print('----');
    TextWindow.Print(outStr);
    GetTargetCoords()
    TextWindow.Print('----');
    Orion.ClientOptionSet('UseCustomMaxDrawZOffset', 0)
	}

function GetTargetCoords()
    {
    var x = SelectedTile.X();
    var y = SelectedTile.Y();
    var z = SelectedTile.Z();
    var str = '[' + x + ',' + y + ',' + z + ']';
    TextWindow.Open();
    TextWindow.Print('Coords: ' + str);
    Orion.CopyToClipboard(str);
    //Shared.AddArray('coords', [x,y,z]);
    }

//--#Seller
function HouseShouter()
    {
    var hook = '1054570293462581269';
    var key = 'LoiZt4nFioMgO37jRPfgOKsqsrw7j8QgAUt_W7Rbh4vZAxenTWzAXbVNhMOvPAbC182H';
    var bot =
        "https://discordapp.com/api/webhooks/"
        + hook
        + "/"
        + key; // Webhook url
    Orion.Exec('ProspectMonitor',true);
    Orion.RemoveDisplayTimer('shout');
    var text =  'Max storage house plots for sale! One screen south of Tram Yew gate is a small house full of teleporters, check em out! Discord: svojstva'
    var interval = 0;
    var runes = Orion.FindTypeEx('0x1F14').filter(function(part)
        {
        return Orion.Contains(part.Properties(), 'svoj');
        }).map(function(rune)
            {
            return rune.Serial();
            });
    if(!runes[0])
        return Orion.CharPrint(self,1159,"Couldn't find rune titled 'House'! Halting...");
    var runeSwap = runes.shift()
    runes.push(runeSwap);
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
            Orion.WaitForTarget(6000) && Orion.TargetObject(runeSwap);
            var check = Orion.WaitJournal('You open a magical gate to another location|The spell fizzles.|Something is blocking the location.',startTime,Orion.Now() + 6000,'my|sys');
            if(check && check.Text() == 'Something is blocking the location.')
                {
                Orion.HttpPost(bot,'content=' + Player.Name() + ' Rune Blocked');   
                runeSwap = runes.shift();
                runes.push(runeSwap);
                }
            }
        Orion.Wait(1000);
        }
    }

function ProspectMonitor()
    { //has built in GM scanner, do not use the other GM scanner with this
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
        for(var i=0;i<Orion.JournalCount();i++)
			{
			var msg = Orion.JournalLine(i);
            if(!msg)
                continue;
            var msgText = msg.Text();
            var msgFlag = msg.Flags();
            var msgSerial = msg.Serial();
            Orion.ClearJournal(msgText);
            if(Orion.Contains(msgText, 'GM '))
                {
                Orion.HttpPost(GMbot, "content=" + Player.Name() + ": GM")
                Orion.PauseScript('all');
                }
            if(msgFlag != 4)
                continue;
			if(Orion.GetDistance(msgSerial) < 5)
				{
				var mobileObj = Orion.FindObject(msgSerial);
                Orion.HttpPost(bot, "content=" + Player.Name() + ': Potential Prospect: ' + mobileObj.Name() + ' said: ' + msgText)
                Orion.Wait(1000);
				}
			}
        Orion.Wait(1000);
        }
    }
//--#Misc Utilities
function RecallToDropSpot()
    {
    Orion.Terminate('all','RecallToDropSpot');
    while(Orion.BuffExists('Animal Form'))
        {
        Orion.Cast('Animal Form');
        Orion.Wait(5000);
        }
    var runeBook = Orion.FindTypeEx('0x22C5').filter(function(book)
        {
        return Orion.Contains(book.Properties(), 'Main');
        })[0];
    if(!runeBook)
        return Orion.CharPrint(self,1159,"No runebook named 'Main' found");
    do
        {
        var startTime = Orion.Now();
        if(Orion.SkillValue('Chivalry') >= 700)
            Orion.Cast('Sacred Journey');
        else
            Orion.Cast('Recall');
        Orion.Wait(700);
        } while(Orion.InJournal('You have not yet recovered from casting a spell.', 'sys', '0', 'any', startTime))
    if(Orion.WaitForTarget(5000))
        Orion.TargetObject(runeBook.Serial());
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

function ContainerGumpToggle()
	{
	if (Orion.ClientOptionGet('GriddedContainers') == 1)
		Orion.ClientOptionSet('GriddedContainers', 0);
	else
		Orion.ClientOptionSet('GriddedContainers', 1);
	}

function ZAxisToggle()
	{
    Orion.ClientOptionSet('CustomMaxDrawZOffsetValue', 1)
	if (Orion.ClientOptionGet('UseCustomMaxDrawZOffset') == 1)
		Orion.ClientOptionSet('UseCustomMaxDrawZOffset', 0);
	else
		Orion.ClientOptionSet('UseCustomMaxDrawZOffset', 1);
	}

function LandGridToggle()
	{
	if(Orion.ClientOptionGet('MarkingLandTiles') == 1)
		Orion.ClientOptionSet('MarkingLandTiles', 0);
	else
		Orion.ClientOptionSet('MarkingLandTiles', 1);
	}
     
function BlockRunWhileHiddenToggle()
	{
	if(Orion.ClientOptionGet('BlockRunWhileHidden') == 1)
        {
        Orion.CharPrint(self,1159,'BlockRunWhileHidden OFF');
		Orion.ClientOptionSet('BlockRunWhileHidden', 0);
        }
	else
        {
        Orion.CharPrint(self,1159,'BlockRunWhileHidden ON');
		Orion.ClientOptionSet('BlockRunWhileHidden', 1);
        }
	}

function AlwaysRunToggle()
	{
	if(Orion.ClientOptionGet('AlwaysRun') == 1)
        {
        Orion.CharPrint(self,1159,'AlwaysRun OFF');
		Orion.ClientOptionSet('AlwaysRun', 0);
        }
	else
        {
        Orion.CharPrint(self,1159,'AlwaysRun ON');
		Orion.ClientOptionSet('AlwaysRun', 1);
        }
	}

function DropDraggedToContainer()
	{//Reduce mouse movements when transferring items.
    //If you press the hotkey while not dragging an item, it will bring up a target cursor for you to set your drop container.
    //If you press the hotkey while dragging an item, it will drop the item into your designated drop container.
    //You can press Escape instead of targeting something to retain the previous drop container if you accidentally bring up the target cursor.
	var dropContainer = Orion.FindObject('dropContainer');
    if(Orion.HaveTarget())
        {
        return Orion.CharPrint(self,1159,"Can't set new drop container while target cursor is up!");
        }
	else if(dropContainer && Orion.Dragging())
		Orion.DropDraggedItem('dropContainer');	
	else
		{
        Orion.CharPrint(self,1159,'Target new drop container or press Escape to keep using old container')
		var lastSerial = Orion.GetSerial('dropContainer');
		if(Orion.WaitForAddObject('dropContainer') != 1)
			Orion.AddObject('dropContainer', lastSerial);
		}
	}

function StayLoggedIn()
    {
    while(true)
        {
        Orion.EmoteAction('salute');
        Orion.Wait(60000);
        }
    }

function HideAllLiveMobs()
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

function IDOC_NewCharacterSetup()
    {
    //get lrc suit and gold first
    //set all skills to 'Lock' in Orion Assistant
    Orion.ClientOptionSet('AutoOpenDoorsMode', 1);
    Orion.ClientOptionSet('AlwaysRun', 1);
    if(Orion.Contains(Player.Properties(), '(young)'))
        {
        Orion.Say('i renounce my young player status');
        if(Orion.WaitForGump(1000))
            {
            var gump0 = Orion.GetGump('last');
            if((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00005B9C'))
                {
                gump0.Select(Orion.CreateGumpHook(1));
                Orion.Wait(100);
                }
            }
        }
    var gold = Orion.FindType('0x0EED')[0];
    while(gold)
        {
        while(Player.X() != 3488 && Player.Y() != 2573)
            {
            Orion.WalkTo(3488, 2573, 0, 0);
            Orion.Wait(500);
            }
        var bank = Player.BankSerial();
        while(!Orion.GumpExists('container', bank))
            {
            Orion.SayWhisper('bank');
            Orion.Wait(1300);
            bank = Player.BankSerial();
            }
        Orion.MoveItem(gold,0,bank);
        Orion.Wait(1300);
        gold = Orion.FindType('0x0EED')[0];  
        }
    if(!Orion.ObjAtLayer('Mount'))
        {
        while(Player.X() != 3523 && Player.Y() != 2576)
            {
            Orion.WalkTo(3523, 2576, 0, 0);
            Orion.Wait(500);
            }
        Orion.Wait(1300);
        BuyHorse();
        }
    Orion.Exec('DropItems',true);
    while(Player.X() != 3450 && Player.Y() != 2677)
        {
        Orion.WalkTo(3450, 2677, 0, 0);
        Orion.Wait(500);
        }
    var gate = Orion.FindTypeEx('0x0F6C', any, ground, 'near', 24);
    if(gate[0])
        {
        Orion.WalkTo(gate[0].X(),gate[0].Y(),0,0);
        Orion.Resend();
        Orion.Wait(1000);
        if(Player.X() != gate[0].X() || Player.Y() != gate[0].X())
            Orion.WalkTo(gate[0].X(),gate[0].Y(),0,0);
        Orion.UseObject(gate[0].Serial());
        Orion.Wait(1000);
        if(Orion.WaitForGump(2000))
            {
            var gump0 = Orion.GetGump('last');
            if((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00000258'))
                {
                var gumpHook0 = Orion.CreateGumpHook(1);
                gumpHook0.AddCheck(28, true);
                gump0.Select(gumpHook0);
                Orion.Wait(100);
                gump0.Select(Orion.CreateGumpHook(0));
                }
            }
        Orion.Wait(3000);
        }
    }

function DropItems(_CallOnly)
    {
    var bag = Orion.FindType('0x0E76')[0];
    var items = Orion.FindTypeEx(any).filter(function(item)
        {
        return !Orion.Contains(item.Properties(), 'Blessed|bag')
        })[0];
    while(bag && items)
        {
        Orion.MoveItem(items.Serial(),0,bag);
        Orion.Wait(1300);
        items = Orion.FindTypeEx(any).filter(function(item)
            {
            return !Orion.Contains(item.Properties(), 'Blessed|bag')
            })[0];
        }
    for(var i=2;i<25;i++)
        {
        var item = Orion.ObjAtLayer(i);
        if(!item || i == 11 || i == 21 || i == 22)
            continue;
        Orion.MoveItem(item.Serial(),0,bag);
        Orion.Wait(1300);
        if(Orion.ObjAtLayer(i))
            i--;
        }
    }

function BuyHorse()
    {
    var vendors = Orion.FindTypeEx(any,any,ground,'mobile',4,'yellow').filter(function(vendor)
        {
        return Orion.Contains(vendor.Properties(), 'the animal trainer') && !Orion.Contains(vendor.Properties(), 'guild');
        });
    var shopnpcSerial = vendors[0].Serial();
    var shoplist = Orion.GetShopList('Horsey');
    var items = [
        new ShopListItem('0x00E4|0x00C8|0x00E2|0x00CC', '0x0000', '', 1),
        ];
    shoplist.SetItems(items);
    Orion.UpdateShopList(shoplist);
    Orion.BuyHook('Horsey');
    Orion.WaitContextMenuID(shopnpcSerial, 110);
    Orion.RequestContextMenu(shopnpcSerial);
    while(!Orion.ObjAtLayer('Mount'))
        {
        Orion.Wait(1300);
        var horsey = Orion.FindTypeEx(any, any, ground, 'mobile', 2, 'blue|green').filter(function(mobile)
            {
            return Orion.Contains(mobile.Name(), 'a horse');  
            })[0];
        if(horsey)
            {
            Orion.Say('all follow me');
            Orion.UseObject(horsey.Serial())
            Orion.Wait(1300);
            }
        }
    }
    
function TrackBlockerHouseSign()
    {
    var bot = "https://discordapp.com/api/webhooks/"
    + '941921319463841843' //hook
    + "/"
    + '7edeWcihk41muJgZGU2RouSAzICkLSAH8P4GoEKbv_OyRTa_kMumiQhWHcb4XEYispwI'; //key
    Orion.WaitForAddObject("myTarget")
    var a = Orion.FindObject('myTarget');
    while(a)
        {
        Orion.Wait(250);
        a = Orion.FindObject('myTarget');
        }
    Orion.HttpPost(bot, "content=House fell!");
    }

function GMJournalScan()
	{
	var bot = "https://discordapp.com/api/webhooks/"
        + '941921319463841843' //hook
        + "/"
        + '7edeWcihk41muJgZGU2RouSAzICkLSAH8P4GoEKbv_OyRTa_kMumiQhWHcb4XEYispwI'; //key
    var paramText = "content=" + Player.Name() + ": GM";
	var msg = 'GM ';
	while(true)
		{
		var check = Orion.WaitJournal(msg, Orion.Now(), 0, ' ');
		Orion.Wait(100);
        var checkarr = Orion.Split(check.Text(), ' ');
		for(i = 0;i<checkarr.length;i++)
			{
			switch(checkarr[i])
				{	
				case 'GM':
					Orion.HttpPost(bot, paramText);
					//Orion.PlayWav('Alarm09.wav');
					//Orion.PauseScript('all', 'GMJournalScan');
                    Orion.Wait(1000);
                    Orion.StopWalking();		
					break;	
				default:
					break;
				}
			}
		}
	}

function TeleStealer(_)
    {
    var tele = Orion.FindTypeEx(any,any,ground,'item',2).filter(function(item)
        {
        var itemProps = item.Properties();
        return Orion.Contains(itemProps, 'House Teleporter') && !Orion.Contains(itemProps, 'Locked Down')
        })[0];
    while(!tele)
        {
        Orion.Wait(1);
        tele = Orion.FindTypeEx(any,any,ground,'item',2).filter(function(item)
            {
            var itemProps = item.Properties();
            return Orion.Contains(itemProps, 'House Teleporter') && !Orion.Contains(itemProps, 'Locked Down')
            })[0];
        }
    Orion.MoveItem(tele.Serial());
    Orion.Wait(1300);
    Orion.WaitContextMenuID(self, 604);
    Orion.RequestContextMenu(self);
    Orion.Wait(500);
    Orion.WalkTo(Player.X(), Player.Y() + 3, Player.Z(), 0, 255, 0);
    }

//--#Helpers
function AutoGate(_CallOnly)
    {
    var gate = Orion.FindTypeEx('0x0F6C|0x0DDB', any, ground, 'near', 16)[0];
    if(!gate)
        return true;
    var gateX = gate.X();
    var gateY = gate.Y();
    while(Orion.GetDistance(gateX, gateY) > 1 && Orion.GetDistance(gateX,gateY) < 16)
        {
        Orion.WalkTo(gate.X(),gate.Y());
        Orion.Wait(1000);
        }
    Orion.Resend();
    Orion.Wait(500);
    Orion.UseObject(gate.Serial());
    if(Orion.WaitForGump(3000))
        {
        var gump = Orion.GetGump(any,'0x0000232D')
        if(gump != null)
            {
            while(!Player.Hidden())
                {
                Orion.UseSkill('Hiding');
                Orion.Wait(500);
                }
            Orion.Wait(1000);
            gump.Select(Orion.CreateGumpHook(1));
			Orion.Wait(1000);
            }
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