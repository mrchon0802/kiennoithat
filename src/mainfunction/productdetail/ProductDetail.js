"use client";

import React, { useMemo, useCallback } from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import "./styles/productDetail.css";
import SizeOption from "./SizeOption";
import ColorOption from "./ColorOption";
import Action from "./Action";
import TotalDetail from "./TotalDetail";
import FeatureDetail from "./featuredetail/FeatureDetail";
import Image from "next/image";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

// Constants
const WIDTH_PRICE_MULTIPLIER = {
  1.4: 1,
  1.6: 1.1,
  1.8: 1.2,
};

const IMAGE_FADE_TIMEOUT = 400;

function ProductDetail() {
  const [currentProduct, setCurrentProduct] = useState(null);
  const [activeSelectedSize, setActiveSelectedSize] = useState(0);
  const [activeSelectedColor, setActiveSelectedColor] = useState(null);
  const [isFeatureDetailOpen, setIsFeatureDetailOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageState, setImageState] = useState({
    src: null,
    isFadingOut: false,
    loaded: false,
  });

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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Memoized values
  const selectedWidth = useMemo(() => 
    currentProduct?.size?.width?.[activeSelectedSize], 
    [currentProduct, activeSelectedSize]
  );

  const fullSize = useMemo(() => {
    if (!currentProduct?.size) return "";
    const { length, height } = currentProduct.size;
    return `Dài ${length} x Rộng ${selectedWidth} x Cao ${height}`;
  }, [currentProduct, selectedWidth]);

  const selectedColor = useMemo(() => {
    if (!currentProduct?.colors?.length) return null;
    return currentProduct.colors.find(
      (color) => color._id === activeSelectedColor || color.id === activeSelectedColor
    ) || currentProduct.colors[0];
  }, [currentProduct, activeSelectedColor]);

  // Final price calculation
  const finalPrice = useMemo(() => {
    if (!currentProduct?.price) return 0;
    const basicPrice = currentProduct.price;
    const multiplier = WIDTH_PRICE_MULTIPLIER[selectedWidth] || 1;
    return Math.round(basicPrice * multiplier);
  }, [currentProduct, selectedWidth]);

  // Fetch product data
  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${apiUrl}/products/${productId}`);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setCurrentProduct(data);
      } catch (err) {
        console.error("Error fetching product data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, apiUrl]);

  // Set default color
  useEffect(() => {
    if (currentProduct?.colors?.length > 0 && !activeSelectedColor) {
      setActiveSelectedColor(currentProduct.colors[0]._id);
    }
  }, [currentProduct, activeSelectedColor]);

  // Event handlers
  const handleWidthOptionClick = useCallback((index) => {
    setActiveSelectedSize(index);
  }, []);

  const handleColorOptionClick = useCallback((id) => {
    setActiveSelectedColor(id);
  }, []);

  const handleFeatureDetailOpen = useCallback(() => {
    setIsFeatureDetailOpen(true);
  }, []);

  const handleFeatureDetailClose = useCallback(() => {
    setIsFeatureDetailOpen(false);
  }, []);

  // Image handling
  useEffect(() => {
    if (!currentProduct?.colors || !selectedColor) return;

    const selectedImg = selectedColor?.productImage || currentProduct.colors[0]?.productImage;
    if (!selectedImg) return;

    // Trigger fade out
    setImageState(prev => ({ ...prev, isFadingOut: true }));

    const timer = setTimeout(() => {
      setImageState({
        src: selectedImg,
        isFadingOut: false,
        loaded: false,
      });
    }, IMAGE_FADE_TIMEOUT);

    return () => clearTimeout(timer);
  }, [selectedColor, currentProduct]);

  // Update selecting order
  useEffect(() => {
    if (!currentProduct || !selectedColor) return;

    setSelectingOrder({
      productId: currentProduct._id,
      name: currentProduct.title,
      image: selectedColor?.productImage,
      width: selectedWidth,
      price: finalPrice,
      size: fullSize,
      weight: currentProduct?.weight,
      height: currentProduct?.size?.height,
      length: currentProduct?.size?.length,
      color: selectedColor?.colorName || selectedColor?.name,
      quantity: 1,
    });
  }, [currentProduct, selectedWidth, selectedColor, finalPrice, fullSize]);

  // Handle image load
  const handleImageLoad = useCallback(() => {
    setImageState(prev => ({ ...prev, loaded: true }));
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!currentProduct) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography variant="h6">Product not found</Typography>
      </Box>
    );
  }

  return (
    <div className="product-container">
      <div className="product-image">
        <div className="image-wrapper">
          {imageState.src && (
            <Image
              src={imageState.src}
              alt={currentProduct.title}
              className={`fade-img ${imageState.loaded ? "show" : ""} ${
                imageState.isFadingOut ? "fade-out" : ""
              }`}
              width={1200}
              height={675}
              priority
              onLoadingComplete={handleImageLoad}
            />
          )}
        </div>
      </div>
      
      <div className="product-info">
        <Typography variant="h4" fontWeight="bold" textAlign="center">
          {currentProduct.title}
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
            onClose={handleFeatureDetailClose}
          />
        )}

        <Action 
          finalPrice={finalPrice} 
          selectingOrder={selectingOrder} 
        />
      </div>
    </div>
  );
}

export default React.memo(ProductDetail);