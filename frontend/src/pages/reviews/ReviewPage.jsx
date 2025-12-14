import React, { useState } from "react";
// 1. Thay thế Next.js Link bằng React Router DOM Link
import { Link } from "react-router-dom"; 

// 2. Chuyển đổi imports alias (@/) sang đường dẫn tương đối (../../...)
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Heart, User, FolderOpen, ClipboardPlus, Star, Calendar, Clock, MapPin } from "lucide-react";

// Mock data for appointment history
// Loại bỏ khai báo kiểu TypeScript: (typeof appointmentHistory)[0] | null
const appointmentHistory = [
  {
    id: 1,
    type: "exam",
    typeName: "Khám bệnh",
    date: "15/11/2024",
    time: "10:00",
    branch: "Chi nhánh Quận 1",
    petName: "Mèo Miu",
    status: "completed",
    hasReview: false,
    review: null, // Thêm review: null để khớp với logic TypeScript cũ
  },
  {
    id: 2,
    type: "vaccination",
    typeName: "Tiêm phòng",
    date: "20/10/2024",
    time: "14:30",
    branch: "Chi nhánh Quận 3",
    petName: "Chó Lucky",
    status: "completed",
    hasReview: true,
    review: {
      serviceQuality: 5,
      staffAttitude: 5,
      overall: 5,
      comment: "Dịch vụ rất tốt, bác sĩ tận tâm!",
    },
  },
  {
    id: 3,
    type: "exam",
    typeName: "Khám bệnh",
    date: "05/10/2024",
    time: "09:00",
    branch: "Chi nhánh Quận 7",
    petName: "Chó Bông",
    status: "completed",
    hasReview: false,
    review: null, // Thêm review: null để khớp với logic TypeScript cũ
  },
];

