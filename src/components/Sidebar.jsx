'use client'
import { useContext, useEffect, useState } from "react";
import { MyContext } from "@/context/MyContext";
import { v1 as uuidv1 } from "uuid";
import Image from "next/image";

export default function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const [open, setOpen] = useState(false);

  const normalizeThreads = (threads = []) => {
    const seen = new Set();
    const out = [];

    for (let i = 0; i < threads.length; i++) {
      const t = threads[i] || {};
      const key = t.id ?? (typeof t._id === "string" ? t._id : null) ?? `fallback-${i}`;

      if (seen.has(key)) {
        console.warn("Duplicate thread key skipped:", key, t);
        continue;
      }
      seen.add(key);

      out.push({
        __key: key,
        id: t.id ?? t._id ?? key,
        title: t.title ?? "Untitled",
        messages: t.messages ?? [],
      });
    }

    return out;
  };

  const getAllThreads = async () => {
    try {
      const response = await fetch("/api/chat");
      const text = await response.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch (parseErr) {
        throw new Error("Invalid JSON from server");
      }
      if (!response.ok) {
        throw new Error(json?.err || `Status ${response.status}`);
      }
      const normalized = normalizeThreads(json);
      setAllThreads(normalized);
    } catch (err) {
      console.error("getAllThreads error:", err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    const newId = uuidv1();
    setCurrThreadId(newId);
    setPrevChats([]);
    setOpen(false); 
  };

  const changeThread = async (id) => {
    setCurrThreadId(id);
    try {
      const response = await fetch(`/api/chat/${id}`);
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody?.err || `Failed to fetch thread ${id}`);
      }
      const res = await response.json();
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
      setOpen(false);
    } catch (err) {
      console.error("changeThread error:", err);
    }
  };

  const deleteThread = async (id) => {
    try {
      const response = await fetch(`/api/chat/${id}`, { method: "DELETE" });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(body?.err || `Delete failed: ${response.status}`);
      }
      setAllThreads((prev = []) => prev.filter(thread => thread.id !== id));
      if (id === currThreadId) createNewChat();
    } catch (err) {
      console.error("deleteThread error:", err);
    }
  };
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        aria-label="Open sidebar"
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 h-10 w-10 rounded-full bg-[#171717] text-[#b4b4b4] flex items-center justify-center shadow-md md:hidden"
      >
        <i className="fa-solid fa-bars"></i>
      </button>

      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-200 md:hidden ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden={!open}
      />

      <section
        className={`
          fixed top-0 left-0 z-50 h-screen w-80 bg-[#171717] text-[#b4b4b4] flex flex-col justify-between
          transform transition-transform duration-300
          md:static md:translate-x-0 md:h-screen
          ${open ? "translate-x-0" : "-translate-x-full"} 
        `}
        aria-hidden={false}
      >
        <div>
          <button
            onClick={createNewChat}
            className="flex justify-between items-center m-2.5 p-2.5 rounded-[5px] bg-transparent border border-white/50 cursor-pointer hover:bg-white/5"
          >
            <Image
              src="/logo.png"
              alt="QuestQuill"
              width={25}
              height={25}
              className="bg-white rounded-full object-cover"
            />
            <span className="text-xl ml-60">
              <i className="fa-solid fa-pen-to-square"></i>
            </span>
          </button>

          <ul className="m-2.5 p-2.5 h-[calc(100vh-150px)] overflow-auto">
            {allThreads?.map((thread) => (
              <li
                key={thread.__key}
                onClick={() => changeThread(thread.id)}
                className={`list-none cursor-pointer py-2 px-3 mb-2 text-sm border-10px border-transparent relative hover:bg-white/5 hover:rounded-[10px] group ${
                  thread.id === currThreadId ? "bg-white/5 rounded-[10px]" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate">{thread.title}</div>
                  <div className="ml-2">
                    <i
                      className="fa-solid fa-trash text-transparent group-hover:text-red-400 hover:text-red-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteThread(thread.id);
                      }}
                      title="Delete thread"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-2.5 m-2.5 text-sm text-center border-t border-white/50">
          <p>By Abhiraj Kaushal</p>
        </div>
      </section>
    </>
  );
}
