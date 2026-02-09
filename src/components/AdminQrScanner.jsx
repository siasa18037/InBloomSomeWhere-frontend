import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function AdminQrScanner({ onResult, onClose }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false
    );

    scanner.render(
      (decodedText) => {
        let orderId = decodedText;

        if (decodedText.includes("/order/")) {
          orderId = decodedText.split("/order/").pop();
        }

        orderId = orderId.split("?")[0].split("#")[0];

        onResult(orderId);
        scanner.clear();
      },
      () => {
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center"
      style={{ zIndex: 2000 }}
    >
      <div
        className="bg-white rounded-4 shadow p-4 text-center"
        style={{ width: 320 }}
      >
        <h5 className="fw-bold mb-3 text-danger">
          สแกน QR ออเดอร์
        </h5>

        <div id="qr-reader" style={{ width: "100%" }} />

        <button
          className="btn btn-outline-secondary w-100 rounded-pill mt-3"
          onClick={onClose}
        >
          ปิด
        </button>
      </div>
    </div>
  );
}
