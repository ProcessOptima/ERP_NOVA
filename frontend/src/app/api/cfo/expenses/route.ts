import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET() {
    const filePath = path.join(process.cwd(), "data", "categories.json");
    const file = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(file);

    const expenses = json.all_transactions.filter(
        (t: { creditdebitindicator: string }) => t.creditdebitindicator === "DEBIT"
    );

    return NextResponse.json({ expenses }, {
        status: 200,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store"
        },
    });
}
