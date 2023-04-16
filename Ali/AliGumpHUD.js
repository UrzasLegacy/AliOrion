//# AliGumpHud

//Asset Types:
//'button': A custom graphic button. Args: 'functionName', widthAdjust, xAdj, yAdj, 'graphic|graphicSelected|graphicPressed'
//'toggle': A gem toggle button. Args: 'functionName', 'displayName', ('altOnGraphic|altOnGraphicSelected|altOnGraphicPressed','altOffGraphic|altOffGraphicSelected|altOffGraphicPressed',xAdj,yAdj)
//'textInput': A text input. Args: 'storedVarName'
//'text': Text. Args: 'textString', textColor, xAdj, yAdj
//'horizontalLine': A horizontal line. Args: width,xAdj,yAdj,color,lineWidth
//'verticalLine': A vertical line. Args: height,xAdj,yAdj,color,lineWidth
//'comboBox': A dropdown box. Args: storedVarName, option1, option2, option3... etc
//'xSpacer': A blank asset spacer. Args: width
//'ySpacer': A blank row spacer. Args: height
//'tooltip': Add a tooltip to the previous asset. Args: 'text'


// var gumpAssets = 
// [
//     [ ['toggle','Example1Function','Example1','0x2c88|0x2c89|0x2c8A','0x2c92|0x2c93|0x2c94', 6, 6], ['toggle','Example3Function','Three'], ['toggle','Example4Function','4'] ],
//     [ ['toggle','Example2Function','ExampleTwo'],['ySpacer',10] ],
//     [ ['text','Sample Text Here',554,1,1] ],
//     [ ['textInput','Ignore Mobs'],['horizontalLine',30,0,0,'#FF660066',2],['verticalLine',30,0,0,'#FF660066',10] ],
//     [ ['comboBox', 'Single Target', 'Primary', 'Secondary'], ['comboBox', 'Two Targets', 'Primary', 'Secondary'], ['comboBox', 'Multi Target', 'Primary', 'Secondary']],
//     [ ['xSpacer', 330],['button','ClearAll',20,0,2,'0x2EE3|0x2EE3|0x2EE4'] ]
// ];

