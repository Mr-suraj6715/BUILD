"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Announcement {
  id: string;
  text: string;
  link?: string | null;
}

export default function AnnouncementBar() {
  const [messages, setMessages] = useState<Announcement[]>([
    { id: "1", text: "NEW DROP LIVE — LIMITED STOCK WORLDWIDE", link: "/shop?badge=NEW+DROP" },
    { id: "2", text: "FREE EXPRESS SHIPPING ON ALL ORDERS ABOVE ₹1,499", link: "/shop" },
    { id: "3", text: "USE CODE 'BUILD10' FOR 10% OFF YOUR FIRST ORDER", link: "/shop" },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch("/api/admin/cms")
      .then((res) => res.json())
      .then((data) => {
        if (data.announcements && data.announcements.length > 0) {
          setMessages(data.announcements);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (messages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [messages]);

  const current = messages[currentIndex] || messages[0];

  return (
    <div className="bg-[#101010] text-[#F5F3EE] text-[11px] font-mono py-1.5 px-4 transition-all duration-300 border-b border-[#222222]">
      <div className="max-w-7xl mx-auto flex items-center justify-between tracking-widest uppercase">
        {/* Left Dispatch Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-block w-2 h-2 rounded-full bg-[#D8FF36] animate-pulse" />
          <span className="text-[#D8FF36] font-bold hidden sm:inline">DISPATCH PROTOCOL // 01</span>
          <span className="text-[#D8FF36] font-bold sm:hidden">PROTOCOL 01</span>
        </div>

        {/* Center rotating message */}
        <div className="flex items-center justify-center text-center overflow-hidden px-2">
          {current?.link ? (
            <Link
              href={current.link}
              className="flex items-center gap-2 hover:text-[#D8FF36] transition-colors truncate"
            >
              <span className="truncate">{current.text}</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#D8FF36] shrink-0" />
            </Link>
          ) : (
            <span className="truncate">{current?.text}</span>
          )}
        </div>

        {/* Right Status badge */}
        <div className="hidden md:flex items-center gap-1.5 text-[#888888] shrink-0 text-[10px]">
          <span className="text-[#D8FF36] font-bold">PRINT LABS</span>
          <span>[ONLINE]</span>
        </div>
      </div>
    </div>
  );
}

