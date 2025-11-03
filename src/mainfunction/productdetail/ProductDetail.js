"use client";

import React, { useMemo } from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import "./styles/productDetail.css";
import SizeOption from "./SizeOption";
import ColorOption from "./ColorOption";
import Action from "./Action";
import TotalDetail from "./TotalDetail";
import FeatureDetail from "./featuredetail/FeatureDetail";
import Image from "next/image";
import { Box, Typography, Button } from "@mui/material";

function ProductDetail() {
  const [currentProduct, setCurrentProduct] = useState(null);
  const [activeSelectedSize, setActiveSelectedSize] = useState(0);
  const [activeSelectedColor, setActiveSelectedColor] = useState(null);
  const [isFeatureDetailOpen, setIsFeatureDetailOpen] = useState(false);

  const [selectingOrder, setSelectingOrder] = useState({
    productId: "",
    name: "",
    image: "",
    price: 0,
    size: "",
    color: "",
    quantity: 1,
  });

  const params = useParams();
  const productId = params.productId;

  //load du lieu tu json
  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/products/${productId}`);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setCurrentProduct(data);
      } catch (err) {
        console.error("Error fetching product data:", err);
      }
    };

    fetchProduct();
  }, [productId]);

  //chon chiue rong
  const handleWidthOptionClick = (index) => {
    setActiveSelectedSize(index);
  };

  const width = currentProduct?.size?.width[activeSelectedSize];
  const length = currentProduct?.size?.length;
  const height = currentProduct?.size?.height;
  const fullSize = `Dài ${length} x Rộng ${width} x Cao ${height}`;

  //chon mau
  const handleColorOptionClick = (id) => {
    setActiveSelectedColor(id);
  };
  useEffect(() => {
    if (currentProduct?.colors?.length > 0 && !activeSelectedColor) {
      setActiveSelectedColor(currentProduct.colors[0]._id);
    }
  }, [currentProduct, productId]);

  //tinh gia bang usememo
  const finalPrice = useMemo(() => {
    if (!currentProduct) return 0;
    const basicPrice = currentProduct.price || 0;
    const selectedWidthValue = currentProduct?.size.width?.[activeSelectedSize];
    const widthPriceMultiplier = {
      1.4: 1,
      1.6: 1.1,
      1.8: 1.2,
    };
    return Math.round(
      basicPrice * (widthPriceMultiplier[selectedWidthValue] || 1)
    );
  }, [activeSelectedSize, currentProduct]);

  //hieu ung cho img
  const [imageSrc, setImageSrc] = useState(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!currentProduct || !currentProduct?.colors) {
      return;
    }
    const fallBackImg = currentProduct?.colors[0]?.productImage;
    const selectedColor =
      currentProduct?.colors?.find(
        (color) =>
          color.id === activeSelectedColor || color._id === activeSelectedColor
      ) || currentProduct.colors[0];

    const selectedImg = selectedColor?.productImage || fallBackImg;

    if (!selectedImg) return;
    //trigger fade out
    setIsFadingOut(true);
    //cho fade xong roi hien img
    const timer = setTimeout(() => {
      setImageSrc(selectedImg);

      //trigger fade in
      setIsFadingOut(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [activeSelectedColor, currentProduct]);

  useEffect(() => {
    if (!currentProduct) return;

    const selectedColor =
      currentProduct.colors.find(
        (c) => c._id === activeSelectedColor || c.id === activeSelectedColor
      ) || currentProduct.colors[0];

    setSelectingOrder({
      productId: currentProduct._id,
      name: currentProduct.title,
      image: selectedColor?.productImage,
      width: currentProduct?.size?.width[activeSelectedSize],
      price: finalPrice,
      size: fullSize,
      weight: currentProduct?.weight,
      height: currentProduct?.size?.height,
      length: currentProduct?.size?.length,
      color: selectedColor?.colorName || selectedColor?.name,
      quantity: 1,
    });
  }, [currentProduct, activeSelectedSize, activeSelectedColor, finalPrice]);

  const handleFeatureDetailOpen = () => {
    setIsFeatureDetailOpen(true);
  };
  return (
    <div>
      <div className="product-container">
        <div className="product-image">
          <div className="image-wrapper">
            {imageSrc && (
              <Image
                src={imageSrc}
                alt=""
                className={`fade-img ${loaded ? "show" : ""} ${
                  isFadingOut ? "fade-out" : ""
                }`}
                // style={{ display: loaded ? "block" : "none" }}
                width={1200}
                height={675}
                onLoadingComplete={() => setLoaded(true)}
              />
            )}
          </div>
        </div>
        <div className="product-info">
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ textAlign: "center" }}
          >
            {currentProduct?.title}
          </Typography>

          <SizeOption
            activeSelectedSize={activeSelectedSize}
            handleWidthOptionClick={handleWidthOptionClick}
            productOption={currentProduct}
          />
          <ColorOption
            activeSelectedColor={activeSelectedColor}
            handleColorOptionClick={handleColorOptionClick}
            productOption={currentProduct}
          />
          <TotalDetail
            activeSelectedSize={activeSelectedSize}
            productOption={currentProduct}
          />
          <Button
            // className="feature-detail-btn"
            variant="contained"
            color="primary"
            sx={{
              width: "50%",
              margin: "0 auto",
              color: "var(--kds-color--color)",
              background: "#eee",
            }}
            onClick={handleFeatureDetailOpen}
          >
            Chi Tiết Sản Phẩm
          </Button>
          {isFeatureDetailOpen && (
            <FeatureDetail
              productOption={currentProduct}
              onClose={() => setIsFeatureDetailOpen(false)}
            />
          )}

          <Action finalPrice={finalPrice} selectingOrder={selectingOrder} />
        </div>
      </div>
    </div>
  );
}
export default ProductDetail;
