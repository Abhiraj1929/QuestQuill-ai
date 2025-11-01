import mongodb from "@/lib/mongodb";
import Thread from "@/models/Threads";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await mongodb();
    const { id } = await params;
const threads = await Thread.findOne({ id: id });
    if (!threads) {
      return NextResponse.json(
        { err: "No thread found" }
      );
    }
    return NextResponse.json(threads.messages);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { err: "Failed to fetched data" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  try{
    const deletedThread = await Thread.findOneAndDelete({id});

    if(!deletedThread){
      return NextResponse.json(
        {err: "Thread not found"},
        {status: 404}
      );
    };

    return NextResponse.json(
      {message: "Thread Deleted Successfully"},
      {status:200}
    );
  }catch(err){
    return NextResponse.json(
      {err: "Failed to delete thread"},
      {status: 500}
    );
  }
}