import re

with open('research_paper.md', 'r') as f:
    content = f.read()

html_start = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Research Paper - Campus Library Management System</title>
<style>
body { font-family: "Times New Roman", Times, serif; font-size: 12pt; line-height: 1.8; margin: 0; background: #fff; color: #000; }
.page { max-width: 820px; margin: 0 auto; padding: 60px 70px; }
.print-tip { background:#1a1a2e; color:white; padding:12px 20px; border-radius:8px; margin-bottom:24px; font-family:Arial,sans-serif; font-size:13px; }
h1 { font-size:16pt; text-align:center; margin-bottom:6px; }
h2 { font-size:13pt; border-bottom:1px solid #333; padding-bottom:4px; margin-top:28px; }
h3 { font-size:12pt; margin-top:18px; }
h4 { font-size:11pt; margin-top:12px; }
p { text-align:justify; margin:8px 0; }
pre { background:#f4f4f4; padding:12px; border-left:4px solid #333; font-size:10pt; overflow-x:auto; white-space:pre-wrap; font-family:"Courier New",monospace; }
code { font-family:"Courier New",monospace; font-size:10pt; background:#f0f0f0; padding:1px 4px; border-radius:3px; }
pre code { background:none; padding:0; }
table { width:100%; border-collapse:collapse; margin:16px 0; font-size:11pt; }
td { border:1px solid #999; padding:7px 12px; }
tr:first-child td { background:#e8e8e8; font-weight:bold; text-align:center; }
li { margin:5px 0; margin-left:20px; }
ul,ol { margin:8px 0; }
hr { border:none; border-top:1px solid #ccc; margin:24px 0; }
strong { font-weight:bold; }
em { font-style:italic; }
.author-section { text-align:center; margin:10px 0 24px 0; color:#333; font-size:11pt; line-height:2; }
@media print { .print-tip { display:none; } body { font-size:11pt; } .page { padding:40px 50px; } }
</style>
</head>
<body>
<div class="page">
<div class="print-tip">&#128196; <strong>To save as PDF:</strong> Press <strong>Cmd + P</strong> &rarr; In the print dialog, choose <strong>"Save as PDF"</strong> &rarr; Click Save &mdash; That's it!</div>
"""

lines = content.split('\n')
i = 0
in_code = False
in_table = False
result = []
author_lines = []
author_mode = False

while i < len(lines):
    line = lines[i]

    # Code blocks
    if line.startswith('```'):
        if not in_code:
            lang = line[3:].strip()
            result.append('<pre><code>')
            in_code = True
        else:
            result.append('</code></pre>')
            in_code = False
        i += 1
        continue

    if in_code:
        result.append(line.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;'))
        i += 1
        continue

    # Tables
    if line.strip().startswith('|') and '|' in line:
        if not in_table:
            result.append('<table>')
            in_table = True
        if re.match(r'^\|\s*[-:| ]+\|?\s*$', line):
            i += 1
            continue
        cells = [c.strip() for c in line.strip().strip('|').split('|')]
        row = '<tr>' + ''.join(f'<td>{c}</td>' for c in cells) + '</tr>'
        result.append(row)
        i += 1
        continue
    else:
        if in_table:
            result.append('</table>')
            in_table = False

    # Format inline
    line = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', line)
    line = re.sub(r'\*(.+?)\*', r'<em>\1</em>', line)
    line = re.sub(r'`(.+?)`', r'<code>\1</code>', line)

    # Headings
    if line.startswith('# '):
        result.append(f'<h1>{line[2:]}</h1>')
    elif line.startswith('## '):
        result.append(f'<h2>{line[3:]}</h2>')
    elif line.startswith('### '):
        result.append(f'<h3>{line[4:]}</h3>')
    elif line.startswith('#### '):
        result.append(f'<h4>{line[5:]}</h4>')
    elif re.match(r'^[-*] ', line):
        result.append(f'<li>{line[2:]}</li>')
    elif re.match(r'^\d+\. ', line):
        cleaned = re.sub(r'^\d+\. ', '', line)
        result.append(f'<li>{cleaned}</li>')
    elif line.strip() == '---':
        result.append('<hr/>')
    elif line.strip() == '':
        result.append('<br/>')
    else:
        result.append(f'<p>{line}</p>')

    i += 1

if in_table:
    result.append('</table>')

html_end = "</div></body></html>"

final_html = html_start + '\n'.join(result) + html_end

with open('research_paper.html', 'w') as f:
    f.write(final_html)

print("SUCCESS: research_paper.html created!")
print("Open it in your browser and press Cmd+P to save as PDF.")
