import React from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import {
  Box,
  Button,
  Chip,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { alpha, type SxProps, type Theme } from "@mui/material/styles";
import { monoStack } from "../../theme";
import { BLOG_PATH, PROJECTS_PATH } from "../site/content";
import {
  getPostBySlug,
  getPostRelatedLinks,
  postPath,
  postRecords,
  type PostBlock,
  type PostRecord,
  type PostStatus,
} from "../site/post-content";
import {
  ActionLinkRow,
  DetailPageHeader,
  IndexPageHeader,
  PageHero,
  PageSection,
  PublicSiteLayout,
  SectionHeader,
} from "../site/layout";
import {
  accentChipSx,
  accentPanelBaseSx,
  composeSx,
  mutedChipSx,
  softPanelBaseSx,
  warningPanelBaseSx,
} from "../site/styles";
import { useDocumentTitle } from "../site/use-document-title";

const PAGE_TITLE = "Blog | Tony Lee";
const POST_DETAIL_PREFIX = `${BLOG_PATH}/`;
const HOME_BREADCRUMB = { label: "Home", href: "/" };
const BLOG_BREADCRUMB = { label: "Blog", href: BLOG_PATH };

const postPageListSx: SxProps<Theme> = {
  display: "grid",
  gap: { xs: 2, md: 2.25 },
};

const postIndexGridSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    lg: "repeat(2, minmax(0, 1fr))",
  },
  gap: { xs: 1.25, md: 1.5 },
};

const postIndexSummarySx: SxProps<Theme> = composeSx(accentPanelBaseSx, {
  display: "grid",
  gap: 0.65,
  alignSelf: { md: "end" },
  p: { xs: 1.25, sm: 1.35 },
});

const postIndexCardSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "flex",
  flexDirection: "column",
  gap: { xs: 1.05, md: 1.2 },
  height: "100%",
  p: { xs: 1.35, sm: 1.55, md: 1.7 },
});

const postCardBodySx: SxProps<Theme> = {
  display: "grid",
  gap: 0.7,
  minWidth: 0,
  minHeight: { lg: "11rem" },
  alignContent: "start",
};

const postMetaRowSx: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  gap: 0.65,
  alignItems: "center",
};

const postTagRowSx: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  gap: 0.55,
  alignItems: "center",
};

const postCardActionsSx: SxProps<Theme> = {
  mt: "auto",
  pt: { xs: 0.2, md: 0.45 },
};

const postMetaPanelSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  gap: 0.85,
  p: { xs: 1.2, sm: 1.35 },
});

const postMetaGridSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: {
    xs: "repeat(2, minmax(0, 1fr))",
    md: "minmax(0, 1fr)",
  },
  gap: 0.7,
};

const postMetaItemSx: SxProps<Theme> = composeSx(accentPanelBaseSx, {
  display: "grid",
  gap: 0.15,
  minHeight: "4.1rem",
  p: { xs: 1, sm: 1.1 },
});

const articleShellSx: SxProps<Theme> = {
  display: "grid",
  gap: { xs: 1.5, md: 1.8 },
  maxWidth: "58rem",
};

const outlinePanelSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  gap: 0.9,
  p: { xs: 1.25, sm: 1.45, md: 1.55 },
});

const outlineListSx: SxProps<Theme> = {
  m: 0,
  pl: 2.25,
  color: "text.secondary",
  "& li": {
    pl: 0.25,
  },
  "& li + li": {
    mt: 0.45,
  },
};

const articleParagraphSx: SxProps<Theme> = {
  color: "text.secondary",
  maxWidth: "56rem",
};

const articleListSx: SxProps<Theme> = {
  m: 0,
  pl: 2.25,
  color: "text.secondary",
  "& li": {
    pl: 0.25,
  },
  "& li + li": {
    mt: 0.5,
  },
};

const flowGridSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "repeat(2, minmax(0, 1fr))",
  },
  gap: { xs: 0.85, md: 1 },
};

const flowStepSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  gridTemplateColumns: "2.2rem minmax(0, 1fr)",
  gap: 0.75,
  alignItems: "center",
  minHeight: "4.2rem",
  p: { xs: 1, sm: 1.1 },
});

const flowStepNumberSx: SxProps<Theme> = (theme) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "2.1rem",
  height: "2.1rem",
  borderRadius: "50%",
  backgroundColor: alpha(theme.palette.secondary.main, 0.12),
  color: theme.palette.secondary.dark,
  fontWeight: 750,
  fontSize: "0.82rem",
});

