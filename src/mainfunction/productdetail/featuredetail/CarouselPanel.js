import React from "react";
import { X } from "lucide-react";
import styles from "./FeatureDetail.module.css";
import clsx from "clsx";

const PanelItem = ({ item, isActive, onClose }) => (
  <div className={clsx(styles.carouselPanel, isActive && styles.active)}>
    <div className={styles.featureHighlight}>
      <div className={styles.featureAssetContainer}>
        <img src={item.src} alt={item.content || "Feature image"} />
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
