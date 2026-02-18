import type { ResumeData } from "../../types";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function toList(value: unknown): string[] {
  if (typeof value === "string") {
    const text = toText(value);
    return text ? [text] : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item) => toList(item));
  }
  return [];
}

function toCommaList(value: unknown): string[] {
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }
  if (Array.isArray(value)) {
    return value.flatMap((item) => toCommaList(item));
  }
  return [];
}

function readPeriod(record: UnknownRecord): {
  startDate: string | null;
  endDate: string | null;
} {
  const period = isRecord(record.period) ? record.period : null;
  const startDate =
    toText(record.startDate) ??
    (period
      ? toText(period.start) ?? toText(period.from) ?? toText(period.startDate)
      : null);
  const endDate =
    toText(record.endDate) ??
    (period ? toText(period.end) ?? toText(period.to) ?? toText(period.endDate) : null);
  return { startDate, endDate };
}

function normalizeHeader(data: UnknownRecord): ResumeData["header"] | null {
  const profile = isRecord(data.profile) ? data.profile : null;
  const header = isRecord(data.header) ? data.header : null;
  const source = profile ?? header;

  if (!source) return null;

  const name = toText(source.name) ?? (header ? toText(header.name) : null);
  if (!name) return null;

  const badges = toList(
    source.badges ?? source.headline ?? data.badges ?? (header ? header.badges : null)
  );

  const contactsSource =
    (isRecord(source.contacts) ? source.contacts : null) ??
    (header && isRecord(header.contacts) ? header.contacts : null) ??
    (isRecord(data.contacts) ? data.contacts : null);

  const contacts: ResumeData["header"]["contacts"] = {};
  if (contactsSource) {
    const phone = toText(contactsSource.phone);
    const linkedin = toText(contactsSource.linkedin);
    const email = toText(contactsSource.email);
    if (phone) contacts.phone = phone;
    if (linkedin) contacts.linkedin = linkedin;
    if (email) contacts.email = email;
  }

  const summary =
    toText(source.summary) ??
    (header ? toText(header.summary) : null) ??
    toText(data.summary) ??
    "";

  return {
    name,
    badges,
    contacts,
    summary,
  };
}

function normalizeExperience(data: UnknownRecord): ResumeData["experience"] {
  const source = Array.isArray(data.experience)
    ? data.experience
    : Array.isArray(data.workExperience)
      ? data.workExperience
      : [];
  const experience: ResumeData["experience"] = [];

  for (const item of source) {
    if (!isRecord(item)) continue;
    const title =
      toText(item.title) ?? toText(item.role) ?? toText(item.position) ?? toText(item.jobTitle);
    const company =
      toText(item.company) ??
      toText(item.organization) ??
      toText(item.employer) ??
      toText(item.client);
    const { startDate, endDate } = readPeriod(item);
    const highlights = toList(item.highlights ?? item.achievements ?? item.bullets);

    if (!title || !company || !startDate) continue;

    experience.push({
      title,
      company,
      startDate,
      endDate: endDate ?? "Present",
      highlights,
    });
  }

  return experience;
}

function normalizeSkills(data: UnknownRecord): ResumeData["skills"] {
  const source = data.skills ?? data.skillGroups;
  const skills: ResumeData["skills"] = {};

  if (Array.isArray(source)) {
    for (const item of source) {
      if (!isRecord(item)) continue;
      const category = toText(item.category) ?? toText(item.name);
      if (!category) continue;

      const values = toCommaList(item.items ?? item.keywords ?? item.skills);
      if (values.length > 0) skills[category] = values;
    }
    return skills;
  }

  if (!isRecord(source)) return skills;

  for (const [category, value] of Object.entries(source)) {
    const values = toCommaList(value);
    if (values.length > 0) skills[category] = values;
  }

  return skills;
}

function normalizeEducation(data: UnknownRecord): ResumeData["education"] {
  const source = Array.isArray(data.education)
    ? data.education
    : Array.isArray(data.studies)
      ? data.studies
      : [];
  const education: ResumeData["education"] = [];

  for (const item of source) {
    if (!isRecord(item)) continue;
    const school = toText(item.school) ?? toText(item.institution);
    const degree = toText(item.degree) ?? toText(item.program);
    const { startDate, endDate } = readPeriod(item);

    if (!school || !degree || !startDate) continue;

    education.push({
      school,
      degree,
      startDate,
      endDate: endDate ?? "",
    });
  }

  return education;
}

function normalizeCertificates(data: UnknownRecord): ResumeData["certificates"] {
  const source = Array.isArray(data.certificates)
    ? data.certificates
    : Array.isArray(data.certifications)
      ? data.certifications
      : [];
  const certificates: ResumeData["certificates"] = [];

  for (const item of source) {
    if (!isRecord(item)) continue;
    const title = toText(item.title) ?? toText(item.name);
    const issuer =
      toText(item.issuer) ?? toText(item.authority) ?? toText(item.provider);
    const date = toText(item.date) ?? toText(item.earned) ?? toText(item.issuedAt) ?? "";

    if (!title || !issuer) continue;

    certificates.push({
      title,
      issuer,
      date,
    });
  }

  return certificates;
}

export function normalizeResumeData(data: unknown): ResumeData | null {
  if (!isRecord(data)) return null;

  const header = normalizeHeader(data);
  if (!header) return null;

  const experience = normalizeExperience(data);
  const skills = normalizeSkills(data);
  const education = normalizeEducation(data);
  const certificates = normalizeCertificates(data);

  return {
    header,
    experience,
    skills,
    education,
    certificates,
  };
}
