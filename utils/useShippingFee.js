"use client";

import { useState, useEffect } from "react";
import { getShippingFee } from "./ghnApi"; // chỗ bạn để hàm GHN

export function useShippingFee({
  fromDistrictId,
  toDistrictId,
  toWardCode,
  weight,
  length,
  width,
  height,
  insuranceValue = 0,
  coupon = null,
}) {
  const [shippingFee, setShippingFee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!toDistrictId || !toWardCode) return;

    async function fetchFee() {
      setLoading(true);
      setError("");
      try {
        const data = await getShippingFee({
          fromDistrictId,
          toDistrictId,
          toWardCode,
          weight,
          length,
          width,
          height,
          insuranceValue,
          coupon,
        });
        setShippingFee(data.data.total);
      } catch (err) {
        setError(err.message || "Không tính được phí vận chuyển");
      } finally {
        setLoading(false);
      }
    }

    fetchFee();
  }, [
    fromDistrictId,
    toDistrictId,
    toWardCode,
    weight,
    length,
    width,
    height,
    insuranceValue,
    coupon,
  ]);

  return { shippingFee, loading, error };
}