function AliGumpRenderer() 
	{
    var title = "Ali's Modular Gump"
    var startTime = Orion.Now();
    var gump = Orion.CreateCustomGump(10420); 

    var rowAdj = 45;
    var characterAdj = 6;
    var buttonTextHorAdj = 32;
    var buttonTextVerAdj = 3;
    var textColor = 1159;
	var rowStart = 35;
	var columnStart = 25;

    var gumpButtons = gumpAssets;//Shared.GetArray('gumpValues',[]);
    //Orion.Print(gumpButtons)
    if(!gumpButtons[0])
        {
        Orion.Print('Resetting to default Assets')
        Shared.AddArray('gumpValues',gumpAssets)
        gumpButtons = gumpAssets;
        }
    var heightAdjust = 0;
    var width = Math.max.apply(Math, gumpButtons.map(function (rows)
        {
        var length = rows.reduce(function(sum,ele)
            {
            var assetType = ele[0];
            var widthAdjust = 0
            switch(assetType)
                {
                case 'button':
                    widthAdjust = ele[2];
                    break;
                case 'toggle':
                    widthAdjust = (ele[2].length * characterAdj) + buttonTextHorAdj + 23 + (ele[5] || 0);
                    break;
                case 'comboBox':
                    widthAdjust = 142;
                    heightAdjust += 3;
                    break;
                case 'textInput':
                    widthAdjust = 135;
                    break;
                case 'text':
                    var string = ele[1];
                    var xAdj = ele[2];
                    widthAdjust = (string.length * characterAdj) + xAdj// + 20;
                    break;
                case 'horizontalLine':
                    widthAdjust = ele[1] + 10;
                    break;
                case 'verticalLine':
                    widthAdjust = ele[5];
                    heightAdjust += ele[1];
                    break;
                case 'xSpacer':
                    widthAdjust = ele[1];
                    break;
                case 'ySpacer':
                    heightAdjust += ele[1];
                    break;
                default:
                    break;
                }
            return sum + widthAdjust;
            },0);
        return length + 25;
        }));
    var height = (gumpButtons.length * rowAdj) + rowStart + heightAdjust;
    gump.Clear();
    gump.SetCallback('AliGumpCallback');
    gump.AddResizepic(0, 0, 'a3c', width, height); //background 0xDAC 0x254e 0x2560 9bf5 
    gump.AddColoredPolygone(10, 12, width - 20, 15, '#FF660066', 0, 1, 0, 0, 0); //title background
    gump.AddColoredPolygone(10, 12, width - 20, 15, '#FF666600', 1, 2, 0, 0, 0); //title border
    gump.AddColoredPolygone(10, 12, width - 20, height - 24, '#FF666600', 1, 2, 0, 0, 0); //gump border
	//gump.AddText(20,9, 554, 'Modular Gump') //title
    gump.AddHtmlGump(0,0,9,width,height,'a3c',0,0) //these next 3 lines are a workaround for positioning html text
    gump.Select('htmlgump');
    gump.AddHtmlText('doesnt matter what', 'i put here', width, height, 554, "<center>" + title + "</center>"); //x,y arguments are bugged and don't do anything
    gump.Select('gump');
    
    //Custom Assets
	//gump.AddButton(100, width - 95, height - 35,'0x2EE0','0x2EE0','0x2EE1','0x0487'); //accept
	//gump.AddButton(101, 21, height - 35,'0x2EE3','0x2EE3','0x2EE4','0x0487'); //clear
    
    //Modular Assets
    var rowPos = rowStart;
    var colPos = columnStart;
    var i = 1;
    for(var r = 0;r<gumpButtons.length;r++)
        {
        var row = gumpButtons[r];
        for(var c = 0;c<row.length;c++)
            {
            var asset = row[c];
            var assetType = asset[0];
            switch(assetType)
                {
                case 'button':
                    var gumpOption = asset[1];
                    var widthAdjust = asset[2];
                    var xAdj = asset[3] || 0;
                    var yAdj = asset[4] || 0;
                    var buttonGraphic = asset[5] != undefined ? Orion.Split(asset[5],'|') : ['0x25FB','0x25FC','0x25FC']; //0x16D3,0x16D5 0x2640,0x2641  0x16D3
                    gump.AddButton(i, colPos + xAdj, rowPos + yAdj, buttonGraphic[0], buttonGraphic[1], buttonGraphic[2], '0x0000');
                    colPos += widthAdjust;
                    break;
                case 'toggle':
                    var gumpOption = asset[1];
                    var gumpTitle = asset[2];
	                var buttonOnGraphic = asset[3] != undefined ? Orion.Split(asset[3],'|') : ['0x25FB','0x25FC','0x25FC']; //0x16D3,0x16D5 0x2640,0x2641  0x16D3
	                var buttonOffGraphic = asset[4] != undefined ? Orion.Split(asset[4],'|') : ['0x25F8','0x25F9','0x25F9']; //0x16D3,0x16D5 0x2640,0x2641  0x16D3
                    var xAdj = asset[5] || 0;
                    var yAdj = asset[6] || 0;
                    var stateGraphic //graphic,selected,pressed
                    Orion.ScriptRunning(gumpOption) ? stateGraphic = buttonOnGraphic : stateGraphic = buttonOffGraphic;
                    gump.AddText(colPos + buttonTextHorAdj, rowPos + buttonTextVerAdj, textColor, gumpTitle);
                    gump.AddButton(i, colPos + xAdj, rowPos + yAdj, stateGraphic[0], stateGraphic[1], stateGraphic[2], '0x0000');
                    colPos += (gumpTitle.length * characterAdj) + buttonTextHorAdj + 20;
                    break;
                case 'comboBox': //['comboBox', 'Single Target', 'Primary', 'Secondary']
                    var gumpOption = asset[1];
                    var dropLength = Math.ceil((asset.length - 2));
                    var value = Shared.GetVar(gumpOption,undefined);
                    gump.AddComboBox(i + 300, colPos, rowPos, '0x0BB8', 0, '0x0BB8', 125, -3,dropLength);
                    for(var j=2;j<asset.length;j++)
                        {
                        gump.AddComboBoxText(asset[j],0,value == asset[j] ? 1 : 0,115,'center');
                        }
                    gump.AddText(colPos,rowPos - 18,554,gumpOption);
                    gump.AddColoredPolygone(colPos, rowPos, 124, 19, '#FF666600', 1, 2, 0, 0, 0);
                    gump.AddButton(i, colPos - 9, rowPos + 1, '0x16CD', '0x16CE', '0x16CE', '0x0000');
                    colPos += 140;
                    break;
                case 'textInput':
                    var gumpOption = asset[1];
                    gump.AddResizepic(colPos, rowPos , '0x0BB8', 100, 19);
                    gump.AddTextEntry(i + 200, colPos + 5, rowPos - 1, 1159, Shared.GetVar(gumpOption,''), 100, 20);
                    gump.AddText(colPos,rowPos - 18,554,gumpOption);
                    gump.AddColoredPolygone(colPos, rowPos, 99, 19, '#FF666600', 1, 2, 0, 0, 0);
                    gump.AddButton(i, colPos + 87, rowPos + 1, '0x16CF', '0x16D0', '0x16D0', '0x0000');
                    gump.AddTooltip('Update');
                    colPos += 135;
                    break;
                case 'text':
                    var string = asset[1];
                    var color = asset[2];
                    var xAdj = asset[3];
                    var yAdj = asset[4];
                    gump.AddText(colPos + xAdj, rowPos + yAdj,color,string);
                    colPos += (string.length * characterAdj) + xAdj;
                    break;
                case 'horizontalLine':
                    var width = asset[1];
                    var xAdj = asset[2];
                    var yAdj = asset[3];
                    var color = asset[4];
                    var lineWidth = asset[5];
                    gump.AddLine(colPos + xAdj,rowPos + yAdj, colPos + xAdj + width,rowPos + yAdj, color, lineWidth);
                    colPos += width + 10;
                    break;
                case 'verticalLine':
                    var height = asset[1];
                    var xAdj = asset[2];
                    var yAdj = asset[3];
                    var color = asset[4];
                    var lineWidth = asset[5];
                    gump.AddLine(colPos + xAdj,rowPos + yAdj, colPos + xAdj,rowPos + yAdj + height, color, lineWidth);
                    colPos += 10;
                    break;
                case 'xSpacer':
                    var xAdjust = asset[1];
                    colPos += xAdjust;
                    break;
                case 'ySpacer':
                    var yAdjust = asset[1];
                    rowPos += yAdjust;
                    break;
                case 'tooltip':
                    var text = asset[1];
                    gump.AddTooltip(text);
                    break;
                default:
                    break;
                }
			i += 1;
            }
        colPos = columnStart;
        rowPos += rowAdj;
        }
    //Custom Assets
    
    gump.Update();
    Orion.Print('interval: ' + (Orion.Now() - startTime))
	}

