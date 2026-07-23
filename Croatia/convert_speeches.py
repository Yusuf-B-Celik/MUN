#!/usr/bin/env python3
import os
import re
import subprocess
import glob

# Style template
TEMPLATE = """<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Croatia - {title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Inter:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap');

        @page {{
            size: A4;
            margin: 0;
        }}

        body {{
            font-family: 'Lora', serif;
            color: #1e293b;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            -webkit-print-color-adjust: exact;
        }}

        /* Tricolor Ribbon at the very top of the page */
        .tricolor-ribbon {{
            display: flex;
            height: 6px;
            width: 100%;
        }}
        .ribbon-red {{
            background-color: #c21e25;
            flex: 1;
        }}
        .ribbon-white {{
            background-color: #ffffff;
            flex: 1;
        }}
        .ribbon-blue {{
            background-color: #0a2540;
            flex: 1;
        }}

        .container {{
            padding: 1.5cm 2.2cm 2.2cm 2.2cm;
            position: relative;
            box-sizing: border-box;
            min-height: 25.5cm; /* Allows natural height but keeps footer at bottom of single page */
            height: 29.7cm; /* Constrain to 1 page exact for short speeches */
        }}

        /* Header layout */
        header {{
            margin-bottom: 0.8cm;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 0.6cm;
        }}

        .header-meta {{
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            font-family: 'Inter', sans-serif;
            margin-bottom: 0.6cm;
        }}

        .meta-left {{
            text-align: left;
        }}
        .meta-right {{
            text-align: right;
        }}

        .org-title {{
            font-size: 8pt;
            font-weight: 700;
            letter-spacing: 1.5px;
            color: #64748b;
            text-transform: uppercase;
            margin: 0 0 2px 0;
        }}
        .org-sub {{
            font-size: 7.5pt;
            font-weight: 500;
            letter-spacing: 0.5px;
            color: #94a3b8;
            text-transform: uppercase;
            margin: 0;
        }}

        .delegation-title {{
            font-family: 'Cinzel', serif;
            font-size: 11pt;
            font-weight: 700;
            letter-spacing: 1px;
            color: #0a2540;
            margin: 0 0 2px 0;
        }}
        .delegation-sub {{
            font-size: 7.5pt;
            font-weight: 600;
            letter-spacing: 1px;
            color: #c21e25;
            text-transform: uppercase;
            margin: 0;
        }}

        /* Document Title */
        .doc-title-container {{
            text-align: center;
            margin-top: 0.2cm;
            margin-bottom: 0.2cm;
        }}

        .doc-category {{
            font-family: 'Inter', sans-serif;
            font-size: 8.5pt;
            font-weight: 600;
            letter-spacing: 2px;
            color: #94a3b8;
            text-transform: uppercase;
            margin: 0 0 4px 0;
        }}

        .doc-title {{
            font-family: 'Cinzel', serif;
            font-size: 17pt;
            font-weight: 700;
            color: #0a2540;
            margin: 0;
            line-height: 1.2;
        }}

        /* Topic / Context bar */
        .topic-bar {{
            background-color: #f8fafc;
            border-left: 3px solid #0a2540;
            padding: 10px 15px;
            margin-bottom: 0.8cm;
            font-family: 'Inter', sans-serif;
        }}
        .topic-label {{
            font-size: 7pt;
            font-weight: 700;
            letter-spacing: 1px;
            color: #64748b;
            text-transform: uppercase;
            margin: 0 0 2px 0;
        }}
        .topic-value {{
            font-size: 9.5pt;
            font-weight: 600;
            color: #1e293b;
            margin: 0;
        }}

        /* Speech Content */
        .speech-content {{
            font-size: 10.5pt;
            line-height: 1.6;
            text-align: justify;
        }}

        .greeting {{
            font-size: 11pt;
            font-weight: 700;
            color: #0a2540;
            margin-bottom: 1em;
            font-style: italic;
            font-family: 'Lora', serif;
        }}

        .speech-p {{
            margin-top: 0;
            margin-bottom: 1.1em;
            text-indent: 1.5em;
        }}

        .speech-p:first-of-type {{
            text-indent: 0;
        }}

        .closing {{
            font-size: 10.5pt;
            font-weight: 600;
            font-style: italic;
            color: #0a2540;
            margin-top: 1.5em;
            margin-bottom: 0;
        }}

        /* Signature block */
        .signature-section {{
            margin-top: 1.2cm;
            display: flex;
            justify-content: flex-end;
            page-break-inside: avoid;
        }}

        .signature-box {{
            text-align: center;
            width: 6.5cm;
        }}

        .signature-line {{
            border-top: 1px solid #94a3b8;
            margin-bottom: 6px;
        }}

        .sig-title {{
            font-family: 'Inter', sans-serif;
            font-size: 8.5pt;
            font-weight: 600;
            color: #0a2540;
            margin: 0 0 2px 0;
        }}

        .sig-sub {{
            font-family: 'Inter', sans-serif;
            font-size: 7.5pt;
            color: #64748b;
            margin: 0;
        }}

        /* Footer positioning */
        footer {{
            position: absolute;
            bottom: 1.2cm;
            left: 2.2cm;
            right: 2.2cm;
            border-top: 1px solid #e2e8f0;
            padding-top: 10px;
            display: flex;
            justify-content: space-between;
            font-family: 'Inter', sans-serif;
            font-size: 7.5pt;
            color: #94a3b8;
        }}
    </style>
</head>
<body>
    <div class="tricolor-ribbon">
        <div class="ribbon-red"></div>
        <div class="ribbon-white"></div>
        <div class="ribbon-blue"></div>
    </div>

    <div class="container">
        <header>
            <div class="header-meta">
                <div class="meta-left">
                    <p class="org-title">North Atlantic Treaty Organization</p>
                    <p class="org-sub">North Atlantic Council (NAC)</p>
                </div>
                <div class="meta-right">
                    <p class="delegation-title">Republic of Croatia</p>
                    <p class="delegation-sub">Permanent Delegation to NATO</p>
                </div>
            </div>

            <div class="doc-title-container">
                <p class="doc-category">{category}</p>
                <h1 class="doc-title">{title}</h1>
            </div>
        </header>

        <div class="topic-bar">
            <p class="topic-label">Agenda Item</p>
            <p class="topic-value">{topic}</p>
        </div>

        <main class="speech-content">
            {body_html}
        </main>

        <div class="signature-section">
            <div class="signature-box">
                <div class="signature-line"></div>
                <p class="sig-title">Delegation of Croatia</p>
                <p class="sig-sub">North Atlantic Council Session</p>
            </div>
        </div>

        <footer>
            <span>Republic of Croatia • Permanent Delegation to NATO</span>
            <span>Brussels, 2026</span>
        </footer>
    </div>
</body>
</html>
"""

