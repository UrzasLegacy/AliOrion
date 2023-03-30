function UseStealing()
	{
	while(Orion.ObjAtLayer('RightHand',self))
		{
		Orion.Unequip('RightHand');
		Orion.Wait(100);
		}
	Orion.UseSkill('Stealing');
	if(Orion.WaitForTarget(1000))
		{
		var endTime = Orion.Now() + 10000;
		while(Orion.HaveTarget() && Orion.Now() < endTime)
			{
			Orion.Wait(10);
			}
		}
		Orion.Dress('Dagger');
	}

function CatchBackpack(backpackSerial)
	{
	Shared.AddVar('markBackpack', backpackSerial);
	}

function OpenSerialBackpack(serial)
	{
	var check = Orion.UseItemOnMobile(serial, self);
	if(check)
		Orion.Exec('BackPackGumpRenderer');
	}
function OpenNearPack()
	{
	var mark = Orion.FindTypeEx('0x0190|0x0191|0x0192|0x0193|0x03DB|0x03DF|0x03E2|0x0084|0x00F6|0x00DC|0x0051|0x00D9|0x007A|0x0019|0x00DB|0x0015|0x00C9|0x00EE|0x00CD|0x04E6|0x0059|0x00B7|0x00B8|0x00B9|0x00BA|0x025D|0x025E|0x025F|0x0260|0x029A|0x029B|0x02B6|0x02B7|0x03DB|0x03DF|0x03E2',any,ground,'ignoreself',1)[0];
	if(mark)
		{
		var markSerial = mark.Serial();
		var markName = mark.Name();
		Orion.CharPrint(markSerial,1159,markName)
		var pack = Orion.ObjAtLayer('backpack',markSerial)
		if(pack)
			{
			var packSerial = pack.Serial();
			OpenSerialBackpack(packSerial)
			Orion.Wait(100);
			BackPackGumpRenderer(packSerial,markSerial,markName)
			//Shared.AddVar('markBackpack',packSerial);
			}
		}
	}
function BackPackGumpRenderer(markBackpack,markSerial,markName)
	{
	//while(true)
		//{
		var items = Orion.FindTypeEx(any,any,markBackpack,'',20).filter(function(item)
			{
			return !Orion.Contains(item.Properties(),'Blessed|Insured|Strength|Agility|Cure|Heal|Poison|Refresh|Empty Bottle|Bandage|Small Crate|Stat Loss|Supernova');
			});
		if(items.length == 0)
			return;
		var g = 10420;
		var endTime = Orion.Now() + 1000;
		var gump = Orion.CreateCustomGump(g);
		while(gump && Orion.Now() < endTime)
			{
			gump = Orion.CreateCustomGump(g++);
			Orion.Wait(1);
			}
		gump.SetCallback('MarkBackpackGumpCallBack')
		gump.Clear();
		gump.AddResizepic(0, 0, 0xDAC, 300, 40 + 15 * (items.length + 2));
		var line = 0
		gump.AddText(35, 15 + (15 * line) ,'0', markName);
		gump.AddButton(markSerial, 15, 20 + (15 * line++) , 0x4B9, 0x4BA, 0x4B9, '0');
		line++;
		for(var i=0;i<items.length;i++)
			{
			var item = items[i];
			gump.AddText(35, 15 + (15 * line) ,'0', item.Name());
			gump.AddButton(item.Serial(), 15, 20 + (15 * line++) , 0x4B9, 0x4BA, 0x4B9, '0');
			}
		gump.Update();
		//Orion.Wait(500);
		}
	//}
