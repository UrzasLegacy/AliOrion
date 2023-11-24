/*************************************************************************************
 *  Script  : Altiric's Amazing All-Skills Trainer
 *  Author  : Altiric
 *  Contact : Altiric@gmail.com
 *  Created : Oct 27, 2023
 *  Modified: Nov 15, 2023
 *  Version : 1.0
 * 
 *  Featurs:
 *      -Train skills with the click of a button!
 *      -Automatically uses Alacrity scrolls from backpack for skill if any exist
 *      -Siege Compatible: If you know, you know. Just keep one in your backpack
 * 
 *************************************************************************************/
const items = {
    instruments: '0x0E9D|0x0E9C|0x0EB2'
}

const display = {
    index: 10000,   // display Serial
    serial_count: Shared.GetVar('serial_count', 12000),
    noclose: true,     // NoClose true/false
    background: 0x13BE, // Background impage

    serial: function() { // Get an increase serial count
        return ++this.serial_count;
    },

    create: function(menu, width, height, title) { // Create a new display
        this.menu = menu;
        this.menu.Clear();   // Clear current display
        this.menu.SetCallback('process'); // Add callback function
        this.menu.SetNoClose(this.noclose); // Set noclose
        this.menu.AddResizepic(0, 0, this.background, width, height, this.serial()); // Add background image
        this.menu.AddGlobalColor(1, '#F6F6F6');
        this.box(10, 10, (width - 40), 20, title, 400); // Add title box
        this.button( 0, 345, 5, 'minimize', "", 1111, null, '0x13BA', '0x13BA', '0x13BB')
        this.menu.AddTooltip("Minimize");
        this.button(0, 365, 5, 'close', "", 1112, null, '0x13BC', '0x13BC', '0x13BD');
        this.menu.AddTooltip("Close");
        return this; // Return for chainin
    },

    text: function(x, y, text, color, width) { // Add text to display
        this.menu.AddText(x, y, color ? color : '0x7FA', text, width ? width : 250, this.serial());
        return this;
    },

    button: function(button, x, y, label, text, buttonCode, color, show, hover, click, width) {
        if (!buttonCode) {
            Orion.Print("Button serial code must be provided for " +label);
            return;
        }
        show = show ? show : 0xFA5;
        hover = hover ? hover : 0xFA6;
        click = click ? click : 0xFA7;

        if (button !== 0) {
            this.menu.AddButton(buttonCode, x, y, show, hover, click, '0x0000', 0, button);
        } else {
            this.menu.AddButton(buttonCode, x, y, show, hover, click, '0x0000');
        }
        this.menu.AddTooltip(text);
        this.text((x + 35), y, text, color);
        
        var buttonFunctionMapping = JSON.parse(Shared.GetVar('buttonFunctionMapping', '{}'));
        buttonFunctionMapping[buttonCode] = label;
        Shared.AddVar('buttonFunctionMapping', JSON.stringify(buttonFunctionMapping));

        return this;
    },

    box: function(x, y, width, height, title, id, length){ // Add a box to the display
        this.menu.AddGumpPic(x, y, 0xA40, 0x0000, id ? id : this.serial(), 0x0000, width, height);
        this.menu.AddCheckerTrans(x, y, width, height, id ? id : this.serial());
        this.text((x+80), y, title, null, length);
        return this;
    },

    addpage: function(page){ // Add a page to the display
        this.menu.AddPage(page);
        return this;
    },

    setpage: function(page){  // Set the current page
        this.menu.SetPage(page);
        return this;
    },

    combobox: function(id, x, y, entries) {
        var defaultBackground = "0x3000";
        var defaultCompositeBackground = 0;
        var defaultOpenGraphic = "0x3001";
        var defaultWidth = 200;
        var defaultTextOffsetY = 0;
        var defaultShowItemsCount = 5;
        var defaultCenterMaximized = 0;

        this.menu.AddComboBox(id, x, y, defaultBackground, defaultCompositeBackground, defaultOpenGraphic, defaultWidth, defaultTextOffsetY, defaultShowItemsCount, defaultCenterMaximized);

        // Add text entries to the comboBox
        for (var i = 0; i < entries.length; i++) {
            this.comboboxtext(entries[i]);
        }

        return this;
    },

    comboboxtext: function(text, color, selected, width, align) {
        color = color || "0";  // Default color
        selected = selected || 0;  // Default selected state
        width = width || 200;  // Default width
        align = align || "left";  // Default text alignment

        this.menu.AddComboBoxText(text, color, selected, width, align);

        return this;
    },

    update: function() { // Update the display
        this.menu.Update();
        return this;
    }
};

