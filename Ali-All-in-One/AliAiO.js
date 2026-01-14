//#include AliOrion/Ali-All-in-One/AliQoL.js
//#include AliOrion/Ali-All-in-One/AliAutomation.js
//#include AliOrion/Ali-All-in-One/AliDebug.js
//#include AliOrion/Ali-All-in-One/AliHelpers.js
//#include AliOrion/Ali-All-in-One/AliLooterPlugin.js
//#include AliOrion/Ali-All-in-One/AliVS.js

var settings = {
        farmType: 'Mobile', //false, 'Static' , 'Mobile' , 'Leash'
        walkThrough: 'Primeval',
        useGatherMobs: true, //true , false. Set to true to attack all mobs in the area each loop of AutoAttack();
        mobGraphic: '!0x0308|!0x001F', //any , '0x00F1' , '!0x0308', '0x00F1|!0x00F2'. Mob graphic to search for. Put ! before graphic to exclude that graphic instead
        mobileFarmConfinementZone: [6500,921,7300,1070], //[x1,y1,x2,y2] x1, y1 is northwest corner; x2, y2 is southeast corner. Set to false to ignore this setting.
        leashFarmRadius: 6, //Radius around the leader to search for mobs
        leashLeader: 0x003DB071, //Serial number of leader
        useSingleTargetSpecial: true, //true , false. Set to true to use a special when only 1 mob is nearby to attack.
            singleTargetSpecial: 'Primary', //'Primary' , 'Secondary'. Set which special is used when only 1 mob is nearby to attack.
        useWhirlwind: true, //true , false. Set to true to use a special when more than 2 mobs are nearby to attack.
            whirlwindSpecial: 'Secondary', //'Primary' , 'Secondary'. Set which special is used when more than 2 mobs are nearby to attack.
        useMomentumStrike: true, //true , false. Set to true to use momentum strike when exactly 2 mobs are nearby to attack.
        useEnemyOfOne: false, //true , false.
        useCounterAttack: true, //true , false.
        useConsecrateWeapon: false, //true , false.
        useDivineFury: false, //true , false.
        useAutoLoot: false, //true, false.
        useConfidence: false, //true , false.
            useConfidenceThresholdPercent: 90, //Percentage of self HP to attempt to cast confidence
        useBandieSelf: false, //true , false.
            useBandieSelfThresholdPercent: 80, //Percentage of self HP to attempt to use bandage on self
        useBandieOthers: false, //true , false.
            useBandieOtherThresholdPercent: 75, //Percentage of other's HP to attempt to use bandage on others
        useDiscordPush: true,  //true , false. Set to true to use Discord notifications for JournalScan
            discordHook: '887268637315047444', //Put Discord WebHook here
            discordKey: 'SJfWniY7dpD9URmrvXSPb3EFs7DzrZiVH5_Wd4f16Tg695utEVXeLc7quvb8Gwjmg_0Z', //Put Discord Bot Key here
        journalScanType: '', //'GM' 'Control Messages', 'Equipment Damage'
        };

function Gyoza()
	{
	var layers = [-44, -25]
	Orion.WaitForAddObject("boop")
	var x = SelectedTile.X()
	var y = SelectedTile.Y()
	var gump = Orion.GetGump('0x0000028C');
	if (gump !== null)
		{
		gump.Select(Orion.CreateGumpHook(2));
		Orion.Wait(100);
		}
	var gyozas = Orion.FindTypeEx(0x28A9,1159,ground,"item","xyz: " + x + ", " + y)
	while(true)
		{
		for(var i = 0; i < gyozas.length; i++)
			{
			if(gyozas[i].Z() != (-25 - (i * 19)))
				{
				Orion.WaitForTarget(2000)
				Orion.TargetObject(gyozas[i].Serial())
				}
			}
		Orion.Wait(50)
		}
	}

function Runes()
	{
	var runes = Orion.FindTypeEx(0x0E5C,1159,ground,"item",16)
	while(true)
		{
		for(var i = 0; i < runes.length; i++)
			{
			if(runes[i].Z() != 25)
				{
				Orion.WaitForTarget(2000)
				Orion.TargetObject(runes[i].Serial())
				}
			}
		Orion.Wait(50)
		}
	}

//Available Gumps
//AliVSGump
//AliLootGump
//AliStringSearchGump


//AliBODGump TODO
//AliImbueGump TODO
//AliTrainingGump TODO

//Task Scripts
//AliIDOC TODO



// Recommended Hotkeys:
// QoL
//  AttackNearest
//  GatherMobs
//  RepairGear
//  FindOwnCorpse


function terminateScripts()
	{
	Orion.Terminate('all')
	}