function AliGumpCallback(_) 
	{
    var code = CustomGumpResponse.ReturnCode();
    Orion.Print('Code: ' + code)
    if(code == 0)
        return;
    else if(code == 100)
        {
        //Orion.Print(true);
        }
    else if(code == 101)
        {
        Orion.Terminate('all','AliGumpCallback');
        Orion.Wait(50);
        return AliGumpRenderer();
        }
    var i = 1;
    var gumpButtons = gumpAssets;//Shared.GetArray('gumpValues');
	for(var r = 0;r<gumpButtons.length;r++)
        {
        var row = gumpButtons[r];
        for(var c = 0;c<row.length;c++)
            {
            var asset = row[c];
            if(code == i)
                {
                var assetType = asset[0];
                switch(assetType)
                    {
                    case 'toggle':
                        var gumpOption = asset[1]; //Function name to toggle
                        Orion.ToggleScript(gumpOption);
                        break;
                    case 'button':
                        var gumpOption = asset[1]; //Function name to exec
                        Orion.Exec(gumpOption,true);
                        break;
                    case 'textInput':
                        var text = CustomGumpResponse.Text(code + 200);
                        var gumpOption = asset[1]; //Shared Variable Name
                        Shared.AddVar(gumpOption,text);
                        Orion.Print(text);
                        break;
                    case 'comboBox':
                        var gumpOption = asset[1];
                        var value = CustomGumpResponse.ComboBox(i+300)
                        if(value > -1)
                            var parsedValue = asset[2 + value];
                        else
                            var parsedValue = undefined;
                        Shared.AddVar(gumpOption,parsedValue);
                        Orion.Print(gumpOption + ' value: ' + parsedValue)
                        break;
                    default:
                        break;
                    }
                }
            i++
            }
        }
    //Orion.Print(gumpButtons);
    //Shared.AddArray('gumpValues',gumpButtons);
    Orion.Wait(50);
    AliGumpRenderer();
	}
	
