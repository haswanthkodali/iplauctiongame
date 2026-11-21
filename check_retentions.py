import re

with open('data.js', 'r', encoding='utf-8') as f:
    data_content = f.read()

with open('stats.js', 'r', encoding='utf-8') as f:
    stats_content = f.read()

names_in_data = set(re.findall(r'name:\s*[\'"]([^\'"]+)[\'"]', data_content))
print(f'Total players in data.js: {len(names_in_data)}')

retentions = re.findall(r'retentionHistory2024:\s*\[(.*?)\]', stats_content)
all_retained = []
for r in retentions:
    items = [x.strip().strip('"\'') for x in r.split(',') if x.strip()]
    all_retained.extend(items)

print(f'Total retained in stats.js: {len(all_retained)}')
missing = [name for name in all_retained if name not in names_in_data]
print(f'Retained players not matching exact name in data.js: {missing}')
