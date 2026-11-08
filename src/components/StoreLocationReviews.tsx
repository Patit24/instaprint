import React from 'react';
import { 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  ExternalLink, 
  CheckCircle, 
  Quote, 
  Navigation, 
  MessageCircle,
  ShieldCheck,
  Award
} from 'lucide-react';
import { STORE_INFO, REAL_REVIEWS } from '../data/products';

export const StoreLocationReviews: React.FC = () => {
  return (
    <section id="store-location-section" className="py-16 bg-[#090b10] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Highest Rated in North Kolkata</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
            Visit Our Baranagar Studio & Workshop
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Experience our 4.9★ craftsmanship in person. Touch optical acrylic samples, inspect LED illumination palettes, and speak directly with our print artisans.
          </p>
        </div>

        {/* Location & Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-stretch">
          
          {/* Left Column: Physical Store Card */}
          <div className="lg:col-span-5 bg-[#111422] rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col justify-between shadow-xl">
            <div className="space-y-6">
              
              {/* Google Reviews Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white p-2 flex items-center justify-center shadow-md">
                    {/* Google 'G' icon */}
                    <svg viewBox="0 0 24 24" className="w-8 h-8">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs font-bold text-white mt-0.5">
                      4.9 Rating • 158 Google Reviews
                    </p>
                  </div>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Verified Shop
                </span>
              </div>

              {/* Exact Store Details */}
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block mb-1">Official Address:</span>
                  <p className="text-sm font-bold text-white flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                    <span>{STORE_INFO.address}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 pl-6 mt-0.5">
                    Landmark: {STORE_INFO.landmark}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block mb-1">Direct Phone Contact:</span>
                  <a
                    href={`tel:${STORE_INFO.phone}`}
                    className="text-sm font-bold text-amber-400 hover:underline flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-amber-400" />
                    <span>{STORE_INFO.phone}</span>
                  </a>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block mb-1">Operating Hours:</span>
                  <div className="flex items-start gap-2 text-slate-300">
                    <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Monday – Saturday: 11:00 AM – 09:30 PM</p>
                      <p className="text-slate-400">Sunday: 12:00 PM – 08:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Direct Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-800 mt-6">
              <a
                href={STORE_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-slate-700"
              >
                <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                <span>Get Directions</span>
              </a>

              <a
                href={`tel:${STORE_INFO.phone}`}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow-rose hover:scale-[1.02] transition-transform"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Store</span>
              </a>
            </div>
          </div>

          {/* Right Column: Google Maps Interactive View & Highlights */}
          <div className="lg:col-span-7 bg-[#111422] rounded-3xl overflow-hidden border border-slate-800 flex flex-col justify-between">
            {/* Embedded Visual Map Preview */}
            <div className="relative w-full h-72 sm:h-80 bg-slate-900 overflow-hidden">
              <iframe
                title="Instaprint Baranagar Location Map"
                src="https://maps.google.com/maps?q=106/B,%20Gopal%20Lal%20Tagore%20Rd,%20Joyshree,%20Baranagar,%20Kolkata,%20West%20Bengal%20700036&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 filter invert contrast-125 opacity-80 hover:opacity-100 transition-opacity"
                loading="lazy"
              ></iframe>

              {/* Overlay Marker Pill */}
              <div className="absolute top-4 left-4 bg-[#090b10]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 shadow-xl flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-500 animate-ping"></div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white">INSTAPRINT</p>
                  <p className="text-[10px] text-slate-400">Gopal Lal Tagore Rd, Baranagar</p>
                </div>
              </div>
            </div>

            {/* Studio Turnaround Guarantees */}
            <div className="p-6 sm:p-7 bg-[#0d101a] border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Same-day collection for urgent gifts</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Live physical inspection before accepting</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Free high-res proof verification by designer</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Card, UPI, & cash accepted at counter</span>
              </div>
            </div>
          </div>

        </div>

        {/* Real Customer Testimonials Wall */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                What Kolkata Says About Instaprint
              </h3>
              <p className="text-xs text-slate-400">
                100% verified customer experiences from our Google business profile
              </p>
            </div>
            
            <a
              href={STORE_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 font-semibold"
            >
              <span>Read all 158 reviews on Google</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {REAL_REVIEWS.map((review) => (
              <div
                key={review.id}
                className="bg-[#121624] p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
              >
                <div className="space-y-3">
                  {/* Rating Stars & Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-amber-400 gap-0.5">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{review.date}</span>
                  </div>

                  {/* Comment */}
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2.5">
                  <img
                    src={review.avatar}
                    alt={review.author}
                    className="w-8 h-8 rounded-full object-cover border border-slate-700"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <h4 className="text-xs font-bold text-white truncate">{review.author}</h4>
                      {review.verified && (
                        <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{review.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
