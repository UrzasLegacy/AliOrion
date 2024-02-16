function SortContainerByScore()
	{
	Orion.CharPrint(self, 1159, 'Select container to sort FROM');
	Orion.WaitForAddObject('myTarget');
	var fromContainer = Orion.GetSerial('myTarget');
	Orion.CharPrint(self, 1159, 'Select container to sort .6+ TO');
	Orion.WaitForAddObject('myTarget');
	var toContainerT1 = Orion.GetSerial('myTarget');
	Orion.CharPrint(self, 1159, 'Select container to sort .4-.599 TO');
	Orion.WaitForAddObject('myTarget');
	var toContainerT2 = Orion.GetSerial('myTarget');
	Orion.CharPrint(self, 1159, 'Select container to sort < .4 TO');
	Orion.WaitForAddObject('myTarget');
	var toContainerT3 = Orion.GetSerial('myTarget');
	Orion.UseObject(fromContainer);
	Orion.Wait(1200);
	var item = Orion.FindType(any,any,fromContainer)[0];
	while(item)
		{
		var startTime = Orion.Now();
		Orion.Print('Evaluating Item');
		var score = PvPMageJewelryEval(item);
		if(score > .6)
			Orion.MoveItem(item, 0, toContainerT1);
		else if(score > .4)
			Orion.MoveItem(item, 0, toContainerT2);
		else
			Orion.MoveItem(item, 0, toContainerT3);
		var deltaTime = Orion.Now() - startTime;
		if(deltaTime < 1300)
			Orion.Wait(1300 - deltaTime);
		item = Orion.FindType(any,any,fromContainer)[0];
		}
	}


function PvPMageJewelryEvalByTarget()
	{
	Orion.WaitForAddObject('myTarget');
	var score = PvPMageJewelryEval('myTarget');
	Orion.Print('Score: ' + score)
	}

function PvPMageJewelryEval(itemSerial)
	{
	var pvpMageArr = 
		[  //[Mod RegEx, Weight]
			[/Enhance Potions (\d*)/, 2],	
			[/Mana Regeneration (\d*)/, 15],	
			[/Faster Casting (\d*)/, 60],
			[/Faster Cast Recovery (\d*)/, 25],
			[/Defense Chance Increase (\d*)/, 4],
			[/Hit Chance Increase (\d*)/, 4],
			[/^Damage Increase (\d*)/m, 1],	
			[/Strength Bonus (\d*)/, 6],
			[/Dexterity Bonus (\d*)/, 4],
			[/Intelligence Bonus (\d*)/, 4],
			[/Lower Reagent Cost (\d*)/, 2],
			[/Lower Mana Cost (\d*)/, 4],
			[/Swing Speed Increase (\d*)/, 3],
			[/Mana Increase (\d*)/, 3],
			[/Stamina Increase (\d*)/, 1],
			[/Spell Damage Increase (\d*)/, 1],
			[/Resist (\d*)/, 0],
		]
	
	var pvpMageSkillArr = 
		[ //Skill, Weight
			'Magery', 5,
			'Mace Fighting', 1,
			'Fencing', 1,
			'Musicianship', 1,
			'Swordsmanship', 5,
			'Animal Taming', 2,
			'Spirit Speak', 5,
			'Tactics', 2,
			'Wrestling', 5,
			'Animal Lore', 2,
			'Discordance', 1,
			'Focus', 5,
			'Parrying', 5,
			'Stealth', 2,
			'Anatomy', 2,
			'Bushido', 2,
			'Evaluate Intelligence', 5,
			'Mysticism', 5,
			'Necromancy', 5,
			'Archery', 2,
			'Chivalry', 2,
			'Healing', 2,
			'Ninjitsu', 2,
			'Resisting Spells', 5
		]
  	var item = Orion.FindObject(itemSerial);
	var skillWeight = 0;
	var skillAdj;
	var skillmatches = item.Properties().match(/[a-zA-Z ]* \+\d*/g);
	if(skillmatches)
		{
		skillmatches.forEach(function(part,ind)
            {
            var skill = part.match(/([a-zA-Z ]*) \+(\d*)/);
			var skillInd = pvpMageSkillArr.indexOf(skill[1])
            if(skill && skillInd > -1)
                skillAdj = skill[2] * pvpMageSkillArr[skillInd + 1];
            else
                skillAdj = 0;
            skillWeight = skillWeight + Math.floor(skillAdj * (1 + (ind * .2)));
            });
		}
	for(var i=0,totalWeight=skillWeight;i<pvpMageArr.length;i++)
		{
		var match = item.Properties().match(pvpMageArr[i][0]);
		if(match)
			totalWeight = totalWeight + pvpMageArr[i][1]*match[1];
		else
			Orion.Wait(10);
		}
	var score = (totalWeight/765).toFixed(3);
	//Orion.Print('Weight: ' + totalWeight + '/765');
	return score;
	}

