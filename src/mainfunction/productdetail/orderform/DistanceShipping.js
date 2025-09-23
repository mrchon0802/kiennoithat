import React, { useEffect, useState } from "react";
import axios from "axios";

function DistanceShipping({
  addressDetail,
  ward,
  district,
  province,
  toDistrictId,
  toWardCode,
  shippingCostChange,
}) {
  // const storeCoordinates = [106.774528, 10.848806];

  const [address, setAddress] = useState("");
  const [distance, setDistance] = useState(null);
  const [shippingCost, setShippingCost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = "9be3c663-67d6-11f0-8120-026f4833faa3";
  const shopId = 5906998;

  const fromDistrictId = 725; // tp thuan an

  useEffect(() => {
    if (addressDetail && ward && district && province) {
      const fullAddress = `${addressDetail}, ${ward}, ${district}, ${province}`;
      setAddress(fullAddress);

      const fetchShipingFee = async () => {
        setLoading(true);
        setError("");

        try {
          console.log("toDistrictId:", toDistrictId);
          console.log("toWardCode:", toWardCode);
          const response = await axios.post(
            "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
            {
              service_type_id: 2,
              insurance_value: 1000000,
              coupon: null,
              from_district_id: fromDistrictId,
              to_district_id: Number(toDistrictId),
              to_ward_code: String(toWardCode),
              height: 90,
              length: 200,
              weight: 80000,
              width: 140,
            },
            {
              headers: {
                Token: token,
                ShopId: shopId,
                "Content-Type": "application/json",
              },
            }
          );
          const fee = response.data.data.total;
          setShippingCost(fee);
          if (shippingCostChange) {
            shippingCostChange(fee);
          }
        } catch (error) {
          setError(
            error.response?.data?.message || "Không tính dược phí vận chuyển"
          );
          console.error(
            "Lỗi tính phí: ",
            error.response?.data || error.message
          );
        } finally {
          setLoading(false);
        }
      };
      fetchShipingFee();
    }
  }, [addressDetail, ward, district, province, toDistrictId, toWardCode]);

  return (
    <div className="distance-shipping">
      <span>Địa chỉ của bạn: </span>
      <p>{address}</p>
      {loading ? (
        <p>Đang tính ...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : shippingCost !== null ? (
        <p>
          Phí vận chuyển và lắp đặt:{" "}
          <strong>{shippingCost.toLocaleString()}</strong> VND
        </p>
      ) : null}
    </div>
  );
}
export default DistanceShipping;