var stealFilterIgnore = 'Blessed|Insured|Cure|Heal|Poison|Refresh';
function DontMindIfIDo()
	{
	var markHash = {};
	var packHash = {};
	var memoryMS = 300000;
	var packArr = [];
	var nextUseTime = 0;
	while(true)
		{
		Orion.Wait(500);
		var mark = Orion.FindType('0x0190|0x0191|0x0192|0x0193|0x03DB|0x03DF|0x03E2|0x0084|0x00F6|0x00DC|0x0051|0x00D9|0x007A|0x0019|0x00DB|0x0015|0x00C9|0x00EE|0x00CD|0x04E6|0x0059|0x00B7|0x00B8|0x00B9|0x00BA|0x025D|0x025E|0x025F|0x0260|0x029A|0x029B|0x02B6|0x02B7|0x03DB|0x03DF|0x03E2',any,ground,'ignoreself',20,'blue|orange|gray|red')
			.filter(function(filt)
				{
				var pack = Orion.ObjAtLayer('backpack',filt);
				if(pack)
					{
					var packSerial = pack.Serial();
					return !packHash[packSerial]
					// if(bool)
					// 	return !bool[0];
					}
				});
		Orion.Print(mark.length)
		for(var i=0;i<mark.length;i++)
			{
			var markSerial = mark[i];
			var markPack = Orion.ObjAtLayer('backpack',markSerial);
			if(markPack)
				{
				var markPackSerial = markPack.Serial();
				// var items = Orion.FindType(any,any,markPackSerial)
				// Orion.Print('i: ' + items)
				// if(items.length == 0)
				// 	{
					packHash[markPackSerial] = [Orion.Now() + memoryMS, markSerial];
					// }
				// while(Orion.FindType(any,any,markPackSerial).length == 0 && Orion.GetDistance(markSerial) < 3)
				// 	{
					// var nowTime = Orion.Now();
					// if(nowTime > nextUseTime)
					// 	{
					// 	var nextUseTime = nowTime + 1200;
					// 	Orion.UseObject(markPackSerial);
					// 	}

				// 	packHash[markPackSerial] = [Orion.Now() + memoryMS,markSerial];
				// 	break;
				// 	}
				}
			}
		
		var gump = Orion.CreateCustomGump(10420);
		gump.SetCallback('MarkBackpackGumpCallBack')
		gump.Clear();
		var background = 0;
		for(var packSerial in packHash)
			{
			var packArr = packHash[packSerial];
			var decayTimer = packArr[0];
			var packOwner = packArr[1];
			var nowTime = Orion.Now();
			if(nowTime > decayTimer)
				{
				delete packHash[packSerial];
				continue;
				}
			var items = Orion.FindTypeEx(any,any,packSerial,'',24);
			if(items.length == 0 && Orion.GetDistance(packOwner) < 2)// && !Orion.HaveTarget())
				{
				if(nowTime > nextUseTime)
					{
					var nextUseTime = nowTime + 1200;
					Orion.UseItemOnMobile(packSerial,self);
					}
				}
			var backGroundItems = items.filter(function(item)
				{
				return !Orion.Contains(item.Properties(),'Blessed|Insured|Cure|Heal|Poison|Refresh');
				});
			if(backGroundItems.length)
				background++;
			background += backGroundItems.length;
			}
		gump.AddResizepic(0, 0, 0xDAC, 300, 40 + 15 * background);
		var line = 0;
		for(var packSerial in packHash)
			{
			var packArr = packHash[packSerial];
			var decayTimer = packArr[0];
			var packOwner = packArr[1];
			var items = Orion.FindTypeEx(any,any,packSerial,'',24);
			if(items.length == 0)
				continue;
			var stealFilter = items.filter(function(item)
				{
				return !Orion.Contains(item.Properties(),'Blessed|Insured|Cure|Heal|Poison|Refresh');
				});
			var packOwnerObj = Orion.FindObject(packOwner)
			if(packOwnerObj)
				var name = packOwnerObj.Name();
			gump.AddText(35, 15 + (15 * line++) , '0', name);				
			for(var i=0;i<stealFilter.length;i++)
				{
				var item = stealFilter[i];
				gump.AddText(35, 15 + (15 * line) ,Shared.GetVar('itemTarget') == item.Serial() ? '1' : '0', item.Name());
				gump.AddButton(item.Serial(), 15, 20 + (15 * line++) , 0x4B9, 0x4BA, 0x4B9, '0');
				}
			if(stealFilter.length == 0)
				gump.AddText(35, 15 + (15 * line++) ,'0', 'No Items');
				
			line++
			}
		gump.Update();
		}
	}

