import React, { useState } from "react";
import { X } from "lucide-react";
import styles from "./FeatureDetail.module.css";
import clsx from "clsx";
import Image from "next/image";
import { Button } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PanelItem = ({ item, isActive, onClose, position, onPrev, onNext }) => {
  const [hover, setHover] = useState(false);

  console.log("hover:", hover);
  console.log("Panel position:", position, "| hover:", hover);

  return (
    <div
      className={clsx(
        styles.carouselPanel,

        isActive && styles.active,
        position === "left" && styles.carouselLeft,
        position === "right" && styles.carouselRight,
        position === "hidden" && styles.hidden
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={styles.featureHighlight}>
        <div className={styles.featureAssetContainer}>
          <Image
            src={item.image}
            alt={item.description || "Feature image"}
            width={550}
            height={550}
          />
        </div>
        <div className={styles.featureCopyContainer}>
          <div className={styles.featureTitle}>
            <X
              size={30}
              style={{ cursor: "pointer", color: "var(--kds-color--color)" }}
              onClick={onClose}
            />
          </div>
          <div className={styles.featureDescription}>{item.description}</div>
        </div>
      </div>
      {hover && position === "left" && (
        <>
          {console.log("✅ render next button")}
          <ChevronLeft
            size={30}
            className={clsx(
              styles.control,
              styles.prevBtn,
              styles.showControls
            )}
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
          />
        </>
      )}

      {hover && position === "right" && (
        <>
          {console.log("✅ render next button")}
          <ChevronRight
            size={30}
            className={clsx(
              styles.control,
              styles.nextBtn,
              styles.showControls
            )}
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
          />
        </>
      )}
    </div>
  );
};
export default PanelItem;
