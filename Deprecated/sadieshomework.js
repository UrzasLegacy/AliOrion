Shared.GetVar('multi')
function main()
{
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
		if(Orion.FindType(0x1BD7).length > 0)
		{
			if(Orion.FindObject(Orion.FindType(0x1BD7)).Count() < 90)
			{
				if(Orion.FindType(0x1BD7,'any', lastcontainer).length > 0)
				{
					if(Orion.FindObject(Orion.FindType(0x1BD7,'any', lastcontainer)).Count() > 270)
					{
						Orion.DragItem(Orion.FindType(0x1BD7,'any', lastcontainer), (270 - Orion.FindObject(Orion.FindType(0x1BD7)).Count()));
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
			if(Orion.FindType(0x1BD7,'any', lastcontainer).length > 0)
			{
				if(Orion.FindObject(Orion.FindType(0x1BD7,'any', lastcontainer)).Count() >= 270)
				{
					Orion.DragItem(Orion.FindType(0x1BD7,'any', lastcontainer), 270);
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
		if(Orion.FindType(0x1EB9).length < 3)
		{
			while(true)
			{
				craftTinker();
				Orion.Wait(1000*Shared.GetVar('multi'));
				if(Orion.FindType(0x1EB9).length > 2)
				{
					break;
				}
			}
		}
		if(Orion.FindType(0x10E7).length < 3)
		{
			while(true)
			{
				craftCarp();	
				Orion.Wait(1000*Shared.GetVar('multi'));
				if(Orion.FindType(0x10E7).length > 2)
				{
					break;
				}					
			}
		}
		if(Orion.FindType(0x1BD7)	.length > 0)
		{		
		if(Orion.FindObject(Orion.FindType(0x1BD7)).Count() >= 90)
			{
				if(getQuest() == true)
				{
					Orion.Wait(1000*Shared.GetVar('multi'));
					if(craft() == true)
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

function test()
{
	Orion.Print(Orion.GetPing('average'));
}

function craftTinker() 
{
	if(Orion.FindObject(Orion.FindType('0x1BF2')).Count() > 10)
	{
		Orion.UseType('0x1EB9');
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
		Orion.Print('Need Ingots! Go get some and restart.');
		Orion.StopMacro();
	}
}

function craftCarp() 
{
	Orion.UseType('0x1EB9');
	if (Orion.WaitForGump(1000*Shared.GetVar('multi')))
	{
		var gump1 = Orion.GetGump('last');
		if ((gump1 !== null) && (!gump1.Replayed()) && (gump1.ID() === '0x000001CC'))
		{
			gump1.Select(Orion.CreateGumpHook(73));
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
	Orion.UseObject('0x001C4260');
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

function getQuest()
{
	var arch = '1073882';
	Orion.UseObject('0x001C4260');
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
			Orion.UseObject('0x001C4260');
			
		Orion.Wait(1200*Shared.GetVar('multi'));
	}
}	

function craft()
{
	var tool = Orion.FindObject(Orion.FindType('0x10E7')[0]);
		
	if(tool.Exists() == true)
	{
		Orion.Wait(1000*Shared.GetVar('multi'));
		Orion.UseObject(tool.Serial());
	}	
	
	while(true)
	{		
		if(tool.Exists() == false)
		{
			tool = Orion.FindObject(Orion.FindType('0x10E7')[0]);		
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
