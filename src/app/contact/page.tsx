"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderNumber: "",
    subject: "Order Status / Tracking",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 w-full min-h-screen">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-[#777777] hover:text-[#151515] mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>

      <span className="text-xs font-mono font-bold tracking-mega text-[#777777] uppercase block">
        COMMUNITY & SUPPORT
      </span>
      <h1 className="font-display text-4xl sm:text-6xl uppercase font-black tracking-tight text-[#151515] mt-1 mb-8">
        CONTACT BUILD HQ
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Support Info Box */}
        <div className="md:col-span-5 bg-[#101010] text-[#F5F3EE] p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="font-display text-2xl uppercase font-bold text-[#D8FF36] mb-2">
              FLAGSHIP STUDIO
            </h2>
            <p className="text-xs text-[#AAAAAA] leading-relaxed">
              We respond to all customer care, size consultation, and collaboration inquiries within 24 hours.
            </p>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#D8FF36] mt-0.5 flex-shrink-0" />
              <div>
                <strong className="block text-white">BUILD CLOTHING STUDIO</strong>
                <span className="text-[#888888]">104, Fashion Avenue, Bandra West, Mumbai, MH 400050</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#D8FF36] flex-shrink-0" />
              <div>
                <strong className="block text-white">CUSTOMER DESK</strong>
                <a href="mailto:support@buildclothing.com" className="text-[#888888] hover:text-[#D8FF36]">
                  support@buildclothing.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#D8FF36] flex-shrink-0" />
              <div>
                <strong className="block text-white">HOTLINE (MON-SAT 10AM-7PM)</strong>
                <span className="text-[#888888]">+91 98765 43210</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#262626]">
            <span className="text-[10px] font-mono uppercase text-[#777777] block mb-2">
              TRACK EXISTING ORDER
            </span>
            <Link
              href="/track"
              className="w-full block text-center py-2.5 bg-[#181818] text-[#D8FF36] font-bold text-xs uppercase tracking-wider hover:bg-black"
            >
              Live Courier Radar →
            </Link>
          </div>
        </div>

        {/* Message Form Box */}
        <div className="md:col-span-7 bg-[#E8E5DE] border border-[#D4D0C8] p-6 sm:p-8">
          <h2 className="font-display text-2xl uppercase font-bold text-[#151515] mb-4">
            SEND US A MESSAGE
          </h2>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#555555] uppercase mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Varun K."
                    className="w-full bg-[#F5F3EE] border border-[#D4D0C8] p-2.5 text-[#151515]"
                  />
                </div>
                <div>
                  <label className="block text-[#555555] uppercase mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@email.com"
                    className="w-full bg-[#F5F3EE] border border-[#D4D0C8] p-2.5 text-[#151515]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#555555] uppercase mb-1">Order # (If applicable)</label>
                  <input
                    type="text"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    placeholder="e.g. BLD-2505-8821"
                    className="w-full bg-[#F5F3EE] border border-[#D4D0C8] p-2.5 text-[#151515]"
                  />
                </div>
                <div>
                  <label className="block text-[#555555] uppercase mb-1">Inquiry Topic</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#F5F3EE] border border-[#D4D0C8] p-2.5 text-[#151515]"
                  >
                    <option value="Order Status / Tracking">Order Status / Tracking</option>
                    <option value="Size Consultation">Size & Fit Consultation</option>
                    <option value="Return / Exchange Request">Return / Exchange Request</option>
                    <option value="Brand Collaboration">Brand Collaboration / Media</option>
                    <option value="Other">Other Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#555555] uppercase mb-1">Your Message *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can our crew help you?"
                  className="w-full bg-[#F5F3EE] border border-[#D4D0C8] p-2.5 text-[#151515]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#101010] text-[#D8FF36] font-bold text-xs uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? "TRANSMITTING..." : "DISPATCH INQUIRY"}</span>
              </button>
            </form>
          ) : (
            <div className="p-6 bg-[#F5F3EE] border border-[#D8FF36] text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-green-700 mx-auto" />
              <h3 className="font-display text-2xl uppercase font-bold text-[#151515]">
                MESSAGE RECEIVED
              </h3>
              <p className="text-xs font-mono text-[#555555]">
                Thank you, {formData.name}. Ticket has been created. Our Bandra team will reply to <strong>{formData.email}</strong> within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold uppercase underline mt-2 block mx-auto"
              >
                Send Another Message
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

