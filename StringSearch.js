function StringSearch() 
	{
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/AliStringSavedSearches.json';
    var tmpFile = Orion.NewFile();
    tmpFile.Open(tmpFilePath);
    var savedSearches = [];
    var fileString = tmpFile.ReadAll();
    if(fileString)
        savedSearches = JSON.parse(fileString);

    var title = "Ali String Search";
    var gump = Orion.CreateCustomGump(10423);
    gump.Clear();
    gump.SetCallback('StringSearchCallback');

    var height = 455;
    var width = 288;
    gump.AddResizepic(0, 0, 'a3c', width, height); //background 0xDAC 0x254e 0x2560 9bf5 
    gump.AddColoredPolygone(10, 12, width - 20, 15, '#FF660066', 0, 1, 0, 0, 0); //title background
    gump.AddColoredPolygone(10, 12, width - 20, 15, '#FF666600', 1, 2, 0, 0, 0); //title border
    gump.AddColoredPolygone(10, 12, width - 20, height - 24, '#FF666600', 1, 2, 0, 0, 0); //gump border
    gump.AddHtmlGump(0,0,9,width,height,'a3c',0,0) //these next 3 lines are a workaround for positioning html text
    gump.Select('htmlgump');
    gump.AddHtmlText('doesnt matter what', 'i put here', width, height, 554, "<center>" + title + "</center>"); //x,y arguments are bugged and don't do anything
    gump.Select('gump');

    var rowStart = 40;
	var columnStart = 25;
    var heightAdjust = 25;

    var xPos = columnStart;
    var yPos = rowStart;
    
    var value;
    var shared;

    var comboOptions = ['Include','Exclude'];
    for(var i=1;i<11;i++)
        {
        var responseCode = i;
        shared = 'String ' + responseCode;
        value = Shared.GetVar(shared,'Include');
        gump.AddComboBox(responseCode, xPos, yPos, '0x0BB8', 0, '0x0BB8', 70, -3,2);
        for(var j=0;j<comboOptions.length;j++)
            gump.AddComboBoxText(comboOptions[j],0,value == comboOptions[j] ? 1 : 0,115,'left');
        gump.AddResizepic(xPos + 70, yPos , '0x0BB8', 170, 19);
        gump.AddTextEntry(responseCode + 500, xPos + 70 + 3, yPos, 0, Shared.GetVar(shared + ' Value',''), 170, 20);
        gump.AddTooltip('String to Search');
        yPos += heightAdjust;
        }

    yPos += heightAdjust;

    gump.AddText(33,yPos - 20,554,'Saved Searches');
    shared = Shared.GetVar('Save Name',undefined);
    gump.AddComboBox(20000, xPos + 3, yPos, '0x0BB8', 0, '0x0BB8', 160, -3,savedSearches.length);
    for(var j=0;j<savedSearches.length;j++)
        gump.AddComboBoxText(savedSearches[j][0],0,shared == savedSearches[j][0] ? 1 : 0,160,'left');
    gump.AddButton(999, xPos + 173, yPos - 1, '40028', '40028', '40018', '0x0000');
    gump.AddTooltip('Load Saved Criteria');
    gump.AddText(217,yPos - 1,554,'Load');
    gump.AddTooltip('Load Saved Criteria');

    yPos += heightAdjust;
    gump.AddResizepic(xPos + 3, yPos , '0x0BB8', 160, 19);
    gump.AddTextEntry(20001, xPos + 6, yPos, 0, '', 160, 20);
    gump.AddTooltip('Enter Saved Search Name');
    gump.AddButton(998, xPos + 173, yPos - 1, '40028', '40028', '40018', '0x0000');
    gump.AddTooltip('Save Current Criteria');
    gump.AddText(216,yPos - 1,554,'Save');
    gump.AddTooltip('Save Current Criteria. Enter name to the left');

    yPos += heightAdjust;
    gump.AddButton(1000, xPos + 173, yPos + 20, '40028', '40028', '40018', '0x0000');
    gump.AddTooltip('Highlight items that meet the criteria above');
    gump.AddText(xPos + 173 + 13,yPos + 20,554,'Search');
    gump.AddTooltip('Highlight items that meet the criteria above');
    gump.AddButton(1001, xPos + 88, yPos + 20, '40028', '40028', '40018', '0x0000');
    gump.AddTooltip('Clear the search menu');
    gump.AddText(xPos + 88 + 18,yPos + 20,554,'Clear');
    gump.AddTooltip('Clear the search menu');
    gump.AddButton(997, xPos + 3, yPos + 20, '40028', '40028', '40018', '0x0000');
    gump.AddTooltip('Delete currently selected saved search');
    gump.AddText(xPos + 16,yPos + 20,554,'Delete');
    gump.AddTooltip('Delete currently selected saved search');
    gump.AddButton(996, xPos + 173, yPos + 45, '40028', '40028', '40018', '0x0000');
    gump.AddTooltip('Move items that meet the criteria above');
    gump.AddText(xPos + 173 + 15,yPos + 45,554,'Move');
    gump.AddTooltip('Move items that meet the criteria above');

    gump.Update();

	}

