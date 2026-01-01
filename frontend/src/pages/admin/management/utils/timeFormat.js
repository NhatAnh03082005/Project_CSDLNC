// Chuẩn hóa dữ liệu để hiển thị trong <input type="time" /> => "HH:MM"
export function formatTimeFromSQL(value) {
  if (!value) return "";

  if (value instanceof Date && !isNaN(value.getTime())) {
    const hh = String(value.getHours()).padStart(2, "0");
    const mm = String(value.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  if (typeof value === "string") {
    const m = value.match(/(\d{1,2}):(\d{2})/);
    if (!m) return "";
    const hh = m[1].padStart(2, "0");
    const mm = m[2];
    return `${hh}:${mm}`;
  }

  if (typeof value === "object") {
    const h = value.hours ?? value.hour;
    const m = value.minutes ?? value.minute;
    if (Number.isInteger(h) && Number.isInteger(m)) {
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    }
  }

  return "";
}

export function inputHHMMToServerTime(value) {
  if (!value) return null;
  const m = String(value).match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return null;
  const hh = m[1].padStart(2, "0");
  const mm = m[2];
  const ss = (m[3] ?? "00").padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

export const formatDate = (dateString) => {
  if (!dateString) return "Đến nay";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};