function parse()
	{
    Orion.CharPrint(self, 1159, 'Select container to sort FROM');
    Orion.WaitForAddObject('myTarget');
    var fromContainer = Orion.GetSerial('myTarget');
    Orion.CharPrint(self, 1159, 'Select container to sort TO');
	Orion.WaitForAddObject('myTarget');
	var toContainer = Orion.GetSerial('myTarget');
	for(var attempt=0;attempt<2;attempt++)
		{
		Orion.Print('debug');
		var items = Orion.FindType(any,any,fromContainer).filter(function(itemEval)
			{
			return VitalityArmorEval(itemEval) > .7;
			});
		for(var i=0;i<items.length;i++)
			{
			Orion.MoveItem(items[i], 0, toContainer);
			Orion.Wait(1200);
			}
		}
	}

function VitalityArmorEvalByTarget()
	{
	Orion.WaitForAddObject('myTarget');
	var score = VitalityArmorEval('myTarget');
	Orion.Print('Score: ' + score)
	}

function VitalityArmorEval(itemSerial) 
	{
	var pvpMageArr = 
		[  //[Mod RegEx, Weight]
            [/Damage Eater (\d*)/, 5],
            [/Kinetic Eater (\d*)/, 4],
            [/Fire Eater (\d*)/, 4],
            [/Cold Eater (\d*)/, 1],
            [/Poison Eater (\d*)/, 4],
            [/Energy Eater (\d*)/, 1],
            [/Casting Focus (\d*)/, 8],
            [/Strength Bonus (\d*)/, 6],
            [/Intelligence Bonus (\d*)/, 4],
			[/Hit Point Increase (\d*)/, 12],
			[/Mana Increase (\d*)/, 4],
			[/Health Regeneration (\d*)/, 10],
			[/Mana Regeneration (\d*)/, 20],
			[/Lower Mana Cost (\d*)/, 4],
			[/Lower Reagent Cost (\d*)/, 2],
		];
    var item = Orion.FindObject(itemSerial);
	for(var i=0,totalWeight=0;i<pvpMageArr.length;i++)
		{
		var match = item.Properties().match(pvpMageArr[i][0]);
		if(match)
            {
            var increase = pvpMageArr[i][1]*match[1]
            //TextWindow.Open();
            //TextWindow.Print(pvpMageArr[i][0] + ':' + increase);
			totalWeight += increase;
            }
        }
	var score = (totalWeight/405).toFixed(3);
	//Orion.Print('Weight: ' + totalWeight + '/405');
	return score;
	}

function RestorationArmorEval(itemSerial) 
	{
	var pvpMageArr = 
		[  //[Mod RegEx, Weight]
            [/Damage Eater (\d*)/, 5],
            [/Kinetic Eater (\d*)/, 4],
            [/Fire Eater (\d*)/, 4],
            [/Cold Eater (\d*)/, 1],
            [/Poison Eater (\d*)/, 4],
            [/Energy Eater (\d*)/, 1],
            [/Casting Focus (\d*)/, 8],
            [/Intelligence Bonus (\d*)/, 4],
			[/Mana Increase (\d*)/, 4],
			[/Stamina Regeneration (\d*)/, 1],
			[/Health Regeneration (\d*)/, 10],
			[/Mana Regeneration (\d*)/, 20],
			[/Lower Mana Cost (\d*)/, 4],
			[/Lower Reagent Cost (\d*)/, 2],
		];
    var item = Orion.FindObject(itemSerial);
	for(var i=0,totalWeight=0;i<pvpMageArr.length;i++)
		{
		var match = item.Properties().match(pvpMageArr[i][0]);
		if(match)
            {
            var increase = pvpMageArr[i][1]*match[1]
            //TextWindow.Open();
            //TextWindow.Print(pvpMageArr[i][0] + ':' + increase);
			totalWeight += increase;
            }
        }
	var score = (totalWeight/340).toFixed(3);
	//Orion.Print('Weight: ' + totalWeight + '/340');
	return score;
	}

function HasteArmorEval(itemSerial) 
	{
	var pvpMageArr = 
		[  //[Mod RegEx, Weight]
            [/Damage Eater (\d*)/, 5],
            [/Kinetic Eater (\d*)/, 4],
            [/Fire Eater (\d*)/, 4],
            [/Cold Eater (\d*)/, 1],
            [/Poison Eater (\d*)/, 4],
            [/Energy Eater (\d*)/, 1],
            [/Casting Focus (\d*)/, 4],
            [/Dexterity Bonus (\d*)/, 8],
            [/Intelligence Bonus (\d*)/, 6],
			[/Stamina Increase (\d*)/, 8],
			[/Mana Increase (\d*)/, 4],
			[/Stamina Regeneration (\d*)/, 1],
			[/Mana Regeneration (\d*)/, 20],
			[/Lower Mana Cost (\d*)/, 4],
			[/Lower Reagent Cost (\d*)/, 2],
		];
    var item = Orion.FindObject(itemSerial);
	for(var i=0,totalWeight=0;i<pvpMageArr.length;i++)
		{
		var match = item.Properties().match(pvpMageArr[i][0]);
		if(match)
            {
            var increase = pvpMageArr[i][1]*match[1]
            //TextWindow.Open();
            //TextWindow.Print(pvpMageArr[i][0] + ':' + increase);
			totalWeight += increase;
            }
        }
	var score = (totalWeight/337).toFixed(3);
	//Orion.Print('Weight: ' + totalWeight + '/337');
	return score;
	}