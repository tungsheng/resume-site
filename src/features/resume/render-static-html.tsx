import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { DEFAULT_RESUME_TEMPLATE, type ResumeLayoutTemplate } from "../../layouts";
import type { ResumeData } from "../../types";
import { ResumeDocument } from "./document";
import { getResumeDocumentCss } from "./document-css";

export function renderResumeHtmlDocument(
  data: ResumeData,
  themeColor: string,
  layoutTemplate: ResumeLayoutTemplate = DEFAULT_RESUME_TEMPLATE
): string {
  const title = renderToStaticMarkup(<title>{`${data.header.name} - Resume`}</title>);
  const body = renderToStaticMarkup(
    <ResumeDocument
      data={data}
      themeColor={themeColor}
      layoutTemplate={layoutTemplate}
    />
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${title}
  <style>${getResumeDocumentCss()}</style>
</head>
<body>${body}</body>
</html>`;
}
