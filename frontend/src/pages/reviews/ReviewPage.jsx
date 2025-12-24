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

      
    </div>
  )
}