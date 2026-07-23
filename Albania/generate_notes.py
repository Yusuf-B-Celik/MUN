#!/usr/bin/env python3
import os
import re
import subprocess
import sys

# HTML Template for Debate & Speech Notes (Cornell Style)
CORNELL_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Debate & Speech Notes</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Outfit:wght@300;400;500;600&display=swap');

        @page {{
            size: A4;
            margin: 1.5cm 1.5cm 1.5cm 1.5cm;
            @bottom-center {{
                content: "";
                border-top: 1px solid #eee;
                width: 100%;
            }}
            @bottom-left {{
                content: "DELEGATION OF ALBANIA — DEBATE & SPEECH NOTES";
                font-family: 'Outfit', 'Fira Sans', sans-serif;
                font-size: 7pt;
                font-weight: 500;
                color: #888;
                letter-spacing: 0.08em;
            }}
            @bottom-right {{
                content: "Official Note Sheet";
                font-family: 'Outfit', 'Fira Sans', sans-serif;
                font-size: 7pt;
                font-weight: 600;
                color: #e41e26;
            }}
        }}

        body {{
            font-family: 'Outfit', 'Fira Sans', sans-serif;
            color: #1a1a1a;
            background-color: #fdfcfb;
            margin: 0;
            padding: 0;
        }}

        .header-container {{
            text-align: center;
            margin-bottom: 1rem;
            border-bottom: 1px double #c5a059;
            padding-bottom: 0.6rem;
        }}

        .coat-of-arms {{
            width: 42px;
            height: auto;
            margin-bottom: 0.3rem;
            display: inline-block;
        }}

        .republic-title {{
            font-family: 'Cinzel', 'DejaVu Serif', serif;
            font-size: 11pt;
            font-weight: 700;
            letter-spacing: 0.16em;
            color: #111;
            margin: 0;
            text-transform: uppercase;
        }}

        .delegation-subtitle {{
            font-family: 'Outfit', 'Fira Sans', sans-serif;
            font-size: 8pt;
            font-weight: 500;
            letter-spacing: 0.1em;
            color: #e41e26;
            margin: 0.1rem 0 0 0;
            text-transform: uppercase;
        }}

        h1.document-title {{
            font-family: 'Cinzel', 'DejaVu Serif', serif;
            font-size: 13pt;
            font-weight: 700;
            color: #111;
            text-align: center;
            margin-top: 0.5rem;
            margin-bottom: 0.8rem;
            letter-spacing: 0.05em;
        }}

        /* Metadata Block */
        .metadata-grid {{
            display: table;
            width: 100%;
            margin-bottom: 1rem;
            border: 1px solid #e5e0d8;
            background-color: #f7f6f2;
            border-left: 3px solid #e41e26;
            padding: 0.5rem 0.8rem;
            border-radius: 0 4px 4px 0;
        }}

        .metadata-row {{
            display: table-row;
        }}

        .metadata-cell {{
            display: table-cell;
            font-size: 8.5pt;
            padding-bottom: 0.2rem;
        }}

        .metadata-label {{
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #666;
            width: 15%;
        }}

        .metadata-value {{
            color: #ccc;
            border-bottom: 1px dotted #999;
            width: 35%;
        }}

        /* Main Cornell Layout */
        .cornell-container {{
            display: table;
            width: 100%;
            border-collapse: collapse;
        }}

        .cornell-row {{
            display: table-row;
        }}

        .cornell-left-col {{
            display: table-cell;
            width: 30%;
            border-right: 1.5px solid #c5a059;
            padding-right: 0.8rem;
            vertical-align: top;
        }}

        .cornell-right-col {{
            display: table-cell;
            width: 70%;
            padding-left: 0.8rem;
            vertical-align: top;
        }}

        .column-header {{
            font-family: 'Cinzel', 'DejaVu Serif', serif;
            font-size: 8.5pt;
            font-weight: 700;
            color: #e41e26;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 1px solid #e41e26;
            padding-bottom: 0.2rem;
        }}

        /* Ruled Lines */
        .ruled-container {{
            margin-top: 0.2rem;
        }}

        .ruled-line {{
            height: 0.7cm;
            border-bottom: 1px solid #e5e0d8;
        }}

        /* Bottom Summary Section */
        .summary-container {{
            margin-top: 1rem;
            border-top: 1.5px solid #c5a059;
            padding-top: 0.5rem;
        }}

        .summary-header {{
            font-family: 'Cinzel', 'DejaVu Serif', serif;
            font-size: 8.5pt;
            font-weight: 700;
            color: #111;
            margin-bottom: 0.3rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }}
    </style>
