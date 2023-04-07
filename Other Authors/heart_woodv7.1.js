//Send a mule with 50+ Tinkering and 30+ Carp to heartwood to farm saws
//Must craft one stool before letting the script go
//Original Creator: Unknown
//Heavily Modfied by: Sadie
//Special Thanks to Ali & Raged
//Version 7: Functioning as intended
Shared.GetVar('multi')
Shared.GetVar('firstPass')
Shared.GetVar('ArboristSerial')
function main()
{
	Shared.AddVar('ArboristSerial', '');
	Shared.AddVar('multi', 1);
	if(parseInt(Orion.GetPing('average')) > 60)
	{
		Shared.AddVar('multi', 2);;
	}
	else if (parseInt(Orion.GetPing('average')) > 150)
	{
		Shared.AddVar('multi', 3);;
	}
	else (parseInt(Orion.GetPing('average')) < 60)
	{
		Shared.AddVar('multi', 1);;
	}
	Shared.AddVar('firstPass', true);
	Orion.CharPrint(self,1159,'Target Packy or Beetle')
	Orion.WaitForAddObject('objectName');
	var mount = Orion.FindObject(Orion.GetSerial('objectName'));
	while(true)
	{
		if(mount.Exists() == true)
		{
            Orion.RequestContextMenu(mount.Serial());
			Orion.WaitContextMenuID(mount.Serial(), 508);
		}
		Orion.Wait(1000);
		if(Orion.FindType(lookup.Boards.Graphic,'any', lastcontainer).length < 1)
		{
			var subContainer = Orion.FindType(lookup.Backpack.Graphic,any, lastcontainer);
			Orion.UseObject(subContainer)
			Orion.Wait(1500);
			if(Orion.FindType(lookup.Boards.Graphic,'any', lastcontainer).length < 1)
			{
				var subContainer = Orion.FindType(lookup.Backpack.Graphic,any, lastcontainer);
				Orion.UseObject(subContainer)
				Orion.Wait(1500);
				var supplyContainer = subContainer[0]
			}
			else
			{
				var supplyContainer = subContainer[0]
			}
		}
		Orion.Wait(1000);
		if(Orion.FindType(lookup.Boards.Graphic).length > 0)
		{
			if(Orion.FindObject(Orion.FindType(lookup.Boards.Graphic)).Count() < 90)
			{
				if(Orion.FindType(lookup.Boards.Graphic,'any', lastcontainer).length > 0)
				{
					if(Orion.FindObject(Orion.FindType(lookup.Boards.Graphic,'any', lastcontainer)).Count() > 270)
					{
						Orion.DragItem(Orion.FindType(lookup.Boards.Graphic,'any', lastcontainer), (270 - Orion.FindObject(Orion.FindType(lookup.Boards.Graphic)).Count()));
						Orion.Wait(600*Shared.GetVar('multi'));
						Orion.DropDraggedItem();
						Orion.Wait(1000*Shared.GetVar('multi'));				
					}
				}
				else
				{
					Orion.Print('Out of boards stoping!');
					Orion.UseObject(mount.Serial());
					Orion.PauseScript('all');
				}
			}	
		}
		else
		{
			if(Orion.FindType(lookup.Boards.Graphic,'any', lastcontainer).length > 0)
			{
				if(Orion.FindObject(Orion.FindType(lookup.Boards.Graphic,'any', lastcontainer)).Count() >= 270)
				{
					Orion.DragItem(Orion.FindType(lookup.Boards.Graphic,'any', lastcontainer), 270);
					Orion.Wait(600*Shared.GetVar('multi'));
					Orion.DropDraggedItem();
					Orion.Wait(1000*Shared.GetVar('multi'));				
				}
				else
				{
					Orion.Print('Out of boards stoping!');
					Orion.UseObject(mount.Serial());
					Orion.PauseScript('all');
				}		
			}
		}					
		if(Orion.FindType(lookup.TinkerTools.Graphic).length < 3)
		{
			while(true)
			{
				craftTinker();
				Orion.Wait(1000*Shared.GetVar('multi'));
				if(Orion.FindType(lookup.TinkerTools.Graphic).length > 2)
				{
					break;
				}
			}
		}
		if(Orion.FindType(lookup.CarpScorp.Graphic).length < 3)
		{
			while(true)
			{
				craftCarp();	
				Orion.Wait(1000*Shared.GetVar('multi'));
				if(Orion.FindType(lookup.CarpScorp.Graphic).length > 2)
				{
					break;
				}					
			}
		}
		if(Orion.FindType(lookup.Boards.Graphic)	.length > 0)
		{		
			if(Orion.FindObject(Orion.FindType(lookup.Boards.Graphic)).Count() >= 90)
				{
					if(getQuest() == true)
					{
						Orion.Wait(1000*Shared.GetVar('multi'));
						if(craft() == true)
						{
	                        Orion.Wait(1000*Shared.GetVar('multi'));
							if(flagQuestItem() == true)
	                        {
	                            Orion.Wait(1000*Shared.GetVar('multi'));
	                            if(turnIn() == true)
	                            {
	                                Orion.Wait(1000*Shared.GetVar('multi'));
	                                searchBags();					
	                            }
	                        }
						}
					}
				}
		}
	}
}

