// Resume data structure

export interface ResumeData {
  header: {
    name: string;
    badges: string[];
    contacts: {
      phone?: string;
      linkedin?: string;
      email?: string;
    };
    summary: string;
  };
  experience: Array<{
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    highlights: string[];
  }>;
  skills: {
    frontend: string[];
    backend: string[];
    management: string[];
  };
  education: Array<{
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
  }>;
  certificates: Array<{
    title: string;
    issuer: string;
    date: string;
  }>;
}
