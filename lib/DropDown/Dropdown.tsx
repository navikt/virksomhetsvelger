import styles from "./Dropdown.module.css";
import { HTMLAttributes, ReactNode } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  ariaLabel: string;
  friKomponent: boolean;
  erApen: boolean;
}

const Dropdown = ({
  erApen,
  ariaLabel,
  friKomponent,
  children,
  ...divProperties
}: Props) => {
  return erApen ? (
    <div
      role="dialog"
      aria-label={ariaLabel}
      className={`${styles.panel} ${!friKomponent ? styles.panelFriKomponent : ""}`}
      {...divProperties}
    >
      {children}
    </div>
  ) : null;
};

export default Dropdown;
