function JewelryBoxCatalogue()
    {
    Orion.CharPrint(self,1159,'Target Jewelry Box to Catalogue')
    Orion.WaitForAddObject('myTarget');
    var boxSerial = Orion.GetSerial('myTarget');
    Orion.CharPrint(self,1159,'Target Jewelry Box to Transfer to')
    Orion.WaitForAddObject('myTarget');
    var xferSerial = Orion.GetSerial('myTarget');
    while(true)
        {
        var endTime = Orion.Now() + 10000;
        var gump = Orion.GetGump(boxSerial, '0x000F3EE7');
        while(!gump)
            {
            if(Orion.Now() > endTime)
                return Orion.CharPrint(self,1159,'Gump Timed Out! Halting...');
            Orion.UseObject(boxSerial);
            Orion.Wait(1300);
            gump = Orion.GetGump(boxSerial, '0x000F3EE7');
            }
        var commandList = gump.CommandList();
        var serialButtons = commandList.filter(function(command)
            {
            return Orion.Contains(command,'button') && Orion.Contains(command,' 2351 2351 ');
            });
        if(!serialButtons[0])
            break;
        var itemArr = serialButtons.map(function(command)
            {
            var match = command.match(/button (\d+) (\d+) 2351 2351 1 0 (\d+)/) || [];
            if(match[0])
                return [match[3],(+match[1] / 50),((match[2] - 40) / 50)]
            else return 'Missing'
            })
        for(var i=0;i<itemArr.length;i++)
            {
            var arr = itemArr[i];
            JewelryBoxGumpButton(arr[0])
            var item = Orion.FindObject(arr[0]);
            if(!item)
                {
                i--;
                continue;
                }
            var itemProps = item.Properties();
            arr.push(itemProps);
            }
        var gump = Orion.GetGump(xferSerial, '0x000F3EE7');
        while(!gump)
            {
            if(Orion.Now() > endTime)
                return Orion.CharPrint(self,1159,'Gump Timed Out! Halting...');
            Orion.UseObject(xferSerial);
            Orion.Wait(1300);
            gump = Orion.GetGump(xferSerial, '0x000F3EE7');
            }
        JewelryBoxGumpButton(3)
        itemArr.forEach(function(a)
            {
            if(Orion.WaitForTarget(3000))
                Orion.TargetObject(a[0])
            })
        if(Orion.HaveTarget())
            Orion.CancelTarget();
        TextWindow.Open();
        itemArr.forEach(function(a)
            {
            TextWindow.Print(a[3] + '\n');
            });
        Orion.Wait(1000);
        }
    }

    //button 50 290 2351 2351 1 0 1157168028 

function JewelryBoxGumpButton(code)
    {
    if(Orion.WaitForGump(2000))
        {
        var gump = Orion.GetGump('any','0x000F3EE7');
        if(gump)
            {
            gump.Select(Orion.CreateGumpHook(code));
            Orion.Wait(200);
            }
        }
    }

function ORContainsCheck(itemArr,checks)
    {
    //var checks = ['text','text']
    var items = itemArr.filter(function(item)
        {   
        var check = false;
        var itemProps = itemArr[0];
        for(var i=0;i<checks.length;i++)
            {
            check = Orion.Contains(itemProps,checks[i])
            if(check)
                break;
            }
        return check;
        });
    }

function ANDContainsCheck(itemArr,checks)
    {
    //var checks = ['text','text']
    var items = itemArr.filter(function(item)
        {   
        var check = true;
        var itemProps = itemArr[0];
        for(var i=0;i<checks.length;i++)
            {
            check = Orion.Contains(itemProps,checks[i])
            if(!check)
                break;
            }
        return check;
        });
    }