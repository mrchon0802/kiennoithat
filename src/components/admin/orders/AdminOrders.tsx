"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { fetchAllOrders, updateOrderStatus } from "@/store/orderSlice";
import type { OrderStatus } from "@/type/Order";
import styles from "./AdminOrders.module.css";

const labels:Record<string,string>={pending:"Chờ xác nhận",confirmed:"Đã xác nhận",preparing:"Đang chuẩn bị",ready_to_ship:"Sẵn sàng giao",shipping:"Đang giao",completed:"Hoàn thành",cancelled:"Đã hủy",delivery_failed:"Giao thất bại"};
const next:Record<string,OrderStatus>={pending:"confirmed",confirmed:"preparing",preparing:"ready_to_ship"};
const money=(n=0)=>`${Number(n).toLocaleString("vi-VN")} ₫`;

export default function AdminOrders() {
 const dispatch=useDispatch<AppDispatch>();
 const user=useSelector((s:RootState)=>s.login.user);
 const {orders,loading,error}=useSelector((s:RootState)=>s.order);
 const [busy,setBusy]=useState<string|null>(null);
 useEffect(()=>{if(user?.role==="admin") dispatch(fetchAllOrders());},[dispatch,user?.role]);
 const advance=async(id:string,status:OrderStatus)=>{
  setBusy(id); try{await dispatch(updateOrderStatus({orderId:id,status})).unwrap();}finally{setBusy(null);}
 };
 if(user?.role!=="admin") return <main className={styles.page}>Bạn không có quyền truy cập.</main>;
 return <main className={styles.page}>
  <header><div><h1>Quản lý đơn hàng</h1><p>Theo dõi và xử lý đơn hàng của Kiến Nội Thất.</p></div><button onClick={()=>dispatch(fetchAllOrders())}>Làm mới</button></header>
  {error&&<p className={styles.error}>{error}</p>}
  {loading&&!orders.length?<p>Đang tải...</p>:<div className={styles.tableWrap}><table><thead><tr><th>Mã đơn</th><th>Ngày đặt</th><th>Sản phẩm</th><th>Tổng tiền</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
  <tbody>{orders.map(o=><tr key={o._id}><td><strong>{o.orderCode}</strong></td><td>{new Date(o.createdAt).toLocaleDateString("vi-VN")}</td><td>{o.items.length} sản phẩm</td><td>{money(o.totalPrice)}</td><td>{labels[o.status]??o.status}</td><td><div className={styles.actions}><Link href={`/my-account/order-history/${o._id}`}>Chi tiết</Link>{next[o.status]&&<button disabled={busy===o._id} onClick={()=>advance(o._id,next[o.status])}>{busy===o._id?"Đang lưu...":labels[next[o.status]]}</button>}</div></td></tr>)}</tbody></table>
  {!orders.length&&<p className={styles.empty}>Chưa có đơn hàng.</p>}</div>}
 </main>;
}
