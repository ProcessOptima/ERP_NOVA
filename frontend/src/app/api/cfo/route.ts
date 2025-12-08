import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
    const filePath = path.join(process.cwd(), "data", "finance.json");
    const json = fs.readFileSync(filePath);

    return new Response(json, {
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store"
        }
    });
}