function StringSearchCallback(_) 
	{
    var tmpFilePath = Orion.CurrentScriptDirPath() + '/AliStringSavedSearches.json';
    var code = CustomGumpResponse.ReturnCode();
    var comboOptions = ['Include','Exclude'];
    if(code == 0)
        return;
    else if(code == 1000) //Search Items
        {
        var searchStringsList = [];
        var excludeIncludesList = [];
        for(var i=1;i<11;i++)
            {
            var responseCode = i;
            var combo = CustomGumpResponse.ComboBox(responseCode);
            var textEntry = CustomGumpResponse.Text(responseCode+500) || '';
            if(combo > -1)
                {
                Shared.AddVar('String ' + responseCode,comboOptions[combo]);
                Shared.AddVar('String ' + responseCode + ' Value',textEntry);
                searchStringsList.push(textEntry);
                excludeIncludesList.push(combo);
                }
            }
        SearchByStrings(searchStringsList,excludeIncludesList)
        }
    else if(code == 996) //Move Items
        {
        var searchStringsList = [];
        var excludeIncludesList = [];
        for(var i=1;i<11;i++)
            {
            var responseCode = i;
            var combo = CustomGumpResponse.ComboBox(responseCode);
            var textEntry = CustomGumpResponse.Text(responseCode+500) || '';
            if(combo > -1)
                {
                Shared.AddVar('String ' + responseCode,comboOptions[combo]);
                Shared.AddVar('String ' + responseCode + ' Value',textEntry);
                searchStringsList.push(textEntry);
                excludeIncludesList.push(combo);
                }
            }
        var items = SearchByStrings(searchStringsList,excludeIncludesList)
        MoveItems(items)
        }
    else if(code == 1001) //Clear entries
        {
        Shared.ClearVars();
        ResetItemColors();
        }
    else if(code == 999) //Recall saved search
        {
        var tmpFile = Orion.NewFile();
        tmpFile.Open(tmpFilePath);
        var savedSearches = [];
        var fileString = tmpFile.ReadAll(); 
        if(fileString)
            savedSearches = JSON.parse(fileString);
        

        var combo = CustomGumpResponse.ComboBox(20000);
        var savedSearch = savedSearches[combo];
        if(!savedSearch)
            return Orion.CharPrint(self,1159,'Couldn\'t find saved search')
        Shared.ClearVars();
        var searchStrings = savedSearch[1];
        var excludeIncludes = savedSearch[2];

        for(var i=0,j=1;i<10;i++,j++)
            {
            Shared.AddVar('String ' + j,comboOptions[excludeIncludes[i]]);
            Shared.AddVar('String ' + j + ' Value',searchStrings[i]);
            }
        }
    else if(code == 998) //Save Search
        {
        var tmpFile = Orion.NewFile();
        tmpFile.Open(tmpFilePath);
        var savedSearches = [];
        var fileString = tmpFile.ReadAll(); 
        if(fileString)
            savedSearches = JSON.parse(fileString);
        var searchStringsList = [];
        var excludeIncludesList = [];
        for(var i=1;i<11;i++)
            {
            var responseCode = i;
            var combo = CustomGumpResponse.ComboBox(responseCode);
            var textEntry = CustomGumpResponse.Text(responseCode+500) || '';
            if(combo > -1)
                {
                // if(skills[combo] == 'Clear')
                //     {
                //     Shared.RemoveVar('Skill ' + responseCode);
                //     Shared.RemoveVar('Skill ' + responseCode + ' Value');
                //     continue;
                //     }
                Shared.AddVar('String ' + responseCode,comboOptions[combo]);
                Shared.AddVar('String ' + responseCode + ' Value',textEntry);
                searchStringsList.push(textEntry);
                excludeIncludesList.push(combo);
                }
            }
        var saveName = CustomGumpResponse.Text(20001)
        if(!saveName)
            return Orion.CharPrint(self,1159,'You must choose a name for the save');
        var overwrite = false;
        for(var i=0;i<savedSearches.length;i++)
            {
            var savedSearch = savedSearches[i];
            if(saveName == savedSearch[0])
                {
                savedSearch[1] = searchStringsList;
                savedSearch[2] = excludeIncludesList;
                overwrite = true;
                break;
                }
            }
        if(!overwrite)
            {
            savedSearches.push(
                [
                    saveName,
                    searchStringsList,
                    excludeIncludesList
                ])
            }
        tmpFile.Remove();
        tmpFile.Open(tmpFilePath);
        Orion.Print("Recording To File: " + tmpFilePath); 
        tmpFile.Write(JSON.stringify(savedSearches));
        tmpFile.Close();
        }
    else if(code == 997) //Delete Saved Search
        {
        var tmpFile = Orion.NewFile();
        tmpFile.Open(tmpFilePath);
        var savedSearches = [];
        var fileString = tmpFile.ReadAll(); 
        if(fileString)
            savedSearches = JSON.parse(fileString);
        tmpFile.Close()
        
        var combo = CustomGumpResponse.ComboBox(20000);
        var savedSearch = savedSearches[combo];
        if(!savedSearch)
            return Orion.CharPrint(self,1159,'Couldn\'t find saved search')

        var outArr = savedSearches.filter(function(item)
            {
            return item[0] !== savedSearch[0];
            })
        tmpFile.Remove();
        tmpFile.Open(tmpFilePath);
        Orion.Print("Recording To File: " + tmpFilePath); 
        tmpFile.Write(JSON.stringify(outArr));
        tmpFile.Close();
        }
    Orion.Wait(50);
    StringSearch();
	}

