"use client";

import React, { useEffect } from "react";
import { Box, ButtonBase, Typography } from "@mui/material";

export default function ColorOption({
  activeSelectedColor,
  productOption,
  handleColorOptionClick,
}) {
  if (!productOption || !productOption?.colors) return null;

  const selectionColor = productOption?.colors?.find(
    (option) => option._id === activeSelectedColor,
  );

  return (
    <Box>
      {/* Tên màu đang chọn */}
      <Box display="flex" alignItems="center" mt={2}>
        <Typography variant="body1" fontWeight="bold">
          Màu gỗ:{" "}
          {selectionColor && (
            <Typography component="span" sx={{ ml: 0.5 }}>
              {selectionColor.name}
            </Typography>
          )}
        </Typography>
      </Box>

      {/* Danh sách màu */}
      <Box display="flex" gap={2} mt={1} flexWrap="wrap">
        {productOption.colors.map((color) => (
          <ButtonBase
            key={color.name}
            onClick={() => handleColorOptionClick(color._id)}
            sx={{
              borderRadius: 1,
              border:
                activeSelectedColor === color._id ? "3px solid" : "1px solid",
              borderColor:
                activeSelectedColor === color._id
                  ? "--kds-color--color-active"
                  : "grey.400",
              p: 0.5,
              width: 100,
              height: 100,
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src={color.image}
              alt={color.name}
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
