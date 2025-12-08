import {NextResponse} from "next/server";
import path from "path";
import fs from "fs";

export async function GET() {
    const filePath = path.join(process.cwd(), "data", "categories.json");
    const json = fs.readFileSync(filePath, "utf8");

    return new NextResponse(json, {
        status: 200,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store"
        },
    });
}