def parse_speech_file(filepath):
    filename = os.path.basename(filepath)
    
    # Try to parse number and title from filename
    # Pattern: Croatia - Speech X_ Title.md
    match = re.match(r"Croatia\s*-\s*Speech\s*(\d+)_\s*(.*?)\.md", filename)
    if match:
        speech_num = match.group(1)
        speech_title = match.group(2).strip()
        category = f"Official Speech Transcript — Speech {speech_num}"
    else:
        # Format filename nicely (e.g. new-speech.md -> New Speech)
        raw_title = filename.replace(".md", "").replace("-", " ").replace("_", " ").strip()
        speech_title = raw_title.title()
        category = "Official Speech Transcript"
        
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Split content into paragraphs/lines
    lines = content.strip().split("\n")
    body_elements = []
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Skip the word "Konuşma" (case-insensitive) if it appears as a header line
        if line.lower() == "konuşma":
            continue
            
        # Check if greeting
        if line.startswith("Honorable Chair") or line.startswith("Honoured Chair"):
            body_elements.append(f'<p class="greeting">{line}</p>')
        # Check if closing
        elif line.startswith("Thank you, and I yield") or line.startswith("Thank you and I yield"):
            body_elements.append(f'<p class="closing">{line}</p>')
        else:
            body_elements.append(f'<p class="speech-p">{line}</p>')
            
    body_html = "\n".join(body_elements)
    
    return {
        "title": speech_title,
        "category": category,
        "topic": speech_title,
        "body_html": body_html
    }

