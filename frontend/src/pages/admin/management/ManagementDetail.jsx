import React from "react";
import { Button } from "../../../components/ui/button";
import { ArrowLeft } from "lucide-react";

import BranchManagement from "./components/BranchManagement";
import EmployeeManagement from "./components/EmployeeManagement";
import PromotionManagement from "./components/PromotionManagement";
import ProductstockManagement from "./components/ProductstockManagement";
import ProductManagement from "./components/ProductManagement";
import VaccineManagement from "./components/VaccineManagement";
import VaccinestockManagement from "./components/VaccinestockManagement";
import ServiceManagement from "./components/ServiceManagement";
import EmployeeTransferHistory from "./components/EmployeeTransferHistory";

export default function ManagementDetail({ type, onBack }) {
  const getTitleByType = () => {
    switch (type) {
      case "employee":
        return "Quản lý nhân viên";
      case "promotion":
        return "Quản lý khuyến mãi";
      case "service":
        return "Quản lý dịch vụ";
      case "product":
        return "Quản lý sản phẩm";
      case "productsStock":
        return "Quản lý tồn kho sản phẩm";
      case "vaccine":
        return "Quản lý vắc-xin";
      case "vaccinesStock":
        return "Quản lý kho vắc-xin";
      case "branch":
        return "Quản lý chi nhánh";
      case "transfer":
        return "Lịch sử điều động nhân viên";
      default:
        return "Quản lý";
    }
  };

  return (
    <>
      {type === "employee" && <EmployeeManagement />}
      {type === "promotion" && <PromotionManagement />}
      {type === "service" && <ServiceManagement />}
      {type === "product" && <ProductManagement />}
      {type === "productsStock" && <ProductstockManagement />}
      {type === "vaccine" && <VaccineManagement />}
      {type === "vaccinesStock" && <VaccinestockManagement />}
      {type === "branch" && <BranchManagement />}
      {type === "transfer" && <EmployeeTransferHistory />}
    </>
  );
}
