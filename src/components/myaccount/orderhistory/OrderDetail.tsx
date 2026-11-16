"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { orderApi } from "@/api/orderApi";
import type { OrderDetailResponse } from "@/type/Order";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import styles from "./OrderDetail.module.css";

const labels: Record<string,string> = {
  pending:"Chờ xác nhận", confirmed:"Đã xác nhận", preparing:"Đang chuẩn bị",
  ready_to_ship:"Chờ giao hàng", shipping:"Đang giao hàng", completed:"Hoàn thành",
  cancelled:"Đã hủy", delivery_failed:"Giao hàng thất bại",
};
const money=(n=0)=>`${Number(n).toLocaleString("vi-VN")} ₫`;

export default function OrderDetail() {
  const params=useParams<{productId:string}>();
  const user=useSelector((s:RootState)=>s.login.user);
  const [data,setData]=useState<OrderDetailResponse|null>(null);
  const [loading,setLoading]=useState(true);
  const [reason,setReason]=useState("");
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);

  const load=async()=>{
    if(!params.productId) return;
    setLoading(true);
    try { setData(await orderApi.getById(params.productId)); }
    catch(e:any) { setMessage(e.response?.data?.message ?? "Không thể tải chi tiết đơn hàng."); }
    finally { setLoading(false); }
  };
  useEffect(()=>{ if(user?._id) void load(); },[params.productId,user?._id]);

  const requestCancel=async()=>{
    if(!reason.trim()) { setMessage("Vui lòng nhập lý do muốn hủy đơn."); return; }
    setBusy(true);
    try { await orderApi.requestCancellation(params.productId,reason); setReason(""); setMessage("Đã gửi yêu cầu hủy. Shop sẽ xem xét."); await load(); }
    catch(e:any) { setMessage(e.response?.data?.message ?? "Không thể gửi yêu cầu hủy."); }
    finally { setBusy(false); }
  };

  if(loading) return <main className={styles.page}>Đang tải chi tiết đơn hàng...</main>;
  if(!data) return <main className={styles.page}>{message || "Không tìm thấy đơn hàng."}</main>;
  const {order,payment,deliveries,statusHistory}=data;
  const canRequestCancel=!["completed","cancelled"].includes(order.status) && order.cancellationStatus!=="requested";

  return <main className={styles.page}>
    <header className={styles.header}>
      <div><h1>Chi tiết đơn hàng</h1><p>Mã đơn: <strong>{order.orderCode}</strong></p></div>
      <span className={styles.status}>{labels[order.status] ?? order.status}</span>
    </header>
    {message && <p className={styles.message}>{message}</p>}
    <section className={styles.panel}>
      <h2>Tiến trình đơn hàng</h2>
      <div className={styles.timeline}>
        {statusHistory.map((entry)=><div className={styles.timelineItem} key={entry._id}>
          <span className={styles.dot}/><div><strong>{labels[entry.toStatus] ?? entry.toStatus}</strong>
          {entry.note && <p>{entry.note}</p>}<small>{new Date(entry.createdAt).toLocaleString("vi-VN")}</small></div>
        </div>)}
        {!statusHistory.length && <p>Đơn hàng đang chờ shop xác nhận.</p>}
      </div>
    </section>
    <section className={styles.panel}>
      <h2>Sản phẩm</h2>
      {order.items.map((item,i)=><div className={styles.product} key={`${item.productId}-${i}`}>
        <div><strong>{item.name}</strong><p>{[item.size,item.color].filter(Boolean).join(" · ")}</p><small>Số lượng: {item.quantity}</small></div>
        <strong>{money(item.price*item.quantity)}</strong>
      </div>)}
      <div className={styles.total}><span>Tiền hàng</span><strong>{money(order.subtotal)}</strong></div>
      <div className={styles.total}><span>Phí vận chuyển</span><strong>{money(order.shippingFee)}</strong></div>
      <div className={styles.total}><span>Giảm giá</span><strong>{money(order.discount)}</strong></div>
      <div className={styles.grand}><span>Tổng thanh toán</span><strong>{money(order.totalPrice)}</strong></div>
    </section>
    <section className={styles.panel}>
      <h2>Thanh toán</h2>
      {payment ? <>
        <p>Phương thức: <strong>{payment.method==="cod"?"Thanh toán khi nhận hàng (COD)":"Chuyển khoản ngân hàng"}</strong></p>
        <p>Trạng thái: <strong>{payment.status}</strong></p>
        <div className={styles.total}><span>Đã thanh toán</span><strong>{money(payment.paidAmount)}</strong></div>
        <div className={styles.total}><span>Còn phải thanh toán</span><strong>{money(payment.remainingAmount)}</strong></div>
        {payment.depositRequired && <p>Tiền đặt cọc yêu cầu: {money(payment.depositAmount)}</p>}
      </>:<p>Chưa có thông tin thanh toán.</p>}
    </section>
    <section className={styles.panel}>
      <h2>Địa chỉ nhận hàng</h2>
      <p>{order.shippingAddress.fullName}</p><p>{order.shippingAddress.phoneNumber}</p><p>{order.shippingAddress.address}</p>
    </section>
    {deliveries.length>0 && <section className={styles.panel}>
      <h2>Lịch giao hàng</h2>
      {deliveries.map(d=><div className={styles.delivery} key={d._id}>
        <strong>{d.deliveryCode}</strong><span>{new Date(d.scheduledDate).toLocaleString("vi-VN")}</span>
        <span>{d.timeSlot}</span><span>{d.status}</span>{d.failureReason&&<p>{d.failureReason}</p>}
      </div>)}
    </section>}
    {canRequestCancel && <section className={styles.panel}>
      <h2>Yêu cầu hủy đơn</h2>
      {order.cancellationStatus==="requested" ? <p>Yêu cầu hủy của bạn đang chờ shop xem xét.</p> : <>
        <textarea value={reason} onChange={e=>setReason(e.target.value)} placeholder="Nhập lý do muốn hủy đơn..." rows={3}/>
        <button disabled={busy} onClick={requestCancel}>{busy?"Đang gửi...":"Gửi yêu cầu hủy đơn"}</button>
      </>}
    </section>}
  </main>;
}
