//--# AliDebug
var debug = true;
function Debug(msg,type)
    {
    if(!debug)
        return;
    if(type == undefined)
        type = 1;
    if(!TextWindow.IsOpened())
        TextWindow.Open();
    switch(type)
        {
        case 1:
            TextWindow.Print(Orion.Time() + '|-' + Player.Name() + ': ' + msg);
            break;
        case 2:
            TextWindow.Print('DEBUG ' + Orion.Time() + '|-' + Player.Name() + ': ' + msg);
            break;
        default:
            break;
        }
    }

const Logger = {
    Error: function(text) { Orion.Print(0x0021, JSON.stringify(text)); },
    Info: function(text) { Orion.Print(0x03E9, JSON.stringify(text)); },
    Warn: function(text) { Orion.Print(0x035, JSON.stringify(text)); },
    Debug: function(text) {
        TextWindow.Print(JSON.stringify(text));
        if (!TextWindow.IsOpened()) {
            TextWindow.Open();
        }
    },
};

function ClearUdp()
	{
	Orion.RemoveAllUdpServers();
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

function RecordPlayerPosition()
	{
	if(!TextWindow.IsOpened())
		TextWindow.Open();
	TextWindow.Print('[' + Player.X() + ', ' + Player.Y() + '],')
	Orion.AddFakeMapObject(Orion.Random(1,20000), '0x051A', 1152, Player.X(), Player.Y(), Player.Z());
	}
	
function SurveyMarkRange()
    {
    var range = 24
    Orion.ClearFakeMapObjects()
    var startX = Player.X() - range * 2;
    var endX = Player.X() + range * 2;
    var startY = Player.Y() - range * 2;
    var endY = Player.Y() + range * 2;
    var tiles = Orion.GetTilesInRect('land', startX, startY, endX, endY);
    tiles.forEach(function (tile) 
            {
            var tileX = tile.X();
            var tileY = tile.Y();
            var tileZ = tile.Z();
            var serial = String(tileX) + String(tileY);
            Orion.AddFakeMapObject(serial, '0x051A', 1159, tileX, tileY, tileZ);
            });
    var startX = Player.X() - range;
    var endX = Player.X() + range;
    var startY = Player.Y() - range;
    var endY = Player.Y() + range;
    var tiles = Orion.GetTilesInRect('land', startX, startY, endX, endY);
    tiles.forEach(function (tile) 
            {
            var tileX = tile.X();
            var tileY = tile.Y();
            var tileZ = tile.Z();
            var serial = String(tileX) + String(tileY);
            Orion.AddFakeMapObject(serial, '0x051A', 5, tileX, tileY, tileZ);
            });
    var startX = Player.X() - range * 2;
    var endX = Player.X() + range * 2;
    var startY = Player.Y() - range * 2;
    var endY = Player.Y() + range * 2;
    var tiles = Orion.GetTilesInRect('land', Player.X(), startY, Player.X(), endY);
    tiles.forEach(function (tile) 
            {
            var tileX = tile.X();
            var tileY = tile.Y();
            var tileZ = tile.Z();
            var serial = String(tileX) + String(tileY);
            Orion.AddFakeMapObject(serial, '0x051A', 1, tileX, tileY, tileZ);
            Orion.AddFakeMapObject(serial, '0x051A', 1, tileX, tileY, tileZ);
            });
    var tiles = Orion.GetTilesInRect('land', startX, Player.Y(), endX, Player.Y());
    tiles.forEach(function (tile) 
            {
            var tileX = tile.X();
            var tileY = tile.Y();
            var tileZ = tile.Z();
            var serial = String(tileX) + String(tileY);
            Orion.AddFakeMapObject(serial, '0x051A', 1, tileX, tileY, tileZ);
            Orion.AddFakeMapObject(serial, '0x051A', 1, tileX, tileY, tileZ);
            }); 
    Orion.AddFakeMapObject(1, '0x051A', 1, Player.X(), Player.Y(), Player.Z());
    Orion.AddFakeMapObject(1, '0x051A', 1, Player.X(), Player.Y(), Player.Z());
    Orion.AddFakeMapObject(1, '0x051A', 1, Player.X(), Player.Y(), Player.Z());
    Orion.AddFakeMapObject(1, '0x051A', 1, Player.X(), Player.Y(), Player.Z());
    }

function ClearMarkers()
    {
    Orion.ClearFakeMapObjects();
    }

function AliGumpRedraw() {
    var miscSerial = 10000;
    var gumpRedraw = Orion.CreateCustomGump(11001);
    gumpRedraw.Clear();
    gumpRedraw.AddText(5, -20, 32, "CLONE");
    gumpRedraw.SetCallback("AliGumpRedrawCallback");

    var gump = Orion.GetGump('last');
    var gumpCommands = gump.CommandList();
    for (var i = 0; i < gumpCommands.length; i++) {
        var gumpCommand = Orion.Split(gumpCommands[i], ' ');
        if (gumpCommand[0] == 'tilepic') {
            var x = gumpCommand[1];
            var y = gumpCommand[2];
            var graphic = gumpCommand[3];
            gumpRedraw.AddTilePic(x, y, graphic, '0');
        }
        else if (gumpCommand[0] == 'resizepic') {
            var x = gumpCommand[1];
            var y = gumpCommand[2];
            var graphic = gumpCommand[3];
            var width = gumpCommand[4];
            var height = gumpCommand[5];
            gumpRedraw.AddResizepic(x, y, graphic, width, height);
        }
        else if (gumpCommand[0] == 'gumppic') {
            var x = gumpCommand[1];
            var y = gumpCommand[2];
            var graphic = gumpCommand[3]
            gumpRedraw.AddGumpPic(x, y, graphic, '0');
        }
        else if (gumpCommand[0] == 'button') {
            var x = gumpCommand[1];
            var y = gumpCommand[2];
            var graphicOne = gumpCommand[3];
            var graphicTwo = gumpCommand[4];
            var graphicThree = gumpCommand[3];
            var action = gumpCommand[5];
            var toPage = gumpCommand[6];
            var serial = gumpCommand[7];
            gumpRedraw.AddButton(serial, x, y, graphicOne, graphicTwo, graphicThree, '0', action, toPage);
        }
        else if (gumpCommand[0] == 'buttontileart') {
            var x = gumpCommand[1];
            var y = gumpCommand[2];
            var graphicOne = gumpCommand[3];
            var graphicTwo = gumpCommand[4];
            var graphicThree = gumpCommand[4];
            var color = gumpCommand[5];
            var action = gumpCommand[6];
            var toPage = gumpCommand[7];
            var tileGraphic = gumpCommand[8];
            var tileColor = gumpCommand[9];
            var tileX = gumpCommand[10];
            var tileY = gumpCommand[11];
            gumpRedraw.AddButtonTileArt(miscSerial++, x, y, graphicOne, graphicTwo, graphicThree, color, tileGraphic, tileColor, tileX, tileY, action, toPage);
        }
        else if (gumpCommand[0] == 'checkertrans') {
            var x = gumpCommand[1];
            var y = gumpCommand[2];
            var width = gumpCommand[3]
            var height = gumpCommand[4];
            gumpRedraw.AddCheckerTrans(x, y, width, height)
        }
        else if (gumpCommand[0] == 'text') {
            var x = gumpCommand[1];
            var y = gumpCommand[2];
            var color = gumpCommand[3];
            var textIndex = gumpCommand[4];
            gumpRedraw.AddText(x, y, color, gump.Text(textIndex));
        }
        else if (gumpCommand[0] == 'xmfhtmlgump') {
            var x = gumpCommand[1];
            var y = gumpCommand[2];
            var width = gumpCommand[3];
            var height = gumpCommand[4];
            var textCliloc = gumpCommand[5];
            var hasBackground = gumpCommand[6];
            var hasScrollbar = gumpCommand[7];
            //Dunno how to get the actual background graphic
            gumpRedraw.AddHtmlGump(miscSerial++, x, y, width, height, 'graphic', hasBackground, hasScrollbar, color, Orion.GetCliLocString(textCliloc));
        }
        else if (gumpCommand[0] == 'xmfhtmlgumpcolor') {
            var x = gumpCommand[1];
            var y = gumpCommand[2];
            var width = gumpCommand[3];
            var height = gumpCommand[4];
            var textCliloc = gumpCommand[5];
            var hasBackground = gumpCommand[6];
            var hasScrollbar = gumpCommand[7];
            var color = gumpCommand[8];
            //Dunno how to get the actual background graphic
            gumpRedraw.AddHtmlGump(miscSerial++, x, y, width, height, 'graphic', hasBackground, hasScrollbar, color, Orion.GetCliLocString(textCliloc));
        }
    }
    gumpRedraw.Update();
}

function AliGumpRedrawCallback() {
    Orion.Print("Response Code: " + CustomGumpResponse.ReturnCode());
}

function GetAllUniqueGraphicsInContainer()
    {
    var hash = {};
    var outString = '';
    Orion.WaitForAddObject('myTarget');
    var serial = Orion.GetSerial('myTarget');
    VerifyOpenContainer(serial);
    Orion.FindTypeEx(any,any,serial).forEach(function(item)
        {
        var graphic = item.Graphic();
        if(!hash[graphic])
            {
            outString += graphic + '|';
            hash[graphic] = true;
            }
        });
    TextWindow.Open();
    TextWindow.Print(outString.slice(0,-1));
    }

function timeMyFunction(func, args)
    {   //func: the function you want to time
        //args: the arguments of the function in an array. Default: []
        //Example: timeMyFunction(AddNumbers,[1,2])
    var start = Orion.Now();
    func.apply(null, args);
    var time = Orion.Now() - start;
    Orion.Print('Execution time: ' + time + 'ms');
    }