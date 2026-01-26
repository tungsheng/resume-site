// Resume page toolbar component

import React from "react";
import { buttonStyles } from "../../../../styles";
import { Spinner, DownloadIcon, PrintIcon } from "../../../../components";
import { styles } from "./style";

interface ToolbarProps {
  title: string;
  onPrint: () => void;
  onDownload: () => void;
  downloading: boolean;
}

export function Toolbar({ title, onPrint, onDownload, downloading }: ToolbarProps) {
  return (
    <header style={styles.toolbar} className="toolbar" role="banner">
      <h1 style={styles.title}>{title}</h1>
      <nav style={styles.actions} aria-label="Resume actions">
        <button
          onClick={onPrint}
          style={buttonStyles.btnSecondary}
          aria-label="Print resume"
        >
          <PrintIcon />
          Print
        </button>
        <button
          onClick={onDownload}
          disabled={downloading}
          style={buttonStyles.btn}
          aria-label={downloading ? "Generating PDF" : "Download resume as PDF"}
          aria-busy={downloading}
        >
          {downloading ? (
            <>
              <Spinner size={16} color="#fff" />
              Generating...
            </>
          ) : (
            <>
              <DownloadIcon />
              Download PDF
            </>
          )}
        </button>
      </nav>
    </header>
  );
}
