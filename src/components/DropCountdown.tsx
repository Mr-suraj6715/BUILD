"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Flame, CheckCircle, ArrowRight } from "lucide-react";

interface DropData {
  title: string;
  subtitle: string;
  description: string;
  targetDate: string;
  imageUrl: string;
  badge: string;
}

export default function DropCountdown() {
  const [dropData, setDropData] = useState<DropData>({
    title: "DROP 009: CYBER ARCHIVE",
    subtitle: "STRICTLY LIMITED TO 300 NUMBERED PIECES",
    description: "Experimental boxy silhouettes crafted with 260 GSM Japanese combed cotton, industrial high-density rubberized typography, and custom distressed wash.",
    targetDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=2400&q=95",
    badge: "EXCLUSIVE DROP",
  });

  const [timeLeft, setTimeLeft] = useState({
    days: "03",
    hours: "14",
    minutes: "28",
    seconds: "45",
  });

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/cms")
      .then((res) => res.json())
      .then((data) => {
        if (data.dropCountdown) {
          setDropData({
            title: data.dropCountdown.title,
            subtitle: data.dropCountdown.subtitle || "LIMITED PIECES WORLDWIDE",
            description: data.dropCountdown.description || "",
            targetDate: data.dropCountdown.targetDate,
            imageUrl: data.dropCountdown.imageUrl || "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=2400&q=95",
            badge: data.dropCountdown.badge || "NEXT DROP",
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(dropData.targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)).toString().padStart(2, "0"),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24).toString().padStart(2, "0"),
          minutes: Math.floor((difference / 1000 / 60) % 60).toString().padStart(2, "0"),
          seconds: Math.floor((difference / 1000) % 60).toString().padStart(2, "0"),
        });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [dropData.targetDate]);

  const handleNotifyMe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubscribed(true);
    } catch {
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#101010] text-[#F5F3EE] py-20 px-4 sm:px-6 lg:px-8 border-y border-[#262626]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Image with Industrial Frame */}
        <div className="lg:col-span-6 relative">
          <div className="relative aspect-[4/5] sm:aspect-[1/1] overflow-hidden border border-[#262626]">
            <img
              src={dropData.imageUrl}
              alt={dropData.title}
              className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
            />
            {/* Live Indicator Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#101010]/90 backdrop-blur-md px-3 py-1.5 border border-[#262626]">
              <span className="w-2 h-2 rounded-full bg-[#D8FF36] animate-ping" />
              <span className="text-[11px] font-bold tracking-widest text-[#D8FF36] uppercase">
                {dropData.badge}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Countdown & Drop Details */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <span className="text-xs font-mono font-bold tracking-mega text-[#D8FF36] uppercase mb-3">
            {dropData.subtitle}
          </span>
          <h2 className="font-display text-4xl sm:text-6xl tracking-wide uppercase font-bold text-[#F5F3EE] mb-4 leading-none">
            {dropData.title}
          </h2>
          <p className="text-sm sm:text-base text-[#777777] mb-8 max-w-lg leading-relaxed">
            {dropData.description}
          </p>

          {/* Countdown Clock Display */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-8 max-w-md">
            {[
              { label: "DAYS", value: timeLeft.days },
              { label: "HOURS", value: timeLeft.hours },
              { label: "MINS", value: timeLeft.minutes },
              { label: "SECS", value: timeLeft.seconds },
            ].map((unit) => (
              <div
                key={unit.label}
                className="bg-[#181818] border border-[#262626] p-4 text-center"
              >
                <div className="font-display text-3xl sm:text-5xl font-black text-[#D8FF36] leading-none mb-1">
                  {unit.value}
                </div>
                <div className="text-[10px] font-mono tracking-widest text-[#777777] uppercase">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>

          {/* Notify Me Form */}
          {!subscribed ? (
            <form onSubmit={handleNotifyMe} className="flex flex-col sm:flex-row gap-2 max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email for early 15-min drop access"
                required
                className="flex-grow bg-[#181818] border border-[#333333] px-4 py-3 text-sm text-[#F5F3EE] placeholder:text-[#777777] focus:outline-none focus:border-[#D8FF36]"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#D8FF36] text-[#101010] font-bold text-xs uppercase tracking-wider px-6 py-3 hover:bg-white transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Bell className="w-4 h-4" />
                <span>{loading ? "Joining..." : "Notify Me"}</span>
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-3 bg-[#181818] border border-[#D8FF36]/40 p-4 max-w-md text-sm text-[#D8FF36]">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>You are on the VIP drop list. You will receive 15-minute priority access.</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