const postCodeSx: SxProps<Theme> = (theme) => ({
  m: 0,
  minWidth: 0,
  maxWidth: "100%",
  overflowX: "auto",
  px: 1.5,
  py: 1.25,
  borderRadius: 1.5,
  backgroundColor: "#0d1117",
  border: "1px solid #30363d",
  color: "#e6edf3",
  fontFamily: monoStack,
  fontSize: { xs: "0.82rem", sm: "0.86rem" },
  lineHeight: 1.55,
  overflowWrap: "anywhere",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  boxShadow: `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.06)}`,
});

const tableShellSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  overflow: "hidden",
});

const relatedGridSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "repeat(2, minmax(0, 1fr))",
  },
  gap: { xs: 0.9, md: 1 },
};

const relatedLinkSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  gap: 0.35,
  alignContent: "center",
  minHeight: "5rem",
  p: { xs: 1.1, sm: 1.25 },
});

function resolveCurrentPathname(initialPath?: string): string {
  return initialPath ?? (typeof window === "undefined" ? BLOG_PATH : window.location.pathname);
}

function isBlogIndexPath(pathname: string): boolean {
  const normalizedPath = (pathname.split(/[?#]/, 1)[0] ?? "").replace(/\/+$/, "");

  return normalizedPath === BLOG_PATH;
}

export function getPostSlugFromPath(pathname: string): string | null {
  const normalizedPath = (pathname.split(/[?#]/, 1)[0] ?? "").replace(/\/+$/, "");

  if (normalizedPath === BLOG_PATH) {
    return null;
  }

  if (!normalizedPath.startsWith(POST_DETAIL_PREFIX)) {
    return null;
  }

  const slug = normalizedPath.slice(POST_DETAIL_PREFIX.length);
  if (!slug || slug.includes("/")) {
    return null;
  }

  return decodeURIComponent(slug);
}

function statusChipSx(status: PostStatus): SxProps<Theme> {
  if (status === "Published") return accentChipSx;
  if (status === "Drafting") return (theme) => ({
    borderColor: alpha(theme.palette.warning.main, 0.35),
    backgroundColor: alpha(theme.palette.warning.light, 0.34),
    color: theme.palette.warning.dark,
  });
  return mutedChipSx;
}

function getPostStats() {
  const tags = new Set(postRecords.flatMap((post) => post.tags));
  const categories = new Set(postRecords.map((post) => post.category));

  return {
    posts: postRecords.length,
    tags: tags.size,
    categories: categories.size,
  };
}

function PostStatusChip({ status }: { status: PostStatus }) {
  return (
    <Chip
      label={status}
      size="small"
      variant="outlined"
      sx={statusChipSx(status)}
    />
  );
}

function PostCard({ post }: { post: PostRecord }) {
  return (
    <Box component="article" sx={postIndexCardSx}>
      <Box sx={postCardBodySx}>
        <Box sx={postMetaRowSx}>
          <Chip label={post.category} size="small" variant="outlined" sx={accentChipSx} />
          <PostStatusChip status={post.status} />
          <Typography variant="caption" color="text.secondary">
            {post.readingTime}
          </Typography>
        </Box>

        <Typography component="h2" variant="h5" sx={{ overflowWrap: "anywhere" }}>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {post.summary}
        </Typography>
      </Box>

      <Box sx={postTagRowSx} aria-label={`${post.title} tags`}>
        {post.tags.map((tag) => (
          <Chip key={`${post.slug}-${tag}`} label={tag} size="small" variant="outlined" />
        ))}
      </Box>

      <Box sx={postCardActionsSx}>
        <Button
          href={postPath(post.slug)}
          variant="outlined"
          endIcon={<ArrowForwardRoundedIcon />}
        >
          Open post
        </Button>
      </Box>
    </Box>
  );
}

function BlogIndexRoute() {
  const stats = getPostStats();

  useDocumentTitle(PAGE_TITLE);

  return (
    <PublicSiteLayout
      activeNav="blog"
      breadcrumbs={[HOME_BREADCRUMB, { label: "Blog" }]}
    >
      <PageSection>
        <Box sx={postPageListSx}>
          <IndexPageHeader
            title="Blog"
            copy="Engineering posts on inference serving, scheduler behavior, and GPU kernel paths."
            support={
              <Box sx={postIndexSummarySx}>
                <Typography variant="body2" color="text.secondary">
                  Working posts start as source-backed outlines, then graduate into deeper writeups as evidence and diagrams settle.
                </Typography>
                <Box sx={postMetaRowSx}>
                  <Chip label={`${stats.posts} posts`} size="small" variant="outlined" />
                  <Chip label={`${stats.categories} categories`} size="small" variant="outlined" />
                  <Chip label={`${stats.tags} tags`} size="small" variant="outlined" />
                </Box>
              </Box>
            }
          />

          <Box sx={postIndexGridSx}>
            {postRecords.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </Box>
        </Box>
      </PageSection>
    </PublicSiteLayout>
  );
}

function PostMetaPanel({ post }: { post: PostRecord }) {
  return (
    <Box sx={postMetaPanelSx}>
      <Box sx={postMetaRowSx}>
        <Chip label={post.category} size="small" variant="outlined" sx={accentChipSx} />
        <PostStatusChip status={post.status} />
      </Box>

      <Box sx={postMetaGridSx}>
        <Box sx={postMetaItemSx}>
          <Typography variant="caption" color="text.secondary">
            Updated
          </Typography>
          <Typography variant="subtitle1">{post.updated}</Typography>
        </Box>
        <Box sx={postMetaItemSx}>
          <Typography variant="caption" color="text.secondary">
            Reading time
          </Typography>
          <Typography variant="subtitle1">{post.readingTime}</Typography>
        </Box>
      </Box>

      <Divider />
      <Box sx={postTagRowSx}>
        {post.tags.map((tag) => (
          <Chip key={`${post.slug}-meta-${tag}`} label={tag} size="small" variant="outlined" />
        ))}
      </Box>
    </Box>
  );
}

function FlowBlock({ block }: { block: Extract<PostBlock, { kind: "flow" }> }) {
  return (
    <Stack spacing={1}>
      <Typography component="h2" variant="h5">
        {block.title}
      </Typography>
      <Box sx={flowGridSx}>
        {block.steps.map((step, index) => (
          <Box key={`${block.title}-${step}`} sx={flowStepSx}>
            <Box component="span" sx={flowStepNumberSx}>
              {String(index + 1).padStart(2, "0")}
            </Box>
            <Typography variant="body2" color="text.secondary">
              {step}
            </Typography>
          </Box>
        ))}
      </Box>
    </Stack>
  );
}

function TableBlock({ block }: { block: Extract<PostBlock, { kind: "table" }> }) {
  const rowSx = (theme: Theme) => ({
    display: "grid",
    gridTemplateColumns: {
      xs: "minmax(0, 1fr)",
      md: `repeat(${block.columns.length}, minmax(0, 1fr))`,
    },
    gap: { xs: 0.4, md: 1 },
    alignItems: "center",
    px: { xs: 1.15, md: 1.35 },
    py: { xs: 1, md: 0.95 },
    "& + &": {
      borderTop: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
    },
  });

  return (
    <Stack spacing={1}>
      <Typography component="h2" variant="h5">
        {block.title}
      </Typography>
      <Box sx={tableShellSx}>
        <Box
          sx={(theme) => ({
            ...rowSx(theme),
            display: { xs: "none", md: "grid" },
            backgroundColor: alpha(theme.palette.text.primary, 0.035),
            color: theme.palette.text.secondary,
            fontSize: "0.72rem",
            fontWeight: 600,
            lineHeight: 1.2,
            textTransform: "uppercase",
          })}
        >
          {block.columns.map((column) => (
            <Box key={column}>{column}</Box>
          ))}
        </Box>
        {block.rows.map((row) => (
          <Box key={row.join("-")} sx={rowSx}>
            {row.map((cell, index) => (
              <Box key={`${row.join("-")}-${index}`} sx={{ minWidth: 0 }}>
                <Typography
                  component="span"
                  sx={{
                    display: { xs: "inline", md: "none" },
                    mr: 0.5,
                    color: "text.secondary",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  {block.columns[index]}:
                </Typography>
                <Typography component="span" variant="body2" color="text.secondary">
                  {cell}
                </Typography>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Stack>
  );
}

function PostArticleBlock({ block }: { block: PostBlock }) {
  if (block.kind === "heading") {
    return (
      <Stack spacing={0.85}>
        {block.eyebrow ? (
          <Typography variant="overline" sx={{ color: "secondary.dark" }}>
            {block.eyebrow}
          </Typography>
        ) : null}
        <Typography component="h2" variant="h4">
          {block.title}
        </Typography>
      </Stack>
    );
  }

  if (block.kind === "paragraph") {
    return (
      <Typography variant="body1" sx={articleParagraphSx}>
        {block.text}
      </Typography>
    );
  }

  if (block.kind === "list") {
    return (
      <Stack spacing={1}>
        {block.title ? (
          <Typography component="h3" variant="h6">
            {block.title}
          </Typography>
        ) : null}
        <Box component="ul" sx={articleListSx}>
          {block.items.map((item) => (
            <Box key={item} component="li">
              <Typography variant="body2">{item}</Typography>
            </Box>
          ))}
        </Box>
      </Stack>
    );
  }

  if (block.kind === "callout") {
    return (
      <Box sx={composeSx(block.tone === "warning" ? warningPanelBaseSx : accentPanelBaseSx, {
        display: "grid",
        gap: 0.55,
        p: { xs: 1.15, sm: 1.3 },
      })}>
        <Typography variant="subtitle1">{block.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {block.body}
        </Typography>
      </Box>
    );
  }

  if (block.kind === "code") {
    return (
      <Stack spacing={1}>
        <Typography component="h2" variant="h5">
          {block.label}
        </Typography>
        <Box component="pre" aria-label={block.label} sx={postCodeSx}>
          <code>{block.code}</code>
        </Box>
      </Stack>
    );
  }

  if (block.kind === "table") {
    return <TableBlock block={block} />;
  }

  return <FlowBlock block={block} />;
}

function RelatedLinksSection({ post }: { post: PostRecord }) {
  const relatedLinks = getPostRelatedLinks(post);

  if (relatedLinks.length === 0) {
    return null;
  }

  return (
    <PageSection>
      <SectionHeader
        eyebrow="Evidence"
        title="Related work"
        copy="Project, experiment, and decision links that this post should stay grounded in."
      />
      <Box sx={relatedGridSx}>
        {relatedLinks.map((link) => (
          <Link
            key={`${link.kind}-${link.href}`}
            href={link.href}
            underline="none"
            color="inherit"
            sx={relatedLinkSx}
          >
            <Typography variant="caption" color="text.secondary">
              {link.kind}
            </Typography>
            <Typography variant="subtitle1" sx={{ overflowWrap: "anywhere" }}>
              {link.label}
            </Typography>
          </Link>
        ))}
      </Box>
    </PageSection>
  );
}

function PostDetailRoute({ post }: { post: PostRecord }) {
  useDocumentTitle(`${post.title} | Tony Lee`);

  return (
    <PublicSiteLayout
      activeNav="blog"
      breadcrumbs={[HOME_BREADCRUMB, BLOG_BREADCRUMB, { label: post.title }]}
    >
      <DetailPageHeader
        title={post.title}
        copy={post.summary}
        support={<PostMetaPanel post={post} />}
        actions={
          <>
            <Button href={BLOG_PATH} variant="contained" startIcon={<ArrowBackRoundedIcon />}>
              All posts
            </Button>
            <Button href={PROJECTS_PATH} variant="outlined">
              View projects
            </Button>
          </>
        }
      />

      <PageSection>
        <Box sx={outlinePanelSx}>
          <Typography variant="overline" sx={{ color: "secondary.dark" }}>
            Outline
          </Typography>
          <Box component="ol" sx={outlineListSx}>
            {post.outline.map((item) => (
              <Box key={item} component="li">
                <Typography variant="body2">{item}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </PageSection>

      <PageSection>
        <Box component="article" sx={articleShellSx}>
          {post.blocks.map((block, index) => (
            <PostArticleBlock key={`${post.slug}-${block.kind}-${index}`} block={block} />
          ))}
        </Box>
      </PageSection>

      <RelatedLinksSection post={post} />
    </PublicSiteLayout>
  );
}

function UnknownPostRoute({ slug }: { slug: string }) {
  useDocumentTitle("Post Not Found | Tony Lee");

  return (
    <PublicSiteLayout
      activeNav="blog"
      breadcrumbs={[HOME_BREADCRUMB, BLOG_BREADCRUMB, { label: "Not found" }]}
    >
      <PageHero>
        <Typography component="h1" variant="h3">
          Post not found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "54rem" }}>
          No blog post is published for "{slug}". Choose from the blog index.
        </Typography>
        <ActionLinkRow>
          <Button href={BLOG_PATH} variant="contained" startIcon={<ArrowBackRoundedIcon />}>
            Blog index
          </Button>
          <Button href={PROJECTS_PATH} variant="outlined">
            View projects
          </Button>
        </ActionLinkRow>
      </PageHero>
    </PublicSiteLayout>
  );
}

export function BlogPage({ initialPath }: { initialPath?: string } = {}) {
  const pathname = resolveCurrentPathname(initialPath);

  if (isBlogIndexPath(pathname)) {
    return <BlogIndexRoute />;
  }

  const slug = getPostSlugFromPath(pathname);
  if (!slug) {
    return <BlogIndexRoute />;
  }

  const post = getPostBySlug(slug);
  if (!post) {
    return <UnknownPostRoute slug={slug} />;
  }

  return <PostDetailRoute post={post} />;
}
