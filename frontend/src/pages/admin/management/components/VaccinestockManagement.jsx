import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../../../components/ui/dialog";
import { Plus, ArrowLeft } from "lucide-react";

export default function VaccinestockManagement() {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isAddVaccineDialogOpen, setIsAddVaccineDialogOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState("");

  const allVaccines = [
    { id: 1, name: "Vắc-xin 5 bệnh", manufacturer: "Nobivac" },
    { id: 2, name: "Vắc-xin dại", manufacturer: "Rabigen" },
    { id: 3, name: "Vắc-xin cúm", manufacturer: "Canigen" },
    { id: 4, name: "Vắc-xin 7 bệnh", manufacturer: "Vanguard" },
  ];

  const branches = [
    "PetCare Quận 1",
    "PetCare Quận 3",
    "PetCare Bình Thạnh",
    "PetCare Thủ Đức",
    "PetCare Gò Vấp",
    "PetCare Tân Bình",
    "PetCare Phú Nhuận",
    "PetCare Quận 7",
    "PetCare Quận 10",
    "PetCare Bình Tân",
  ];

  const vaccines = [
    {
      id: 1,
      name: "Vắc-xin cúm",
      type: "Vắc-xin phòng bệnh",
      quantity: 45,
      price: 450000,
    },
    {
      id: 2,
      name: "Vắc-xin dại",
      type: "Vắc-xin phòng bệnh",
      quantity: 28,
      price: 165000,
    },
    {
      id: 3,
      name: "Vắc-xin 5 bệnh",
      type: "Vắc-xin phòng bệnh",
      quantity: 67,
      price: 120000,
    },
    {
      id: 4,
      name: "Vắc-xin 7 bệnh",
      type: "Vắc-xin phòng bệnh",
      quantity: 52,
      price: 380000,
    },
  ];

  if (selectedBranch) {
    return (
      <>
        <Button
          variant="ghost"
          className="gap-2 mb-4 hover:text-red-600 hover:bg-red-50"
          onClick={() => setSelectedBranch(null)}
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách chi nhánh
        </Button>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Vắc-xin tại {selectedBranch}</CardTitle>
                <CardDescription>
                  Quản lý số lượng vắc-xin tồn kho
                </CardDescription>
              </div>
              <Dialog
                open={isAddVaccineDialogOpen}
                onOpenChange={setIsAddVaccineDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Thêm vắc-xin vào kho
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Thêm vắc-xin vào kho</DialogTitle>
                    <DialogDescription>
                      Chọn vắc-xin từ danh sách và nhập số lượng
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="vaccineSelect">Chọn vắc-xin</Label>
                      <select
                        id="vaccineSelect"
                        value={selectedVaccine}
                        onChange={(e) => setSelectedVaccine(e.target.value)}
                        className="w-full border rounded-lg p-2 flex h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">-- Chọn vắc-xin --</option>
                        {allVaccines.map((vaccine) => (
                          <option key={vaccine.id} value={vaccine.id}>
                            {vaccine.name} ({vaccine.manufacturer})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vaccineInitialQuantity">
                        Số lượng ban đầu
                      </Label>
                      <Input
                        id="vaccineInitialQuantity"
                        type="number"
                        placeholder="0"
                        defaultValue="0"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddVaccineDialogOpen(false)}
                    >
                      Hủy
                    </Button>
                    <Button onClick={() => setIsAddVaccineDialogOpen(false)}>
                      Thêm vào kho
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vaccines.map((vaccine) => (
                <div
                  key={vaccine.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-semibold">{vaccine.name}</div>
                    <div className="text-sm text-gray-500">{vaccine.type}</div>
                    <div className="text-sm font-medium text-blue-600">
                      {vaccine.price.toLocaleString("vi-VN")} ₫
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Label
                      htmlFor={`quantity-${vaccine.id}`}
                      className="text-sm"
                    >
                      Số lượng:
                    </Label>
                    <Input
                      id={`quantity-${vaccine.id}`}
                      type="number"
                      defaultValue={vaccine.quantity}
                      className="w-24"
                    />
                    <Button size="sm">Cập nhật</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chọn chi nhánh</CardTitle>
        <CardDescription>
          Chọn chi nhánh để xem và quản lý tồn kho
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-3">
          {branches.map((branch, index) => (
            <Button
              key={index}
              variant="outline"
              className="justify-start h-auto p-4 bg-transparent"
              onClick={() => setSelectedBranch(branch)}
            >
              <div className="text-left">
                <div className="font-semibold">{branch}</div>
                <div className="text-sm text-gray-500">
                  Xem sản phẩm tồn kho
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
