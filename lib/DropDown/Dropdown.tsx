import styles from "./Dropdown.module.css";
import { forwardRef, HTMLAttributes, ReactNode } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  ariaLabel: string;
  friKomponent: boolean;
  erApen: boolean;
}

const Dropdown = forwardRef<HTMLDivElement, Props>(
  ({ erApen, ariaLabel, friKomponent, children, ...divProperties }, ref) => {
    return erApen ? (
      <div
        ref={ref}
        role="dialog"
        aria-label={ariaLabel}
        className={`${styles.panel} ${friKomponent ? styles.panelFriKomponent : ""}`}
        {...divProperties}
      >
        {children}
      </div>
    ) : null;
  },
);

Dropdown.displayName = "Dropdown";

export default Dropdown;
