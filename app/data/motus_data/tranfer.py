import csv

def csv_to_js_variable(js_file):
    # Read the CSV file and convert it to a list of lists
    with open("./data/motus_data/final_words.csv", 'r', encoding="utf8", newline='') as file:
        csv_reader = csv.reader(file)
        csv_data = [row for row in csv_reader]

    # Write JavaScript code to create the variable with CSV data
    with open(js_file, 'w') as file:
        file.write('const dictionary = [\n')
        for row in csv_data:
            file.write(f'["{row[0]}", "{row[1]}"],\n')
        file.write('];\n')

# Example usage:
#csv_to_js_variable('./data/motus_data/dictionary2.js')

def create_js_file(input_txt_file, output_js_file):
    # Read lines from the input text file
    with open(input_txt_file, 'r') as txt_file:
        lines = txt_file.readlines()

    # Create JavaScript array content
    js_array_content = '[' + ', '.join([f'"{line.strip()}"' for line in lines]) + ']'

    # Write JavaScript array to the output JavaScript file
    with open(output_js_file, 'w') as js_file:
        js_file.write('var myArray = ' + js_array_content + ';')

create_js_file("./data/motus_data/20k.txt", "./data/motus_data/dictionary2.js")