# Lined Notes Template
LINED_NOTES_TEMPLATE = """<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Croatia - MUN Session Notes</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Inter:wght@400;500;600;700&display=swap');

        @page {
            size: A4;
            margin: 0;
        }

        body {
            font-family: 'Inter', sans-serif;
            color: #1e293b;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            -webkit-print-color-adjust: exact;
        }

        /* Tricolor Ribbon at the very top of the page */
        .tricolor-ribbon {
            display: flex;
            height: 6px;
            width: 100%;
        }
        .ribbon-red {
            background-color: #c21e25;
            flex: 1;
        }
        .ribbon-white {
            background-color: #ffffff;
            flex: 1;
        }
        .ribbon-blue {
            background-color: #0a2540;
            flex: 1;
        }

        .container {
            padding: 1.5cm 2.2cm 2.2cm 2.2cm;
            position: relative;
            box-sizing: border-box;
            height: 29.7cm;
        }

        /* Header layout */
        header {
            margin-bottom: 0.6cm;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 0.4cm;
        }

        .header-meta {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 0.4cm;
        }

        .org-title {
            font-size: 8pt;
            font-weight: 700;
            letter-spacing: 1.5px;
            color: #64748b;
            text-transform: uppercase;
            margin: 0 0 2px 0;
        }
        .org-sub {
            font-size: 7.5pt;
            font-weight: 500;
            color: #94a3b8;
            text-transform: uppercase;
            margin: 0;
        }

        .delegation-title {
            font-family: 'Cinzel', serif;
            font-size: 11pt;
            font-weight: 700;
            color: #0a2540;
            margin: 0 0 2px 0;
        }
        .delegation-sub {
            font-size: 7.5pt;
            font-weight: 600;
            color: #c21e25;
            text-transform: uppercase;
            margin: 0;
        }

        .doc-title-container {
            text-align: center;
        }

        .doc-category {
            font-size: 8.5pt;
            font-weight: 600;
            letter-spacing: 2px;
            color: #94a3b8;
            text-transform: uppercase;
            margin: 0 0 4px 0;
        }

        .doc-title {
            font-family: 'Cinzel', serif;
            font-size: 16pt;
            font-weight: 700;
            color: #0a2540;
            margin: 0;
        }

        .meta-fields {
            display: flex;
            gap: 1.5cm;
            margin-bottom: 0.6cm;
            font-size: 9pt;
        }
        .field {
            flex: 1;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 4px;
            color: #64748b;
        }
        .field span {
            font-weight: 600;
            color: #0a2540;
            margin-right: 6px;
        }

        .lined-paper {
            height: 18.5cm;
            background-image: linear-gradient(#e2e8f0 1px, transparent 1px);
            background-size: 100% 0.8cm;
            margin-top: 0.2cm;
        }

        footer {
            position: absolute;
            bottom: 1.2cm;
            left: 2.2cm;
            right: 2.2cm;
            border-top: 1px solid #e2e8f0;
            padding-top: 10px;
            display: flex;
            justify-content: space-between;
            font-size: 7.5pt;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="tricolor-ribbon">
        <div class="ribbon-red"></div>
        <div class="ribbon-white"></div>
        <div class="ribbon-blue"></div>
    </div>
    <div class="container">
        <header>
            <div class="header-meta">
                <div>
                    <p class="org-title">North Atlantic Treaty Organization</p>
                    <p class="org-sub">North Atlantic Council (NAC)</p>
                </div>
                <div style="text-align: right;">
                    <p class="delegation-title">Republic of Croatia</p>
                    <p class="delegation-sub">Permanent Delegation to NATO</p>
                </div>
            </div>
            <div class="doc-title-container">
                <p class="doc-category">Conference Materials</p>
                <h1 class="doc-title">Session Notes</h1>
            </div>
        </header>
        <div class="meta-fields">
            <div class="field"><span>Agenda Item:</span></div>
            <div class="field"><span>Speaker:</span></div>
            <div class="field"><span>Date / Session:</span></div>
        </div>
        <div class="lined-paper"></div>
        <footer>
            <span>Republic of Croatia • Permanent Delegation to NATO</span>
            <span>Brussels, 2026</span>
        </footer>
    </div>
</body>
</html>
"""

