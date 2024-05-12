var fileName = 'AsukaRaresFestItemsLog'

function AliRaresFestItemLogger()
    {
    var tmpFilePath = Orion.CurrentScriptDirPath() + '\\' + fileName + '.txt';

    var vendorItems = HandleVendors().trim()
    var safeItems = HandleSafes().trim()
    var storedString = Shared.GetVar('storedString','')
    var outStr = ''
    if(vendorItems)
        outStr += vendorItems + '\n'
    if(safeItems)
        outStr += safeItems + '\n'
    storedString += outStr
    Shared.AddVar('storedString',storedString)
    var tmpFile = Orion.NewFile();
    tmpFile.Remove(tmpFilePath);
    tmpFile.Open(tmpFilePath);
    Orion.Print("Recording To File: " + tmpFilePath); 
    tmpFile.Write(storedString);
    tmpFile.Close();
    }

function LocateVendorBySerial()
    {
    var vendorSerial = 0x017DF00A
    Orion.AddHighlightCharacter(vendorSerial, '1152');
    Orion.CharPrint(vendorSerial,1159,'HERE')
    Orion.CharPrint(vendorSerial,1159,'HERE')
    Orion.CharPrint(vendorSerial,1159,'HERE')
    }

function LocateSafeBySerial()
    {
    var safeSerial = 0x017DF00A
    Orion.TestItemColor(safeSerial, '1152');
    Orion.CharPrint(safeSerial,1159,'HERE')
    Orion.CharPrint(safeSerial,1159,'HERE')
    Orion.CharPrint(safeSerial,1159,'HERE')
    }

function ClearHashTable()
    {
    Shared.AddArray('hashTable',[])
    }

function ClearStoredString()
    {
    Shared.AddVar('storedString','')
    }

function HandleVendors()
    {
    var outStr = ''
    var vendors = Orion.FindTypeEx(any,any,ground,'live',24,'yellow').filter(function(npc)
        {
        return Orion.Contains(npc.Properties(),'Shop Name:');
        });
    for(var i=0;i<vendors.length;i++)
        {
        var vendor = vendors[i];
        var vendorSerial = vendor.Serial();
        var vendorBackpackObj = Orion.ObjAtLayer('Backpack',vendorSerial);
        if(vendorBackpackObj)
            {
            var vendorBackpack = vendorBackpackObj.Serial()
            VerifyOpenVendor(vendorSerial,vendorBackpack)
            GetAllSubContainers(vendorBackpack,true)
            var vendorStr = CatalogueItems(vendorBackpack,vendorSerial)
            if(vendorStr)
                outStr += '\n' + vendorStr
            }
        }
    return outStr
    }

function HandleSafes()
    {
    var hash = Shared.GetArray('hashTable',[])
    var outStr = ''
    var hues = {
        "1159":true,
        "1170":true,
        "1914":true,
    }
    var safes = FloorRowColumnScanEnumerateSafes(); //returns a sorted array of all safe info arrays
    for(var i=0;i<safes.length;i++)
        {
        var safe = Orion.FindObject(safes[i][0]);
        var safeSerial = safe.Serial()
        Orion.SetSearchArea(safe.X(),safe.Y(),safe.Z() + 1,safe.X(),safe.Y(),safe.Z() + 11);
        var item = Orion.FindTypeEx(any,any,ground,'item',20).filter(function(item)
            {
            return !Orion.Contains(item.Graphic(),'0x0FF1|0x9C18|0x9C19');
            })[0];
        Orion.ResetSearchArea();
        if(item)
            {
            var itemSerial = item.Serial()
            if(hash.indexOf(itemSerial) > -1)
                continue
            hash.push(itemSerial)
            if(!TextWindow.IsOpened())
                TextWindow.Open()
            var hexHue = item.Color()
            var hue = parseInt(hexHue)
            var hueCheck = hues[hue]
            var lenCheck = 4 - String(hue).length
            if(lenCheck > 0)
                {
                hue = String(hue)
                for(var i=0;i<lenCheck;i++)
                    {
                    hue = '0' + hue
                    }
                }
            var lineStr = item.Name() + ':::ON SAFE, X:' + safe.X() + ', Y:' + safe.Y() + ', Hue:' + hue + ', Safe Serial:' + safeSerial + ', Item:' + itemSerial
            if(!lineStr)
                Orion.CharPrint(self,1159,"!" + item.Properties())
            outStr += lineStr + '\n'
            if(hueCheck)
                {
                TextWindow.Print('\t\t\t\t' + item.Name() + ':::ON SAFE X:' + safe.X() + ', Y:' + safe.Y() +'\t\t\t\t\t\t\t\t\t\t\t\t$$###########Hue:' + hue +'###################Safe Serial:' + safeSerial +'###################Item:' + itemSerial +'###########$$')
                Orion.AddHighlightCharacter(safeSerial, '1152');
                }
            else
                {
                TextWindow.Print(lineStr)
                }
            }
        }
    Shared.AddArray('hashTable',hash)
    return outStr
    }