function close_display(_internal){
    const menu = Orion.CreateCustomGump(display.index);
    menu.Close();
}

function process(_internal) { // Process the gump
    const button = CustomGumpResponse.ReturnCode();
    var buttonFunctionMapping = JSON.parse(Shared.GetVar('buttonFunctionMapping', '{}')); // Get the button function mapping

    if(button === 1111){
        var data = Shared.GetVar('data', {default_height: 350, default_minimized: 145});
        const height = data.height || data.default_height;
        const mini = data.minimized || data.default_minimized;
        if(data.height === height){
            data.height = mini;
        } else {
            data.height = height;
        }
        Shared.AddVar('data', data);
        show_display();
        return;
    } else if(button === 1112){
        Orion.Terminate('train_skill');
        close_display();
    } else if (button === 1004) {
        display_skill_selection(); // Call the skill selection display when the new button is clicked
        return;
    } else if (button === 5007) {
        var selectedSkills = [];
        for (var i = 0; i < 7; i++) {
            var skillIndex = CustomGumpResponse.GetComboBoxSelectedIndex(5000 + i);
            if (skillIndex >= 0) { // -1 means no selection
                selectedSkills.push(skillNames[skillIndex]);
            }
        }
        train_selected_skills(selectedSkills); // Function to initiate training of selected skills
        return;
    }
    
    if (buttonFunctionMapping.hasOwnProperty(button)) { // Check if the button serial code is in the mapping
        const label = buttonFunctionMapping[button]; // Get the button function
        
        switch(label){
            case 'clear_data':
                Shared.ClearVars();
                Shared.ClearArrays();
                Orion.RemoveTimer('training');
                show_display();
                break;
            case 'stop_training':
                Shared.AddVar('skill_action',"Training Stopped");
                Orion.Terminate('train_skill');
                show_display();
                break;
            default:
                Orion.Exec('train_skill', true, label);
                break;
        }
    }
}