# Structured Notes Template
STRUCTURED_NOTES_TEMPLATE = """<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Croatia - MUN Session Planner & Notes</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Inter:wght@400;500;600;700&display=swap');

        @page {
            size: A4;
            margin: 0;
        }

        body {
            font-family: 'Inter', sans-serif;
            color: #1e293b;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            -webkit-print-color-adjust: exact;
        }

        /* Tricolor Ribbon at the very top of the page */
        .tricolor-ribbon {
            display: flex;
            height: 6px;
            width: 100%;
        }
        .ribbon-red {
            background-color: #c21e25;
            flex: 1;
        }
        .ribbon-white {
            background-color: #ffffff;
            flex: 1;
        }
        .ribbon-blue {
            background-color: #0a2540;
            flex: 1;
        }

        .container {
            padding: 1.5cm 2.2cm 2.2cm 2.2cm;
            position: relative;
            box-sizing: border-box;
            height: 29.7cm;
        }

        /* Header layout */
        header {
            margin-bottom: 0.6cm;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 0.4cm;
        }

        .header-meta {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 0.4cm;
        }

        .org-title {
            font-size: 8pt;
            font-weight: 700;
            letter-spacing: 1.5px;
            color: #64748b;
            text-transform: uppercase;
            margin: 0 0 2px 0;
        }
        .org-sub {
            font-size: 7.5pt;
            font-weight: 500;
            color: #94a3b8;
            text-transform: uppercase;
            margin: 0;
        }

        .delegation-title {
            font-family: 'Cinzel', serif;
            font-size: 11pt;
            font-weight: 700;
            color: #0a2540;
            margin: 0 0 2px 0;
        }
        .delegation-sub {
            font-size: 7.5pt;
            font-weight: 600;
            color: #c21e25;
            text-transform: uppercase;
            margin: 0;
        }

        .doc-title-container {
            text-align: center;
        }

        .doc-category {
            font-size: 8.5pt;
            font-weight: 600;
            letter-spacing: 2px;
            color: #94a3b8;
            text-transform: uppercase;
            margin: 0 0 4px 0;
        }

        .doc-title {
            font-family: 'Cinzel', serif;
            font-size: 16pt;
            font-weight: 700;
            color: #0a2540;
            margin: 0;
        }

        .meta-fields {
            display: flex;
            gap: 1.5cm;
            margin-bottom: 0.6cm;
            font-size: 9pt;
        }
        .field {
            flex: 1;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 4px;
            color: #64748b;
        }
        .field span {
            font-weight: 600;
            color: #0a2540;
            margin-right: 6px;
        }

        .grid-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5cm;
            margin-bottom: 0.5cm;
        }

        .note-box {
            border: 1px solid #cbd5e1;
            border-radius: 4px;
            padding: 10px 15px;
            box-sizing: border-box;
            background-color: #f8fafc;
        }

        .note-box-title {
            font-size: 8.5pt;
            font-weight: 700;
            color: #0a2540;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 6px;
            margin-top: 0;
            margin-bottom: 10px;
        }

        .note-lines {
            height: 6cm;
            background-image: linear-gradient(#cbd5e1 1px, transparent 1px);
            background-size: 100% 0.7cm;
            margin-top: 10px;
        }

        .note-box.full-width {
            grid-column: span 2;
        }

        .note-box.full-width .note-lines {
            height: 4.2cm;
        }

        footer {
            position: absolute;
            bottom: 1.2cm;
            left: 2.2cm;
            right: 2.2cm;
            border-top: 1px solid #e2e8f0;
            padding-top: 10px;
            display: flex;
            justify-content: space-between;
            font-size: 7.5pt;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="tricolor-ribbon">
        <div class="ribbon-red"></div>
        <div class="ribbon-white"></div>
        <div class="ribbon-blue"></div>
    </div>
    <div class="container">
        <header>
            <div class="header-meta">
                <div>
                    <p class="org-title">North Atlantic Treaty Organization</p>
                    <p class="org-sub">North Atlantic Council (NAC)</p>
                </div>
                <div style="text-align: right;">
                    <p class="delegation-title">Republic of Croatia</p>
                    <p class="delegation-sub">Permanent Delegation to NATO</p>
                </div>
            </div>
            <div class="doc-title-container">
                <p class="doc-category">Conference Materials</p>
                <h1 class="doc-title">Session Planner & Notes</h1>
            </div>
        </header>
        <div class="meta-fields">
            <div class="field"><span>Agenda Item:</span></div>
            <div class="field"><span>Session:</span></div>
            <div class="field"><span>Date:</span></div>
        </div>
        
        <div class="grid-layout">
            <div class="note-box">
                <h3 class="note-box-title">1. Key Country Positions & Alliances</h3>
                <div class="note-lines"></div>
            </div>
            <div class="note-box">
                <h3 class="note-box-title">2. Main Debate Points & Arguments</h3>
                <div class="note-lines"></div>
            </div>
            <div class="note-box full-width">
                <h3 class="note-box-title">3. Draft Resolution Amendments & Action Items</h3>
                <div class="note-lines"></div>
            </div>
        </div>

        <footer>
            <span>Republic of Croatia • Permanent Delegation to NATO</span>
            <span>Brussels, 2026</span>
        </footer>
    </div>
</body>
</html>
"""

