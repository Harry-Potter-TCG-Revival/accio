import json
import re

def clean_adventure_effects(json_file):
    # Load the JSON file
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    changes_made = 0  # Track number of changes

    # Process each item in the JSON list
    for item in data:
        if "Adventure" in item.get("type", []):  # Only process Adventure-type cards
            if "effect" in item and isinstance(item["effect"], list):
                new_effect = []
                for effect in item["effect"]:
                    # Remove lines that start with "to solve:" or "reward:"
                    if not re.match(r"^\s*(to solve:|reward:)", effect, re.IGNORECASE):
                        new_effect.append(effect)

                if len(new_effect) != len(item["effect"]):  # Check if any change was made
                    print(f"Updating '{item['name']}' - Removing 'to solve:' and 'reward:' from 'effect'")
                    item["effect"] = new_effect
                    changes_made += 1

    # Save the modified JSON if changes were made
    if changes_made > 0:
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Updated {changes_made} Adventure cards successfully!")
    else:
        print("No changes were made. Ensure 'effect' contains 'to solve:' or 'reward:' lines.")

# Example usage
clean_adventure_effects("cards.json")