const skill_table = {
    "Anatomy": {
        button: 202,
        execute: function(){
            const target = get_object('target');
            if(!Orion.ObjectExists(target.Serial())){
                Orion.Print(0xEE, "Missing Target");
                Shared.AddVar('skill_action',"Target Missing");
                Shared.AddVar('skill_failed', true);
            }
            Orion.WaitTargetObject(target.Serial());
            Orion.UseSkill('Anatomy');
            set_timer('anatomy', 2500);
            Orion.Wait(2000);
        }
    },

    'Swordsmanship': {
        button: 241,
        execute: function(){
            const target = get_object('target');
            const start = {x: Player.X(), y: Player.Y(), z: Player.Z()}
            
            Orion.Print("Combat routine");
            if(target){
                const current_skill = Orion.SkillValue('Swordsmanship');

                if(Player.Hits('%') < 75 || target.Hits('%') < 75 && !Player.WarMode()){
                    Shared.AddVar('show_skill', "Need Health");
                    Orion.Wait(1000);
                    show_display();
                } else if(Orion.ClientLastAttack() === '0x00000000'){
                    if((this_is_siege() && !Orion.BuffExists('Heat of Battle')) || !this_is_siege()){
                        Shared.AddVar('skill_action', "Attacking: " +target.Name());
                        show_display();
    
                        Orion.WalkTo(target.X(), target.Y(), target.Z(), 1, 0, 0);
                        Orion.SetTimer('attack');
                        Orion.Attack(target.Serial());
                        Orion.Wait(100);
                    }
                }

                if(Player.Hits('%') < 25 || target.Hits('%') < 25){
                    Shared.AddVar('skill_action', "Too Damaged");
                    Orion.WalkTo(start.x, start.y, start.z, 0, 0, 1);
                    Orion.Wait(100);
                    Orion.WarMode(false);
                }

                if(target.Distance() > 1 && Player.WarMode())
                    Orion.WarMode(false);

                if(this_is_siege()){
                    while(Orion.SkillValue('Swordsmanship') === current_skill && target.Hits('%') > 25 && Player.Hits('%') > 25 && Orion.Timer('attack') < 15000)
                        Orion.Wait(100);
                    Shared.AddVar('skill_action', "Retreating");
                    show_display();
                    Orion.WalkTo(start.x, start.y, start.z, 0, 0, 1);
                    Orion.Wait(100);
                    Orion.WarMode(false);
                }

                Orion.Wait(250);
            } else {
                Shared.AddVar('skill_action', "Unable to find target");
                Shared.AddVar('skill_failed', true);
                show_display();
            }
        }
    },

    'Chivalry': {
        execute: function(){
            if(Player.Mana('%') < 25 || Player.Mana() < 25){
                while(Player.Mana('%') < 95)
                    Orion.Wait(100);
            }
            var skill = Orion.SkillValue('Chivalry');
            if(skill < 300)
                Orion.Cast('remove curse');
            else if(skill >= 300 && skill < 450)
                Orion.Cast('consecrate weapon');
            else if(skill >= 450 && skill < 600)
                Orion.Cast('divine fury');
            else if(skill >= 600 && skill < 700)
                Orion.Cast('enemy of one');
            else if(skill >= 700 && skill < 900)
                Orion.Cast('Holy Light');
            else
                Orion.Cast('Noble Sacrifice');

            Orion.Wait(3000);
            
            Orion.Wait(500);
        }
    },

    "Detecting Hidden": {
        button: 215,
        execute: function(){
            if(Orion.SkillValue('Detecting Hidden') < 700){
                const chest = Orion.FindTypeEx(any, any, ground, 'item|InLOS', 10)
                    .filter(function(item){ return item.Properties().match(/chest/i) })
                    .shift();
            } else {
                const chest = get_object('target');
            }

            if(chest){
                Orion.WaitTargetObject(chest.Serial());
                Orion.UseSkill('Detecting Hidden');
                set_timer('Detecting Hidden', 11000)
            } else {
                Shared.AddVar('skill_action',"No chests");
                Shared.AddVar('skill_failed', true);
            }
        }
    },

    "Discordance": {
        button: 0,
        execute: function(){
            if(!Shared.GetVar('instrument', false) || !Orion.FindObject(Shared.GetVar('instrument'))){
                var inst = Orion.FindType(items.instruments).shift();
                Orion.Print("Using new instrument");
                Orion.UseObject('inst');
                Orion.Wait('useitemdelay');
                Shared.AddVar('instrument', inst);
            }

            const target = get_object('target');
            if(!Orion.ObjectExists(target.Serial())){
                Orion.Print(0xEE, "Missing Target");
                Shared.AddVar('skill_action',"Target Missing");
                Shared.AddVar('skill_failed', true);
            }
            Shared.AddVar('skill_action', "Discording Target");
            show_display();
            Orion.WaitTargetObject(target.Serial());
            Orion.UseSkill('Discordance');
            set_timer('discordance', 8000);
        }
    },

    "Hiding": {
        execute: function(){
            Orion.UseSkill('Hiding');
            set_timer('Hiding', 10000);
        } 
    },

    "Magery": {
        execute: function(){
            var spell_table = [
                { name: 'heal',         max: 300,   mana: 10 },
                { name: 'bless',        max: 450,   mana: 15 },
                { name: 'greater heal', max: 550,   mana: 20 },
                { name: 'magic reflection', max: 650,   mana: 25 },
                { name: 'reveal',       max: 750,   mana: 30 },
                { name: 'mass dispel',  max: 900,   mana: 35 },
                { name: 'Earthquake',   max: 1200,  mana: 40 }
            ];
            cast_spell('Magery', spell_table);
        }
    },

    'Musicianship': {
        execute: function(){
            var instrument = Orion.FindType(items.instruments).shift();
            if(!instrument){
                Shared.AddVar('skill_action', "Out of instruments");
                Shared.AddVar('skill_failed', true);
            }
            Orion.UseObject(instrument);
            Orion.Wait('useitemdelay');
        }
    },

    "Mysticism": {
        execute: function(){
            var spell_table = [
                { name: 'purchase',         max: 400,   mana: 10 },
                { name: 'stone form',       max: 630,   mana: 10 },
                { name: 'cleansing winds',  max: 800,   mana: 15 },
                { name: 'hail storm',       max: 950,   mana: 20 },
                { name: 'nether cyclone',   max: 1200,  mana: 25 },
            ];
            cast_spell('Mysticism', spell_table);
        }
    },

    "Necromancy": {
        button: 250,
        execute: function(){
            var spell_table = [
                { name: 'curse weapon',     from: 0, to: 350,  mana: 10 },
                { name: 'evil omen',        from: 350, to: 400, mana: 20 },
                { name: 'pain spike',       from: 400, to: 500, mana: 15 },
                { name: 'horrific beast',   from: 500, to: 700,   mana: 20 },
                { name: 'wither',           from: 700, to: 900,   mana: 25 },
                { name: 'lich form',        from: 900, to: 1000,  mana: 30 },
                { name: 'vampiric embrace', from: 1000, to: 1200,  mana: 40 }
            ];
            cast_spell('Necromancy', spell_table);
        }
    },

    'Peacemaking': {
        execute: function(){
            var instrument = Orion.FindType(items.instruments).shift();
            if(!instrument){
                Shared.AddVar('skill_action', "Out of instruments");
                Shared.AddVar('skill_failed', true);
            }

            if(Orion.DisplayTimerExists('peacemaking')){
                if(Orion.SkillValue('Musicianship') < Orion.SkillValue('Musicianship', 'cap')){
                    Shared.AddVar('skill_action', "Play Instrument");
                    Orion.UseObject(instrument);
                    Orion.Wait('useitemdelay');
                } else
                    Shared.AddVar('skill_action', "Waiting for Timer");
            } else {
                Shared.AddVar('skill_action', "Area Peacemaking");
                Orion.WaitTargetObject('self');
                Orion.UseSkill('Peacemaking');
                if(Orion.WaitJournal("What instrument shall you play", Orion.Now(), Orion.Now()+1200)){
                    Orion.UseObject(instrument);
                    Orion.Wait('useitemdelay');
                }
                if(Orion.InJournal("You play poorly|You attempt to calm everyone")){
                    set_timer('Peacemaking', 6000);
                    Orion.ClearJournal("You play poorly|You attempt to calm everyone");
                } else if(Orion.InJournal("You play hypnotic music|You play your hypnotic music")){
                    set_timer('Peacemaking', 10000);
                    Orion.ClearJournal("You play hypnotic music|You play your hypnotic music");
                }
            }
        }
    },

    "Stealth": {
        execute: function(){
            if(Orion.SkillValue('Hiding') < 300)
                train_skill('Hiding', 300);

            function hide(_internal){
                if(!Player.Hidden()){
                    Orion.UseSkill('Hiding');
                    Orion.Wait(600);
                }
            }
            hide();
            
            const dirs = [
                {x: -2, y: 2},
                {x: -2, y: -2},
                {x: 2, y: 2},
                {x: 2, y: -2}
            ];

            const start = {x: Player.X(), y: Player.Y(), z: Player.Z()};
            dirs.filter(function(tile){ return Orion.GetTiles('land', Player.X()+tile.x, Player.Y()+tile.y)[0] })
                .forEach(function(dir){
                    Orion.WalkTo(Player.X()+dir.x, Player.Y()+dir.y, Player.Z(), 0, 255, 0);
                    Orion.Wait(100);
                    Orion.WalkTo(start.x, start.y, start.z, 0, 255, 0);
                    Orion.Wait(100);
                });
            }
    }
};