function test()
{
	Orion.Print(Orion.GetPing('average'));
}

function craftTinker() 
{
    if(Orion.FindType(lookup.IronIngots.Graphic).length > 0)
    {
        if(Orion.FindObject(Orion.FindType(lookup.IronIngots.Graphic)).Count() >= 10)
        {
            Orion.UseType(lookup.TinkerTools.Graphic);
            if (Orion.WaitForGump(1000*Shared.GetVar('multi')))
            {
                var gump1 = Orion.GetGump('last');
                if ((gump1 !== null) && (!gump1.Replayed()) && (gump1.ID() === '0x000001CC'))
                {
                    gump1.Select(Orion.CreateGumpHook(11));
                    Orion.Wait(500*Shared.GetVar('multi'));
                }
                if (Orion.WaitForGump(1000*Shared.GetVar('multi')))
                {
                    var gump0 = Orion.GetGump('last');
                    if ((gump0 !== null) && (!gump0.Replayed()))
                    {
                        gump0.Select(Orion.CreateGumpHook(0));
                        Orion.Wait(100*Shared.GetVar('multi'));
                    }
                }			
            }
        }
        else
        {
            Orion.Print('Need Ingots! Grabbing Ingots');
            Orion.DragItem(Orion.FindType(lookup.IronIngots.Graphic,'any', lastcontainer), 270);
            Orion.Wait(600*Shared.GetVar('multi'));
            Orion.DropDraggedItem();
            Orion.Wait(1000*Shared.GetVar('multi'));
            //Orion.StopMacro();
        }
    }
    else
    {
        Orion.Print('Need Ingots! Grabbing Ingots');
        Orion.DragItem(Orion.FindType(lookup.IronIngots.Graphic,'any', lastcontainer), 270);
        Orion.Wait(600*Shared.GetVar('multi'));
        Orion.DropDraggedItem();
        Orion.Wait(1000*Shared.GetVar('multi'));
        //Orion.StopMacro();
    }
}

function craftCarp() 
{
	Orion.UseType(lookup.TinkerTools.Graphic);
	if (Orion.WaitForGump(1000*Shared.GetVar('multi')))
	{
		var gump1 = Orion.GetGump('last');
		if ((gump1 !== null) && (!gump1.Replayed()) && (gump1.ID() === '0x000001CC'))
		{
			gump1.Select(Orion.CreateGumpHook(10));
			Orion.Wait(500*Shared.GetVar('multi'));
		}
		if (Orion.WaitForGump(1000*Shared.GetVar('multi')))
		{
			var gump0 = Orion.GetGump('last');
			if ((gump0 !== null) && (!gump0.Replayed()))
			{
				gump0.Select(Orion.CreateGumpHook(0));
				Orion.Wait(100*Shared.GetVar('multi'));
			}
		}
	}
}

function turnIn()
{
//what does this do
	var Questarborist = GetQuestArborist();
	Orion.UseObject(Questarborist);
	if (Orion.WaitForGump(1000*Shared.GetVar('multi')))
	{
		var gump0 = Orion.GetGump('last');
		if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x0000032A'))
		{
			gump0.Select(Orion.CreateGumpHook(4));
			Orion.Wait(100*Shared.GetVar('multi'));
		}
	}
	if (Orion.WaitForGump(1000*Shared.GetVar('multi')))
	{
		var gump1 = Orion.GetGump('last');
		if ((gump1 !== null) && (!gump1.Replayed()) && (gump1.ID() === '0x00000323'))
		{
			gump1.Select(Orion.CreateGumpHook(1));
			Orion.Wait(100*Shared.GetVar('multi'));
		}
	}
	return true;
}

function flagQuestItem()
{
	var characterSerial = Player.Serial();
    Orion.WaitContextMenuID(characterSerial, 801);
    Orion.RequestContextMenu(characterSerial);
    Orion.WaitForTarget(500);
    while(Orion.FindType('0x0B5E','0x04EA').length < 10)
    {
    if(Orion.WaitForTarget(2000))
      Orion.TargetType('0x0B5E', '0x0000')
    Orion.Wait(300); //this extra wait is dependent on your ping so can kinda adjust it, but this is still pretty fast
    }
  if(Orion.WaitForTarget(2000))
    Orion.CancelTarget();
	return true;
}

