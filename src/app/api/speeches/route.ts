import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export interface Speech {
  id: number;
  filename: string;
  title: string;
  content: string;
}

export async function GET() {
  try {
    const countries = ["Albania", "Croatia"];
    const result: Record<string, Speech[]> = {
      albania: [],
      croatia: [],
    };

    for (const country of countries) {
      let countryDir = "";
      if (country === "Albania") {
        countryDir = path.join(process.cwd(), "Albania");
      } else if (country === "Croatia") {
        countryDir = path.join(process.cwd(), "Croatia");
      } else {
        continue;
      }
      
      if (!fs.existsSync(countryDir)) {
        console.warn(`Directory not found: ${countryDir}`);
        continue;
      }

      const files = fs.readdirSync(countryDir);
      const speeches: Speech[] = [];

      for (const file of files) {
        if (!file.endsWith(".md")) continue;

        // Filename format: "Albania - Speech 1_ General Opening Statement.md"
        // or "Croatia - Speech 1_ General Opening Statement.md"
        const speechMatch = file.match(/Speech\s+(\d+)[_:]\s*(.+)\.md$/i);
        
        let id = 0;
        let title = file.replace(/\.md$/, "");

        if (speechMatch) {
          id = parseInt(speechMatch[1], 10);
          title = speechMatch[2].trim();
        } else {
          // Fallback: search for numbers
          const numMatch = file.match(/(\d+)/);
          if (numMatch) {
            id = parseInt(numMatch[1], 10);
          }
        }

        const filePath = path.join(countryDir, file);
        const content = fs.readFileSync(filePath, "utf-8");

        speeches.push({
          id,
          filename: file,
          title,
          content: content.trim(),
        });
      }

      // Sort speeches by ID (1 to 9)
      speeches.sort((a, b) => a.id - b.id);
      
      const key = country.toLowerCase();
      result[key] = speeches;
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Failed to read speeches:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load speeches" },
      { status: 500 }
    );
  }
}
