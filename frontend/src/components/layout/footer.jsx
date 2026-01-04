import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  ChevronRight,
  Send,
} from "lucide-react";
import { Button } from "../../components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600" />
      
      <div className="container mx-auto px-6 pt-20 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/customer" className="flex items-center gap-3 group">
              <div className="bg-white p-2 rounded-xl transition-transform group-hover:rotate-12 duration-300">
                <img
                  src="/logo.png"
                  alt="PetCareX Logo"
                  className="h-10 w-10 object-contain"
                />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">PetCareX</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Hệ thống chăm sóc thú cưng 5 sao. Chúng tôi cam kết mang lại những điều tốt đẹp nhất cho người bạn bốn chân của bạn bằng tình yêu và công nghệ y khoa hiện đại.
            </p>
            <div className="flex gap-4">
              <SocialButton href="https://facebook.com" icon={<Facebook className="h-5 w-5" />} label="Facebook" />
              <SocialButton href="https://instagram.com" icon={<Instagram className="h-5 w-5" />} label="Instagram" />
              <SocialButton href="https://twitter.com" icon={<Twitter className="h-5 w-5" />} label="Twitter" />
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-8 relative inline-block">
              Khám phá
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-blue-600 rounded-full" />
            </h3>
            <ul className="space-y-4">
              <FooterLink to="/services" label="Khám bệnh tổng quát" />
              <FooterLink to="/services" label="Tiêm phòng định kỳ" />
              <FooterLink to="/products" label="Cửa hàng phụ kiện" />
              <FooterLink to="/about" label="Về chúng tôi" />
              <FooterLink to="/appointments" label="Đặt lịch ngay" />
            </ul>
          </div>

          {/* Contact Details Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-8 relative inline-block">
              Thông tin liên hệ
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-blue-600 rounded-full" />
            </h3>
            <ul className="space-y-5">
              <ContactItem 
                icon={<Phone className="h-5 w-5 text-blue-500" />} 
                title="Hotline 24/7" 
                content="1900 1234" 
              />
              <ContactItem 
                icon={<Mail className="h-5 w-5 text-blue-500" />} 
                title="Email hỗ trợ" 
                content="contact@petcarex.vn" 
              />
              <ContactItem 
                icon={<MapPin className="h-5 w-5 text-blue-500" />} 
                title="Chi nhánh chính" 
                content="Q7, TP. Hồ Chí Minh" 
              />
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-8 relative inline-block">
              Đăng ký nhận tin
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-blue-600 rounded-full" />
            </h3>
            <p className="text-sm text-slate-400 mb-6">Đừng bỏ lỡ các ưu đãi đặc biệt và kiến thức chăm sóc thú cưng hữu ích.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email của bạn..." 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all pr-12"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 p-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20">
                <Send className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-slate-800 mt-16 mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-500 text-sm font-medium">
            &copy; {new Date().getFullYear()} <span className="text-slate-300 font-bold">PetCareX</span>. All rights reserved.
          </div>
          <div className="flex gap-8 text-sm font-semibold">
            <Link to="/privacy" className="text-slate-500 hover:text-white transition-colors">Bảo mật</Link>
            <Link to="/terms" className="text-slate-500 hover:text-white transition-colors">Điều khoản</Link>
            <Link to="/help" className="text-slate-500 hover:text-white transition-colors">Trợ giúp</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, label }) {
  return (
    <li>
      <Link 
        to={to} 
        className="text-slate-400 hover:text-white hover:translate-x-1 flex items-center gap-2 transition-all group"
      >
        <ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500" />
        {label}
      </Link>
    </li>
  );
}

function ContactItem({ icon, title, content }) {
  return (
    <li className="flex items-start gap-4 group">
      <div className="mt-1 bg-slate-800 p-2.5 rounded-lg group-hover:bg-blue-600 transition-colors duration-300">
        {React.cloneElement(icon, { className: "h-4 w-4 text-blue-500 group-hover:text-white transition-colors" })}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mb-0.5">{title}</p>
        <p className="text-sm font-bold text-slate-200">{content}</p>
      </div>
    </li>
  );
}

function SocialButton({ href, icon, label }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noreferrer"
      className="h-10 w-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all hover:-translate-y-1 shadow-lg"
    >
      {icon}
      <span className="sr-only">{label}</span>
    </a>
  );
}