function getQuest()
{
	var arch = '1073882';
	var Questarborist = GetQuestArborist();
    if (Orion.WaitForGump(1000*Shared.GetVar('multi')))
	{
		var gump0 = Orion.GetGump('last');
		if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x0000032A'))
		{
			gump0.Select(Orion.CreateGumpHook(4));
			Orion.Wait(100*Shared.GetVar('multi'));
		}
	}
	if (Orion.WaitForGump(1000*Shared.GetVar('multi')))
	{
		var gump1 = Orion.GetGump('last');
		if ((gump1 !== null) && (!gump1.Replayed()) && (gump1.ID() === '0x00000323'))
		{
			gump1.Select(Orion.CreateGumpHook(1));
			Orion.Wait(100*Shared.GetVar('multi'));
		}
	}
	//this targets Cialla The Arborist
	Orion.UseObject(Questarborist);
	while(true)
	{
		var testing = Orion.GetLastGump();
		var questCommand = testing.Command(24);
		
		if(Orion.Contains(questCommand, arch) == true)
		{
			if (Orion.WaitForGump(1000*Shared.GetVar('multi')))
			{
				var gump0 = Orion.GetGump('last');
				if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00000320'))
				{
					gump0.Select(Orion.CreateGumpHook(1));
					Orion.Wait(100*Shared.GetVar('multi'));
				}
			}
			return true;
		}
		else 
		//targets Ciala The Arborist
			Orion.UseObject(Questarborist);
			
		Orion.Wait(1200*Shared.GetVar('multi'));
	}
}	

function craft()
{
	var tool = Orion.FindObject(Orion.FindType(lookup.CarpScorp.Graphic)[0]);
		
	if(tool.Exists() == true)
	{
		Orion.Wait(1000*Shared.GetVar('multi'));
		Orion.UseObject(tool.Serial());
	}	
	
	while(true)
	{		
		if(tool.Exists() == false)
		{
			tool = Orion.FindObject(Orion.FindType(lookup.CarpScorp.Graphic)[0]);		
			if(tool.Exists() == true)
			{
				Orion.UseObject(tool.Serial());
			}	
		}	
		
		if (Orion.WaitForGump(1000*Shared.GetVar('multi')))
		{
			var gump0 = Orion.GetGump('last');
			if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x000001CC') && Orion.FindType('0x0B5E').length < 10)
			{
				gump0.Select(Orion.CreateGumpHook(82));
				Orion.Wait(500*Shared.GetVar('multi'));
			}
			else if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x000001CC') && Orion.FindType('0x0B5E').length > 8)
			{
				gump0.Select(Orion.CreateGumpHook(0));
				Orion.Wait(500*Shared.GetVar('multi'));
				return true;
			}	
		}		
	}
}

function GetQuestArborist()
{
	var firstPass = Shared.GetVar('firstPass')
	var savedArboristSerial = Shared.GetVar('ArboristSerial')
	    if(savedArboristSerial.length == 0)
	    {
	        Orion.CharPrint(self,1159,'Target Arborist')
	        Orion.WaitForAddObject('objectName');
	        var arborist = Orion.FindObject(Orion.GetSerial('objectName'));
	        Shared.AddVar('firstPass', firstPass);
	        Shared.AddVar('ArboristSerial', arborist.Serial());
	        return arborist.Serial();
	    }
	    else
	    {
	    	return savedArboristSerial;
	    }
}

