const BASE_URL = "https://online-gateway.ghn.vn/shiip/public-api";
const TOKEN = process.env.GHN_TOKEN;
const SHOP_ID = process.env.GHN_SHOP_ID;
const FROM_DISTRICT_ID = process.env.GHN_SHOP_DISTRICT_ID;

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

export async function getProvince() {
  const res = await fetch("/api/ghn/province", { cache: "no-store" });
  if (!res.ok) throw new Error(`Province fetch failed: ${res.status}`);
  return res.json();
}

export async function getDistrict(provinceId) {
  const res = await fetch(`/api/ghn/district?province_id=${provinceId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`District fetch failed: ${res.status}`);
  return res.json();
}

export async function getWard(districtId) {
  const res = await fetch(`/api/ghn/ward?district_id=${districtId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Ward fetch failed: ${res.status}`);
  return res.json();
}

export async function getAvailableServices({ fromDistrictId, toDistrictId }) {
  return ghnFetch("/v2/shipping-order/available-services", {
    method: "POST",
    body: JSON.stringify({
      shop_id: Number(SHOP_ID),
      from_district: Number(FROM_DISTRICT_ID),
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
