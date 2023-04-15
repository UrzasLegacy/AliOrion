function AliStraticsLinker()
    {
    Orion.CharPrint(self,1159,"Target item")
    Orion.WaitForAddObject('myTarget');
	var obj = Orion.FindObject('myTarget');
	var name = obj.Name();
    var underscoreName = name.replace(/\s/g,'_')
    var outMsg = "\"https://wiki.stratics.com/index.php?title=" + underscoreName + "\"";
    var characterAdj = 6.6;
    var title = "Ali's Stratics Linker"
    var gump = Orion.CreateCustomGump(10420); 
    var height = 70
    var width = outMsg.length * characterAdj
    gump.Clear();
    gump.AddResizepic(0, 0, 'a3c', width, height); //background 0xDAC 0x254e 0x2560 9bf5 
    gump.AddColoredPolygone(10, 12, width - 20, 15, '#FF660066', 0, 1, 0, 0, 0); //title background
    gump.AddColoredPolygone(10, 12, width - 20, 15, '#FF666600', 1, 2, 0, 0, 0); //title border
    gump.AddColoredPolygone(10, 12, width - 20, height - 24, '#FF666600', 1, 2, 0, 0, 0); //gump border
    gump.AddHtmlGump(0,0,9,width,height - 20,'a3c',0,0) //these next 3 lines are a workaround for positioning html text
    gump.Select('htmlgump');
    gump.AddHtmlText('doesnt matter what', 'i put here', width, height, 554, "<center>" + title + "</center>"); //x,y arguments are bugged and don't do anything
    gump.Select('gump');
    gump.AddHtmlGump(5000,25, 31, 500, 18, '0x0BB8',0,0);
    gump.Select('htmlgump',5000)
    var textOut = '<a href=' + outMsg + '>' + outMsg + '</a>'
    gump.AddHtmlText(20,20, 500, 18, '1', textOut,100);
    gump.Update();
    gump.Select('gump');
    gump.Update();
    }