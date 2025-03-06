import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI with API key
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Fallback to basic matching if no API key is available or if API call fails
function basicSkillMatch(userSkills: string[], jobSkills: string[]): {
  matchedSkills: string[];
  missingSkills: string[];
  matchScore: number;
} {
  const normalizedUserSkills = userSkills.map(s => s.toLowerCase());
  const normalizedJobSkills = jobSkills.map(s => s.toLowerCase());

  const matchedSkills = jobSkills.filter(skill => 
    normalizedUserSkills.includes(skill.toLowerCase())
  );

  const missingSkills = jobSkills.filter(skill => 
    !normalizedUserSkills.includes(skill.toLowerCase())
  );

  const matchScore = jobSkills.length > 0 
    ? (matchedSkills.length / jobSkills.length) * 100 
    : 0;

  return {
    matchedSkills,
    missingSkills,
    matchScore
  };
}

export async function analyzeSkills(
  userSkills: string[],
  jobSkills: string[]
): Promise<{
  matchedSkills: string[];
  missingSkills: string[];
  matchScore: number;
  improvements: Record<string, {
    leetcode?: string;
    course?: string;
    project?: string;
    certification?: string;
    openSource?: string;
  }>;
}> {
  // If API key is missing or jobSkills is empty, use basic matching
  if (!genAI || !apiKey || !jobSkills || jobSkills.length === 0) {
    console.log('Using basic skill matching (no API key or empty job skills)');
    return {
      ...basicSkillMatch(userSkills, jobSkills),
      improvements: {}
    };
  }

  try {
    const model = genAI.getGenerativeModel({  model: "gemini-2.0-flash" });

    const prompt = `
      As a technical career advisor, analyze these skills:
      
      User Skills: ${userSkills.join(', ')}
      Job Requirements: ${jobSkills.join(', ')}

      Return a JSON object with:
      1. Matched skills from user's list
      2. Missing skills user needs
      3. Match score (0-100)
      4. For each missing skill, provide specific improvement suggestions:
         - LeetCode problem URL
         - Course recommendation (with platform & cost)
         - Project idea
         - Relevant certification
         - GitHub repo for practice

      Format:
      {
        "matchedSkills": ["skill1", "skill2"],
        "missingSkills": ["skill3", "skill4"],
        "matchScore": 75,
        "improvements": {
          "skill3": {
            "leetcode": "https://leetcode.com/problems/specific-problem",
            "course": "Course name on Platform (Free/Paid)",
            "project": "Specific project description",
            "certification": "Certification name and provider",
            "openSource": "https://github.com/user/repo"
          },
          "skill4": {
            // same structure
          }
        }
      }

      Rules:
      1. Only include real LeetCode problems and GitHub repos
      2. Specify if courses are free or paid
      3. Keep project ideas practical and specific
      4. Only suggest recognized certifications
      5. Return valid JSON only
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');

    try {
      // Try to parse the response as JSON
      const analysis = JSON.parse(text);

      // Ensure all required properties exist
      const validatedAnalysis = {
        matchedSkills: Array.isArray(analysis.matchedSkills) ? analysis.matchedSkills : [],
        missingSkills: Array.isArray(analysis.missingSkills) ? analysis.missingSkills : [],
        matchScore: typeof analysis.matchScore === 'number' ? analysis.matchScore : 0,
        improvements: analysis.improvements || {}
      };

      // Log the processed analysis
      console.log('Processed analysis:', validatedAnalysis);

      return validatedAnalysis;
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      console.log('Raw response:', text);
      return {
        ...basicSkillMatch(userSkills, jobSkills),
        improvements: {}
      };
    }
  } catch (error) {
    console.error('Error in analyzeSkills:', error);
    // Return basic matching with empty improvements
    return {
      ...basicSkillMatch(userSkills, jobSkills),
      improvements: {}
    };
  }
}