function Example1Function()
    {
    while(true) Orion.Wait(1000);
    }
function Example2Function()
    {
    while(true) Orion.Wait(1000);
    }
function Example3Function()
    {
    while(true) Orion.Wait(1000);
    }
function Example4Function()
    {
    while(true) Orion.Wait(1000);
    }

function ignoremob()
    {
    Orion.WaitForAddObject('myTarget');
    var objGraphic = Orion.FindObject('myTarget').Graphic();
    var ignoreMobs = Shared.GetVar('Ignore Mobs', undefined);
    if(ignoreMobs)
        ignoreMobs += '|' + objGraphic;
    else
        ignoreMobs = objGraphic;
    Shared.AddVar('Ignore Mobs', ignoreMobs);
    AliGumpRenderer();
    }

function ClearAll()
    {
    Shared.ClearArrays();
    Shared.ClearVars();
    Orion.Terminate('all','Example5Function|AliGumpCallback')
    }

    
function MinimizeButton()
    {
    var gump = Orion.CreateCustomGump(11);
    gump.Clear();

    //gump.AddResizepic(0, 0, '5',80, 80); //background 0xDAC 0x254e 0x2560 9bf5 
    //gump.AddButton(0, 30, 30, 0x589, 0x6b1, 0x6b1, '0x0487');
    gump.AddButton(0, 0, 0, 0x7d6, 0x7d6, 0x7d6, '0x0487');
    gump.Update();
    }
function forceInitButtons(_)
    {
    Shared.AddArray('gumpValues',gumpAssets);
    }

function initVars()
    {
    for(var r = 0;r<gumpAssets.length;r++)
        {
        var row = gumpAssets[r];
        for(var c = 0;c<row.length;c++)
            {
            var asset = row[c];
            var assetType = asset[0];
            switch(assetType)
                {
                case 'textInput':
                    var sharedName = asset[1];
                    Shared.AddVar(sharedName) 
                    break;
                default:
                    break;
                }
            }
        }
    }

var serialIndex = 1;
var ModularGumpButtons = //[ xsize, ysize, CallBackID, 'Text', 'FunctionName', [arguments] ]
    [
        [ [100, 30, serialIndex++, "BSBodBriber", 'BodBriber', ['Blacksmithy']] ],
        [],
        [ [100, 30, serialIndex++, "ImbueGump", "ImbueGump"] ],
    ]

