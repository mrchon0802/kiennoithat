"use client";

import React, { useMemo } from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import "./styles/productDetail.css";
import SizeOption from "./SizeOption";
import ColorOption from "./ColorOption";
import Action from "./Action";
import TotalDetail from "./TotalDetail";
import OrderForm from "./orderform/OrderForm";
import FeatureDetail from "./featuredetail/FeatureDetail";
import Image from "next/image";
import { Box, Typography, Button } from "@mui/material";
import { addOrder } from "@/store/orderSlice";
import { useDispatch } from "react-redux";
import { updateSelectingOrder } from "@/store/orderSlice";

function ProductDetail() {
  const dispatch = useDispatch();

  const [productOption, setProductOption] = useState({});
  const [currentProduct, setCurrentProduct] = useState(null);
  const [activeSelectedSize, setActiveSelectedSize] = useState(0);
  const [activeSelectedColor, setActiveSelectedColor] = useState(1);
  const [finalPrice, setFinalPrice] = useState("");
  const [isFeatureDetailOpen, setIsFeatureDetailOpen] = useState(false);

  const params = useParams();
  const productId = params.productId;

  //load du lieu tu json
  useEffect(() => {
    const fetchData = async () => {
      try {
        const respone = await fetch("/data/product.json");
        const data = await respone.json();
        setProductOption(data.productOption);
        const foundProduct = data.productOption?.mainImage?.find(
          (item) => item.productId === productId
        );
        if (foundProduct) {
          setCurrentProduct(foundProduct);
          setFinalPrice(foundProduct.price);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [productId]);

  const handleWidthOptionClick = (index) => {
    setActiveSelectedSize(index);
    dispatch(updateSelectingOrder({ size: currentProduct?.width?.[index] }));
  };
  const handleColorOptionClick = (id) => {
    setActiveSelectedColor(id);
    dispatch(
      updateSelectingOrder({
        color: currentProduct?.color?.find((c) => c.id === id)?.colorName,
      })
    );
  };

  //tinh gia bang usememo
  const updatePrice = useMemo(() => {
    if (!currentProduct) return 0;
    const basicPrice = currentProduct.price || 0;
    const selectedWidthValue = currentProduct?.width?.[activeSelectedSize];
    const widthPriceMultiplier = {
      "1.4m": 1,
      "1.6m": 1.1,
      "1.8m": 1.2,
    };
    return Math.round(
      basicPrice * (widthPriceMultiplier[selectedWidthValue] || 1)
    );
  }, [activeSelectedSize, currentProduct]);

  useEffect(() => {
    if (currentProduct) {
      dispatch(updateSelectingOrder({ name: currentProduct?.title }));
      dispatch(updateSelectingOrder({ image: currentProduct?.src }));
      dispatch(
        updateSelectingOrder({ price: finalPrice || currentProduct?.price })
      );
    }
  }, [currentProduct, dispatch, updatePrice, finalPrice]);
  //hieu ung cho img
  const [imageSrc, setImageSrc] = useState(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const fallBackImg = currentProduct?.color?.find(
      (color) => color.id === 1
    )?.productImageSrc;
    const selectedImg = currentProduct?.color?.find(
      (color) => color.id === activeSelectedColor
    )?.productImageSrc;
    if (!fallBackImg || !selectedImg) return;
    //trigger fade out
    setIsFadingOut(true);
    //cho fade xong roi hien img
    setTimeout(() => {
      setImageSrc(selectedImg || fallBackImg);
      //trigger fade in
      setIsFadingOut(false);
    }, 400);
  }, [activeSelectedColor, productOption, currentProduct]);
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
                className={isFadingOut ? "fade-out" : ""}
                style={{ display: loaded ? "block" : "none" }}
                width={1200}
                height={675}
                onLoad={() => setLoaded(true)}
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
            Feature Detail
          </Button>
          {isFeatureDetailOpen && (
            <FeatureDetail
              productOption={currentProduct}
              onClose={() => setIsFeatureDetailOpen(false)}
            />
          )}

          {/* <div className={`order-form-wrapper ${showOrderForm ? "show" : ""}`}>
            {showOrderForm && (
              <OrderForm
                productName={currentProduct?.title}
                finalPrice={finalPrice}
                onClose={() => setShowOrderForm(false)}
              />
            )}
          </div> */}
          <Action finalPrice={finalPrice} />
        </div>
      </div>
    </div>
  );
}
export default ProductDetail;
