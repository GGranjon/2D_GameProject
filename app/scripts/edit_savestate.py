import os

absolute_path = os.path.abspath('./data/savestates/savestates.js')
print(absolute_path)
def overwrite_js_file(filename, new_content):
    try:
        # Ouvrir le fichier JavaScript en mode écriture
        with open(filename, 'w') as file:
            # Écrire le nouveau contenu dans le fichier
            file.write(new_content)

        print(f"Successfully overwritten {filename}")
    except Exception as e:
        print(f"An error occurred: {e}")

# Spécifiez le chemin vers le fichier JavaScript que vous souhaitez écraser
js_file = '../data/savestates/savestates.js'

# Le nouveau contenu que vous souhaitez écrire dans le fichier
new_content = "let savestate1 = {money:0, xp: 0, last_place: 'town', last_x_map: 100, last_y_map: 100}\n /*let savestate1 = {money:0, xp: 0, last_place: 'town', last_x_map: map_offsets.town.x, last_y_map: map_offsets.town.y}*/"

# Appeler la fonction pour écraser le fichier JavaScript avec le nouveau contenu
overwrite_js_file(absolute_path, new_content)