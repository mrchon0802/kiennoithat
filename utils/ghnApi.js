import { headers } from "next/headers";

const BASE_URL = "https://online-gateway.ghn.vn/shiip/public-api";
const TOKEN = process.env.NEXT_PUBLIC_GHN_TOKEN;
const SHOP_ID = process.env.NEXT_PUBLIC_GHN_SHOP_ID;

async function ghnFetch(endpoint, option = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...option,
    headers: {
      "Content-Type": "application/json",
      Token: TOKEN,
      ShopId: SHOP_ID,
      ...(option.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`GHN status: ${res.status}`);
  }
  return res.json();
}

export function getProvince() {
  return ghnFetch("/master-data/province");
}

export function getDistrict(provinceId) {
  return ghnFetch("/master-data/district", {
    method: "POST",
    body: JSON.stringify({ province_id: provinceId }),
  });
}

export function getWard(districtId) {
  return ghnFetch("/master-data/ward", {
    method: "POST",
    body: JSON.stringify({ district_id: districtId }),
  });
}

export async function getAvailableServices({ fromDistrictId, toDistrictId }) {
  return ghnFetch("/v2/shipping-order/available-services", {
    method: "POST",
    body: JSON.stringify({
      shop_id: Number(SHOP_ID),
      from_district: Number(fromDistrictId),
      to_district: Number(toDistrictId),
    }),
  });
}

export async function getShippingFee({
  fromDistrictId,
  toDistrictId,
  toWardCode,
  weight,
  length,
  width,
  height,
  insuranceValue = 0,
  serviceTypeId = 2, // 2 = giao hàng tiêu chuẩn, có thể thay đổi theo GHN docs
  coupon = null,
}) {
  const services = await getAvailableServices({ fromDistrictId, toDistrictId });
  if (!services.data || services.data.length === 0) {
    throw new Error("Không có dịch vụ vận chuyển khả dụng");
  }

  const serviceId = services.data[0].service_id;
  return ghnFetch("/v2/shipping-order/fee", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: TOKEN,
      shop_id: SHOP_ID,
    },
    body: JSON.stringify({
      service_id: serviceId,
      insurance_value: insuranceValue,
      coupon,
      from_district_id: Number(fromDistrictId),
      to_district_id: Number(toDistrictId),
      to_ward_code: String(toWardCode),
      weight: Number(weight),
      length: Number(length),
      width: Number(width),
      height: Number(height),
    }),
    caches: "no-store",
  });
}
