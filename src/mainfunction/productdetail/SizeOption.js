"use client";

import React from "react";
import styles from "./styles/WidthOption.module.css";
import { Box, ButtonGroup, Button, Typography } from "@mui/material";

function SizeOption({
  productOption,
  handleWidthOptionClick,
  activeSelectedSize,
}) {
  const selectionSize = productOption?.width?.[activeSelectedSize];
  const length = productOption?.length;
  const height = productOption?.height;
  console.log("chieu rong", selectionSize);
  return (
    <Box>
      {/* Chi tiết kích thước */}
      <Box mt={3}>
        <Typography variant="body1" fontWeight="bold">
          Kích thước:{" "}
          {selectionSize && (
            <Typography component="span" sx={{ ml: 0.5 }}>
              {selectionSize}
            </Typography>
          )}
        </Typography>
      </Box>

      {/* Button Group chọn size */}
      <Box mt={1} display="flex" justifyContent="center" alignItems="center">
        <ButtonGroup
          variant="outlined"
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          {productOption?.width?.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleWidthOptionClick(index)}
              sx={{
                flex: 1,
                py: 1.5,
                fontSize: 15,
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: 1,
                borderColor:
                  index === activeSelectedSize ? "primary.main" : "grey.400",
                backgroundColor:
                  index === activeSelectedSize ? "primary.main" : "transparent",
                color: index === activeSelectedSize ? "white" : "text.primary",
                "&:hover": {
                  backgroundColor:
                    index === activeSelectedSize ? "primary.dark" : "grey.100",
                },
              }}
            >
              {option}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      {/* Thông tin tổng kích thước */}
      <Box mt={2}>
        <Typography variant="body1" fontWeight="bold">
          Kích thước:
        </Typography>
        {selectionSize && (
          <Typography variant="body2" sx={{ color: "text.primary", mt: 0.5 }}>
            Dài {length} x Rộng {selectionSize} x Cao {height}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
export default SizeOption;
