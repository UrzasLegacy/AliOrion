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
            AliAtlas(loc[2],loc[3],loc[4])
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

function AliAtlas(targetX,targetY,targetMap)
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
    var map = maps[Orion.ObjAtLayer('backpack').Map()]
    Orion.Print(map)
    if(Orion.GetDistance(targetX,targetY) == 0)
        {
        Orion.CharPrint(self,1159,'Already at destination: ' + targetX + ',' + targetY + ' in ' + targetMap);
        Orion.WarMode(0);
        return;
        }
    if(Orion.GetDistance(targetX,targetY) < 250 && Orion.GetPathArray(targetX, targetY, 256, 0).length && map == targetMap)
        {
        Orion.CharPrint(self,1159,'Walking to ' + targetX + ',' + targetY + ' in ' + targetMap);
        Orion.WarMode(1);
        AliWalkTo(targetX,targetY);
        Orion.WarMode(0);
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
    Orion.WarMode(1);
    
    Orion.CharPrint(self,1159,'Walking to nearest gate');
    AliWalkTo(nearestGate[3], nearestGate[4])
    //var tempX = Player.X();
    //var tempY = Player.Y();
    while(Orion.GetDistance(destinationGate[3],destinationGate[4]) > 10)
        {
        Orion.Print('Waiting for gate gump')
        var gump = Orion.GetGump('any','0x00000258');
        if(gump !== null)
            {
            var gumpHook = Orion.CreateGumpHook(1);
            gumpHook.AddCheck(destinationGate[2], true);
            gump.Select(gumpHook);
            Orion.Wait(100);
            }
        else
            {
            var gate = Orion.FindTypeEx('0x0F6C', any, ground, 'near', 23);
            Orion.CharPrint(self,1159,'Searching for gate');
            if(gate[0])
                {
                Orion.CharPrint(self,1159,'Walking to gate');
                AliWalkTo(gate[0].X(), gate[0].Y());
                Orion.Wait(500);
                Orion.Resend();
                Orion.Wait(500);
                Orion.UseObject(gate[0].Serial());
                }
            else 
                {
                Orion.CharPrint(self,1159,'Walking to nearest gate');
                if(!AliWalkTo(nearestGate[3], nearestGate[4]))
                    if(!AliWalkTo(1174, 1283))
                        AliWalkTo(1016, 524);
                }
            }
        Orion.Wait(1000);
        }
    Orion.WarMode(1);
    Orion.CharPrint(self,1159,'Walking to ' + targetX + ',' + targetY + ' in ' + targetMap);
    AliWalkTo(targetX,targetY);
    Orion.WarMode(0);
    }

function AliWalkTo(x,y,z,distanceXY,distanceZ,chunkSize,run,openDoor,maxWalkingTime,pathMarkers,startCallBackFn,endCallBackFn)
    {
    if(z === undefined) z = Player.Z();
    if(distanceXY === undefined) distanceXY = 0;
    if(distanceZ === undefined) distanceZ = 255;
    if(chunkSize === undefined) chunkSize = 5;
    if(run === undefined) run = 1;
    if(openDoor === undefined) openDoor = 1;
    if(maxWalkingTime === undefined) maxWalkingTime = 300000;
    if(pathMarkers === undefined) pathMarkers = false;
    
    if(typeof startCallBackFn == 'function')
        startCallBackFn();
    var playerX = Player.X();
    var playerY = Player.Y();
    var zeroDistanceDestination = playerX == x && playerY == y;
    var pathTiles = Orion.GetPathArray(x, y, z, distanceXY, distanceZ, run, openDoor);
    if(pathMarkers)
        Orion.ClearFakeMapObjects();
    if(pathTiles.length === 0 && !zeroDistanceDestination)
        {
        Orion.CharPrint(self,1159,"Destination unreachable!")
        return false;
        }
    if(!zeroDistanceDestination)
        {
        var shortStop = pathTiles[pathTiles.length - 1];
        var shortX = shortStop.X();
        var shortY = shortStop.Y();
        if(pathMarkers)
            {
            pathTiles.forEach(function(tile,i)
                {
                Orion.AddFakeMapObject(i, '0x051A', 1159, tile.X(), tile.Y(), tile.Z());
                })
            Orion.Print('Tiles: ' + pathTiles.length + '\nChunks: ' + Math.floor(pathTiles.length / chunkSize));
            }
        if(pathTiles.length >= chunkSize)
            var chunk = pathTiles[chunkSize - 1];
        else
            var chunk = shortStop;
        var chunkX = chunk.X(), chunkY = chunk.Y(), chunkZ = chunk.Z();
        if(pathMarkers)
            {
            Orion.AddFakeMapObject(10000, '0x051A', 32, x,y,z);
            Orion.AddFakeMapObject(10001, '0x051A', 32, chunkX,chunkY,chunkZ);
            }
        Orion.WalkTo(chunkX,chunkY,chunkZ,0,distanceZ,run,openDoor,maxWalkingTime);
        Orion.Wait(1); // This being so low will make your computer lag if you try to manually move while pathfinding
        }
    if(typeof endCallBackFn == 'function')
        endCallBackFn();
    if(!zeroDistanceDestination && Orion.GetDistance(shortX,shortY) > 0)
        return AliWalkTo(x,y,z,distanceXY,distanceZ,chunkSize,run,openDoor,maxWalkingTime,pathMarkers,startCallBackFn,endCallBackFn);
    return true;
    }

function DistBetweenPoints(x1,y1,x2,y2)
    {
    return Math.floor(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)))
    }