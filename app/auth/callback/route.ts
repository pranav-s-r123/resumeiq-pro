import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  console.log("FULL URL:", request.url);
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as
    | "signup" | "magiclink" | "recovery" | "invite" | "email_change"
    | null;
    const cookieStore = cookies(); // safe on both Next 14 and 15
  const response = NextResponse.redirect(new URL("/dashboard", url.origin));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  let error = null;

 if (code) {
  console.log("CODE RECEIVED:", code);

  const result = await supabase.auth.exchangeCodeForSession(code);

  console.log("RESULT:", result);

  error = result.error;
} else if (token_hash && type) {
    // Email confirmation / magic link callback
    ({ error } = await supabase.auth.verifyOtp({ token_hash, type }));
  } else {
    return NextResponse.redirect(
      new URL("/auth?error=missing_params", url.origin)
    );
  }

  if (error) {
    console.error(error);
    return NextResponse.redirect(
      new URL(`/auth?error=${encodeURIComponent(error.message)}`, url.origin)
    );
  }

  return response;
}