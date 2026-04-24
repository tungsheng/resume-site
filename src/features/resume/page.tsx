import React, { useEffect, useState } from "react";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { buildResumeViewModel } from "./view-model";
import type { ResumeData } from "../../types";
import { publicResumeData } from "./data";
import { EXPERIMENTS_PATH, PROJECT_PATH } from "../site/content";
import {
  ActionLinkRow,
  PageHero,
  PublicSiteLayout,
} from "../site/layout";
import { useDocumentTitle } from "../site/use-document-title";

interface Toast {
  id: number;
  message: string;
  type: "error" | "success";
}

let toastId = 0;

function getLinkedinHref(linkedin: string | undefined): string | null {
  if (!linkedin) return null;
  return linkedin.startsWith("http") ? linkedin : `https://linkedin.com/in/${linkedin}`;
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

export async function requestPublicResumePdf(): Promise<Blob> {
  const res = await fetch("/api/public-pdf", {
    method: "POST",
  });

  if (!res.ok) {
    let message = "Failed to generate PDF";
    try {
      const errorBody = (await res.json()) as { error?: string };
      if (errorBody?.error) message = errorBody.error;
    } catch {
      // Keep the fallback error message when the response is not JSON.
    }
    throw new Error(message);
  }

  return res.blob();
}

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: number) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        right: 24,
        bottom: 24,
        zIndex: (theme) => theme.zIndex.snackbar,
        display: "grid",
        gap: 2,
        maxWidth: "min(360px, calc(100vw - 48px))",
      }}
      role="alert"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </Box>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: number) => void;
}) {
  useEffect(() => {
    const timer = window.setTimeout(() => onRemove(toast.id), 4000);
    return () => window.clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <Alert
      severity={toast.type === "error" ? "error" : "success"}
      variant="filled"
      onClose={() => onRemove(toast.id)}
    >
      {toast.message}
    </Alert>
  );
}

function ScreenResumeBulletList({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <List
      dense
      disablePadding
      sx={{
        listStyleType: "disc",
        pl: 3,
        "& .MuiListItem-root": {
          display: "list-item",
          py: 0.25,
        },
      }}
    >
      {items.map((item, index) => (
        <ListItem key={`${item}-${index}`} disablePadding>
          <ListItemText
            primary={
              <Typography variant="body2" color="text.secondary">
                {item}
              </Typography>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}

function ResumeSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Stack component="section" spacing={2}>
      <Typography variant="h5">{title}</Typography>
      {children}
    </Stack>
  );
}

function ResumeWebView({ data }: { data: ResumeData }) {
  const view = buildResumeViewModel(data);
  const linkedinHref = getLinkedinHref(view.header.contacts.linkedin);

  return (
    <Grid container spacing={3} aria-label="Web resume view">
      <Grid size={{ xs: 12, md: 8 }}>
        <Stack spacing={3}>
          {view.summary ? (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Professional Summary
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {view.summary}
                </Typography>
              </CardContent>
            </Card>
          ) : null}

          {view.projects.length > 0 ? (
            <ResumeSection title={view.projectsTitle}>
              <Stack spacing={2}>
                {view.projects.map((project, index) => (
                  <Card key={`${project.title}-${index}`} variant="outlined">
                    <CardContent>
                      <Stack spacing={1.5}>
                        <Typography variant="h6">{project.title}</Typography>
                        <ScreenResumeBulletList items={project.highlights} />
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </ResumeSection>
          ) : null}

          {view.experience.length > 0 ? (
            <ResumeSection title="Experience">
              <Stack spacing={2}>
                {view.experience.map((experience, index) => (
                  <Card key={`${experience.title}-${index}`} variant="outlined">
                    <CardContent>
                      <Stack spacing={1.5}>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={1}
                          sx={{ justifyContent: "space-between" }}
                        >
                          <div>
                            <Typography variant="h6">{experience.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {experience.company}
                            </Typography>
                          </div>
                          <Typography variant="body2" color="text.secondary">
                            {experience.dateRange}
                          </Typography>
                        </Stack>
                        <ScreenResumeBulletList items={experience.highlights} />
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </ResumeSection>
          ) : null}
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Stack spacing={3}>
          {(view.header.contacts.email || linkedinHref) ? (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Contact
                </Typography>
                <Stack spacing={1.5}>
                  {view.header.contacts.email ? (
                    <div>
                      <Typography variant="overline" color="primary">
                        Email
                      </Typography>
                      <Typography variant="body2">
                        <Link href={`mailto:${view.header.contacts.email}`}>
                          {view.header.contacts.email}
                        </Link>
                      </Typography>
                    </div>
                  ) : null}
                  {linkedinHref ? (
                    <div>
                      <Typography variant="overline" color="primary">
                        LinkedIn
                      </Typography>
                      <Typography variant="body2">
                        <Link href={linkedinHref} target="_blank" rel="noreferrer">
                          {`linkedin.com/in/${view.header.contacts.linkedin}`}
                        </Link>
                      </Typography>
                    </div>
                  ) : null}
                </Stack>
              </CardContent>
            </Card>
          ) : null}

          {view.skills.length > 0 ? (
            <ResumeSection title="Skills">
              <Card variant="outlined">
                <CardContent>
                  <Stack
                    divider={<Divider flexItem />}
                    spacing={1.5}
                  >
                    {view.skills.map((skill) => (
                      <div key={skill.category}>
                        <Typography variant="subtitle1">
                          {skill.categoryLabel}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {skill.itemsText}
                        </Typography>
                      </div>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </ResumeSection>
          ) : null}

          {view.education.length > 0 ? (
            <ResumeSection title="Education">
              <Stack spacing={2}>
                {view.education.map((education, index) => (
                  <Card key={`${education.school}-${index}`} variant="outlined">
                    <CardContent>
                      <Stack spacing={0.5}>
                        <Typography variant="h6">{education.degree}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {education.school}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {education.dateRange}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </ResumeSection>
          ) : null}
        </Stack>
      </Grid>
    </Grid>
  );
}

interface ResumePageContentProps {
  data: ResumeData;
  downloading: boolean;
  onDownload: () => void;
  toasts: Toast[];
  onRemoveToast: (id: number) => void;
}

export function ResumePageContent({
  data,
  downloading,
  onDownload,
  toasts,
  onRemoveToast,
}: ResumePageContentProps) {
  const linkedinHref = getLinkedinHref(data.header.contacts.linkedin);
  const secondaryLinks = [
    { label: "View project", href: PROJECT_PATH, external: false },
    { label: "View experiments", href: EXPERIMENTS_PATH, external: false },
    data.header.contacts.email
      ? {
          label: "Email",
          href: `mailto:${data.header.contacts.email}`,
          external: false,
        }
      : null,
    linkedinHref
      ? {
          label: "LinkedIn",
          href: linkedinHref,
          external: true,
        }
      : null,
  ].filter(
    (
      link
    ): link is {
      label: string;
      href: string;
      external: boolean;
    } => Boolean(link)
  );

  return (
    <PublicSiteLayout activeNav="resume">
      <PageHero>
        <Typography component="h1" variant="h3">
          {data.header.name}
        </Typography>

        {data.header.badges.length > 0 ? (
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
            {data.header.badges.map((badge) => (
              <Chip key={badge} label={badge} />
            ))}
          </Stack>
        ) : null}

        <ActionLinkRow>
          <Button
            type="button"
            variant="contained"
            onClick={onDownload}
            disabled={downloading}
            aria-label={downloading ? "Generating PDF" : "Download resume as PDF"}
            aria-busy={downloading}
            title="Download resume PDF"
            startIcon={
              downloading ? (
                <CircularProgress color="inherit" size={18} />
              ) : (
                <DownloadRoundedIcon />
              )
            }
          >
            {downloading ? "Preparing PDF..." : "Download PDF"}
          </Button>

          {secondaryLinks.map((link) => (
            <Button
              key={link.label}
              href={link.href}
              variant="outlined"
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
            >
              {link.label}
            </Button>
          ))}
        </ActionLinkRow>
      </PageHero>

      <ResumeWebView data={data} />

      <ToastContainer toasts={toasts} onRemove={onRemoveToast} />
    </PublicSiteLayout>
  );
}

export function ResumePage() {
  const data = publicResumeData;
  const [downloading, setDownloading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useDocumentTitle(`${data.header.name} - Resume`);

  function showToast(message: string, type: Toast["type"] = "error"): void {
    const id = ++toastId;
    setToasts((currentToasts) => [...currentToasts, { id, message, type }]);
  }

  function removeToast(id: number): void {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }

  async function downloadPdf(): Promise<void> {
    setDownloading(true);
    try {
      const blob = await requestPublicResumePdf();
      downloadBlob(blob, `${data.header.name.replace(/\s+/g, "_")}_Resume.pdf`);
      showToast("PDF downloaded successfully", "success");
    } catch (downloadError) {
      const message =
        downloadError instanceof Error
          ? downloadError.message
          : "Failed to download PDF. Please try again.";
      showToast(message, "error");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <ResumePageContent
      data={data}
      downloading={downloading}
      onDownload={() => {
        void downloadPdf();
      }}
      toasts={toasts}
      onRemoveToast={removeToast}
    />
  );
}
