var serialIndex = 1;
var ModularGumpButtons = //[ xsize, ysize, CallBackID, 'displayText', 'functionName', optional: [arguments] ]
    [
        [ [100, 30, serialIndex++, "displayText", 'functionName', ['argument1','argument2']] ],
        [], //blank row
        [ [100, 30, serialIndex++, "displayText2", "functionName2"] ],
    ]

function ModularGump()
    {
    var gump = Orion.CreateCustomGump(12002);
    gump.Clear();
    gump.SetCallback('ModularGumpCallback');
    var widest = Math.max.apply(Math, ModularGumpButtons.map(function (rows)
        {
        return rows.length
        }));
    gump.AddHtmlGump(1, 0, 0, widest * 105 + 4, ModularGumpButtons.length * 30 + 1, '0x0BB8', 1, 0);
    gump.Select('htmlgump', 1);
    var row = 0;
    var column = 0;
    ModularGumpButtons.forEach(function(rowLayer)
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

function ModularGumpCallback(_) 
    {
    var code = CustomGumpResponse.ReturnCode();
    if(code == 0) 
        {
        var gump = Orion.CreateCustomGump(12002);
        gump.Close();
        }
    ModularGumpButtons.forEach(function(rowLayer)
        {
        rowLayer.forEach(function(button)
            {
            if(button[2] == code)
                {
                Orion.Print('Code: ' + button[3]);
                Orion.ToggleScript(button[4], false, button[5]);
                return;
                }
            })
        });
    }

function functionName()
    {
    Orion.Print('functionName')
    }

function functionName2()
    {
    Orion.Print('functionName2')
    }