</head>
<body>
    <div class="header-container">
        {eagle_svg_code}
        <div class="republic-title">Republic of Albania</div>
        <div class="delegation-subtitle">Delegation to the North Atlantic Treaty Organization</div>
    </div>

    <h1 class="document-title">Debate & Speech Notes</h1>

    <div class="metadata-grid">
        <div class="metadata-row">
            <div class="metadata-cell metadata-label">Date:</div>
            <div class="metadata-cell metadata-value"></div>
            <div class="metadata-cell metadata-label" style="padding-left: 1rem;">Session:</div>
            <div class="metadata-cell metadata-value"></div>
        </div>
        <div class="metadata-row">
            <div class="metadata-cell metadata-label">Agenda:</div>
            <div class="metadata-cell metadata-value"></div>
            <div class="metadata-cell metadata-label" style="padding-left: 1rem;">Topic:</div>
            <div class="metadata-cell metadata-value"></div>
        </div>
    </div>

    <div class="cornell-container">
        <div class="cornell-row">
            <div class="cornell-left-col">
                <div class="column-header">Key Points / Speakers</div>
                <div class="ruled-container">
                    {ruled_lines_left}
                </div>
            </div>
            <div class="cornell-right-col">
                <div class="column-header">Detailed Notes & Arguments</div>
                <div class="ruled-container">
                    {ruled_lines_right}
                </div>
            </div>
        </div>
    </div>

    <div class="summary-container">
        <div class="summary-header">Summary & Draft Resolution Ideas</div>
        <div class="ruled-container">
            {ruled_lines_summary}
        </div>
    </div>
</body>
</html>
"""

# HTML Template for Resolution & Clause Drafting (Numbered Lines Style)
DRAFTING_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Resolution & Clause Drafting</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Outfit:wght@300;400;500;600&display=swap');

        @page {{
            size: A4;
            margin: 1.5cm 1.5cm 1.5cm 1.5cm;
            @bottom-center {{
                content: "";
                border-top: 1px solid #eee;
                width: 100%;
            }}
            @bottom-left {{
                content: "DELEGATION OF ALBANIA — RESOLUTION & CLAUSE DRAFTING";
                font-family: 'Outfit', 'Fira Sans', sans-serif;
                font-size: 7pt;
                font-weight: 500;
                color: #888;
                letter-spacing: 0.08em;
            }}
            @bottom-right {{
                content: "Official Draft Sheet";
                font-family: 'Outfit', 'Fira Sans', sans-serif;
                font-size: 7pt;
                font-weight: 600;
                color: #e41e26;
            }}
        }}

        body {{
            font-family: 'Outfit', 'Fira Sans', sans-serif;
            color: #1a1a1a;
            background-color: #fdfcfb;
            margin: 0;
            padding: 0;
        }}

        .header-container {{
            text-align: center;
            margin-bottom: 1rem;
            border-bottom: 1px double #c5a059;
            padding-bottom: 0.6rem;
        }}

        .coat-of-arms {{
            width: 42px;
            height: auto;
            margin-bottom: 0.3rem;
            display: inline-block;
        }}

        .republic-title {{
            font-family: 'Cinzel', 'DejaVu Serif', serif;
            font-size: 11pt;
            font-weight: 700;
            letter-spacing: 0.16em;
            color: #111;
            margin: 0;
            text-transform: uppercase;
        }}

        .delegation-subtitle {{
            font-family: 'Outfit', 'Fira Sans', sans-serif;
            font-size: 8pt;
            font-weight: 500;
            letter-spacing: 0.1em;
            color: #e41e26;
            margin: 0.1rem 0 0 0;
            text-transform: uppercase;
        }}

        h1.document-title {{
            font-family: 'Cinzel', 'DejaVu Serif', serif;
            font-size: 13pt;
            font-weight: 700;
            color: #111;
            text-align: center;
            margin-top: 0.5rem;
            margin-bottom: 0.8rem;
            letter-spacing: 0.05em;
        }}

        /* Metadata Block */
        .metadata-grid {{
            display: table;
            width: 100%;
            margin-bottom: 1rem;
            border: 1px solid #e5e0d8;
            background-color: #f7f6f2;
            border-left: 3px solid #e41e26;
            padding: 0.5rem 0.8rem;
            border-radius: 0 4px 4px 0;
        }}

        .metadata-row {{
            display: table-row;
        }}

        .metadata-cell {{
            display: table-cell;
            font-size: 8.5pt;
            padding-bottom: 0.2rem;
        }}

        .metadata-label {{
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #666;
            width: 15%;
        }}

        .metadata-value {{
            color: #ccc;
            border-bottom: 1px dotted #999;
            width: 35%;
        }}

        /* Clause Drafting Grid */
        .drafting-container {{
            display: table;
            width: 100%;
            border-collapse: collapse;
            margin-top: 0.2rem;
        }}

        .drafting-row {{
            display: table-row;
        }}

        .line-number-cell {{
            display: table-cell;
            width: 6%;
            border-right: 1.5px solid #c5a059;
            text-align: right;
            padding-right: 0.5rem;
            font-family: 'Outfit', 'Fira Sans', sans-serif;
            font-size: 8pt;
            font-weight: 600;
            color: #c5a059;
            vertical-align: middle;
            height: 0.74cm;
        }}

        .line-writing-cell {{
            display: table-cell;
            width: 94%;
            border-bottom: 1px solid #e5e0d8;
            padding-left: 0.8rem;
            vertical-align: middle;
            height: 0.74cm;
        }}

        .column-header {{
            font-family: 'Cinzel', 'DejaVu Serif', serif;
            font-size: 8.5pt;
            font-weight: 700;
            color: #e41e26;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 1px solid #e41e26;
            padding-bottom: 0.2rem;
        }}
    </style>
</head>
<body>
    <div class="header-container">
        {eagle_svg_code}
        <div class="republic-title">Republic of Albania</div>
        <div class="delegation-subtitle">Delegation to the North Atlantic Treaty Organization</div>
    </div>

    <h1 class="document-title">Resolution & Clause Drafting</h1>

    <div class="metadata-grid">
        <div class="metadata-row">
            <div class="metadata-cell metadata-label">Draft Ref:</div>
            <div class="metadata-cell metadata-value"></div>
            <div class="metadata-cell metadata-label" style="padding-left: 1rem;">Sponsors:</div>
            <div class="metadata-cell metadata-value"></div>
        </div>
        <div class="metadata-row">
            <div class="metadata-cell metadata-label">Topic:</div>
            <div class="metadata-cell metadata-value"></div>
            <div class="metadata-cell metadata-label" style="padding-left: 1rem;">Bloc:</div>
            <div class="metadata-cell metadata-value"></div>
        </div>
    </div>

    <div class="column-header">Draft Clauses & Amendments</div>

    <div class="drafting-container">
        {drafting_lines}
    </div>
</body>
</html>
"""