function cast_spell(skill_name, spell_table) {
    var current_skill = Orion.SkillValue(skill_name);
    var spell_to_cast = null;

    const spell_to_cast = spell_table.filter(function(spell){
        return current_skill >= spell.from && current_skill < spell.to;
    }).shift();

    if (spell_to_cast && !Player.Frozen()) {
        check_meditation(spell_to_cast.mana);

        Shared.AddVar('skill_action', spell_to_cast.name);
        show_display();

        Orion.WaitTargetObject(Player.Serial());
        Orion.SetTimer('casting');
        Orion.Print(0x0044, "Casting: " +spell_to_cast.name);
        Orion.Cast(spell_to_cast.name);
        if(!Player.Frozen())
            Orion.Wait(2500);
        while (Player.Frozen()){
            if(Orion.Timer('casting') >= 1000){
                show_display();
                Orion.SetTimer('casting');
            }
            Orion.Wait(10);
        }
        show_display();
        var fcr = (6 - Player.FCR()) / 4 * 1000 + 250;
        if(fcr > 250)
            set_timer('Magery', fcr); // Set a timer for the skill, adjust time as needed
        Orion.Wait(100);
        Orion.Wait(fcr);
    }
}

function alacrity_active(name){
    var buff = Orion.BuffDescription('Arcane Empowerment');
    if(!buff) return false;
    return Orion.Contains(buff, name);
}

