"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import debounce from "lodash/debounce";

export default function useShippingFee() {
  const [fee, setFee] = useState(0);
  const cacheRef = useRef({});

  const fetchShippingFee = async (params) => {
    const cacheKey = JSON.stringify(params);
    if (cacheRef.current[cacheKey]) {
      console.log("💾 Lấy phí ship từ cache");
      setFee(cacheRef.current[cacheKey]);
      return;
    }

    try {
      const res = await axios.post("/api/shipping", params);
      const total = res.data?.fee ?? 0;
      cacheRef.current[cacheKey] = total;
      setFee(total);
      console.log("🚚 GHN fee:", total);
    } catch (error) {
      console.error("Shipping fee error:", error);
      setFee(0);
    }
  };

  const debouncedFetch = useRef(debounce(fetchShippingFee, 500)).current;

  return { fee, fetchShippingFee: debouncedFetch };
}