function DontMindIfIDo2()
	{
	var hash = {};
	var memoryMS = 5000;
	var outArr = [];
	while(true)
		{
		Orion.Wait(100);
		var mark = Orion.FindTypeEx('0x0190|0x0191|0x0192|0x0193|0x03DB|0x03DF|0x03E2|0x0084|0x00F6|0x00DC|0x0051|0x00D9|0x007A|0x0019|0x00DB|0x0015|0x00C9|0x00EE|0x00CD|0x04E6|0x0059|0x00B7|0x00B8|0x00B9|0x00BA|0x025D|0x025E|0x025F|0x0260|0x029A|0x029B|0x02B6|0x02B7|0x03DB|0x03DF|0x03E2',any,ground,'ignoreself',1,'blue|orange|gray|red')
		for(var i=0;i<mark.length;i++)
			{
			var markObj = mark[i];
			var markSerial = markObj.Serial();
			if(hash[markSerial] != undefined)
				continue;
			var markPack = Orion.ObjAtLayer('backpack',markSerial);
			var markPackSerial = markPack.Serial();
			if(!Orion.GumpExists('container',markPackSerial) && Orion.OpenContainer(markPackSerial))
				{
				hash[markSerial] = [Orion.Now() + memoryMS, markPackSerial];
				break;
				}
			}
		var gump = Orion.CreateCustomGump(10420);
		gump.SetCallback('MarkBackpackGumpCallBack')
		gump.Clear();
		var nowTime = Orion.Now();
		var background = 0;
		for(var serial in hash)
			{
			var prop = hash[serial];
			var items = Orion.FindTypeEx(any,any,prop[1],'',20).filter(function(item)
				{
				return !Orion.Contains(item.Properties(),'Blessed|Insured|Cure|Heal|Poison|Refresh');
				});
			if(nowTime > prop[0] || items.length == 0)
				{
				delete hash[serial];
				var tempArr = [];
				for(var o=0;o<outArr.length;o++)
					{
					if(outArr[o][0] != serial)
						tempArr.push(outArr[o])
					}
				outArr = tempArr;
				continue;
				}
			background++;
			background+=items.length;
			var subArr = [serial,items];
			outArr.push(subArr);	
			}
		gump.AddResizepic(0, 0, 0xDAC, 200, 40 + 15 * background);
		var line = 0;
		for(var i=0;i<outArr.length;i++)
			{
			var subArr = outArr[i];
			var charObj = Orion.FindObject(subArr[0]);
			if(charObj)
				var name = charObj.Name();
			else
				var name = 'No Name';
			var items = subArr[1];
			gump.AddText(35, 15 + (15 * line++) , '0', name);				
			for(var i=0;i<items.length;i++)
				{
				var item = items[i];
				gump.AddText(35, 15 + (15 * line) ,Shared.GetVar('itemTarget') == item.Serial() ? '1' : '0', item.Name());
				gump.AddButton(item.Serial(), 15, 20 + (15 * line++) , 0x4B9, 0x4BA, 0x4B9, '0');
				}
			}
		gump.Update();
		
		}
	}

function MarkBackPackGumpRenderer()
	{
	while(true)
		{
		var markBackpack = Shared.GetVar('markBackpack');
		var items = Orion.FindTypeEx(any,any,markBackpack,'',20).filter(function(item)
			{
			return !Orion.Contains(item.Properties(),'Blessed|Insured|Cure|Heal|Poison|Refresh');
			});
		var g = 10420;
		var endTime = Orion.Now() + 2000;
		var gump = Orion.CreateCustomGump(10420);
		while(!gump && Orion.Now() < endTime)
			{
			gump = Orion.CreateCustomGump(g++);
			}
		gump.SetCallback('MarkBackpackGumpCallBack')
		gump.Clear();
		gump.AddResizepic(0, 0, 0xDAC, 200, 40 + 15 * items.length);
		for(var i=0;i<items.length;i++)
			{
			var item = items[i];
			gump.AddText(35, 15 + (15 * i) ,Shared.GetVar('itemTarget') == item.Serial() ? '1' : '0', item.Name());
			gump.AddButton(item.Serial(), 15, 20 + (15 * i) , 0x4B9, 0x4BA, 0x4B9, '0');
			gump.Update();
			}
		Orion.Wait(500);
		}
	}

function UseSmokeBomb()
	{
	var smokeBomb = Orion.FindType('0x2809|0x2808')[0];
	if(!smokeBomb)
		return Orion.CharPrint(self,1159,'Out of smokebombs!');
	if(Orion.HaveTarget())
		Orion.CancelTarget();
	Orion.UseItemOnMobile(smokeBomb, self);
	}
	
function MoveItemTarget()
	{
	Orion.MoveItem(Shared.GetVar('itemTarget'))
	}


function MarkBackPackGump()
	{
	while(true)
		{
		var markBackpack = Shared.GetVar('markBackpack');
		var items = Orion.FindTypeEx(any,any,markBackpack,'',20).filter(function(item)
			{
			return !Orion.Contains(item.Properties(),'Blessed|Insured|Cure|Heal|Poison|Refresh');
			});
		var gump = Orion.CreateCustomGump(10420);
		gump.SetCallback('MarkBackpackGumpCallBack')
		gump.Clear();
		gump.AddResizepic(0, 0, 0xDAC, 200, 40 + 15 * items.length);
		for(var i=0;i<items.length;i++)
			{
			var item = items[i];
			gump.AddText(35, 15 + (15 * i) ,Shared.GetVar('itemTarget') == item.Serial() ? '1' : '0', item.Name());
			gump.AddButton(item.Serial(), 15, 20 + (15 * i) , 0x4B9, 0x4BA, 0x4B9, '0');
			gump.Update();
			}
		Orion.Wait(500);
		}
	}


function MarkBackpackGumpCallBack()
	{
	var code = CustomGumpResponse.ReturnCode();
	if(code == 0)
		{
		Orion.Terminate('MarkBackPackGump')
		}
	else
		{
		var check = Orion.FindObject(code)
		if(check && check.Mobile())
			return Orion.CharPrint(code,1159,'Mark');
		Shared.AddVar('itemTarget',code)
		Orion.ClientLastTarget(code);
		var item = Orion.FindObject(code);
		if(item)
		 Orion.CharPrint(self,1159,'Target: ' + item.Name())
		}
	}