// Resume data structure

export interface ResumeData {
  header: {
    name: string;
    badges: string[];
    contacts: {
      linkedin?: string;
      email?: string;
    };
    summary: string;
  };
  projects?: {
    title: string;
    items: Array<{
      title: string;
      highlights: string[];
    }>;
  };
  experience: Array<{
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    highlights: string[];
  }>;
  skills: Record<string, string[]>;
  education: Array<{
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
  }>;
}
