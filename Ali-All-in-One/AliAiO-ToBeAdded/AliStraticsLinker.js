function AliStraticsSearcher()
    {
    Orion.CharPrint(self,1159,"Target item")
    Orion.WaitForAddObject('myTarget');
	var obj = Orion.FindObject('myTarget');
	var name = obj.Name();
    var linkType = 'Search';
    var outMsg = LinkFormatter(name,linkType);
    var characterAdj = 6.4;
    var title = "Ali's Stratics Searcher"
    var gump = Orion.CreateCustomGump(10420); 
    var height = 70;
    var margin = 25;
    var width = (name.length * characterAdj) + ((linkType.length + ': '.length) * characterAdj) + (margin * 2);
    gump.Clear();
    gump.AddResizepic(0, 0, 'a3c', width, height); //background image
    gump.AddColoredPolygone(10, 12, width - 20, 15, '#FF660066', 0, 1, 0, 0, 0); //title background
    gump.AddColoredPolygone(10, 12, width - 20, 15, '#FF666600', 1, 2, 0, 0, 0); //title border
    gump.AddColoredPolygone(10, 12, width - 20, height - 24, '#FF666600', 1, 2, 0, 0, 0); //background border
    gump.AddHtmlGump(0,0,9,width,height - 20,'a3c',0,0) //these next 3 lines are a workaround for positioning html text
    gump.Select('htmlgump');
    gump.AddHtmlText('doesnt matter what', 'i put here apparently', width, height, 554, "<center>" + title + "</center>"); //x,y arguments are bugged and don't do anything
    gump.Select('gump');
    gump.AddHtmlGump(5000,margin, 31, 500, 18, '0x0BB8',0,0);
    gump.Select('htmlgump',5000)
    var textOut = linkType + ': <a href=' + outMsg + '>' + name + '</a>'
    gump.AddHtmlText(20,20, 500, 18, '32', textOut,100);
    gump.Select('gump');
    gump.Update();
    }

function LinkFormatter(itemName,type)
    {
    switch(type)
        {
        case 'Search':
            var formattedName = itemName.replace(/\s/g,'+') //https://wiki.stratics.com/index.php?search=Body+Fluid+Of+Queen+Ogre+Bee+Larva&title=Special%3ASearch&fulltext=Search
            var outMsg = "\"https://wiki.stratics.com/index.php?search=" + formattedName + "&title=Special%3ASearch&fulltext=Search\"";
            break;
        case 'UO Link':
            var formattedName = itemName.replace(/\s/g,'_') //
            var outMsg = "\"https://wiki.stratics.com/index.php?title=UO:" + formattedName + "\"";
            break;
        default:
            var formattedName = itemName.replace(/\s/g,'_')
            var outMsg = "\"https://wiki.stratics.com/index.php?title=" + formattedName + "\"";
            break;
        }
    return outMsg;
    }


//[URL='https://wiki.stratics.com/index.php?title=UO:Standard_Of_The_Pumpkin_King']bomp[/URL]
function AliStraticsLinker()
    {
    Orion.CharPrint(self,1159,"Target item");
    Orion.WaitForAddObject('myTarget');
	var obj = Orion.FindObject('myTarget');
	var name = obj.Name();
    var underscoreName = name.replace(/\s/g,'_') //https://wiki.stratics.com/index.php?search=Body+Fluid+Of+Queen+Ogre+Bee+Larva&title=Special%3ASearch&fulltext=Search
    var outMsg = "\"https://wiki.stratics.com/index.php?title=" + underscoreName + "\"";
    var outMsg2 = "\"https://wiki.stratics.com/index.php?title=UO:" + underscoreName + "\"";
    var characterAdj = 6.6;
    var title = "Ali's Stratics Linker";
    var gump = Orion.CreateCustomGump(10420);
    var height = 108;
    var largerMsg = Math.max(outMsg.length,outMsg2.length);
    var width = largerMsg * characterAdj;
    gump.Clear();
    gump.AddResizepic(0, 0, 'a3c', width, height); //background image
    gump.AddColoredPolygone(10, 12, width - 20, 15, '#FF660066', 0, 1, 0, 0, 0); //title background
    gump.AddColoredPolygone(10, 12, width - 20, 15, '#FF666600', 1, 2, 0, 0, 0); //title border
    gump.AddColoredPolygone(10, 12, width - 20, height - 24, '#FF666600', 1, 2, 0, 0, 0); //background border
    gump.AddHtmlGump(0,0,9,width,height - 20,'a3c',0,0) //these next 3 lines are a workaround for positioning html text
    gump.Select('htmlgump');
    gump.AddHtmlText('doesnt matter what', 'i put here', width, height, 554, "<center>" + title + "</center>"); //x,y arguments are bugged and don't do anything
    gump.Select('gump');
    gump.AddHtmlGump(5000,25, 31, width, 65, '0x0BB8',0,0);
    gump.Select('htmlgump',5000)
    var textOut = '<a href=' + outMsg + '><b>NEWER RARES</b></a>';
    var textOut2 = '<a href=' + outMsg2 + '><b>OLDER RARES</b></a>';
    gump.AddHtmlText(20,20, width, 65, '1', textOut + '\n\n' + textOut2,100);
    gump.Select('gump');
    gump.Update();
    }

