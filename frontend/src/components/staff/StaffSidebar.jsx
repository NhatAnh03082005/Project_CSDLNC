import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Home,
  Receipt,
  FilePlus,
  Clock,
  Calendar,
  History,
  Stethoscope,
  Syringe,
  Pill,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";

export default function StaffSidebar() {
  const location = useLocation();
  const { user } = useAuthStore();

  return (
    <aside className="hidden md:block w-64 border-r border-gray-200 bg-white min-h-[calc(100vh-4rem)] sticky top-16 shadow-sm z-40">
      <nav className="p-5 space-y-1">
        <Link to="/staff/demo">
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 h-12 rounded-xl text-base font-medium transition-all duration-200 ${
              location.pathname === "/staff/demo"
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Home
              className={`h-5 w-5 ${
                location.pathname === "/staff/demo"
                  ? "text-blue-600"
                  : "text-gray-400"
              }`}
            />
            <span>Trang chủ</span>
          </Button>
        </Link>

        {user?.ViTri !== "Bác sĩ thú y" && (
          <>
            <div className="pt-6 pb-2 px-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Nghiệp vụ
              </p>
            </div>

            <Link to="/staff/create-record">
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 h-12 rounded-xl text-base font-medium transition-all duration-200 ${
                  location.pathname === "/staff/create-record"
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <FilePlus
                  className={`h-5 w-5 ${
                    location.pathname === "/staff/create-record"
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                />
                <span>Tạo hồ sơ</span>
              </Button>
            </Link>

            <Link to="/staff/invoice">
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 h-12 rounded-xl text-base font-medium transition-all duration-200 ${
                  location.pathname === "/staff/invoice"
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Receipt
                  className={`h-5 w-5 ${
                    location.pathname === "/staff/invoice"
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                />
                <span>Lập hóa đơn</span>
              </Button>
            </Link>
          </>
        )}

        {user?.ViTri === "Bác sĩ thú y" && (
          <>
            <div className="pt-6 pb-2 px-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Lịch trình
              </p>
            </div>

            <Link to="/staff/work-schedule">
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 h-12 rounded-xl text-base font-medium transition-all duration-200 ${
                  location.pathname === "/staff/work-schedule"
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Clock
                  className={`h-5 w-5 ${
                    location.pathname === "/staff/work-schedule"
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                />
                <span>Lịch làm việc</span>
              </Button>
            </Link>

            <Link to="/staff/doctor-appointments">
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 h-12 rounded-xl text-base font-medium transition-all duration-200 ${
                  location.pathname === "/staff/doctor-appointments"
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Calendar
                  className={`h-5 w-5 ${
                    location.pathname === "/staff/doctor-appointments"
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                />
                <span>Lịch hẹn của tôi</span>
              </Button>
            </Link>

            <div className="pt-6 pb-2 px-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Bệnh án
              </p>
            </div>

            <Link to="/staff/medical-history">
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 h-12 rounded-xl text-base font-medium transition-all duration-200 ${
                  location.pathname === "/staff/medical-history"
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <History
                  className={`h-5 w-5 ${
                    location.pathname === "/staff/medical-history"
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                />
                <span>Lịch sử khám bệnh</span>
              </Button>
            </Link>

            <Link to="/staff/medicines">
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 h-12 rounded-xl text-base font-medium transition-all duration-200 ${
                  location.pathname === "/staff/medicines"
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Pill
                  className={`h-5 w-5 ${
                    location.pathname === "/staff/medicines"
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                />
                <span>Tra cứu thuốc</span>
              </Button>
            </Link>

            <Link to="/staff/medical-records">
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 h-12 rounded-xl text-base font-medium transition-all duration-200 ${
                  location.pathname === "/staff/medical-records"
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Stethoscope
                  className={`h-5 w-5 ${
                    location.pathname === "/staff/medical-records"
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                />
                <span>Hồ sơ khám bệnh</span>
              </Button>
            </Link>

            <Link to="/staff/vaccination-records">
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 h-12 rounded-xl text-base font-medium transition-all duration-200 ${
                  location.pathname === "/staff/vaccination-records"
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Syringe
                  className={`h-5 w-5 ${
                    location.pathname === "/staff/vaccination-records"
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                />
                <span>Hồ sơ tiêm phòng</span>
              </Button>
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
