import Papa from 'papaparse';
import type { Job } from '../types';

// Function to get all available job role files
export const getAvailableJobRoles = async (): Promise<string[]> => {
  try {
    // Use import.meta.glob to get a list of all CSV files in the /data/ directory
    const csvFiles = import.meta.glob('/public/data/*.csv', { as: 'url' });

    const extractedRoles = Object.keys(csvFiles).map((path) => {
      const baseName = path.replace('/public/data/', '').replace('.csv', '');
      return baseName
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    });

    return extractedRoles.length > 0 ? extractedRoles : ['Software Engineer', 'Data Analyst', 'Mixed'];
  } catch (error) {
    console.error('Failed to fetch available job roles:', error);
    // Return default roles if there's an error
    return ['Software Engineer', 'Data Analyst', 'Mixed'];
  }
};


export const fetchJobsFromCSV = async (filename: string): Promise<Job[]> => {
  try {
    const response = await fetch(`/data/${filename}.csv`);
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const jobs = results.data.map((row: any) => {
            // Process the row data based on the format
            return processJobRow(row);
          });
          resolve(jobs as Job[]);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error(`Failed to fetch jobs from ${filename}.csv:`, error);
    throw new Error(`Failed to fetch jobs: ${error}`);
  }
};

// Helper function to process job data from different CSV formats
const processJobRow = (row: any): Job => {
  // Create a new job object with default values
  const job: Job = {
    id: crypto.randomUUID(),
    role: row.role || 'Unknown Role',
    company: row.company || 'Unknown Company',
    experience: row.experience || 'Not specified',
    salary: row.salary || 'Not disclosed',
    location: [],
    jobSummary: row.jobSummary || '',
    skills: [],
    applyLink: row.applyLink || '#'
  };

  // Process location field
  if (row.location) {
    if (typeof row.location === 'string') {
      // Handle location with multiple values (comma-separated or +N format)
      if (row.location.includes(',')) {
        job.location = row.location.split(',').map((loc: string) => loc.trim()).filter(Boolean);
      } else if (row.location.includes('+')) {
        // Format: "Noida+1" or similar
        const locations = row.location.split(/\+/).map((loc: string) => loc.trim()).filter(Boolean);
        // Filter out numeric values (like "+1")
        job.location = locations.filter((loc: string) => isNaN(Number(loc)));
      } else {
        job.location = [row.location.trim()];
      }
    } else if (Array.isArray(row.location)) {
      job.location = row.location;
    }
  } else {
    job.location = ['Not specified'];
  }

  // Process skills field
  if (row.skills) {
    if (typeof row.skills === 'string') {
      // Handle different skill formats
      if (row.skills.includes('\n')) {
        // Format: "Skill1\nSkill2\nSkill3"
        job.skills = row.skills.split('\n').map((skill: string) => skill.trim()).filter(Boolean);
      } else if (row.skills.includes('•')) {
        // Format: "Skill1 • Skill2 • Skill3+2"
        // First split by "+" to handle the "+N" suffix
        const skillParts = row.skills.split(/\+/).map((part: string) => part.trim()).filter(Boolean);
        
        // Process each part
        const extractedSkills: string[] = [];
        for (const part of skillParts) {
          if (part.match(/^\d+$/)) {
            // This is just a number indicating more skills, skip it
            continue;
          }
          // Split by bullet points
          const subSkills = part.split('•').map((s: string) => s.trim()).filter(Boolean);
          extractedSkills.push(...subSkills);
        }
        
        job.skills = extractedSkills;
      } else if (row.skills.includes('+')) {
        // Format: "Skill1 Skill2 Skill3+1 more"
        // Split by "+" and take only the first part
        const mainPart = row.skills.split('+')[0].trim();
        // Split by spaces for timesjobs.com format
        job.skills = mainPart.split(/\s+/).filter(Boolean);
      } else {
        // Simple space-separated list
        job.skills = row.skills.split(/\s+/).filter(Boolean);
      }
    } else if (Array.isArray(row.skills)) {
      job.skills = row.skills;
    }
  }

  // Ensure job summary is properly set
  if (!job.jobSummary && row.JobSummary) {
    job.jobSummary = row.JobSummary;
  }

  return job;
};

export const filterJobs = (jobs: Job[], location: string | null = null): Job[] => {
  if (!location) return jobs;
  return jobs.filter(job => 
    job.location.some(loc => loc.toLowerCase().includes(location.toLowerCase()))
  );
};

export const matchJobsWithSkills = (jobs: Job[], userSkills: string[]): Job[] => {
  return jobs.map(job => {
    const matchedSkills = job.skills.filter(skill => 
      userSkills.some(userSkill => 
        userSkill.toLowerCase() === skill.toLowerCase()
      )
    );
    
    const matchScore = (matchedSkills.length / job.skills.length) * 100;
    
    return {
      ...job,
      matchScore,
      matchedSkills
    };
  })
  .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
  .slice(0, 10);
};