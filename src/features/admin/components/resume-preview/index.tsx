// Resume preview component

import React from "react";
import type { ResumeData } from "../../../../types";
import type { ResumeLayoutTemplate } from "../../../../layouts";
import { ResumeView, Spinner } from "../../../../components";
import { styles } from "./style";

interface ResumePreviewProps {
  data: ResumeData | null;
  themeColor: string;
  layoutTemplate: ResumeLayoutTemplate;
  loading: boolean;
}

export function ResumePreview({
  data,
  themeColor,
  layoutTemplate,
  loading,
}: ResumePreviewProps) {
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <Spinner size={40} />
          <span style={{ marginLeft: 12 }}>Loading resume...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>No resume loaded</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <ResumeView
        data={data}
        themeColor={themeColor}
        layoutTemplate={layoutTemplate}
      />
    </div>
  );
}
