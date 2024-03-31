def treatment(line):
    new_line = ""
    ignore_next_commas = False
    numbers_of_commas = 0
    i = 0
    while numbers_of_commas <2:
        if line[i] == "\"" and ((line[i+1] != "\"") or (line[i-1] != "\"")):
            ignore_next_commas = not ignore_next_commas
            new_line += line[i]
        elif line[i] == " " and line[i+1] == ",":
            pass
        elif not ignore_next_commas:
            if line[i] == ",":
                numbers_of_commas += 1
                if numbers_of_commas != 2:
                    new_line += line[i]
            else:
                new_line += line[i]
        else:
            new_line += line[i]
        i+=1
    new_line += "\n"
    return new_line

def wordIsCorrect(line):
    commas = 0
    i=0
    while commas == 0:
        if (line[i] == " " and line[i+1] != ",") or (line[i] == "-"):   #if it has "-" or spaces in its name
            return False
        elif line[i] == ",":
            return True
        i += 1
    return True


def create():
    with open("./data/motus_data/words.csv", encoding="utf8") as f_in, open("./data/motus_data/final_words.csv", 'w', encoding="utf8") as f_out:
        # Write header unchanged
        header = f_in.readline()
        # Transform the rest of the lines
        for line in f_in:
            if wordIsCorrect(line):
                f_out.write(treatment(line))
    f_in.close()
    f_out.close()


create()

"""tests
print(wordIsCorrect("Tree , description"))
print(wordIsCorrect("Non-existent, description"))
print(wordIsCorrect("Tree, description"))
"""
