import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    console.error("Groq Error:", error);
    throw new Error("Groq API failed");
  }

  return res.json();
}

function safeParseJSON(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Invalid AI response");

    return JSON.parse(
      match[0]
        .replace(/'/g, '"')
        .replace(/,\s*}/g, "}")
        .replace(/,\s*]/g, "]")
    );
  }
}

function ensureArray(arr: any, fallback: string[]) {
  return Array.isArray(arr) && arr.length > 0 ? arr : fallback;
}

export async function POST(request: NextRequest) {
  try {
    // ---------------------------
    // 1. Supabase Auth (FIXED)
    // ---------------------------
    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

   console.log("AUTH USER:", user);
   console.log("AUTH USER ID:", user?.id);  

    // ---------------------------
    // 2. Form Data
    // ---------------------------
    const formData = await request.formData();
    const file = formData.get("resume") as File;
    const jobDescription =
      (formData.get("jobDescription") as string) || "";

    if (!file) {
      return NextResponse.json(
        { error: "No resume file provided" },
        { status: 400 }
      );
    }

    // ---------------------------
    // 3. Extract text
    // ---------------------------
    const buffer = Buffer.from(await file.arrayBuffer());
    let resumeText = buffer
      .toString("latin1")
      .replace(/[^\x20-\x7E\n]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 3500);

    if (resumeText.length < 20) {
      return NextResponse.json(
        { error: "Could not extract resume text" },
        { status: 400 }
      );
    }

    // ---------------------------
    // 4. Prompt
    // ---------------------------
    const prompt = `
You are an ATS Resume Analyzer.

Return ONLY valid JSON:
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
- atsScore: 50-95
- jobMatchScore: 40-95
- NEVER empty arrays
- minimum 5 skillsFound
- minimum 3 skillsMissing
- minimum 5 keywordsFound
- minimum 3 keywordsMissing
- minimum 3 aiSuggestions

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

    // ---------------------------
    // 5. Call Groq
    // ---------------------------
    const groqData = await callGroq(prompt);

    const responseText =
      groqData?.choices?.[0]?.message?.content || "";

    if (!responseText) throw new Error("Empty AI response");

    let analysisResult;

    try {
      analysisResult = safeParseJSON(responseText);
    } catch {
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

    // ---------------------------
    // 6. Normalize scores
    // ---------------------------
    const atsScore = Math.max(
      40,
      Math.min(95, Number(analysisResult.atsScore) || 65)
    );

    const jobMatchScore = Math.max(
      30,
      Math.min(95, Number(analysisResult.jobMatchScore) || 55)
    );

    const overallGrade = analysisResult.overallGrade || "C";

    // ---------------------------
    // 7. Save to Supabase
    // ---------------------------
    const { data, error } = await supabase
      .from("resume_history")
      .insert([
        {
          user_id: user?.id ?? null,
          file_name: file.name,
          ats_score: atsScore,
          job_match_score: jobMatchScore,
          overall_grade: overallGrade,
        },
      ])
      .select();

    console.log("INSERT DATA:", data);
    console.log("INSERT ERROR:", error);

    // ---------------------------
    // 8. Response
    // ---------------------------
    return NextResponse.json({
      fileName: file.name,
      analyzedAt: new Date().toISOString(),
      atsScore,
      jobMatchScore,
      overallGrade,

      skillsFound: ensureArray(analysisResult.skillsFound, [
        "Communication",
        "Problem Solving",
        "Teamwork",
        "Java",
        "Projects",
      ]),

      skillsMissing: ensureArray(analysisResult.skillsMissing, [
        "Leadership",
        "System Design",
        "Testing",
      ]),

      keywordsFound: ensureArray(analysisResult.keywordsFound, [
        "Java",
        "Projects",
        "Development",
        "Programming",
        "Git",
      ]),

      keywordsMissing: ensureArray(analysisResult.keywordsMissing, [
        "REST API",
        "Microservices",
        "Cloud",
      ]),

      aiSuggestions: ensureArray(analysisResult.aiSuggestions, [
        "Add measurable outcomes",
        "Improve formatting",
        "Add more technical keywords",
      ]),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to analyze resume",
      },
      { status: 500 }
    );
  }
}