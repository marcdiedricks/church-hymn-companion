import os
import re
import json
import shutil

def extract_hymn_number(filename):
    """Extracts leading digits from filenames (e.g. '001 Adoration lyrics.txt' -> 1)"""
    match = re.search(r'(\d+)', filename)
    return int(match.group(1)) if match else None

def parse_txt_file(file_path):
    """Parses a single text file and extracts title, author, composer, and sections."""
    content = None
    for enc in ['utf-8', 'cp1252', 'latin-1']:
        try:
            with open(file_path, 'r', encoding=enc) as f:
                content = f.read()
            break
        except UnicodeDecodeError:
            continue

    if content is None:
        with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()

    raw_lines = [l.strip() for l in content.splitlines()]
    non_empty = [l for l in raw_lines if l]
    if not non_empty:
        return None

    first_line = non_empty[0]
    title = re.sub(r'^\d+\s*', '', first_line).strip()

    author = "Author Unknown"
    composer = "Composer Unknown"

    body_lines = []
    in_body = False

    # Section markers require word boundary or full keyword
    section_marker = re.compile(r'^(verse\s*\d+|\d+[\.\)]?|refrain\b[:\.]?|refrein\b[:\.]?|chorus\b[:\.]?|bridge\b[:\.]?|coda\b[:\.]?)', re.I)

    for idx, line in enumerate(non_empty[1:]):
        l_lower = line.lower()

        m = section_marker.match(line)
        if m and not (':' in line and re.search(r'(lyricist|author|composer|vert\.|geb\.|b\.|\d{4}-\d{4})', line, re.I)):
            in_body = True
            body_lines.append(line)
            continue

        if not in_body:
            next_line_lower = non_empty[idx + 2].lower() if idx + 2 < len(non_empty) else ""
            
            if any(l_lower.startswith(k) for k in ['lyricist:', 'author:', 'text:', 'words:', 'teks:', 'poet:', 'digter:']):
                author = re.sub(r'^(lyricist|author|text|words|teks|poet|digter):\s*', '', line, flags=re.I).strip()
            elif any(l_lower.startswith(k) for k in ['composer:', 'music:', 'tune:', 'melody:', 'komponis:']):
                composer = re.sub(r'^(composer|music|tune|melody|komponis):\s*', '', line, flags=re.I).strip()
            elif 'copyright' in l_lower or 'reserved' in l_lower or 'permission' in l_lower or 'c/o integrity' in l_lower or l_lower.startswith('©'):
                pass
            elif l_lower.startswith('ref.') or l_lower.startswith('ref:'):
                # Reference like ref. Psalm 96:9 -> append to author metadata or ignore
                if author == "Author Unknown":
                    author = line
                else:
                    author += " " + line
            elif 'unknown' in l_lower or 'onbekend' in l_lower:
                if 'composer' in l_lower or 'komponis' in l_lower or 'music' in l_lower:
                    composer = line
                elif 'poet' in l_lower or 'author' in l_lower or 'digter' in l_lower or 'text' in l_lower or 'lyricist' in l_lower or 'words' in l_lower or 'teks' in l_lower:
                    author = line
                elif author == "Author Unknown":
                    author = line
                elif composer == "Composer Unknown":
                    composer = line
                else:
                    author = line
            elif author == "Author Unknown" and ('(' in line or 'geb.' in line or 'b.' in line or 'transl.' in line or 'vert.' in line or '1' in line and not line.endswith('.') or 'lyrics based on' in l_lower or 'alt.' in l_lower or any(next_line_lower.startswith(k) for k in ['composer:', 'music:', 'tune:', 'melody:', 'komponis:'])):
                author = line
            elif composer == "Composer Unknown" and author != "Author Unknown" and ('(' in line or 'geb.' in line or 'b.' in line or 'arr.' in line):
                composer = line
            else:
                in_body = True
                body_lines.append(line)
        else:
            if 'copyright' in l_lower or 'reserved' in l_lower or 'permission' in l_lower or 'c/o integrity' in l_lower or l_lower.startswith('©'):
                continue
            body_lines.append(line)

    sections = []
    current_sec = None
    last_refrain_lines = []

    for line in body_lines:
        m = section_marker.match(line)
        if m and not (':' in line and re.search(r'(lyricist|author|composer|vert\.|geb\.|b\.|\d{4}-\d{4})', line, re.I)):
            marker = m.group(0).strip()
            remainder = line[m.end():].strip()

            m_lower = marker.lower()
            if 'refrain' in m_lower or 'refrein' in m_lower or 'chorus' in m_lower:
                stype = 'refrain'
                label = 'Refrain'
            else:
                stype = 'verse'
                v_match = re.search(r'\d+', marker)
                v_num = v_match.group(0) if v_match else str(len(sections) + 1)
                label = f'Verse {v_num}'

            current_sec = {
                'type': stype,
                'number': len(sections) + 1,
                'label': label,
                'lines': []
            }
            sections.append(current_sec)

            if remainder:
                current_sec['lines'].append(remainder)
        else:
            if current_sec is None:
                current_sec = {
                    'type': 'verse',
                    'number': 1,
                    'label': 'Verse 1',
                    'lines': []
                }
                sections.append(current_sec)
            current_sec['lines'].append(line)
            
    # Post-process: populate empty refrains and record last refrain lines
    for sec in sections:
        if sec['type'] == 'refrain':
            if not sec['lines'] and last_refrain_lines:
                sec['lines'] = list(last_refrain_lines)
            elif sec['lines']:
                last_refrain_lines = list(sec['lines'])

    return {
        "title": title,
        "author": author,
        "composer": composer,
        "sections": sections
    }

def compile_dataset(txt_dir, lang_code="en-ZA", output_file=""):
    hymns_map = {}

    if os.path.exists(txt_dir):
        files = sorted(os.listdir(txt_dir))
        for fname in files:
            if fname.endswith(".txt"):
                hnum = extract_hymn_number(fname)
                if hnum is None:
                    continue
                if hnum in hymns_map and not fname.endswith('lyrics.txt'):
                    continue

                parsed = parse_txt_file(os.path.join(txt_dir, fname))
                if parsed:
                    prefix = "EN" if "en" in lang_code.lower() else "AF"
                    hymns_map[hnum] = {
                        "id": f"NAC-{prefix}-{hnum:03d}",
                        "number": hnum,
                        "title": parsed["title"] or f"Hymn {hnum}",
                        "language": lang_code,
                        "source_file": fname,
                        "metadata": {
                            "lyricist_author_translator": parsed["author"],
                            "composer": parsed["composer"]
                        },
                        "sections": parsed["sections"],
                        "media": {}
                    }

    sorted_hymns = [hymns_map[k] for k in sorted(hymns_map.keys())]

    output_payload = {
        "schema": "nac-hymn-offline-content/v0.1",
        "language": {"code": lang_code, "name": "English" if "en" in lang_code else "Afrikaans"},
        "hymn_count": len(sorted_hymns),
        "hymns": sorted_hymns
    }

    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as out:
        json.dump(output_payload, out, indent=2, ensure_ascii=False)

    pub_dir = "public"
    if os.path.exists(pub_dir):
        pub_file = os.path.join(pub_dir, os.path.basename(output_file))
        shutil.copyfile(output_file, pub_file)

    print(f"[{lang_code}] Successfully compiled {len(sorted_hymns)} hymns into {output_file}")

if __name__ == "__main__":
    compile_dataset("temp_en_txt", lang_code="en-ZA", output_file="src/data/en-ZA.hymns.json")
    compile_dataset("temp_af_txt", lang_code="af-ZA", output_file="src/data/af-ZA.hymns.json")
