"use client";

import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { MyContext } from "@/context/MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";


function Avatar({ role }) {
  const isUser = role === "user";
  return (
    <div
      className={
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border" +
        (isUser
          ? " bg-[#10a37f]/20 border-[#10a37f]/40"
          : " bg-white/5 border-white/10")
      }
      aria-hidden
    >
      {isUser ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4 opacity-90">
          <path
            fill="currentColor"
            d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 4.5V21h16v-2.5C20 16.17 16.33 14 12 14Z"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4 opacity-90">
          <path
            fill="currentColor"
            d="M12 2 4 6v6c0 5 4 9 8 10 4-1 8-5 8-10V6Zm0 3.09L17.91 6.5 12 9 6.09 6.5ZM12 20a8.89 8.89 0 0 1-6-7.9V8.26l6 2.73Z"
          />
        </svg>
      )}
    </div>
  );
}

function Bubble({ role, children }) {
  const isUser = role === "user";
  return (
    <div
      className={
        "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-7 shadow-sm " +
        (isUser
          ? " bg-[#10a37f] text-black rounded-br-none"
          : " bg-[#111214] text-[#e6eef6] border border-white/10 rounded-bl-none")
      }
    >
      {children}
    </div>
  );
}

function Markdown({ content }) {
  const memo = useMemo(() => content, [content]);
  return (
    <div className="prose prose-invert max-w-none prose-pre:rounded-xl prose-pre:!bg-[#0c0d10] prose-pre:!border prose-pre:!border-white/10 prose-pre:!p-0 prose-code:before:hidden prose-code:after:hidden">
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{memo}</ReactMarkdown>
    </div>
  );
}

export default function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);
  const listRef = useRef(null);
  const bottomRef = useRef(null);

  // Typing animation for the assistant's latest reply — unchanged logic
  useEffect(() => {
    if (reply === null) {
      setLatestReply(null);
      return;
    }
    if (!prevChats?.length) return;

    const words = reply.split(" ");
    let idx = 0;
    const interval = setInterval(() => {
      setLatestReply(words.slice(0, idx + 1).join(" "));
      idx++;
      if (idx >= words.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [prevChats, reply]);

  // Auto-scroll to bottom like ChatGPT
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [prevChats, latestReply]);

  return (
    <div className="w-full">
      {newChat && (
        <div className="px-6 py-6">
          <h1 className="text-2xl font-semibold text-white">Start a new chat</h1>
          <p className="mt-1 text-sm text-gray-400">Ask anything — QuestQuill will respond</p>
        </div>
      )}

      {/* Chat scroll region */}
      <div
        ref={listRef}
        id="chat-area"
        className="mx-auto h-[70vh] w-full max-w-3xl overflow-y-auto px-3 py-6 space-y-4"
      >
        {/* Render previous chats (all except last) */}
        {prevChats?.slice(0, -1).map((chat, idx) => (
          <div
            key={`${chat.role}-${idx}`}
            className={`w-full flex gap-3 ${chat.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {chat.role !== "user" && <Avatar role={chat.role} />}
            <Bubble role={chat.role}>
              {chat.role === "user" ? (
                <p className="wrap-break-word whitespace-pre-wrap">{chat.content}</p>
              ) : (
                <Markdown content={chat.content} />
              )}
            </Bubble>
            {chat.role === "user" && <Avatar role={chat.role} />}
          </div>
        ))}

        {/* Last message / typing block */}
        {prevChats?.length > 0 && (
          <div className="w-full flex gap-3 justify-start">
            <Avatar role="assistant" />
            <Bubble role="assistant">
              <Markdown
                content={
                  latestReply === null
                    ? prevChats[prevChats.length - 1].content
                    : latestReply
                }
              />
            </Bubble>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
