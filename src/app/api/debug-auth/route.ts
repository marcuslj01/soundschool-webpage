import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json();
    
    console.log("=== AUTH DEBUG ===");
    console.log("Action:", action);
    console.log("Data:", data);
    console.log("Timestamp:", new Date().toISOString());
    console.log("User Agent:", req.headers.get("user-agent"));
    console.log("==================");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Debug auth error:", error);
    return NextResponse.json({ error: "Debug failed" }, { status: 500 });
  }
} 