function CatalogueItems(vendorBackpack,vendorSerial)
    {
    var hash = Shared.GetArray('hashTable',[])
    var outStr = ''
    var hues = {
        "1159":true,
        "1170":true,
        "1914":true,
    }
    var vendor = Orion.FindObject(vendorSerial)
    var items = Orion.FindTypeEx(any,any,vendorBackpack, '', 'finddistance', '', true);
    for(var i=0;i<items.length;i++)
        {
        var item = items[i]
        var itemSerial = item.Serial()
        if(hash.indexOf(itemSerial) > -1)
            continue
        hash.push(itemSerial)
        if(!TextWindow.IsOpened())
            TextWindow.Open()
        var hexHue = item.Color()
        var hue = parseInt(hexHue)
        var hueCheck = hues[hue]
        var lenCheck = 4 - String(hue).length
        if(lenCheck > 0)
            {
            hue = String(hue)
            for(var i=0;i<lenCheck;i++)
                {
                hue = '0' + hue
                }
            }
        var lineStr = item.Name() + ':::Vendor Name: ' + vendor.Name() + ', X:' + vendor.X() + ', Y:' + vendor.Y() + ', Hue:' + hue + ', Vendor Serial:' + vendorSerial + ', Item:' + itemSerial
        outStr += lineStr + '\n'
        if(hueCheck)
            {
            TextWindow.Print('\t\t\t\t' + item.Name() + ':::Vendor Name:' + vendor.Name() + ' X:' + vendor.X() + ' Y:' + vendor.Y() +'\t\t\t\t\t\t\t\t\t\t\t\t$$###########Hue:' + hue +'###################Vendor Serial:' + vendorSerial +'###################Item:' + itemSerial +'###########$$')
            Orion.AddHighlightCharacter(vendorSerial, '1152');
            }
        else
            {
            TextWindow.Print(lineStr)
            }
        }
    Shared.AddArray('hashTable',hash)
    return outStr
    }


function VerifyOpenVendor(vendorSerial,vendorPack,delay)
    {
    var startTime = Orion.Now();
    var endTime = startTime + (delay || 5000);
    while(!Orion.GumpExists('container',vendorPack))
        {
        if(Orion.Now() > endTime)
            return false;
        Orion.UseObject(vendorSerial);
        Orion.Wait(1000);
        }
    return true;
    }

var subContainersArr = [];
function GetAllSubContainers(containerSerial,ignoreEmpties)
    {
    if(!VerifyOpenContainer(containerSerial))
        return;
    subContainersArr.push(containerSerial);
    var subContainers = Orion.FindTypeEx(any,any,containerSerial).filter(function(item)
        {
        var itemProps = item.Properties();
        var containerCheck = Orion.Contains(itemProps,'Contents: ');
        var emptyCheck = Orion.Contains(itemProps,'Contents: 0/');
        if(ignoreEmpties)
            return containerCheck && !emptyCheck;
        return containerCheck;
        });
    for(var i=0;i<subContainers.length;i++)
        {
        var subContainer = subContainers[i];
        GetAllSubContainers(subContainer.Serial(),ignoreEmpties);
        }
    Orion.CloseGump('container',containerSerial);
    return subContainersArr;
    }

function VerifyOpenContainer(containerSerial,delay)
    {
    var startTime = Orion.Now();
    var endTime = startTime + (delay || 5000);
    while(!Orion.GumpExists('container',containerSerial))
        {
        if(Orion.Now() > endTime)
            return false;
        Orion.UseObject(containerSerial);
        Orion.Wait(1000);
        }
    return true;
    }

