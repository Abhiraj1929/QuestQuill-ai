import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Thread from "@/models/Threads";

export async function POST(request) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Create new thread
    const thread = new Thread({
      threadId: "abcc",
      title: "Testing New Thread3",
    });

    // Save to database
    const response = await thread.save();

    // Return response
    return NextResponse.json(response);
    
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Failed to save in DB" },
      { status: 500 }
    );
  }
}
