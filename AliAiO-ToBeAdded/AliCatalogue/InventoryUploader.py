from google.oauth2.service_account import Credentials
import gspread
import json
import os

test_array = [["Ring","","","","","Resisting Spells 15","","","","","","",25,15,"","",1,8,"",25,10,35]]


def main():
    item_data = retrieve_item_data()
    send_to_google(item_data)


def send_to_google(data):
    scopes = ['https://www.googleapis.com/auth/spreadsheets','https://www.googleapis.com/auth/drive']
    try:
        creds = Credentials.from_service_account_file('C:/Users/Sean/Desktop/UO/Orion Script Backups/VSC Orion Workspace/AliOrion/AliAiO-ToBeAdded/AliCatalogue/uo-item-catalogue-b61a5306332c.json', scopes=scopes)
    except Exception as e:
        print("Couldn't open file: ", e)

    client = gspread.authorize(creds)
    sheet = client.open("Item Catalogue").worksheet("Dataset")

    data = retrieve_item_data()
    range_start = 'A2'
    sheet.update(range_name=range_start, values=data)


def retrieve_item_data():
    dir_path = os.path.dirname(os.path.realpath(__file__))
    file_path = os.path.join(dir_path, "AliSpreadsheetInventory.JSON")
    out_data = []

    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    for serial in data:
        row_data = format_jewelry_propObj_for_google_sheets(data[serial],serial)
        out_data.append(row_data)

    return out_data


def format_jewelry_propObj_for_google_sheets(parse,serial):
    print(parse)
    skill_groups = ["", "", "", "", ""]
    skill_group_checks = [
        "Swordsmanship|Fencing|MaceFighting|Magery|Musicianship",
        "Wrestling|Tactics|AnimalTaming|Provocation|SpiritSpeak",
        "Stealth|Parrying|Meditation|AnimalLore|Discordance|Focus",
        "Stealing|Anatomy|EvaluateIntelligence|Veterinary|Necromancy|Bushido|Mysticism",
        "Healing|ResistingSpells|Peacemaking|Archery|Chivalry|Ninjitsu|Throwing"
    ]

    skill_name_format = {
        "MaceFighting": "Mace Fighting",
        "AnimalTaming": "Animal Taming",
        "SpiritSpeak": "Spirit Speak",
        "AnimalLore": "Animal Lore",
        "EvaluateIntelligence": "Evaluate Intelligence",
        "ResistingSpells": "Resisting Spells"
    }

    for key, value in parse.items():
        for i, skill_group in enumerate(skill_group_checks): 
            skills = skill_group.split('|')
            if key in skills:
                formatted_key = skill_name_format.get(key, key)
                skill_groups[i] = formatted_key + " " + str(value)
                continue

    rowData = [parse.get('itemType', ''),
        skill_groups[0],
        skill_groups[1],
        skill_groups[2],
        skill_groups[3],
        skill_groups[4],
        parse.get('StrengthBonus', ''),
        parse.get('DexterityBonus', ''),
        parse.get('IntelligenceBonus', ''),
        parse.get('ManaIncrease', ''),
        parse.get('StaminaIncrease', ''),
        parse.get('ManaRegeneration', ''),
        parse.get('EnhancePotions', ''),
        parse.get('HitChanceIncrease', ''),
        parse.get('DefenseChanceIncrease', ''),
        parse.get('FasterCastRecovery', ''),
        parse.get('FasterCasting', ''),
        parse.get('LowerManaCost', ''),
        parse.get('SpellDamageIncrease', ''),
        parse.get('LowerReagentCost', ''),
        parse.get('SwingSpeedIncrease', ''),
        parse.get('DamageIncrease', ''),
        serial,
        parse.get('ModCount', ''),
        parse.get('SkillCount',''),
        parse.get('IsClean', ''),
        parse.get('HighScore', ''),
        parse.get('HighTemplate', ''),
        #breadcrumb array
    ]
    
    return rowData

main()