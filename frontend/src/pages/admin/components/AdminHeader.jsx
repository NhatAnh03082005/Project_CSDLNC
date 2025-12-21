import { Button } from "../../../components/ui/button";
import { Menu, Bell, Settings } from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="flex h-16 items-center gap-4 px-6">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg overflow-hidden">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="font-bold text-sm">PetCareX Admin</div>
            <div className="text-xs text-gray-500">Hệ thống quản trị</div>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3 border-l pl-3">
            <div className="text-right">
              <div className="text-sm font-medium">Admin User</div>
              <div className="text-xs text-gray-500">Quản trị viên</div>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
              AD
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
