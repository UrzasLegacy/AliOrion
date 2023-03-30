function initTest()
	{ //[x,y,'facet']
	AliAtlas([3688,2079,'Trammel'])
	}

function AliAtlas(target)
    { //[x,y,'facet']
    var maps = ['Felucca', 'Trammel', 'Ilshenar', 'Malas', 'Tokuno Islands', 'Ter Mur & Eodon'];
    if(Orion.GetPathArray(target[0], target[1], 256, 0).length && maps[Player.Map()] == target[2])
        {
        while(Orion.GetDistance(target[0], target[1]) > 2)
            {
            Orion.WalkTo(target[0], target[1], 0,0)
            Orion.Wait(500);
            }
        return;
        }
    //var targetCoords = Orion.Split(target, ',').map(function(coord){return +coord});
    var startTime = Orion.Now();
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
            ['Isamu-Jima', 'Tokuno Islands', 30, 1169, 998],
            ['Makoto-Jima', 'Tokuno Islands', 31, 802, 1204],
            ['Homare-Jima', 'Tokuno Islands', 32, 270, 628],
            ['Royal City', 'Ter Mur & Eodon', 33, 850, 3525],
            ['Valley of Eodon', 'Ter Mur & Eodon', 34, 719, 1863],
        ]

    var x = Player.X();
    var y = Player.Y();
    var map = maps[Player.Map()];
    
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
    var destinationGate = gateArr.filter(function(gate){return gate[1] == target[2]})
        .sort(function(a,b)
        {
        return DistBetweenPoints(target[0],target[1],a[3],a[4]) - DistBetweenPoints(target[0],target[1],b[3],b[4])
        })[0];
    Orion.Print(nearestGate[1] + ' - ' + nearestGate[0] + ' ' + nearestGate[3] + ', ' + nearestGate[4] + ':' + Orion.GetPathArray(nearestGate[3], nearestGate[4], 256, 0).length)
    Orion.Print(destinationGate[1] + ' - ' + destinationGate[0] + ' ' + destinationGate[3] + ', ' + destinationGate[4])
    Orion.Print(Orion.Now() - startTime)
    while(Orion.GetDistance(nearestGate[3], nearestGate[4]) > 2)
        {
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
    while(Orion.GetDistance(target[0], target[1]) > 2)
        {
        Orion.WalkTo(target[0], target[1], 0,0)
        Orion.Wait(500);
        }
    }

function DistBetweenPoints(x1,y1,x2,y2)
    {
    return Math.floor(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)))
    }