export default function ReviewsPage() {
  const [appointments, setAppointments] = useState(appointmentHistory);
  // Loại bỏ khai báo kiểu TypeScript: (typeof appointmentHistory)[0] | null
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [serviceQuality, setServiceQuality] = useState(5);
  const [staffAttitude, setStaffAttitude] = useState(5);
  const [overall, setOverall] = useState(5);
  const [comment, setComment] = useState("");

  // Loại bỏ khai báo kiểu TypeScript: (appointment: (typeof appointmentHistory)[0])
  const handleReview = (appointment) => {
    setSelectedAppointment(appointment);
    if (appointment.hasReview && appointment.review) {
      setServiceQuality(appointment.review.serviceQuality);
      setStaffAttitude(appointment.review.staffAttitude);
      setOverall(appointment.review.overall);
      setComment(appointment.review.comment);
    } else {
      setServiceQuality(5);
      setStaffAttitude(5);
      setOverall(5);
      setComment("");
    }
    setDialogOpen(true);
  };

  const handleSubmitReview = () => {
    if (selectedAppointment) {
      const updatedAppointments = appointments.map((apt) =>
        apt.id === selectedAppointment.id
          ? {
              ...apt,
              hasReview: true,
              review: {
                serviceQuality,
                staffAttitude,
                overall,
                comment,
              },
            }
          : apt,
      );
      setAppointments(updatedAppointments);
      setDialogOpen(false);
    }
  };

  // Loại bỏ khai báo kiểu TypeScript cho props
  const StarRating = ({ value, onChange }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none transition-colors"
          >
            <Star className={`h-6 w-6 ${star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
          </button>
        ))}
      </div>
    );
  };

  // Loại bỏ khai báo kiểu TypeScript cho props
  const StarDisplay = ({ value }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-blue-600 fill-blue-600" />
            <span className="text-xl font-bold text-blue-900">PetCare</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {/* Sửa Link href -> to */}
            <Link to="/" className="text-sm font-medium hover:text-blue-600">
              Trang chủ
            </Link>
            <Link to="/services" className="text-sm font-medium hover:text-blue-600">
              Dịch vụ
            </Link>
            <Link to="/products" className="text-sm font-medium hover:text-blue-600">
              Sản phẩm
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-blue-600">
              Về chúng tôi
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/abstract-geometric-shapes.png" alt="User" />
                    <AvatarFallback>KH</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Khách hàng</p>
                    <p className="text-xs leading-none text-muted-foreground">khachhang@email.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  {/* Sửa Link href -> to */}
                  <Link href="/profile" className="flex items-center w-full">
                    Quản lý hồ sơ
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FolderOpen className="mr-2 h-4 w-4" />
                  {/* Sửa Link href -> to */}
                  <Link href="/pets" className="flex items-center w-full">
                    Thêm/xóa/cập nhật hồ sơ thú cưng
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ClipboardPlus className="mr-2 h-4 w-4" />
                  {/* Sửa Link href -> to */}
                  <Link to="/vaccination-packages" className="flex items-center w-full">
                    Đăng ký gói tiêm phòng
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Star className="mr-2 h-4 w-4" />
                  {/* Sửa Link href -> to */}
                  <Link to="/reviews" className="flex items-center w-full">
                    Đánh giá
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">Đăng xuất</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Lịch sử dịch vụ và đánh giá</h1>
            <p className="text-gray-600">Xem lại lịch sử sử dụng dịch vụ và chia sẻ trải nghiệm của bạn</p>
          </div>

          {appointments.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có lịch sử sử dụng dịch vụ</h3>
                <p className="text-gray-600">Đặt lịch khám hoặc tiêm phòng cho thú cưng của bạn ngay hôm nay</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {appointments.map((appointment) => (
                <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{appointment.typeName}</CardTitle>
                          <Badge
                            variant="secondary"
                            className={
                              appointment.type === "exam" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                            }
                          >
                            {appointment.type === "exam" ? "Khám bệnh" : "Tiêm phòng"}
                          </Badge>
                          {appointment.hasReview && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                              Đã đánh giá
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-base">
                          <div className="flex flex-col gap-2 mt-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span>
                                <strong>Ngày hẹn:</strong> {appointment.date}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span>
                                <strong>Giờ hẹn:</strong> {appointment.time}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span>
                                <strong>Chi nhánh:</strong> {appointment.branch}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />
                              <span>
                                <strong>Thú cưng:</strong> {appointment.petName}
                              </span>
                            </div>
                          </div>
                          {appointment.hasReview && appointment.review && (
                            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                              <div className="flex items-center gap-2 mb-2">
                                <Star className="h-4 w-4 text-yellow-600 fill-yellow-600" />
                                <span className="font-semibold text-gray-900">Đánh giá của bạn</span>
                              </div>
                              <div className="grid gap-2 text-sm">
                                <div className="flex items-center justify-between">
                                  <span>Chất lượng dịch vụ:</span>
                                  <StarDisplay value={appointment.review.serviceQuality} />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Thái độ nhân viên:</span>
                                  <StarDisplay value={appointment.review.staffAttitude} />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Đánh giá tổng thể:</span>
                                  <StarDisplay value={appointment.review.overall} />
                                </div>
                                {appointment.review.comment && (
                                  <div className="mt-2 pt-2 border-t border-yellow-200">
                                    <p className="text-gray-700 italic">"{appointment.review.comment}"</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </CardDescription>
                      </div>
                      <Button onClick={() => handleReview(appointment)} className="flex-shrink-0">
                        <Star className="h-4 w-4 mr-2" />
                        {appointment.hasReview ? "Xem đánh giá" : "Đánh giá"}
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Review Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Đánh giá dịch vụ</DialogTitle>
            <DialogDescription>
              Chia sẻ trải nghiệm của bạn về dịch vụ {selectedAppointment?.typeName} tại {selectedAppointment?.branch}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="serviceQuality">Điểm chất lượng dịch vụ</Label>
              <StarRating value={serviceQuality} onChange={setServiceQuality} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="staffAttitude">Điểm thái độ nhân viên</Label>
              <StarRating value={staffAttitude} onChange={setStaffAttitude} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="overall">Điểm tổng thể</Label>
              <StarRating value={overall} onChange={setOverall} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="comment">Bình luận</Label>
              <Textarea
                id="comment"
                placeholder="Chia sẻ cảm nhận của bạn về dịch vụ, nhân viên, cơ sở vật chất..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmitReview}>Gửi đánh giá</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-6 w-6 fill-white" />
                <span className="text-lg font-bold">PetCare</span>
              </div>
              <p className="text-blue-200 text-sm">
                Hệ thống phòng khám thú y uy tín, chăm sóc thú cưng với tình yêu thương
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Dịch vụ</h3>
              <ul className="space-y-2 text-sm text-blue-200">
                <li>Khám bệnh</li>
                <li>Tiêm phòng</li>
                <li>Phẫu thuật</li>
                <li>Chăm sóc spa</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Liên hệ</h3>
              <ul className="space-y-2 text-sm text-blue-200">
                <li>Hotline: 1900 xxxx</li>
                <li>Email: info@petcare.vn</li>
                <li>Giờ làm việc: 8:00 - 20:00</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Theo dõi</h3>
              <div className="flex gap-4">
                <Button variant="outline" size="icon" className="bg-white/10 border-white/20 hover:bg-white/20">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </Button>
                <Button variant="outline" size="icon" className="bg-white/10 border-white/20 hover:bg-white/20">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.689-.07-4.948 0-3.259.013-3.668.072-4.948.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-sm text-blue-200">
            <p>&copy; 2025 PetCare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}