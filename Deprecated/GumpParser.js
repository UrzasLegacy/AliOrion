function AliGumpRedraw()
    {
    var highSerial = 10000;
    var gumpRedraw = Orion.CreateCustomGump(11001);
    gumpRedraw.Clear();

    //'--Ali Gump Redraw--';
    var gump = Orion.GetGump('last');
    var gumpCommands = gump.CommandList();
    for(var i=0;i<gumpCommands.length;i++)
        {
        var gumpCommand = Orion.Split(gumpCommands[i],' ');
        if(gumpCommand[0] == 'tilepic')
            {
            var x = gumpCommand[1];
            var y = gumpCommand[2];
            var graphic = gumpCommand[3]
            gumpRedraw.AddTilePic(x, y, graphic, '0');
            }
        else if(gumpCommand[0] == 'resizepic')
            {
            var x = gumpCommand[1];
            var y = gumpCommand[2];
            var graphic = gumpCommand[3]
            var width = gumpCommand[4];
            var height = gumpCommand[5];
            gumpRedraw.AddResizepic(x, y, graphic, width, height);
            }
        else if(gumpCommand[0] == 'gumppic')
            {
            var x = gumpCommand[1];
            var y = gumpCommand[2];
            var graphic = gumpCommand[3]
            gumpRedraw.AddGumpPic(x, y, graphic, '0');
            }
        else if(gumpCommand[0] == 'button')
            {
            var x = gumpCommand[1];
            var y = gumpCommand[2];
            var graphicOne = gumpCommand[3]
            var graphicTwo = gumpCommand[4];
            var graphicThree = gumpCommand[3];
            var action = gumpCommand[5];
            var toPage = gumpCommand[6];
            var serial = gumpCommand[7];
            gumpRedraw.AddButton(serial, x, y, graphicOne,graphicTwo,graphicThree, '0',action,toPage);
            }
        else if(gumpCommand[0] == 'buttontileart')
            {
            var x = gumpCommand[1];
            var y = gumpCommand[2];
            var graphicOne = gumpCommand[3]
            var graphicTwo = gumpCommand[4];
            var graphicThree = gumpCommand[4];
            var color = gumpCommand[5];
            var action = gumpCommand[6];
            var toPage = gumpCommand[7];
            var tileGraphic = gumpCommand[8];
            var tileColor = gumpCommand[9];
            var tileX = gumpCommand[10];
            var tileY = gumpCommand[11];
            gumpRedraw.AddButtonTileArt(highSerial++, x, y, graphicOne, graphicTwo, graphicThree, color, tileGraphic, tileColor, tileX, tileY, action, toPage);
            }
        else if(gumpCommand[0] == 'checkertrans')
            {
            var x = gumpCommand[1];
            var y = gumpCommand[2];
            var width = gumpCommand[3]
            var height = gumpCommand[4];
            gumpRedraw.AddCheckerTrans(x, y, width, height)
            }
        else if(gumpCommand[0] == 'text')
            {
            var x = gumpCommand[1];
            var y = gumpCommand[2];
            var color = gumpCommand[3]
            var text = gumpCommand[4];
            gumpRedraw.AddText(x, y, color, gump.Text(text));
            }
        else if(gumpCommand[0] == 'xmfhtmlgumpcolor')
            {
            var x = gumpCommand[1];
            var y = gumpCommand[2];
            var width = gumpCommand[3];
            var height = gumpCommand[4];
            var text = gumpCommand[5];
            var hasBackground = gumpCommand[6];
            var hasScrollbar = gumpCommand[7];
            var color = gumpCommand[8];
            gumpRedraw.AddHtmlGump(highSerial++, x, y, width, height, 'graphic', hasBackground, hasScrollbar, color, Orion.GetCliLocString(text));
            }
        }
    gumpRedraw.Update()
    }