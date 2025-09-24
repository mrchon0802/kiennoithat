import React from "react";
import { X } from "lucide-react";
import styles from "./FeatureDetail.module.css";
import clsx from "clsx";
import Image from "next/image";

const PanelItem = ({ item, isActive, onClose }) => (
  <div className={clsx(styles.carouselPanel, isActive && styles.active)}>
    <div className={styles.featureHighlight}>
      <div className={styles.featureAssetContainer}>
        <Image
          src={item.src}
          alt={item.content || "Feature image"}
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
        <div className={styles.featureDescription}>{item.content}</div>
      </div>
    </div>
  </div>
);
export default PanelItem;
