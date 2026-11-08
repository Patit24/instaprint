import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle, Navigation } from 'lucide-react';
import { STORE_INFO } from '../data/products';

export const ContactUs: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setPhone('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 4000);
  };

  return (
    <div className="py-12 bg-[#090b10] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-400 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 inline-block">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Contact INSTAPRINT Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Have a custom printing inquiry, corporate merchandise order, or artwork question? Visit our Baranagar shop or send us a message below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Store Info Cards (Left) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-6 rounded-3xl bg-[#121622] border border-slate-800 space-y-5">
              <h3 className="font-bold text-white text-base">Studio Contact Details</h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Store Address</p>
                    <p className="text-slate-300 mt-0.5">{STORE_INFO.address}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">Landmark: {STORE_INFO.landmark}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Phone Hotline</p>
                    <a href={`tel:${STORE_INFO.phone}`} className="text-amber-400 font-mono font-bold hover:underline">
                      {STORE_INFO.phone}
                    </a>
                    <p className="text-slate-400 text-[11px]">Calls & WhatsApp available</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Visiting Hours</p>
                    <p className="text-slate-300">Mon – Sat: 11:00 AM – 09:30 PM</p>
                    <p className="text-slate-400">Sunday: 12:00 PM – 08:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Email Inquiries</p>
                    <p className="text-slate-300 font-mono">{STORE_INFO.email}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                <a
                  href={`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent('Hello Instaprint Baranagar! I would like to inquire about printing services.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Store</span>
                </a>

                <a
                  href={STORE_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                >
                  <Navigation className="w-4 h-4 text-cyan-400" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>

            {/* Google Maps iFrame */}
            <div className="rounded-3xl overflow-hidden border border-slate-800 h-60 bg-slate-900 shadow-xl">
              <iframe
                title="Instaprint Location Map"
                src="https://maps.google.com/maps?q=106/B,%20Gopal%20Lal%20Tagore%20Rd,%20Joyshree,%20Baranagar,%20Kolkata,%20West%20Bengal%20700036&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 filter invert contrast-125 opacity-80"
                loading="lazy"
              />
            </div>
          </div>

          {/* Form (Right) */}
          <div className="lg:col-span-7 bg-[#111422] rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
            <h3 className="font-bold text-white text-lg mb-1">Send a Message to the Printing Desk</h3>
            <p className="text-xs text-slate-400 mb-6">Our studio team will respond within 2-4 business hours.</p>

            {submitted ? (
              <div className="p-8 text-center bg-[#0d101a] rounded-2xl border border-emerald-500/30 space-y-3 animate-fadeIn">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Message Received!</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Thank you, <strong>{name}</strong>. An INSTAPRINT print technician will reach out to your WhatsApp/phone shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sen"
                      className="w-full bg-[#141824] text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-medium block mb-1">WhatsApp Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 082406 38595"
                      className="w-full bg-[#141824] text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="w-full bg-[#141824] text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-medium block mb-1">Inquiry Subject</label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Visiting Cards Bulk Order (1000 pcs)"
                      className="w-full bg-[#141824] text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">Order Details / Artwork Requirements *</label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe product, desired quantity, paper stock, or customization details..."
                    className="w-full bg-[#141824] text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-500 hover:to-rose-500 text-white font-bold text-xs tracking-wide shadow-glow-rose flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Workshop</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
