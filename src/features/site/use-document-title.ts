import { useEffect } from "react";

export interface TitleTarget {
  title: string;
}

export function setDocumentTitle(title: string, target: TitleTarget): void {
  target.title = title;
}

export function useDocumentTitle(title: string): void {
  useEffect(() => {
    setDocumentTitle(title, document);
  }, [title]);
}
