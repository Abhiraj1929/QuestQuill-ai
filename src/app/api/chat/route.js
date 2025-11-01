import connectDB from "@/lib/mongodb";
import Thread from "@/models/Threads";
import abhiAi from "@/utils/googleai";
import { NextResponse } from "next/server";
export async function GET(request) {
  try{
    const threads = await Thread.find({}).sort({updatedAt: -1});
    return NextResponse.json(threads);
  }catch(err){
    console.log(err);
    return NextResponse.json(
      {err: "Failed to fetched data"},
      {status: 500}
    );
  };
}

export async function POST(request) {
  // Parse JSON body safely
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" }, 
      { status: 400 }
    )};

  const { threadId, message } = body || {};

  const userContent =
    typeof message === "string"
      ? message
      : message && (message.text ?? message.content);

  if (
    !threadId ||
    typeof threadId !== "string" ||
    !userContent ||
    typeof userContent !== "string" ||
    !userContent.trim()
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      thread = new Thread({
        threadId,
        title: userContent.slice(0, 50) || "New Thread", 
        messages: [{ role: "user", content: userContent }],
      });
    } else {
      thread.messages.push({ role: "user", content: userContent });
    }

    const assistantReply = await abhiAi(userContent);

    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();
    await thread.save();

    return NextResponse.json({ reply: assistantReply });
  } catch (err) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