function format_time(ms) {
    var seconds = Math.floor(ms / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);

    var sec = seconds % 60;
    var min = minutes % 60;
    var hr = hours;

    return (hr < 10 ? '0' : '') + hr + ':' + 
           (min < 10 ? '0' : '') + min + ':' + 
           (sec < 10 ? '0' : '') + sec;
}

function clear_data(_internal){
    Shared.ClearVars();
    Shared.ClearArrays();
    Orion.RemoveObject('target');
    Orion.RemoveObject('secure');
    Orion.Wait(100);
    show_display();
}

function train_skill(skill_name, cap) {
    Orion.Print("Training " +skill_name);
    var object = null;
    
    Shared.AddVar('skill_name', skill_name);
    var current_value = Orion.SkillValue(skill_name);
    const cap = cap ? cap : Orion.SkillValue(skill_name, 'cap');
    
    Shared.AddVar('starting_skill', current_value);
    Shared.AddVar('current_skill', current_value);

    Orion.SetTimer('training');
    
    Orion.Print("Training to cap: " +cap);
    while (Orion.SkillValue(skill_name) < cap && !Shared.GetVar('skill_failed', false)) {
        training_value = Orion.SkillValue(skill_name);
        wait_timer(skill_name);
        alacrity_check(skill_name);
        skill_table[skill_name].execute();

        Shared.AddVar('current_skill', Orion.SkillValue(skill_name));
        if(Orion.SkillValue(skill_name) >= 700 && Orion.SkillValue(skill_name) > training_value){
            soulStone(skill_name, skill_table[skill_name].button);
        }
        show_display();
    }
    if(Shared.GetVar('skill_failed'))
        Orion.Print(0xEE, "Skill failed for some reason");
    Shared.AddVar('skill_action',"Training Complete");
    show_display();
}

function wait_timer(skill){
    while(Orion.DisplayTimerExists(skill.toLowerCase())){
        Shared.AddVar('skill_action', "Timer Active");
        Orion.Wait(1000);
        show_display();
    }
}

function alacrity_check(skill){
    const scroll = get_alacrity(skill);
    if(scroll && !alacrity_active(skill)){
        Orion.UseObject(scroll.Serial());
        Orion.Wait('useitemdelay');
    }
}

function get_skill_details(skill){
    for (var i = 0; i < skill_table.length; i++){
        if (skill_table[i].name === skill)
            return skill_table[i];
    }
    return null;
}

function check_meditation(mana){
    if(Player.Mana() >= mana || Player.MaxMana() < mana) return true;
    if(Orion.SkillValue('Meditation') > 0){
        Shared.AddVar('skill_action',"Meditating");
        while(Player.Mana('%') < 90){
            Shared.AddVar('skill_action',"Meditating");
            if(!Orion.BuffExists('Meditation') && !Orion.DisplayTimerExists('meditation')){
                Orion.UseSkill('Meditation');
                set_timer('meditation', 12000);
            }
            show_display();
            Orion.Wait(1000);
        }
    } else {
        while(Player.Mana('%') < 90){
            Shared.AddVar('skill_action',"Waiting for mana");
            show_display();
            Orion.Wait(1000);
        }
    }
}

