"use client";

import React from "react";
import { Box, ButtonBase, Typography } from "@mui/material";
import { addOrder } from "@/store/orderSlice";
import { useDispatch } from "react-redux";

function ColorOption({
  activeSelectedColor,
  productOption,
  handleColorOptionClick,
}) {
  if (!productOption || !productOption?.color) return null;
  const selectionColor = productOption.color?.find(
    (option) => activeSelectedColor === option.id
  );

  return (
    <Box>
      {/* Tên màu đang chọn */}
      <Box display="flex" alignItems="center" mt={2}>
        <Typography variant="body1" fontWeight="bold">
          Màu gỗ:{" "}
          {selectionColor && (
            <Typography component="span" sx={{ ml: 0.5 }}>
              {selectionColor.colorName}
            </Typography>
          )}
        </Typography>
      </Box>

      {/* Danh sách màu */}
      <Box display="flex" gap={2} mt={1} flexWrap="wrap">
        {productOption.color.map((color) => (
          <ButtonBase
            key={color.id}
            onClick={() => handleColorOptionClick(color.id)}
            sx={{
              borderRadius: 1,
              border:
                activeSelectedColor === color.id ? "3px solid" : "1px solid",
              borderColor:
                activeSelectedColor === color.id ? "primary.main" : "grey.400",
              p: 0.5,
              width: 125,
              height: 125,
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src={color.src}
              alt={color.colorName}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 1,
              }}
            />
          </ButtonBase>
        ))}
      </Box>

      {/* Thông báo */}
      <Typography variant="body2" sx={{ color: "text.secondary", mt: 2 }}>
        *Vui lòng liên hệ trực tiếp với chúng tôi qua thông tin liên hệ để nhận
        được catalog màu
      </Typography>
    </Box>
  );
}
export default ColorOption;
