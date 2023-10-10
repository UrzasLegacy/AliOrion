var gump = Orion.CreateCustomGump(15659);

var pet = ' ';
const skillTree = {
	'Animal Taming': ['Animal Taming', 'Combat Training', '0x00112333', 1, 'targetPet'],
	'Provocation': ['Provocation', 'Inspire', ' ', ' ', ' ', ' '],
	'Peacemaking': ['Peacemaking', 'Resilience', ' ', ' ', ' ', ' '],
	'Discordance': ['Discordance', 'Tribulation', ' ', ' ', 'targetSelf'],
	};
var selectedSkill = ' ';
		
useMeditation = ' ';
var lowMana = 40;



function menu() {

	//Button States
	var states = {
	1: Shared.GetVar('state1', '0x9C4E'),
	2: Shared.GetVar('state2', '0x9C4E')
	}

	gump.Clear()
	
	var itemSerial = 0;
	
	//Not closeable with right mouse click
	gump.SetNoClose(false);

	//Set callback function
	gump.SetCallback('Callbacks');

	//Background
	gump.AddResizepic(0, 0, '0x00E10', 250, 120);
	gump.AddText(60, 20, '47', "Anon' Mastery Trainer");
	gump.AddGumpPic(200, 55, '0x2C4C')
	
	//ComboBox
	gump.AddComboBox(100, 15, 75, '0x0BB8', 0, '0x0BB8', 125, -3);
	gump.AddComboBoxText('Provocation', ' ', Shared.GetVar('selectedSkill') === 'Provocation' ? 1 : 0);
	gump.AddComboBoxText('Peacemaking',  ' ', Shared.GetVar('selectedSkill') === 'Peacemaking' ? 1 : 0);
	gump.AddComboBoxText('Discordance', ' ', Shared.GetVar('selectedSkill') === 'Discordance' ? 1 : 0);
	gump.AddComboBoxText('Animal Taming', ' ', Shared.GetVar('selectedSkill') === 'Animal Taming' ? 1 : 0);
	//gump.AddComboBoxText('Provocation');
	//gump.AddComboBoxText('Peacemaking');
	//gump.AddComboBoxText('Discordance');
	//gump.AddComboBoxText('Animal Taming');
	
	//Meditation CheckBox
	gump.AddResizepic(15, 45, '0x0BB8', 125, 20);
	gump.AddText(20, 45, '60', "Use Meditation?");
	gump.AddButton(1, 160, 45, states[1], states[1], 0x9C4F, '0x0000', 1);
	gump.AddTooltip('Use meditation?');
	
	//Start/Stop Checkbox Button
	gump.AddButton(2, 160, 75, states[2], states[2], 0x9C4F, '0x0000', 1);
	gump.AddTooltip('Start/Stop');
	
	//Close Button
	gump.AddButton(3, 215, 17, '0x3', '0x3', '0x4', '0x0000', 1);
	gump.AddTooltip('Close menu.');

	//Help Button
	//	gump.AddButton(3, 15, 20, '0xFBD', '0xFBE', '0xFBF', '0x0000', 1);
	//	gump.AddTooltip('Help');
		
	gump.Update()
}

