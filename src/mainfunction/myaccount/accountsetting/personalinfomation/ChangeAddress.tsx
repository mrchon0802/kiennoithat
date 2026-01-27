"use client";

import styles from "./ChangeAddress.module.css";
import clsx from "clsx";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { loginSuccess } from "../../../../store/loginSlice";
import { getProvince, getDistrict, getWard } from "../../../../../utils/ghnApi";
import { userApi } from "@/api/userApi";
import type { RootState } from "@/store/store";

/* =======================
   Types
======================= */

interface Province {
  ProvinceID: number;
  ProvinceName: string;
}

interface District {
  DistrictID: number;
  DistrictName: string;
}

interface Ward {
  WardCode: string;
  WardName: string;
}

/* =======================
   Component
======================= */

export default function ChangeAddress() {
  const dispatch = useDispatch();
  const router = useRouter();

  const currentUser = useSelector((state: RootState) => state.login.user);
  const token = useSelector((state: RootState) => state.login.token);

  /* =======================
     Redirect nếu chưa login
  ======================= */
  useEffect(() => {
    if (!currentUser) {
      router.push("/auth");
    }
  }, [currentUser, router]);

  /* =======================
     Form state
  ======================= */
  const [addressDetail, setAddressDetail] = useState<string>("");

  const [provinceInput, setProvinceInput] = useState<string>("");
  const [districtInput, setDistrictInput] = useState<string>("");
  const [wardInput, setWardInput] = useState<string>("");

  /* =======================
     Dropdown state
  ======================= */
  const [isProvinceOpen, setIsProvinceOpen] = useState<boolean>(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState<boolean>(false);
  const [isWardOpen, setIsWardOpen] = useState<boolean>(false);

  /* =======================
     Data list
  ======================= */
  const [provinceList, setProvinceList] = useState<Province[]>([]);
  const [districtList, setDistrictList] = useState<District[]>([]);
  const [wardList, setWardList] = useState<Ward[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<Province | null>(
    null,
  );
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null,
  );
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);

  /* =======================
     Fetch data
  ======================= */
  useEffect(() => {
    getProvince()
      .then((res) => setProvinceList(res.data || []))
      .catch((err) => console.error("Lỗi tải tỉnh:", err));
  }, []);

  useEffect(() => {
    if (!selectedProvince) return;

    getDistrict(selectedProvince.ProvinceID)
      .then((res) => setDistrictList(res.data || []))
      .catch((err) => console.error("Lỗi tải huyện:", err));
  }, [selectedProvince]);

  useEffect(() => {
    if (!selectedDistrict) return;

    getWard(selectedDistrict.DistrictID)
      .then((res) => setWardList(res.data || []))
      .catch((err) => console.error("Lỗi tải xã/phường:", err));
  }, [selectedDistrict]);

  /* =======================
     Helpers
  ======================= */
  const closeAllDropdown = () => {
    setIsProvinceOpen(false);
    setIsDistrictOpen(false);
    setIsWardOpen(false);
  };

  const handleToggle = (type: "province" | "district" | "ward") => {
    setIsProvinceOpen(type === "province");
    setIsDistrictOpen(type === "district");
    setIsWardOpen(type === "ward");
  };

  const handleSelect = (
    type: "province" | "district" | "ward",
    item: Province | District | Ward,
  ) => {
    if (type === "province") {
      const province = item as Province;
      setSelectedProvince(province);
      setProvinceInput(province.ProvinceName);

      setSelectedDistrict(null);
      setSelectedWard(null);
      setDistrictInput("");
      setWardInput("");
    }

    if (type === "district") {
      const district = item as District;
      setSelectedDistrict(district);
      setDistrictInput(district.DistrictName);

      setSelectedWard(null);
      setWardInput("");
    }

    if (type === "ward") {
      const ward = item as Ward;
      setSelectedWard(ward);
      setWardInput(ward.WardName);
    }

    closeAllDropdown();
  };

  /* =======================
     Filter
  ======================= */
  const provinceFilter = provinceList.filter((p) =>
    p.ProvinceName.toLowerCase().includes(provinceInput.toLowerCase()),
  );

  const districtFilter = districtList.filter((d) =>
    d.DistrictName.toLowerCase().includes(districtInput.toLowerCase()),
  );

  const wardFilter = wardList.filter((w) =>
    w.WardName.toLowerCase().includes(wardInput.toLowerCase()),
  );

  /* =======================
     Submit
  ======================= */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentUser?._id) return;

    const fullAddress = `${addressDetail}, ${wardInput}, ${districtInput}, ${provinceInput}`;

    try {
      const res = await userApi.update(currentUser._id, {
        address: addressDetail,
        fullAddress,
        toDistrictId: selectedDistrict?.DistrictID,
        toWardCode: selectedWard?.WardCode,
      });

      dispatch(loginSuccess({ user: res.data, token }));
      router.push("/account-settings/personal-infomation");
    } catch (err) {
      console.error("Error updating address:", err);
    }
  };

  const isActive = addressDetail && provinceInput && districtInput && wardInput;

  /* =======================
     Render
  ======================= */
  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>Thay đổi địa chỉ</h2>

      {/* Province */}
      <div className={clsx(styles.formField)}>
        <label>Tỉnh, thành phố</label>
        <div className={styles.searchInput}>
          <input
            value={provinceInput}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setProvinceInput(e.target.value);
              setIsProvinceOpen(true);
            }}
            placeholder="Nhập tỉnh, thành phố"
          />
          <button type="button" onClick={() => handleToggle("province")}>
            <ChevronDown size={18} />
          </button>
        </div>

        {isProvinceOpen && (
          <ul>
            {provinceFilter.slice(0, 5).map((p) => (
              <li
                key={p.ProvinceID}
                onClick={() => handleSelect("province", p)}
              >
                {p.ProvinceName}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* District */}
      <div className={styles.formField}>
        <label>Quận, huyện</label>
        <div className={styles.searchInput}>
          <input
            value={districtInput}
            onChange={(e) => {
              setDistrictInput(e.target.value);
              setIsDistrictOpen(true);
            }}
            placeholder="Nhập quận, huyện"
          />
          <button type="button" onClick={() => handleToggle("district")}>
            <ChevronDown size={18} />
          </button>
        </div>

        {isDistrictOpen && (
          <ul>
            {districtFilter.map((d) => (
              <li
                key={d.DistrictID}
                onClick={() => handleSelect("district", d)}
              >
                {d.DistrictName}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Ward */}
      <div className={styles.formField}>
        <label>Xã, phường</label>
        <div className={styles.searchInput}>
          <input
            value={wardInput}
            onChange={(e) => {
              setWardInput(e.target.value);
              setIsWardOpen(true);
            }}
            placeholder="Nhập xã, phường"
          />
          <button type="button" onClick={() => handleToggle("ward")}>
            <ChevronDown size={18} />
          </button>
        </div>

        {isWardOpen && (
          <ul>
            {wardFilter.map((w) => (
              <li key={w.WardCode} onClick={() => handleSelect("ward", w)}>
                {w.WardName}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Detail */}
      <div className={styles.addressDetailField}>
        <label>Số nhà, tên đường</label>
        <input
          value={addressDetail}
          onChange={(e) => setAddressDetail(e.target.value)}
          placeholder="Nhập số nhà, tên đường"
        />
      </div>

      {/* Actions */}
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
          onClick={() => router.back()}
        >
          Hủy
        </button>
      </div>
    </form>
  );
}