def main():
    # Load the eagle SVG code
    svg_path = 'albania_eagle.svg'
    if not os.path.exists(svg_path):
        print(f"Error: {svg_path} not found. Please run the script in the same directory.")
        sys.exit(1)
        
    with open(svg_path, 'r') as f:
        eagle_svg_code = f.read()

    # Clean SVG code
    eagle_svg_code = re.sub(r'<\?xml[^>]*\?>', '', eagle_svg_code).strip()
    if 'class=' not in eagle_svg_code:
        eagle_svg_code = eagle_svg_code.replace('<svg', '<svg class="coat-of-arms"')

    # 1. Generate Debate & Speech Notes (Cornell Notes Style)
    ruled_lines_left = '\n'.join('<div class="ruled-line"></div>' for _ in range(20))
    ruled_lines_right = '\n'.join('<div class="ruled-line"></div>' for _ in range(20))
    ruled_lines_summary = '\n'.join('<div class="ruled-line"></div>' for _ in range(5))

    cornell_html = CORNELL_TEMPLATE.format(
        eagle_svg_code=eagle_svg_code,
        ruled_lines_left=ruled_lines_left,
        ruled_lines_right=ruled_lines_right,
        ruled_lines_summary=ruled_lines_summary
    )

    temp_cornell_html = 'temp_cornell.html'
    pdf_cornell_name = 'Albania - Session & Debate Notes.pdf'
    
    with open(temp_cornell_html, 'w', encoding='utf-8') as f:
        f.write(cornell_html)

    # 2. Generate Resolution & Clause Drafting Notes (Line Numbers Style)
    lines_list = []
    for i in range(1, 24): # 23 numbered lines to fit perfectly on A4
        lines_list.append(f"""
        <div class="drafting-row">
            <div class="line-number-cell">{i:02d}</div>
            <div class="line-writing-cell"></div>
        </div>
        """)
    drafting_lines = '\n'.join(lines_list)

    drafting_html = DRAFTING_TEMPLATE.format(
        eagle_svg_code=eagle_svg_code,
        drafting_lines=drafting_lines
    )

    temp_drafting_html = 'temp_drafting.html'
    pdf_drafting_name = 'Albania - Resolution & Clause Drafting.pdf'

    with open(temp_drafting_html, 'w', encoding='utf-8') as f:
        f.write(drafting_html)

    print("Generating note-taking PDFs...")

    # Compile files
    try:
        # Debate Notes
        subprocess.run([
            '/home/yusufbelik/.local/bin/weasyprint',
            temp_cornell_html,
            pdf_cornell_name
        ], check=True)
        print(f"Successfully generated: {pdf_cornell_name}")
        
        # Drafting Notes
        subprocess.run([
            '/home/yusufbelik/.local/bin/weasyprint',
            temp_drafting_html,
            pdf_drafting_name
        ], check=True)
        print(f"Successfully generated: {pdf_drafting_name}")

    except subprocess.CalledProcessError as e:
        print(f"Error compiling PDFs: {e}")
    finally:
        # Clean up temp HTML files
        for temp_file in [temp_cornell_html, temp_drafting_html]:
            if os.path.exists(temp_file):
                os.remove(temp_file)

if __name__ == '__main__':
    main()