function SimpleModularGump()
    {
    var gump = Orion.CreateCustomGump(12002);
    gump.Clear();
    gump.SetCallback('GumpCallback');
    var widest = Math.max.apply(Math, ModularGumpButtons.map(function (rows)
        {
        return rows.length
        }));
    gump.AddHtmlGump(1, 0, 0, widest * 105 + 1, ModularGumpButtons.length * 30 + 1, '0x0BB8', 1, 0);
    gump.Select('htmlgump', 1);
    var row = 0;
    var column = 0;
    ModularGumpButtons.forEach(function(rowLayer)
        {
        rowLayer.forEach(function(button)
            {
            gump.AddResizepic(x * 105 + 4, y * 29 + 2, '0x24EA', button[0], button[1], button[2], 1);
            gump.AddText(x * 105 + 10, y * 29 + 6, '0', button[3]);
            column++;
            });
        column = 0;
        row++;
        });
    gump.Select('gump');
    gump.Update();
    }

function ModularGumpCallback(_) 
    {
    var code = CustomGumpResponse.ReturnCode();
    if(code == 0) 
        {
        var gump = Orion.CreateCustomGump(15);
        gump.Close();
        }
    ModularGumpButtons.forEach(function(rowLayer)
        {
        rowLayer.forEach(function(button)
            {
            if(button[2] == code)
                {
                Orion.Print('Toggle ' + button[3]);
                Orion.ToggleScript(button[4], false, button[5]);
                return;
                }
            })
        });
    }

function BuffMonitor()
	{
	var color = { //[textColorHue,barColorRRGGBBAA]
		'red': [32,'0xFF0000FF'],
		'tangle': [1159,'0xF0FF0BFF']
	}
	var goodActive = color.tangle;
	var badActive = color.red;

	var buffs = [ //buffID,buffCooldown,timerPosition,timerName,xOffset,yOffset,textColor,font,backgroundColor,cooldownColorObj,dispelWarning,persistentBuff
		['Evasion', 20000, 'underChar','Evasion', 0, 40,goodActive[0], -1, goodActive[1], badActive],
		['Blood Oath', 0, 'aboveChar','BLOODOATH', 100, -40,badActive[0], -1, badActive[1]],
		['Vampiric Embrace', 60000, 'aboveChar','VE Missing!', -100, 40,badActive[0], -1, '0x00000000', false, true],
		['Hiding', 60000, 'underChar','Hidden', 100, 40,goodActive[0], -1, '0x00000000',false,false,true],
	]

	while(true)
		{
		//var startTime = Orion.Now();
		Orion.Wait(100);
		for(var i=0;i<buffs.length;i++)
			{
			var buff = buffs[i];
			if(Orion.BuffExists(buff[0]))
				{
				if(buff[10])
					Orion.RemoveDisplayTimer(buff[0]);
				else if(!Orion.DisplayTimerExists(buff[0]))
					{
					Orion.AddDisplayTimer(buff[0], buff[1] + Orion.BuffTimeRemaining(buff[0]), buff[2], 'bar', buff[3], buff[4], buff[5], buff[6], buff[7], buff[8]);
					if(buff[9])
						buff[9][2] = false;
					else if(buff[11])
						Orion.DisplayTimerSetShowTime(buff[0], false);
					}
				}
			else if(Orion.DisplayTimerExists(buff[0]))
				{
				if(buff[9])
					{
					Orion.DisplayTimerSetColorStage(buff[0], 100, buff[9][0], buff[9][1]);
					buff[9][2] = true;
					}
				else if(buff[11])
					{
					Orion.RemoveDisplayTimer(buff[0]);
					}
				}
			else if(buff[10])
				{
				Orion.AddDisplayTimer(buff[0], buff[1], buff[2], 'bar', buff[3], buff[4], buff[5], buff[6], buff[7], buff[8]);
				Orion.Wait(10)
				Orion.DisplayTimerSetShowTime(buff[0], false);
				}
			}
		//Orion.Print('Interval: ' + (Orion.Now() - startTime))
		}
	}