function get_alacrity(name) {
    return Orion.FindTypeEx('0x0EED', '0x00EE', backpack)
        .filter(function(scroll) { return Orion.Contains(scroll.Properties(), name); })
        .shift();
}

function set_timer(skill, timer){
    Orion.AddDisplayTimer(skill.toLowerCase(), timer, 'UnderChar', 'Line|Bar', skill, 0, 0, 'any', -1, '0x0000FFFE');
    Orion.Wait(600);
}

function process(_internal) { // Process the gump
    const button = CustomGumpResponse.ReturnCode();
    Orion.Print("Button: " +button);
    var buttonFunctionMapping = JSON.parse(Shared.GetVar('buttonFunctionMapping', '{}')); // Get the button function mapping

    if(button === 1111){
        var data = Shared.GetVar('data', {});
        if(data.height === 350)
            data.height = 145;
        else
            data.height = 350;
        Shared.AddVar('data', data);
        show_display();
        return;
    } else if (button === 1004) {
        display_skill_selection(); // Call the skill selection display when the new button is clicked
        return;
    } else if (button === 5007) {
        var selectedSkills = [];
        for (var i = 0; i < 7; i++) {
            var skillIndex = CustomGumpResponse.GetComboBoxSelectedIndex(5000 + i);
            if (skillIndex >= 0) { // -1 means no selection
                selectedSkills.push(skillNames[skillIndex]);
            }
        }
        train_selected_skills(selectedSkills); // Function to initiate training of selected skills
        return;
    }
    
    if (buttonFunctionMapping.hasOwnProperty(button)) { // Check if the button serial code is in the mapping
        const label = buttonFunctionMapping[button]; // Get the button function
        Orion.Print("Button Mapping: " +label);
        
        switch(label){
            case 'clear_data':
                Shared.ClearVars();
                Shared.ClearArrays();
                Orion.RemoveTimer('training');
                show_display();
                break;
            case 'stop_training':
                Shared.AddVar('skill_action',"Training Stopped");
                Orion.Terminate('train_skill');
                show_display();
                break;
            default:
                Orion.Exec('train_skill', true, label);
                break;
        }
    }
}

function soulStone(skill, button){
    if(!Orion.ShardName() === "Siege Perilous") return;
    Orion.Print("Stoning: " +skill +" Button: " +button);
    const soul_stone = Orion.FindType('0x32F3|0x32F4|0x2ADC', any, backpack).shift();
    if(!soul_stone) return;
    Shared.AddVar('skill_action', "Stone Swap");
    
    if(!Player.IsHuman()){
        Shared.AddVar('skill_action', "Not Human");
        Shared.AddVar('skill_failed', true);
    }

    if(Orion.BuffExists('Heat of Battle')){
        Shared.AddVar('skill_action', "Heat of Battle");
        set_timer('Combat', 121000);
        while(Orion.BuffExists('Heat of Battle')){
            if(Player.WarMode())
                Orion.WarMode(false);
            Orion.Wait(1000);
            show_display();
        }
    }

    Shared.AddVar('skill_action', "Soul Stone Swap");
    show_display();
    while(Orion.SkillValue(skill) > 0){
        Orion.CancelWaitGump();
        Orion.SetSkillStatus(skill, 'down');
        Orion.UseObject(soul_stone);
        Orion.WaitGump(Orion.CreateGumpHook(button));
        Orion.WaitGump(Orion.CreateGumpHook(402));
        Orion.Wait('useitemdelay');
    }
    while(Orion.SkillValue(skill) < 700){
        Orion.CancelWaitGump();
        Orion.SetSkillStatus(skill, 'up');
        Orion.UseObject(soul_stone);
        Orion.WaitGump(Orion.CreateGumpHook(602));
        Orion.Wait('useitemdelay');
    }
}

function get_object(name){
    var object = Orion.FindObject(name);
    if(!object){
        Orion.Print("Select " +name);
        const result = Orion.WaitForAddObject(name);
        if(result === 1){
            return Orion.FindObject(name);
        } else {
            Orion.RemoveObject(name);
            Orion.Print("Invalid Target");
        }
    } else {
        return object;
    }
}

