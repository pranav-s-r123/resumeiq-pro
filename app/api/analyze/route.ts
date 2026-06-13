import { supabase } from "@/lib/supabase-client";
import { NextRequest, NextResponse } from "next/server";

async function callGroq(prompt: string) {
  const res = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      }),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    console.error("Groq Error:", error);
    throw new Error("Groq API failed");
  }

  return await res.json();
}

function safeParseJSON(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("Invalid AI response");
    }

    const fixed = match[0]
      .replace(/'/g, '"')
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]");

    return JSON.parse(fixed);
  }
}

function ensureArray(arr: any, fallback: string[]) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return fallback;
  }

  return arr;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userId = formData.get("userId") as string;

console.log("USER ID FROM FORM:", userId);


    const file = formData.get("resume") as File;
    
    const jobDescription =
      (formData.get("jobDescription") as string) || "";

    if (!file) {
      return NextResponse.json(
        { error: "No resume file provided" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let resumeText = buffer.toString("latin1");

    resumeText = resumeText
      .replace(/[^\x20-\x7E\n]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 3500);

    if (resumeText.length < 20) {
      return NextResponse.json(
        {
          error: "Could not extract resume text",
        },
        {
          status: 400,
        }
      );
    }

    const prompt = `
You are an ATS Resume Analyzer.

Return ONLY valid JSON.

{
  "atsScore": number,
  "jobMatchScore": number,
  "overallGrade": "A",
  "skillsFound": [],
  "skillsMissing": [],
  "keywordsFound": [],
  "keywordsMissing": [],
  "aiSuggestions": []
}

Rules:
- atsScore between 50 and 95
- jobMatchScore between 40 and 95
- NEVER return empty arrays
- Give minimum 5 skillsFound
- Give minimum 3 skillsMissing
- Give minimum 5 keywordsFound
- Give minimum 3 keywordsMissing
- Give minimum 3 aiSuggestions
- Output ONLY JSON

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

    await new Promise((r) => setTimeout(r, 500));

    const groqData = await callGroq(prompt);

const responseText =
  groqData.choices?.[0]?.message?.content || "";

    if (!responseText) {
      throw new Error("Empty AI response");
    }

    let analysisResult;

try {
  analysisResult = safeParseJSON(responseText);
} catch (err) {
  console.log("JSON parse failed, using fallback");

  analysisResult = {
    atsScore: 65,
    jobMatchScore: 55,
    overallGrade: "C",
    skillsFound: ["Java", "Communication", "Teamwork"],
    skillsMissing: ["System Design", "Testing"],
    keywordsFound: ["Java", "Git", "Projects"],
    keywordsMissing: ["Cloud", "REST API"],
    aiSuggestions: ["Improve formatting", "Add more projects"],
  };
}
    const atsScore = Math.max(
      40,
      Math.min(
        95,
        Number(analysisResult.atsScore) || 65
      )
    );

    const jobMatchScore = Math.max(
      30,
      Math.min(
        95,
        Number(analysisResult.jobMatchScore) || 55
      )
    );

    const overallGrade =
  analysisResult.overallGrade || "C";

// Save analysis to Supabase
try {
  const { data, error } = await supabase
  .from("resume_history")
  .insert([
    {
      user_id: userId || null, 
      file_name: file.name,
      ats_score: atsScore,
      job_match_score: jobMatchScore,
      overall_grade: overallGrade,
    },
  ])
  .select();

console.log("INSERT DATA:", data);
console.log("INSERT ERROR:", error);

  if (error) {
    console.error("Supabase Insert Error:", error);
  }
} catch (err) {
  console.error("Supabase Save Failed:", err);
}

return NextResponse.json({
      fileName: file.name,
      analyzedAt: new Date().toISOString(),

      atsScore,
      jobMatchScore,
      overallGrade,

      skillsFound: ensureArray(
        analysisResult.skillsFound,
        [
          "Communication",
          "Problem Solving",
          "Teamwork",
          "Java",
          "Projects",
        ]
      ),

      skillsMissing: ensureArray(
        analysisResult.skillsMissing,
        [
          "Leadership",
          "System Design",
          "Testing",
        ]
      ),

      keywordsFound: ensureArray(
        analysisResult.keywordsFound,
        [
          "Java",
          "Projects",
          "Development",
          "Programming",
          "Git",
        ]
      ),

      keywordsMissing: ensureArray(
        analysisResult.keywordsMissing,
        [
          "REST API",
          "Microservices",
          "Cloud",
        ]
      ),

      aiSuggestions: ensureArray(
        analysisResult.aiSuggestions,
        [
          "Add measurable project outcomes",
          "Include more technical keywords",
          "Improve resume formatting",
        ]
      ),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to analyze resume",

        atsScore: 50,
        jobMatchScore: 40,
        overallGrade: "C",

        skillsFound: [
          "Communication",
          "Problem Solving",
        ],

        skillsMissing: [
          "Leadership",
          "System Design",
        ],

        keywordsFound: [
          "Java",
          "Projects",
        ],

        keywordsMissing: [
          "Cloud",
          "REST API",
        ],

        aiSuggestions: [
          "Improve formatting",
          "Add more technical skills",
          "Include project achievements",
        ],
      },
      {
        status: 500,
      }
    );
  }
}