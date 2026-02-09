// ===============================
// Sheet (Thai) <-> React (EN)
// ===============================

export function fromSheetToForm(o) {
  if (!o) return null;

  return {
    orderId: o["Order ID"],
    orderDate: o["วันที่รับออเดอร์"],
    deliveryDate: o["วันที่ส่ง / รับสินค้า"]?.slice(0, 10) || "",
    status: o["สถานะออเดอร์"],

    customerName: o["ชื่อลูกค้า"],
    phone: o["เบอร์โทร"],
    channel: o["ช่องทางสั่ง"],

    productCode: o["รหัสสินค้า"],
    productName: o["ชื่อสินค้า"],
    qty: Number(o["จำนวน"] || 0),

    customOption: o["ปรับแต่งเพิ่มเติม"],
    cardMessage: o["ข้อความการ์ด"],
    sender: o["ผู้ให้"],

    receiveMethod: o["วิธีรับสินค้า"],
    address: o["ที่อยู่จัดส่ง"],
    deliveryTime: o["เวลาจัดส่ง"],

    pricePerBouquet: Number(o["ราคาต่อช่อ"] || 0),
    productTotal: Number(o["ราคารวมสินค้า"] || 0),
    shipping: Number(o["ค่าจัดส่ง"] || 0),
    discount: Number(o["ส่วนลด"] || 0),
    net: Number(o["ยอดสุทธิ"] || 0),

    paymentMethod: o["วิธีชำระเงิน"],
    paymentStatus: o["สถานะชำระเงิน"],
    paymentDate: o["วันที่ชำระเงิน"],

    note: o["หมายเหตุร้าน"]
  };
}

export function fromFormToSheet(form) {
  return {
    "Order ID": form.orderId,
    "วันที่รับออเดอร์": form.orderDate,
    "วันที่ส่ง / รับสินค้า": form.deliveryDate,
    "สถานะออเดอร์": form.status,

    "ชื่อลูกค้า": form.customerName,
    "เบอร์โทร": form.phone,
    "ช่องทางสั่ง": form.channel,

    "รหัสสินค้า": form.productCode,
    "ชื่อสินค้า": form.productName,
    "จำนวน": Number(form.qty),

    "ปรับแต่งเพิ่มเติม": form.customOption,
    "ข้อความการ์ด": form.cardMessage,
    "ผู้ให้": form.sender,

    "วิธีรับสินค้า": form.receiveMethod,
    "ที่อยู่จัดส่ง": form.address,
    "เวลาจัดส่ง": form.deliveryTime,

    "ราคาต่อช่อ": Number(form.pricePerBouquet),
    "ราคารวมสินค้า": Number(form.productTotal),
    "ค่าจัดส่ง": Number(form.shipping),
    "ส่วนลด": Number(form.discount),
    "ยอดสุทธิ": Number(form.net),

    "วิธีชำระเงิน": form.paymentMethod,
    "สถานะชำระเงิน": form.paymentStatus,
    "วันที่ชำระเงิน": form.paymentDate,

    "หมายเหตุร้าน": form.note
  };
}
