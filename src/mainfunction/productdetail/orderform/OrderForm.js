import React, { useState, useEffect } from "react";
import DistanceShipping from "./DistanceShipping";
import axios from "axios";

function OrderForm({ productName, finalPrice }) {
  const GHN_API = "https://online-gateway.ghn.vn/shiip/public-api/master-data";
  const TOKEN = process.env.REACT_APP_GHN_TOKEN;
  const SHOP_ID = process.env.REACT_APP_GHN_SHOP_ID;

  const [addressDetail, setAddressDetail] = useState("");
  const [provinceInput, setProvinceInput] = useState("");
  const [districtInput, setDistrictInput] = useState("");
  const [wardInput, setWardInput] = useState("");

  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const [isWardOpen, setIsWardOpen] = useState(false);

  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  useEffect(() => {
    axios
      .get(`${GHN_API}/province`, {
        headers: {
          Token: TOKEN,
        },
      })
      .then((response) => setProvinceList(response.data.data || []))
      .catch((error) => console.error("Lỗi tải tỉnh: ", error));
  }, [TOKEN]);
  useEffect(() => {
    if (selectedProvince) {
      axios
        .post(
          `${GHN_API}/district`,
          {
            province_id: selectedProvince.ProvinceID,
          },
          {
            headers: { Token: TOKEN },
          }
        )
        .then((response) => setDistrictList(response.data.data || []))
        .catch((error) => console.error("Lỗi tải huyện: ", error));
    }
  }, [selectedProvince, TOKEN]);
  useEffect(() => {
    if (selectedDistrict) {
      axios
        .post(
          `${GHN_API}/ward`,
          {
            district_id: selectedDistrict.DistrictID,
          },
          {
            headers: { Token: TOKEN },
          }
        )
        .then((response) => setWardList(response.data.data))
        .catch((error) => {
          console.error("Lỗi tải xã, phường: ", error);
        });
    }
  }, [selectedDistrict, TOKEN]);
  const handleToggle = (type) => {
    // event.preventDefault();
    setIsProvinceOpen(type === "province" ? !isProvinceOpen : false);
    setIsDistrictOpen(type === "district" ? !isDistrictOpen : false);
    setIsWardOpen(type === "ward" ? !isWardOpen : false);
  };
  const handleSelect = (type, item) => {
    if (type === "province") {
      setSelectedProvince(item);
      setProvinceInput(item.ProvinceName);
      setSelectedDistrict(null);
      setSelectedWard(null);
      setDistrictInput("");
      setWardInput("");
      // handleToggle();
    } else if (type === "district") {
      setSelectedDistrict(item);
      setDistrictInput(item.DistrictName);
      setSelectedWard(null);
      setWardInput("");
      // handleToggle();
    } else if (type === "ward") {
      setSelectedWard(item);
      setWardInput(item.WardName);
      // handleToggle();
    }
    handleToggle(type);
  };
  const provinceFilter = provinceList.filter((item) =>
    item.ProvinceName.toLowerCase().includes(provinceInput.toLocaleLowerCase())
  );
  const districtFilter = districtList.filter((item) =>
    item.DistrictName.toLowerCase().includes(districtInput.toLowerCase())
  );
  const wardFilter = wardList.filter((item) =>
    item.WardName.toLowerCase().includes(wardInput.toLowerCase())
  );
  const [number, setNumber] = useState(1);
  const handleMinusClick = () => {
    setNumber((prev) => (prev > 1 ? prev - 1 : prev));
  };
  const handlePlusClick = () => {
    setNumber((prev) => prev + 1);
  };
  const calculatedPrice = finalPrice * number;
  const [shippingCostChange, setShippingCostChange] = useState(0);
  const totalPrice = shippingCostChange + calculatedPrice;
  return (
    <div className="order-form-wrapper">
      <form>
        <h3>Thông tin giao hàng</h3>
        <div className="form-group">
          <label>Họ và tên:</label>
          <input type="text" />
        </div>
        <div className="form-group">
          <label>Số điện thoại</label>
          <input type="text" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" />
        </div>
        <div>
          <div className="province form-field">
            <label>Tỉnh, thành phố</label>
            <div className="search-input">
              <input
                type="text"
                value={provinceInput}
                onChange={(e) => {
                  setProvinceInput(e.target.value);
                  setIsProvinceOpen(true);
                }}
                placeholder="Nhập tỉnh, thành phố"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleToggle("province");
                }}
              >
                <i className="fa-solid fa-angle-down"></i>
              </button>
            </div>

            {isProvinceOpen && (
              <ul>
                {provinceFilter.map((item) => (
                  <li
                    key={item.ProvinceID}
                    onClick={() => handleSelect("province", item)}
                  >
                    {item.ProvinceName}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="district form-field">
            <label>Quận, huyện</label>
            <div className="search-input">
              <input
                type="text"
                value={districtInput}
                onChange={(e) => {
                  setDistrictInput(e.target.value);
                  setIsDistrictOpen(true);
                }}
                placeholder="Nhập quận, huyện"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleToggle("district");
                }}
              >
                <i className="fa-solid fa-angle-down"></i>
              </button>
            </div>
            {isDistrictOpen && (
              <ul>
                {districtFilter.map((item) => (
                  <li
                    key={item.DistrictID}
                    onClick={() => handleSelect("district", item)}
                  >
                    {item.DistrictName}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="Ward form-field">
            <label>Xã, phường</label>
            <div className="search-input">
              <input
                type="text"
                value={wardInput}
                onChange={(e) => {
                  setWardInput(e.target.value);
                  setIsWardOpen(true);
                }}
                placeholder="Nhập xã, phường"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleToggle("ward");
                }}
              >
                <i className="fa-solid fa-angle-down"></i>
              </button>
            </div>
            {isWardOpen && (
              <ul>
                {wardFilter.map((item) => (
                  <li
                    key={item.WardCode}
                    onClick={() => handleSelect("ward", item)}
                  >
                    {item.WardName}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="form-group">
            <label>Số nhà, tên đường</label>
            <input
              type="text"
              value={addressDetail}
              onChange={(e) => {
                e.preventDefault();
                setAddressDetail(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Ghi chú:</label>
          <textarea className="note-input" rows={4} />
        </div>

        <div className="quanity-selection">
          <span className="product-name">{productName}</span>
          <div className="quanity-wrapper">
            <button
              className="quanity-btn minus"
              onClick={(e) => {
                e.preventDefault();
                handleMinusClick();
              }}
            >
              -
            </button>
            <div className="quanity-value">{number}</div>
            <button
              className="quanity-btn plus"
              onClick={(e) => {
                e.preventDefault();
                handlePlusClick();
              }}
            >
              +
            </button>
          </div>
        </div>
        <p className="calculated-price">
          <strong>{calculatedPrice.toLocaleString()}</strong> VND
        </p>

        <DistanceShipping
          addressDetail={addressDetail}
          ward={selectedWard?.WardName}
          district={selectedDistrict?.DistrictName}
          province={selectedProvince?.ProvinceName}
          toDistrictId={selectedDistrict?.DistrictID}
          toWardCode={selectedWard?.WardCode}
          shippingCostChange={setShippingCostChange}
        />
        <div className="total-price">
          <span>Tổng chi phí: </span>
          <span>
            <strong>{totalPrice.toLocaleString()}</strong> VND
          </span>
        </div>
        <div className="policy">
          Bằng việc đặt hàng, tôi đồng ý với{" "}
          <span>thỏa thuận mua hàng của Kiến nội thất</span> và{" "}
          <span>chính sách quyền riêng tư</span>.
        </div>
        <div>
          <button className="confirm-order">Đặt hàng</button>
        </div>
      </form>
    </div>
  );
}
export default OrderForm;
