import styles from "./styles.module.css";
import { Heading } from "@navikt/ds-react";
import React from "react";

export const Banner = ({
  tittel,
  children,
}: {
  tittel: string | React.JSX.Element;
  children?: React.ReactNode;
}) => (
  <div className={styles.root}>
    <div className={styles.container}>
      <div className={styles.innhold}>
        <div className={styles.innholdHeader}>
          {typeof tittel === "string" ? (
            <Heading size="xlarge">{tittel}</Heading>
          ) : (
            tittel
          )}
        </div>
        <div className={styles.widgets}>{children}</div>
      </div>
    </div>
  </div>
);
