import sys
import json
file_name = input('Input file name (yourtexthere.json))\n')

print("Begin inputting words delimited by \\n")
print("Finish by inputting EOF (Ctrl-D)")

word_map = {}
for line in sys.stdin:
    line = line.rstrip()
    if len(line.split(" "))> 1:
        continue

    word_length = len(line)
    if word_length not in word_map:
        word_map[word_length] = []

    target_arr = word_map[word_length]
    target_word = line.lower()

    if target_word in target_arr: # Skip duplicates
        continue
    word_map[word_length].append(line.lower())

if len(word_map) < 1:
    print("No words inputted, quitting")

full_file_name = f"{file_name}.json"
with open(full_file_name, "w") as f:
    json.dump(word_map, f, indent=2)
print(f"File written as \"{full_file_name}\"")