function FloorRowColumnScanEnumerateSafes()
    {
    var safes = Orion.FindTypeEx('0x9C18|0x9C19',any,ground,'item',24).map(function(safe)
        {
        return [safe.Serial(), safe.X(), safe.Y(), safe.Z()];
        }).sort(function(a,b)
            {
            if(a[3] != b[3])
                return b[3] - a[3];
            else if(a[2] != b[2])
                return a[2] - b[2];
            else
                return a[1] - b[1];
            })
    safes.forEach(function(safe,ind)
        {
        if(Player.Z() == safe[3])
            Orion.CharPrint(safe[0], 1159, ind + 1)
        });
    return safes;
    }

function ReformatAsukaLog()
    {
    var tmpFilePath = Orion.CurrentScriptDirPath() + '\\' + fileName + '.txt';
    var tmpFile = Orion.NewFile();
    if(!tmpFile.Open(tmpFilePath))
        return Orion.CharPrint(self,1159,'Something went wrong trying to read or create file: ' + fileName);
    var fileRead = tmpFile.ReadAll();
    if(!fileRead)
        return Orion.CharPrint(self,1159,'Something went wrong trying to read file or it was empty: ' + fileName);

    var stringArray = fileRead.split('\n')
    var reformattedStrings = alignText(stringArray)
    var outStr = reformattedStrings.join('\n')
    var newFilePath = Orion.CurrentScriptDirPath() + '\\' + fileName + 'FORMATTED' + '.txt';
    var newFile = Orion.NewFile();
    newFile.Remove(newFilePath);
    newFile.Open(newFilePath);
    Orion.Print("Recording To File: " + newFilePath); 
    newFile.Write(outStr);
    newFile.Close();
    }

function alignText(strings) {

    var maxLength = 0;
    var firstWords = strings.map(function(s) {
        var firstSpaceIndex = s.indexOf(':::');
        return firstSpaceIndex === -1 ? s : s.substring(0, firstSpaceIndex);
    });

    // Find the longest first word
    firstWords.forEach(function(word) {
        maxLength = Math.max(maxLength, word.length);
    });

    // Align texts with tabs
    return strings.map(function(s) {
        var firstSpaceIndex = s.indexOf(':::');
        var firstWord = firstSpaceIndex === -1 ? s : s.substring(0, firstSpaceIndex);
        var restOfText = firstSpaceIndex === -1 ? '' : s.substring(firstSpaceIndex + 3);

        // Calculate the number of tabs needed after the first word
        var tabsNeeded = Math.ceil((maxLength - firstWord.length) / 8); // Assuming a tab stop is every 8 characters
        var tabs = new Array(tabsNeeded + 1).join('\t'); // +1 because Array(n).join() creates a string with n-1 joins

        return firstWord + tabs + restOfText;
    });
}

function SilentAuctionAlert()
	{
	var bulletinBoard = 0x4353EE65
	var monitorNum = 0
	var catchNum
	while(true)
		{
		Orion.UseObject(bulletinBoard)
		if(Orion.WaitForGump(3000))
			{
			Orion.Wait(1000)
			var gump = Orion.GetGump(bulletinBoard,0x00002330)
			if(gump)
				{
				var entries = Number(gump.Text(8))
				if(!catchNum)
					{
					monitorNum = entries
					catchNum = true
					}
				else if(entries != monitorNum)
					{
					 DiscordPush(Player.Name() + ' tripped')
					 }
				Orion.CharPrint(self,1159,entries)
				Orion.Wait(1000)
				Orion.CloseGump('generic',bulletinBoard,0x00002330)
				}
			}
		Orion.Wait(5000)
		}
	}

function DiscordPush(message)
	{
	var bot = SetDiscordRegistryEntry();
	Orion.HttpPost(bot, "content=" + message);
	}

function SetDiscordRegistryEntry()
    {
    var discordConfig = "https://discordapp.com/api/webhooks/" + "887268637315047444" + '/' + "SJfWniY7dpD9URmrvXSPb3EFs7DzrZiVH5_Wd4f16Tg695utEVXeLc7quvb8Gwjmg_0Z";

    return discordConfig;
    }