def generate_notes_pdf(weasyprint_path):
    print("Generating note-taking PDFs...")
    notes_to_gen = [
        ("Croatia - MUN Notes - Lined.pdf", LINED_NOTES_TEMPLATE),
        ("Croatia - MUN Notes - Structured.pdf", STRUCTURED_NOTES_TEMPLATE)
    ]
    
    for pdf_name, template in notes_to_gen:
        html_path = pdf_name.replace(".pdf", ".temp.html")
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(template)
            
        try:
            cmd = [weasyprint_path, html_path, pdf_name]
            result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            if result.returncode == 0:
                print(f"  Successfully created: {pdf_name}")
            else:
                print(f"  Error creating note PDF: {result.stderr}")
        except Exception as e:
            print(f"  Failed to generate note PDF: {e}")
        finally:
            if os.path.exists(html_path):
                os.remove(html_path)

def main():
    # Find all speech .md files in the current directory, prioritizing standard speeches first
    md_files = glob.glob("*.md")
    md_files = sorted(md_files, key=lambda x: (0 if x.startswith("Croatia - Speech") else 1, x))
    
    if not md_files:
        print("No Markdown files found in the current directory.")
        return
        
    print(f"Found {len(md_files)} markdown files to convert.")
    
    # Check if weasyprint exists
    weasyprint_path = "/home/yusufbelik/.local/bin/weasyprint"
    if not os.path.exists(weasyprint_path):
        weasyprint_path = "weasyprint"
        
    for filepath in md_files:
        print(f"Processing: {filepath} ...")
        data = parse_speech_file(filepath)
        
        # Generate html
        html_str = TEMPLATE.format(
            title=data["title"],
            category=data["category"],
            topic=data["topic"],
            body_html=data["body_html"]
        )
        
        # Temp HTML path
        base_name = os.path.splitext(filepath)[0]
        html_path = base_name + ".temp.html"
        pdf_path = base_name + ".pdf"
        
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(html_str)
            
        # Run Weasyprint
        try:
            cmd = [weasyprint_path, html_path, pdf_path]
            result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            if result.returncode == 0:
                print(f"  Successfully created: {pdf_path}")
            else:
                print(f"  Error creating PDF: {result.stderr}")
        except Exception as e:
            print(f"  Failed to run weasyprint: {e}")
        finally:
            # Clean up temp html
            if os.path.exists(html_path):
                os.remove(html_path)
                
    # Also generate the note-taking PDFs
    generate_notes_pdf(weasyprint_path)

if __name__ == "__main__":
    main()
