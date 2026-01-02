import React from "react";
import RevenueStats from "./components/RevenueStats";
import ProductStats from "./components/ProductStats";
import VaccineStats from "./components/VaccineStats";
import ServiceStats from "./components/ServiceStats";
import CustomerStats from "./components/CustomerStats";
import PerformanceStats from "./components/PerformanceStats";

export default function StatisticsDetail({
  type,
  timeUnit,
  timeValue,
  setTimeUnit,
  setTimeValue,
  data,
}) {
  return (
    <>
      {type === "revenue" && (
        <RevenueStats
          timeUnit={timeUnit}
          timeValue={timeValue}
          setTimeUnit={setTimeUnit}
          setTimeValue={setTimeValue}
          data={data}
        />
      )}
      {type === "product" && (
        <ProductStats
          timeUnit={timeUnit}
          timeValue={timeValue}
          setTimeUnit={setTimeUnit}
          setTimeValue={setTimeValue}
          data={data}
        />
      )}
      {type === "vaccine" && (
        <VaccineStats
          timeUnit={timeUnit}
          timeValue={timeValue}
          setTimeUnit={setTimeUnit}
          setTimeValue={setTimeValue}
          data={data}
        />
      )}
      {type === "service" && (
        <ServiceStats
          timeUnit={timeUnit}
          timeValue={timeValue}
          setTimeUnit={setTimeUnit}
          setTimeValue={setTimeValue}
          data={data}
        />
      )}
      {type === "customer" && <CustomerStats data={data} />}
      {type === "performance" && <PerformanceStats data={data} />}
    </>
  );
}
