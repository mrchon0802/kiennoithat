"use client";

import styles from "./ChangeAddress.module.css";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { loginSuccess } from "../../../../store/loginSlice";
import { getProvince, getDistrict, getWard } from "../../../../../utils/ghnApi";
import { userApi } from "@/api/userApi";

export default function ChangeAddress() {
  const dispatch = useDispatch();
  const router = useRouter();

  const currentUser = useSelector((state) => state.login.user);

  useEffect(() => {
    if (!currentUser) {
      router.push("/auth");
    }
  }, [currentUser, router]);

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

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  useEffect(() => {
    getProvince()
      .then((response) => setProvinceList(response.data || []))
      .catch((error) => console.error("Lỗi tải tỉnh: ", error));
  }, []);
  useEffect(() => {
    if (selectedProvince) {
      getDistrict(selectedProvince.ProvinceID)
        .then((response) => setDistrictList(response.data || []))
        .catch((error) => console.error("Lỗi tải huyện: ", error));
    }
  }, [selectedProvince]);
  useEffect(() => {
    if (selectedDistrict) {
      getWard(selectedDistrict.DistrictID)
        .then((response) => setWardList(response.data || []))
        .catch((error) => {
          console.error("Lỗi tải xã, phường: ", error);
        });
    }
  }, [selectedDistrict]);
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullAddress = `${addressDetail}, ${wardInput}, ${districtInput}, ${provinceInput}`;
    try {
      const res = await userApi.update(currentUser._id, {
        address: addressDetail,
        fullAddress: fullAddress,
        toDistrictId: selectedDistrict?.DistrictID,
        toWardCode: selectedWard?.WardCode,
      });
      const token =
        JSON.parse(localStorage.getItem("auth") || "{}").token || null;

      dispatch(loginSuccess({ user: res.data, token }));
      router.push("/account-settings/personal-infomation");
    } catch (err) {
      console.error("Error when updating adress", err);
    }
  };
  const isActive =
    addressDetail !== "" &&
    wardInput !== "" &&
    districtInput !== "" &&
    provinceInput !== "";
  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <div className={styles.formTitle}>
        <h2>Thay đổi địa chỉ</h2>
      </div>
      <div className={styles.formRow}>
        <div className={clsx(styles.province, styles.formField)}>
          <label>Tỉnh, thành phố</label>
          <div className={styles.searchInput}>
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
              type="button"
              onClick={() => {
                handleToggle("province");
              }}
            >
              <ChevronDown size={18} />
            </button>
          </div>

          {isProvinceOpen && (
            <ul>
              {provinceFilter.slice(0, 5).map((item) => (
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
        <div className={clsx(styles.district, styles.formField)}>
          <label>Quận, huyện</label>
          <div className={styles.searchInput}>
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
              type="button"
              onClick={() => {
                handleToggle("district");
              }}
            >
              <ChevronDown size={18} />
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
        <div className={clsx(styles.ward, styles.formField)}>
          <label>Xã, phường</label>
          <div className={styles.searchInput}>
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
              type="button"
              onClick={() => {
                handleToggle("ward");
              }}
            >
              <ChevronDown size={18} />
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

        <div className={styles.addressDetailField}>
          <label>Số nhà, tên đường</label>
          <input
            type="text"
            value={addressDetail}
            placeholder="Nhập số nhà, tên đường
"
            onChange={(e) => {
              setAddressDetail(e.target.value);
            }}
          />
        </div>
      </div>
      <div className={styles.formActions}>
        <button
          type="submit"
          className={clsx(styles.btnUpdate, isActive && styles.active)}
        >
          Cập nhật
        </button>
        <button
          type="button"
          className={styles.btnCancel}
          onClick={() => router.push("/account-settings/personal-infomation")}
        >
          Hủy
        </button>
      </div>
    </form>
  );
}