function LinkFormatter(itemName,type,bbCode)
    {
    switch(type)
        {
        case 'Search':
            var formattedName = itemName.replace(/\s/g,'+') //https://wiki.stratics.com/index.php?search=Body+Fluid+Of+Queen+Ogre+Bee+Larva&title=Special%3ASearch&fulltext=Search
            var outMsg = "\"https://wiki.stratics.com/index.php?search=" + formattedName + "&title=Special%3ASearch&fulltext=Search\"";
            break;
        case 'UO Link':
            var formattedName = itemName.replace(/\s/g,'_')
            var outMsg = "\"https://wiki.stratics.com/index.php?title=UO:" + formattedName + "\"";
            break;
        default:
            var formattedName = itemName.replace(/\s/g,'_')
            var outMsg = "\"https://wiki.stratics.com/index.php?title=" + formattedName + "\"";
            break;
        }
    if(bbCode)
        outMsg = "[URL=" + outMsg + ']' + itemName + "[/URL]"
    return outMsg;
    }

function AuctionFormatter()
    {
    //ignore these graphics:
        var auctionSafe = '!0x9C18|!0x9C19|';
        var books = '!0x0FF1|';
        var containers = '!0x0E75|!0x0E79|';
        var bulletinBoard = '!0x2311|';
        var teleporters = '!0x574A|!0x40BB|';
        var houseSign = '!0x0BD2|';
        var lanterns = '!0x0A15|!0x0A18|!0x0A1A|!0x0A1D|!0x0A22|!0x0A25|';
        var crystalPortal = '!0x468B|';
    var ignoreGraphics = auctionSafe + books + containers + bulletinBoard + teleporters + houseSign + lanterns + crystalPortal;
    var auctionItems = Orion.FindTypeEx(ignoreGraphics,any,ground,'item',22).filter(function(auctionItem)
    	{
    	return auctionItem.Name();
    	}).sort(function(a,b)
            {
            return a.Color() - b.Color();
            });
    Orion.Print(auctionItems.length);
    TextWindow.Open();
    TextWindow.Clear();
    TextWindow.Print('[TABLE]');
    auctionItems.forEach(function(auctionItem,ind)
    	{
        var itemName = auctionItem.Name();
        var itemGraphic = parseInt(auctionItem.Graphic());
        var itemHue = parseInt(auctionItem.Color());
        var formattedName = itemName.replace(/\s/g,'_');
        var outMsg = "[TR][TD][CENTER][B]" + (ind + 1) + "[/B][/CENTER][/TD][TD][B][URL=\"https://wiki.stratics.com/index.php?title=UO:" + formattedName + "\"]" + itemName+ "[/URL][/B][/TD]" 
            +   "[TD][B]Graphic:[/B] " + itemGraphic + '[/TD]'
            + '[TD][B]Hue:[/B] ' + itemHue + '[/TD][/TR]';
        TextWindow.Print(outMsg);
    	});
    TextWindow.Print('[/TABLE]');
    }

function LinkFormatter(itemName,type,bbCode)
    {
    switch(type)
        {
        case 'Search':
            var formattedName = itemName.replace(/\s/g,'+') //https://wiki.stratics.com/index.php?search=Body+Fluid+Of+Queen+Ogre+Bee+Larva&title=Special%3ASearch&fulltext=Search
            var outMsg = "\"https://wiki.stratics.com/index.php?search=" + formattedName + "&title=Special%3ASearch&fulltext=Search\"";
            break;
        case 'UO Link':
            var formattedName = itemName.replace(/\s/g,'_')
            var outMsg = "\"https://wiki.stratics.com/index.php?title=UO:" + formattedName + "\"";
            break;
        default:
            var formattedName = itemName.replace(/\s/g,'_')
            var outMsg = "\"https://wiki.stratics.com/index.php?title=" + formattedName + "\"";
            break;
        }
    if(bbCode)
        outMsg = "[URL=" + outMsg + ']' + itemName + "[/URL]"
    return outMsg;
    }