function Callbacks() {
	var code = CustomGumpResponse.ReturnCode();
	var state1 = Shared.GetVar('state1', '0x9C4E'); // Shared variable to set the initial state to off (Unchecked)
	var state2 = Shared.GetVar('state2', '0x9C4E'); // Shared variable to set the initial state to off (Unchecked)
	
	Orion.Print('Custom gump response code = ' + code);
	
	//Handle ComboBox Response
	var comboBoxResponse = CustomGumpResponse.ComboBox(100);
	if (comboBoxResponse !== null) {
		if (comboBoxResponse == 0) {
			Shared.AddVar('selectedSkill', 'Provocation');
			Orion.Print('Selected skill is now: ' + selectedSkill);
		} else if (comboBoxResponse == 1) {
			Shared.AddVar('selectedSkill', 'Peacemaking');
			Orion.Print('Selected skill is now: ' + selectedSkill);
		} else if (comboBoxResponse == 2) {
			Shared.AddVar('selectedSkill', 'Discordance');
			Orion.Print('Selected skill is now: ' + selectedSkill);
		} else if (comboBoxResponse == 3) {
			Shared.AddVar('selectedSkill', 'Animal Taming');
			Orion.Print('Selected skill is now: ' + selectedSkill);
		}
	}	
	if (code == 1) {
		if(state1 == '0x9C4E') {
			Shared.AddVar('state1', '0x9C4F');
			useMeditation = true;
			Orion.Print('63', 'useMeditation: ' + useMeditation);
		} else {
			Shared.AddVar('state1', '0x9C4E'); 
			useMeditation = false;
			Orion.Print('132', 'useMeditation: ' + useMeditation);
			}
		menu()
		}
	else if (code == 2) {
		if(state2 == '0x9C4E') {
			Shared.AddVar('state2', '0x9C4F');
			Orion.Exec('masteryTrainer');
			Orion.Print('63', 'masteryTrainer' + ': ON');
		} else {
			Shared.AddVar('state2', '0x9C4E'); 
			Orion.Terminate('masteryTrainer');
			Orion.Print('132', 'masteryTrainer' + ': OFF');
		}
	menu()
	}
	else if (code == 3) {
		gump.Close()
		if (Orion.ScriptRunning('Callbacks')) {
			Orion.ToggleScript('Callbacks');
			Orion.Wait(500)
		}
	}
	//	else if (code == 3) {                ------------------Help Button for later
	//	}	
}

function masteryTrainer() {
	selectedSkill = Shared.GetVar('selectedSkill');
	useMeditation = Shared.GetVar('useMeditation');
	
	var skillInfo = skillTree[selectedSkill];
	var spell = skillInfo[1];
	var gumpId = skillInfo[2];
	var gumpButton = skillInfo[3];
	var targetMode = skillInfo[4];
	var SkillName = skillInfo[0];
	var SkillValue = Orion.SkillValue(SkillName, 'real')
	var SkillCap = Orion.SkillValue(SkillName, 'cap')
	Orion.Print(SkillName);
	Orion.Print(SkillValue);
	Orion.Print(SkillCap);
	while (true) {
	//while (SkillValue < SkillCap) {
		if (useMeditation && Player.Mana() < lowMana) {
			Meditate();
		}
		
		if (targetMode === 'targetPet') {
			// Select pet only if the skill requires it.
			var pets = Orion.FindTypeEx('any', 'any', 'ground', 'nothuman');
			var pet = ' ';

			// Iterate over all found pets
			for (var i = 0; i < pets.length; i++) {
				var currentPet = pets[i];
				var properties = currentPet.Properties();

				if (Orion.Contains(currentPet.Properties(), "\n" + "(bonded)")) {
					pet = currentPet; // Set the current pet as the pet variable
					break; // Exit the loop as we've found a suitable pet
				}
			}

			if (!pet) {
				Orion.Print("No tamed or bonded pets found.");
				return;
			}

		var target = currentPet.Serial();
		}
	if (!Player.Frozen()) {
		Orion.Cast(spell);
		if (Orion.WaitForTarget(2000)) {
			Orion.TargetObject(target);
		}
	}
	if (Orion.WaitForGump(1000)) {
		var gump0 = Orion.GetGump('last');
		if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === gumpId)) {
			gump0.Select(Orion.CreateGumpHook(gumpButton));
			Orion.Wait(100);
				}
			}
		}
			Orion.Wait(20);

	if (SkillValue == SkillCap) {
		Orion.Print("Congratulations!  Your " + selectedSkill + " skill cap has been reached at " + SkillValue/10);
	}
}

function Meditate() {
	var lowMana = 40;
	while(Player.Mana('%') < 100 && !Orion.BuffExists('Meditation')) {
		Orion.UseSkill('Meditation');
		Orion.PrintFast(self,1159,0,'Meditating... ' + Player.Mana() + '/' + Player.MaxMana());
		Orion.Wait(1000)
	}
    Orion.WaitJournal('at peace',Orion.Now(),Orion.Now()+30000)
}

