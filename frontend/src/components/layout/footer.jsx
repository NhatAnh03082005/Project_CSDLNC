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
} from "lucide-react";
import { Button } from "../../components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Cột 1: Giới thiệu */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="Logo.png"
                alt="PetCareX Logo"
                className="h-10 w-10 object-contain"
              />
              <span className="text-xl font-bold tracking-tight">PetCareX</span>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              Hệ thống phòng khám thú y uy tín, nơi thú cưng của bạn được chăm
              sóc bằng cả trái tim và trình độ chuyên môn cao nhất.
            </p>
          </div>

          {/* Cột 2: Dịch vụ */}
          <div>
            <h3 className="font-semibold text-lg mb-4 border-b border-blue-800 pb-2">
              Dịch vụ
            </h3>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>
                <Link
                  to="/services"
                  className="hover:text-white transition-colors"
                >
                  Khám bệnh tổng quát
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="hover:text-white transition-colors"
                >
                  Tiêm phòng định kỳ
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="hover:text-white transition-colors"
                >
                  Phẫu thuật & Cấp cứu
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="hover:text-white transition-colors"
                >
                  Chăm sóc Spa & Làm đẹp
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Liên hệ */}
          <div>
            <h3 className="font-semibold text-lg mb-4 border-b border-blue-800 pb-2">
              Liên hệ
            </h3>
            <ul className="space-y-3 text-sm text-blue-200">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Hotline: 1900 1234</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Email: info@petcarex.vn</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Giờ làm việc: 8:00 - 20:00</span>
              </li>
            </ul>
          </div>

          {/* Cột 4: Mạng xã hội */}
          <div>
            <h3 className="font-semibold text-lg mb-4 border-b border-blue-800 pb-2">
              Theo dõi chúng tôi
            </h3>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                className="bg-white/10 border-white/20 hover:bg-white/20 hover:text-white transition-all"
                asChild
              >
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Facebook</span>
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-white/10 border-white/20 hover:bg-white/20 hover:text-white transition-all"
                asChild
              >
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Instagram className="h-4 w-4" />
                  <span className="sr-only">Instagram</span>
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-white/10 border-white/20 hover:bg-white/20 hover:text-white transition-all"
                asChild
              >
                <a href="https://twitter.com" target="_blank" rel="noreferrer">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Bản quyền */}
        <div className="border-t border-blue-800 mt-12 pt-8 text-center text-sm text-blue-300">
          <p>&copy; {new Date().getFullYear()} PetCareX. Bảo lưu mọi quyền.</p>
          <div className="mt-2 flex justify-center gap-4 text-xs">
            <Link to="/privacy" className="hover:underline">
              Chính sách bảo mật
            </Link>
            <Link to="/terms" className="hover:underline">
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
