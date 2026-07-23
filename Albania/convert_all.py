#!/usr/bin/env python3
import os
import re
import subprocess
import sys
import markdown

# HTML Template with inlined CSS and SVG placeholder
HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{title_clean}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap');

        @page {{
            size: A4;
            margin: 2.2cm 2cm 2.2cm 2cm;
            @top-center {{
                content: "";
                border-bottom: 2px solid #e41e26;
                width: 100%;
                margin-bottom: 15px;
            }}
            @bottom-center {{
                content: "";
                border-top: 1px solid #eee;
                width: 100%;
                margin-top: 15px;
            }}
            @bottom-left {{
                content: "DELEGATION OF ALBANIA — NORTH ATLANTIC COUNCIL";
                font-family: 'Outfit', 'Fira Sans', sans-serif;
                font-size: 7.5pt;
                font-weight: 500;
                color: #666;
                letter-spacing: 0.08em;
                margin-top: 10px;
            }}
            @bottom-right {{
                content: "Page " counter(page);
                font-family: 'Outfit', 'Fira Sans', sans-serif;
                font-size: 8pt;
                font-weight: 600;
                color: #e41e26;
                margin-top: 10px;
            }}
        }}

        body {{
            font-family: 'Lora', 'Georgia', 'DejaVu Serif', serif;
            font-size: 11pt;
            line-height: 1.55;
            color: #1a1a1a;
            background-color: #fdfcfb;
            margin: 0;
            padding: 0;
        }}

        /* Header Style */
        .header-container {{
            text-align: center;
            margin-bottom: 1.2rem;
            border-bottom: 1px double #c5a059;
            padding-bottom: 0.8rem;
        }}

        .coat-of-arms {{
            width: 48px;
            height: auto;
            margin-bottom: 0.4rem;
            display: inline-block;
        }}

        .republic-title {{
            font-family: 'Cinzel', 'DejaVu Serif', serif;
            font-size: 12pt;
            font-weight: 700;
            letter-spacing: 0.16em;
            color: #111;
            margin: 0;
            text-transform: uppercase;
        }}

        .delegation-subtitle {{
            font-family: 'Outfit', 'Fira Sans', sans-serif;
            font-size: 8.5pt;
            font-weight: 500;
            letter-spacing: 0.1em;
            color: #e41e26;
            margin: 0.2rem 0 0 0;
            text-transform: uppercase;
        }}

        .committee-title {{
            font-family: 'Outfit', 'Fira Sans', sans-serif;
            font-size: 7.5pt;
            font-weight: 400;
            letter-spacing: 0.08em;
            color: #555;
            margin: 0.1rem 0 0 0;
            text-transform: uppercase;
        }}

        /* Document Title */
        h1.document-title {{
            font-family: 'Cinzel', 'DejaVu Serif', serif;
            font-size: 14pt;
            font-weight: 700;
            color: #111;
            text-align: center;
            margin-top: 1rem;
            margin-bottom: 1rem;
            line-height: 1.3;
            letter-spacing: 0.02em;
        }}

        /* Metadata Block */
        .metadata-grid {{
            display: table;
            width: 100%;
            margin-bottom: 1.2rem;
            background-color: #f7f6f2;
            border-left: 3px solid #e41e26;
            padding: 0.5rem 1rem;
            border-radius: 0 4px 4px 0;
        }}

        .metadata-row {{
            display: table-row;
        }}

        .metadata-label {{
            display: table-cell;
            font-family: 'Outfit', 'Fira Sans', sans-serif;
            font-size: 8pt;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #666;
            padding-right: 1.5rem;
            padding-bottom: 0.2rem;
            width: 25%;
        }}

        .metadata-value {{
            display: table-cell;
            font-family: 'Outfit', 'Fira Sans', sans-serif;
            font-size: 8.5pt;
            font-weight: 500;
            color: #2c2c2c;
            padding-bottom: 0.2rem;
        }}

        /* Content Styles */
        .content {{
            text-align: justify;
        }}

        .salutation {{
            font-family: 'Outfit', 'Fira Sans', sans-serif;
            font-size: 9.5pt;
            font-weight: 600;
            color: #e41e26;
            margin-top: 0;
            margin-bottom: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            border-bottom: 1px dotted #ccc;
            padding-bottom: 0.3rem;
            display: inline-block;
        }}

        .first-body {{
            margin-top: 0;
            margin-bottom: 0.8rem;
            font-size: 11pt;
            line-height: 1.6;
        }}

        .first-body::first-letter {{
            font-family: 'Cinzel', 'DejaVu Serif', serif;
            font-size: 2.0rem;
            line-height: 1;
            color: #e41e26;
            font-weight: 700;
            margin-right: 0.1rem;
        }}

        .body-p {{
            margin-top: 0;
            margin-bottom: 0.8rem;
            text-indent: 1.5rem;
        }}

        .signature-section {{
            margin-top: 2rem;
            page-break-inside: avoid;
        }}

        .signature-line {{
            width: 180px;
            border-top: 1px solid #c5a059;
            margin-bottom: 0.4rem;
        }}

        .signature-title {{
            font-family: 'Outfit', 'Fira Sans', sans-serif;
            font-size: 8pt;
            font-weight: 600;
            color: #666;
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
        <div class="committee-title">North Atlantic Council (NAC)</div>
    </div>

    <h1 class="document-title">{title_clean}</h1>

    <div class="metadata-grid">
        <div class="metadata-row">
            <div class="metadata-label">Country:</div>
            <div class="metadata-value">Republic of Albania</div>
        </div>
        <div class="metadata-row">
            <div class="metadata-label">Committee:</div>
            <div class="metadata-value">North Atlantic Council (NATO)</div>
        </div>
        <div class="metadata-row">
            <div class="metadata-label">Document:</div>
            <div class="metadata-value">Official Statement / Delegation Speech</div>
        </div>
        <div class="metadata-row">
            <div class="metadata-label">Agenda Item:</div>
            <div class="metadata-value">{agenda_item}</div>
        </div>
    </div>

    <div class="content">
        {content_html}
    </div>

    <div class="signature-section">
        <div class="signature-line"></div>
        <div class="signature-title">Representative of the Republic of Albania</div>
    </div>
</body>
</html>
"""

def main():
    # Load the eagle SVG code
    svg_path = 'albania_eagle.svg'
    if not os.path.exists(svg_path):
        print(f"Error: {svg_path} not found. Please run the script in the same directory as the SVG.")
        sys.exit(1)
        
    with open(svg_path, 'r') as f:
        eagle_svg_code = f.read()

    # Clean the SVG code for HTML insertion (strip XML declaration if present)
    eagle_svg_code = re.sub(r'<\?xml[^>]*\?>', '', eagle_svg_code).strip()
    # Add the class attribute to the SVG if not present
    if 'class=' not in eagle_svg_code:
        eagle_svg_code = eagle_svg_code.replace('<svg', '<svg class="coat-of-arms"')

    # Get all markdown files in the directory
    md_files = [f for f in os.listdir('.') if f.endswith('.md') and f.startswith('Albania - Speech')]
    md_files.sort()

    if not md_files:
        print("No speech markdown files found.")
        sys.exit(1)

    print(f"Found {len(md_files)} markdown files. Starting conversion...")

    for md_file in md_files:
        print(f"Processing {md_file}...")
        
        # Parse filename to get clean title and agenda item
        base = md_file[:-3] # Strip '.md'
        match = re.search(r'Speech (\d+)_\s*(.*)', base)
        if match:
            num = match.group(1)
            agenda_item = match.group(2)
            title_clean = f"Speech {num}: {agenda_item}"
        else:
            title_clean = base
            agenda_item = base

        # Read markdown content
        with open(md_file, 'r', encoding='utf-8') as f:
            text = f.read()

        # Parse text line by line to separate paragraphs
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        
        paragraphs = []
        for line in lines:
            # Convert line using markdown
            line_html = markdown.markdown(line)
            # Remove wrapping <p> and </p> tags
            p_content = re.sub(r'^<p>(.*?)</p>$', r'\1', line_html, flags=re.DOTALL).strip()
            if p_content:
                paragraphs.append(p_content)
        
        formatted_paragraphs = []
        body_start = 0
        
        # Check if first paragraph is a greeting
        if paragraphs:
            first_p = paragraphs[0]
            # Greeting detection keywords
            greeting_keywords = ["Honorable Chair", "Dear delegates", "Distinguished Delegates", "Dear colleagues"]
            if any(kw in first_p for kw in greeting_keywords):
                formatted_paragraphs.append(f'<div class="salutation">{first_p}</div>')
                body_start = 1
            
            # Formulate the body paragraphs
            is_first_body = True
            for p in paragraphs[body_start:]:
                if is_first_body:
                    formatted_paragraphs.append(f'<p class="first-body">{p}</p>')
                    is_first_body = False
                else:
                    formatted_paragraphs.append(f'<p class="body-p">{p}</p>')

        content_html = "\n".join(formatted_paragraphs)

        # Generate complete HTML content
        html_content = HTML_TEMPLATE.format(
            title_clean=title_clean,
            agenda_item=agenda_item,
            eagle_svg_code=eagle_svg_code,
            content_html=content_html
        )

        # Write to a temporary HTML file
        temp_html_name = base + "_temp.html"
        pdf_name = base + ".pdf"

        with open(temp_html_name, 'w', encoding='utf-8') as f:
            f.write(html_content)

        # Run WeasyPrint to convert HTML to PDF
        try:
            subprocess.run([
                '/home/yusufbelik/.local/bin/weasyprint',
                temp_html_name,
                pdf_name
            ], check=True)
            print(f"  Successfully generated: {pdf_name}")
        except subprocess.CalledProcessError as e:
            print(f"  Error generating PDF for {md_file}: {e}")
        finally:
            # Clean up temp file
            if os.path.exists(temp_html_name):
                os.remove(temp_html_name)

    print("All conversions completed successfully.")

if __name__ == '__main__':
    main()