function SearchByStrings(searchStringsList,excludeIncludesList)
    {
    var searchStrings = [];
    var excludeString = '';
    var excludeTrim = false;
    for(var i=0;i<searchStringsList.length;i++)
        {
        var string = searchStringsList[i];
        if(string == '')
            continue;
        if(excludeIncludesList[i] == 1)
            {
            excludeString += string + '|';
            excludeTrim = true;
            }
        else
            {
            searchStrings.push(string);
            }
        }
    if(excludeTrim)
        excludeString = excludeString.slice(0,-1)
    var groundContainers = Orion.FindTypeEx(any,any,ground,'item', 4, '', true).filter(function(item)
        {
        return item.Properties().indexOf('Contents: ') > -1 && Orion.GumpExists('container', item.Serial());
        });
    var packContainers = Orion.FindTypeEx(any, any, self, 'item', 'finddistance', '', true).filter(function(item)
        {
        return item.Properties().indexOf('Contents: ') > -1 && Orion.GumpExists('container', item.Serial());
        });
    var npcContainers = Orion.FindTypeEx(any,any,ground,'mobile',4,'yellow').filter(function(npc)
        {
        return Orion.ObjAtLayer('backpack',npc.Serial())
        }).map(function(npc)
            {
            var npcPack = Orion.ObjAtLayer('backpack',npc.Serial());
            return npcPack;
            });
    var containers = groundContainers.concat(packContainers).concat(npcContainers);
    var items = [];
    for(var i=0;i<containers.length;i++)
        {
        var container = containers[i];
        Orion.FindTypeEx(any,any,container.Serial(),'item', 'finddistance', '', true).forEach(function(item)
            {
            var props = item.Properties();
            if(Orion.Contains(props,excludeString))
                Orion.TestItemColor(item.Serial(),item.Color());
            else
                {
                var pass = searchStrings.every(function(string)
                    {
                    return Orion.Contains(props,string)
                    });
                if(pass)
                    items.push(item.Serial());
                else
                    Orion.TestItemColor(item.Serial(),item.Color());
                }
            });
        }
    Orion.FindTypeEx(any,any,ground,'item', 22).forEach(function(item)
        {
        var props = item.Properties();
        if(Orion.Contains(props,excludeString))
            Orion.TestItemColor(item.Serial(),item.Color());
        else
            {
            var pass = searchStrings.every(function(string)
                {
                return Orion.Contains(props,string)
                });
            if(pass)
                items.push(item.Serial());
            else
                Orion.TestItemColor(item.Serial(),item.Color());
            }
        });
    Orion.Print('Items Found: ' + items.length);
    items.forEach(function(item)
        {
        Orion.TestItemColor(item, 1152);
        });
    return items;
    }