function searchBags()
{
	var bags = Orion.FindType('0x0E75');
	var trash;
	if(bags.length > 0)
	{
		for(i=0;i<bags.length;i++)
		{
			Orion.UseObject(bags[i]);
			Orion.Wait(1500*Shared.GetVar('multi'));
			var items = Orion.FindType('any','any',lastcontainer);    
			if(items.length > 0)
			{
				for(j=0;j<items.length;j++)
				{
					if(Orion.Contains(Orion.FindObject(items[j]).Properties(), 'Runic Dovetail') == true)
					{
						Orion.DragItem(items[j], 1);
						Orion.Wait(600*Shared.GetVar('multi'));
						Orion.DropDraggedItem();
						Orion.Wait(1000*Shared.GetVar('multi'));				
					}
					else if (Orion.Contains(Orion.FindObject(items[j]).Properties(), 'Exceptional Bonus') == true)
					{
						var eBonus = Orion.Split(Orion.FindObject(items[j]).Properties().match(/Exceptional Bonus(.*)/i)[0]);
						if(parseInt(eBonus[2]) >= 24)
						{
							if(Orion.Contains(Orion.FindObject(items[j]).Properties(), 'Alchemy Bonus') == true)
							{
								var nBonus = Orion.Split(Orion.FindObject(items[j]).Properties().match(/Alchemy Bonus:(.*)/i)[0]);
								if(parseInt(nBonus[2]) > 24)
								{
									Orion.DragItem(items[j], 1);
									Orion.Wait(600*Shared.GetVar('multi'));
									Orion.DropDraggedItem();
									Orion.Wait(1000*Shared.GetVar('multi'));								
								}
							}
							else if(Orion.Contains(Orion.FindObject(items[j]).Properties(), 'Blacksmithy Bonus') == true)
							{
								var nBonus = Orion.Split(Orion.FindObject(items[j]).Properties().match(/Blacksmithy Bonus:(.*)/i)[0]);
								if(parseInt(nBonus[2]) > 24)
								{
									Orion.DragItem(items[j], 1);
									Orion.Wait(600*Shared.GetVar('multi'));
									Orion.DropDraggedItem();
									Orion.Wait(1000*Shared.GetVar('multi'));								
								}						
							}
							else if(Orion.Contains(Orion.FindObject(items[j]).Properties(), 'Bowcraft/Fletching Bonus') == true)
							{
								var nBonus = Orion.Split(Orion.FindObject(items[j]).Properties().match(/Fletching Bonus:(.*)/i)[0]);
								if(parseInt(nBonus[2]) > 24)
								{
									Orion.DragItem(items[j], 1);
									Orion.Wait(600*Shared.GetVar('multi'));
									Orion.DropDraggedItem();
									Orion.Wait(1000*Shared.GetVar('multi'));								
								}						
							}
							else if(Orion.Contains(Orion.FindObject(items[j]).Properties(), 'Carpentry Bonus') == true)
							{
								var nBonus = Orion.Split(Orion.FindObject(items[j]).Properties().match(/Carpentry Bonus:(.*)/i)[0]);
								if(parseInt(nBonus[2]) > 24)
								{
									Orion.DragItem(items[j], 1);
									Orion.Wait(600*Shared.GetVar('multi'));
									Orion.DropDraggedItem();
									Orion.Wait(1000*Shared.GetVar('multi'));								
								}						
							}
							else if(Orion.Contains(Orion.FindObject(items[j]).Properties(), 'Cooking Bonus') == true)
							{
								var nBonus = Orion.Split(Orion.FindObject(items[j]).Properties().match(/Cooking Bonus:(.*)/i)[0]);
								if(parseInt(nBonus[2]) > 24)
								{
									Orion.DragItem(items[j], 1);
									Orion.Wait(600*Shared.GetVar('multi'));
									Orion.DropDraggedItem();
									Orion.Wait(1000*Shared.GetVar('multi'));								
								}						
							}
							else if(Orion.Contains(Orion.FindObject(items[j]).Properties(), 'Tailoring Bonus') == true)
							{
								var nBonus = Orion.Split(Orion.FindObject(items[j]).Properties().match(/Tailoring Bonus:(.*)/i)[0]);
								if(parseInt(nBonus[2]) > 25)
								{
									Orion.DragItem(items[j], 1);
									Orion.Wait(600*Shared.GetVar('multi'));
									Orion.DropDraggedItem();
									Orion.Wait(1000*Shared.GetVar('multi'));								
								}						
							}
							else if(Orion.Contains(Orion.FindObject(items[j]).Properties(), 'Tinkering Bonus') == true)
							{
								var nBonus = Orion.Split(Orion.FindObject(items[j]).Properties().match(/Tinkering Bonus:(.*)/i)[0]);
								if(parseInt(nBonus[2]) > 25)
								{
									Orion.DragItem(items[j], 1);
									Orion.Wait(600*Shared.GetVar('multi'));
									Orion.DropDraggedItem();
									Orion.Wait(1000*Shared.GetVar('multi'));								
								}						
							}												
						}	
					}
				}
			}
			var trash = Orion.FindType('0x0E75', 'any', 'ground', 'item|inlos', 1);
			if(trash.length >0)
			{
				var trashAmount = Orion.Split(Orion.FindObject(trash[0]).Properties().match(/Contents:(.*)/g)[0].slice(10,20),'/');
				if(parseInt(trashAmount)<50)
				{
					Orion.DragItem(bags[i], 1);
					Orion.Wait(600*Shared.GetVar('multi'));
					Orion.DropDraggedItem(trash[0]);
					Orion.Wait(1000*Shared.GetVar('multi'));					
				}
				else
				{
					Orion.Ignore(trash[0]);
				}	
			}
			else
			{
				Orion.DragItem(bags[i], 1);
				Orion.Wait(600*Shared.GetVar('multi'));
				Orion.DropDraggedItemRelative(1, Orion.Random(0,3));
				Orion.Wait(1000*Shared.GetVar('multi'));						
			}			
		}
	}
}
	
    const lookup = 
    {
        Boards: {Graphic: '0x1BD7'},
		TinkerTools: {Graphic: '0x1EB9'},
		IronIngots: {Graphic: '0x1BF2'},
		CarpScorp: {Graphic: '0x10E7'},
        Backpack: {Graphic: '0x0E75'},
    }