function this_is_siege(_internal){
    return Orion.ShardName() === "Siege Perilous";
}

function get_sorted_skills(_internal) {
    var skills = [];
    for (var key in skill_table) {
        var new_object = { name: key };
        for (var prop in skill_table[key]) {
            new_object[prop] = skill_table[key][prop];
            new_object[prop].name = prop;
        }
        skills.push(new_object);
    }
    skills.sort(function(a, b) { return a.name.localeCompare(b).name; });
    return skills;
}

function get_skill_data(_internal) {
    return {
        name: Shared.GetVar('skill_name', 0),
        start: Shared.GetVar('starting_skill', 0),
        current: Shared.GetVar('current_skill', 0), 
        action: Shared.GetVar('skill_action', 'Ready'),
        timer: Orion.TimerExists('training') ? Orion.Timer('training') : 0
    };
}

function show_display(_internal){
    var data = Shared.GetVar('data', {height: 350});
    const menu = Orion.CreateCustomGump(display.index);
    var skills = get_sorted_skills();

    const buttons_per_page = 7;
    const total_pages = Math.ceil(skills.length / buttons_per_page);

    display.create(menu, 400, data.height, "ALTIRIC'S AMAZING ALL-SKILLS TRAINER");

    if(data.height >= 300){
        display.box(10, 35, 175, 200, "MENU")
            .button(1, 15, 55, 'select_skill', "Choose Skill", 1001)
            .button(0, 15, 75, 'clear_data', "Clear Skill Data", 1002)
            .button(0, 15, 95, 'stop_training', "Stop Training", 1003)
    }

    var skill = get_skill_data();
    var y = data.height >= 300 ? 260 : 55;
    display.box(10, data.height >= 300 ? 240 : 35, 380, 100, Shared.GetVar('skill_name', false) ? "TRAINING " +Shared.GetVar('skill_name').toUpperCase() : "", 380);

    if(skill.name){
        display.text(15, y, "Starting Skill:")
            .text(105, y, (skill.start/10).toFixed(1))
            .text(15, y+15, "Current Skill:")
            .text(105, y+15, (skill.current/10).toFixed(1))
            .text(15, y+30, "Total Gains:")
            .text(105, y+30, Math.floor(skill.current - skill.start))
            .text(15, y+45, "Training Time:")
            .text(105, y+45, format_time(Orion.TimerExists('training') ? Orion.Timer('training') : 0))
            .text(225, y, "Gains Per Min:")
            .text(325, y, ((skill.current - skill.start) / (Orion.Timer('training') / 60000)).toFixed(1))
            .text(225, y+15, "Gains Per Hr:")
            .text(325, y+15, ((skill.current - skill.start) / (Orion.Timer('training') / 60000 / 60)).toFixed(1))
            .text(225, y+30, "Alacrity:")
            .text(280, y+30, alacrity_active(skill.name) ? "Active" : "No Scrolls")
            .text(225, y+45, "Action:")
            .text(280, y+45, skill.action);
    }

    if(data.height >= 300){
        display.box(190, 35, 200, 200, "SKILLS")
            
        for (var page = 1; page <= total_pages; page++) {
            var start_idx = (page - 1) * buttons_per_page;
            var end_idx = Math.min(start_idx + buttons_per_page, skills.length);
            var y = 55;

            display.addpage(page);
                    
            for (var i = start_idx; i < end_idx; i++) {
                const skill_info = skills[i];
                display.button(0, 195, y, skill_info.name, skill_info.name, 2000+page+i, skill_info.execute ? null : 0x7EE, '0xFAB', '0xFAD', '0xFAC');
                y += 20;
            }
                    
            if (page > 1) display.button(page - 1, 195, 210, 'previous_page', "Prev", 3000+page+i, null, '0xFAE', '0xFB0', '0xFAF');
            if (page < total_pages) display.button(page + 1, 325, 210, 'next_page', "Next", 3001+page+i);
        }
    }
    display.update();
}

function Autostart(){
    show_display();
}