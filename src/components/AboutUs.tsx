import React from 'react';
import { Star, ShieldCheck, Clock, Award, MapPin, Phone, CheckCircle, Sparkles } from 'lucide-react';
import { STORE_INFO } from '../data/products';

export const AboutUs: React.FC = () => {
  return (
    <div className="py-12 bg-[#090b10] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-bold">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>4.9★ Google Business Profile • Baranagar, Kolkata</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Crafting Memories & Brands with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-amber-400">Illuminated Precision</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Located at 106/B Gopal Lal Tagore Road in Joyshree, Baranagar, INSTAPRINT was founded with one clear mission: to bring world-class commercial printing, luxury custom keepsakes, and 24-hour turnaround to Kolkata without corporate markup.
          </p>
        </div>

        {/* Studio Realities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#121622] border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base">In-House Production Atelier</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We own our Japanese UV flatbed printers, laser contour cutters, and DTF garment machines right here in Baranagar. No third-party middlemen.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#121622] border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base">24-Hour Rapid Turnaround</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Need visiting cards for an urgent expo tomorrow? Or an anniversary LED gift tonight? Our same-day store pickup guarantee has saved thousands of clients.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#121622] border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base">Zero Breakage Guarantee</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every acrylic frame, canvas print, and ceramic mug is cushioned with triple-layer bubble air wrap and reinforced cardboard corner protectors.
            </p>
          </div>
        </div>

        {/* Heritage Story */}
        <div className="bg-[#111422] rounded-3xl p-8 sm:p-12 border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-400">Our Heritage in Baranagar</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">From a Local Print Shop to a Full-Scale Customization Powerhouse</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Over the last decade, North Kolkata businesses, medical clinics, schools, and families have trusted INSTAPRINT for everything from everyday visiting cards to high-end gold foil wedding invitations.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              When illuminated acrylic gifts and personalized neon decor took the world by storm, our studio was the first in Kolkata to engineer weighted 3D "LOVE" frames with safety 12V LED strings embedded directly between cast optical acrylic plates.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>15,000+ Prints Delivered</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>158+ Verified 5-Star Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Commercial Offset & Flatbed UV</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Direct Store Pickup Available</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"
                alt="Instaprint Studio Craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-[#090b10] border border-slate-700 p-4 rounded-2xl shadow-xl flex items-center gap-3">
              <Award className="w-8 h-8 text-amber-400" />
              <div>
                <p className="text-sm font-black text-white">4.9 / 5.0 Rating</p>
                <p className="text-[10px] text-slate-400">Google Business Verified</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