function ResetItemColors()
    {
    var groundContainers = Orion.FindTypeEx(any,any,ground,'item', 4, '', true).filter(function(item)
        {
        return item.Properties().indexOf('Contents: ') > -1 && Orion.GumpExists('container', item.Serial());
        });
    var packContainers = Orion.FindTypeEx(any, any, self, 'item', 'finddistance', '', true).filter(function(item)
        {
        return item.Properties().indexOf('Contents: ') > -1 && Orion.GumpExists('container', item.Serial());
        });
    var npcContainers = Orion.FindTypeEx(any,any,ground,'mobile',4,'yellow').filter(function(npc)
        {
        return Orion.ObjAtLayer('backpack',npc.Serial())
        }).map(function(npc)
            {
            var npcPack = Orion.ObjAtLayer('backpack',npc.Serial());
            return npcPack;
            });
    var containers = groundContainers.concat(packContainers).concat(npcContainers);
    var items = [];
    for(var i=0;i<containers.length;i++)
        {
        var container = containers[i];
        Orion.FindTypeEx(any,any,container.Serial(),'item', 'finddistance', '', true).forEach(function(item)
            {
            Orion.TestItemColor(item.Serial(),item.Color());
            });
        }
    Orion.FindTypeEx(any,any,ground,'item', 22).forEach(function(item)
        {
        Orion.TestItemColor(item.Serial(),item.Color());
        });
    }

function MoveItems(items)
    {
    Orion.CharPrint(self,1159,'Target FROM container')
    Orion.WaitForAddObject('myTarget');
    var fromContainer = Orion.GetSerial('myTarget');
    VerifyOpenContainer(fromContainer);
    Orion.CharPrint(self,1159,'Target TO container')
    Orion.WaitForAddObject('myTarget');
    var toContainerObj = Orion.FindObject('myTarget');
    var toContainerProps = toContainerObj.Properties();
    if(toContainerProps.indexOf('Contents: ') > -1)
        {
        var toContainer = toContainerObj.Serial();
        var gridIndex = 0;
        }
    else
        {
        var toContainer = toContainerObj.Container();
        var gridIndex = toContainerObj.GridIndex();
        }
    VerifyOpenContainer(toContainer);
    for(var i=0;i<items.length;i++)
        {
        var item = items[i]
        while(Orion.GetContainer(item) == fromContainer)
            {
            Orion.MoveItem(item,0,toContainer,-1,-1,-1,gridIndex);
            Orion.Wait(1300);
            }
        }
    }

function MoveItemsOLD(items)
    {
    Orion.CharPrint(self,1159,'Target FROM container')
    Orion.WaitForAddObject('myTarget');
    var fromContainer = Orion.GetSerial('myTarget');
    VerifyOpenContainer(fromContainer);
    Orion.CharPrint(self,1159,'Target TO container')
    Orion.WaitForAddObject('myTarget');
    var toContainer = Orion.GetSerial('myTarget');
    VerifyOpenContainer(toContainer);
    for(var i=0;i<items.length;i++)
        {
        var item = items[i]
        while(Orion.GetContainer(item) == fromContainer)
            {
            Orion.MoveItem(item,0,toContainer);
            Orion.Wait(1300);
            }
        }
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