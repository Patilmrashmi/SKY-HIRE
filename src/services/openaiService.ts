import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: '',
  dangerouslyAllowBrowser: true
});

// Fallback to basic matching if API fails
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

  const matchScore = (matchedSkills.length / jobSkills.length) * 100;

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
  try {
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
      5. Return valid JSON only, no additional text
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content;
    console.log('Raw OpenAI response:', response);

    if (!response) {
      throw new Error('Empty response from OpenAI');
    }

    const analysis = JSON.parse(response);

    // Validate and clean the response
    const validatedAnalysis = {
      matchedSkills: Array.isArray(analysis.matchedSkills) ? analysis.matchedSkills : [],
      missingSkills: Array.isArray(analysis.missingSkills) ? analysis.missingSkills : [],
      matchScore: typeof analysis.matchScore === 'number' ? analysis.matchScore : 0,
      improvements: analysis.improvements || {}
    };

    console.log('Processed analysis:', validatedAnalysis);
    return validatedAnalysis;

  } catch (error) {
    console.error('Error in analyzeSkills:', error);
    // Fallback to basic matching if API fails
    const basicMatch = basicSkillMatch(userSkills, jobSkills);
    return {
      ...basicMatch,
      improvements: {}
    };
  }
}