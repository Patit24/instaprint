import React from 'react';
import { CATEGORIES_CONFIG } from '../data/products';
import { ProductCategory } from '../types';
import { 
  Briefcase, 
  FileText, 
  Layers, 
  Flag, 
  Zap, 
  Package, 
  Shirt, 
  ShoppingBag, 
  Coffee, 
  BookOpen, 
  CreditCard, 
  Mail, 
  Gift, 
  ArrowRight,
  Stamp,
  Receipt,
  Calendar,
  PenTool,
  MousePointer,
  Award,
  BadgeCheck 
} from 'lucide-react';

interface CategoriesDirectoryProps {
  onSelectCategory: (categoryId: string) => void;
}

export const CategoriesDirectory: React.FC<CategoriesDirectoryProps> = ({ onSelectCategory }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-amber-400" />;
      case 'FileText': return <FileText className="w-5 h-5 text-sky-400" />;
      case 'Layers': return <Layers className="w-5 h-5 text-rose-400" />;
      case 'Flag': return <Flag className="w-5 h-5 text-emerald-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-cyan-400" />;
      case 'Package': return <Package className="w-5 h-5 text-amber-400" />;
      case 'Shirt': return <Shirt className="w-5 h-5 text-pink-400" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5 text-indigo-400" />;
      case 'Coffee': return <Coffee className="w-5 h-5 text-orange-400" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-emerald-400" />;
      case 'CreditCard': return <CreditCard className="w-5 h-5 text-blue-400" />;
      case 'Mail': return <Mail className="w-5 h-5 text-purple-400" />;
      case 'Stamp': return <Stamp className="w-5 h-5 text-emerald-400" />;
      case 'Receipt': return <Receipt className="w-5 h-5 text-sky-400" />;
      case 'Calendar': return <Calendar className="w-5 h-5 text-amber-400" />;
      case 'PenTool': return <PenTool className="w-5 h-5 text-rose-400" />;
      case 'MousePointer': return <MousePointer className="w-5 h-5 text-cyan-400" />;
      case 'Award': return <Award className="w-5 h-5 text-yellow-400" />;
      case 'BadgeCheck': return <BadgeCheck className="w-5 h-5 text-indigo-400" />;
      default: return <Gift className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <div className="py-12 bg-[#090b10] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-400 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 inline-block mb-3">
            20 Core Commercial Print Lines
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Explore All Printing Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            From executive business cards and self-inking stamps to carbonless NCR bill books, calendars, engraved Parker pens, custom apparel, and illuminated keepsakes.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES_CONFIG.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group relative bg-[#121622] rounded-3xl border border-slate-800 hover:border-slate-700 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
            >
              {/* Image Banner */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                <img
                  src={cat.bannerImage}
                  alt={cat.label}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121622] via-[#121622]/40 to-transparent" />

                <div className="absolute top-3.5 left-3.5 flex items-center gap-2 bg-[#090b10]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 shadow-lg">
                  {getIcon(cat.icon)}
                  <span className="text-xs font-bold text-white">{cat.label}</span>
                </div>

                <div className="absolute top-3.5 right-3.5">
                  <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-md bg-black/70 text-slate-300 border border-white/10">
                    {cat.count} Items
                  </span>
                </div>
              </div>

              {/* Description & Subcategories */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {cat.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {cat.subcategories.map((sub, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-[#141824] text-slate-400 border border-slate-800"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-brand-400 font-bold group-hover:text-brand-300">
                  <span>Browse Products</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
