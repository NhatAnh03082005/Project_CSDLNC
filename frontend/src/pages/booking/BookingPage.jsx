import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, ArrowLeft } from "lucide-react"

function BookingContent() {
  const searchParams = useSearchParams()
  const branchId = searchParams.get("branch")
  const service = searchParams.get("service")

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-blue-600 fill-blue-600" />
            <span className="text-xl font-bold text-blue-900">PetCare</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Link href={`/branches?service=${service}`}>
          <Button variant="ghost" className="gap-2 mb-8">
            <ArrowLeft className="h-4 w-4" />
            Quay lại chọn chi nhánh
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Đặt lịch hẹn</CardTitle>
            <CardDescription>
              Chi nhánh #{branchId} - Dịch vụ: {service}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-center py-12">
              <p className="text-gray-600">Tính năng đặt lịch đang được phát triển...</p>
              <p className="text-sm text-gray-500">
                Trang này sẽ chứa form đặt lịch chi tiết với chọn ngày giờ, thông tin thú cưng, và lý do khám.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  )
}
