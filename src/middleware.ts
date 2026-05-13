import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pagePath = request.nextUrl.pathname;
  // Normalize to lowercase so mixed-case routes (e.g. /CalendarPrototype)
  // generate the same cookie key that the login route sets.
  const normalizedPath = pagePath.toLowerCase();
  const cookieName = `auth_${normalizedPath.replace(/\//g, "_")}`;
  const auth = request.cookies.get(cookieName)?.value;

  // Accept legacy cookie only for the original amerilife page
  const legacyAuth = request.cookies.get("site_auth")?.value;
  const isLegacyPage = normalizedPath === "/amerilife-marketing-strategy";

  if (auth === "authenticated" || (isLegacyPage && legacyAuth === "authenticated")) {
    return NextResponse.next();
  }

  // Allow the login API route through
  if (normalizedPath === "/api/login") {
    return NextResponse.next();
  }

  const html =
    normalizedPath === "/leadstarleaders"
      ? leadStarLoginHTML(pagePath)
      : loginHTML(pagePath);

  return new NextResponse(html, {
    status: 401,
    headers: { "Content-Type": "text/html" },
  });
}

export const config = {
  matcher: ["/amerilife-marketing-strategy", "/ca47media", "/CalendarPrototype", "/GmailCleaner", "/LeadStarLeaders"],
};

function leadStarLoginHTML(pagePath: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LeadStar Leaders</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #231f20;
      color: #f9f9f9;
      font-family: 'Poppins', system-ui, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .container {
      text-align: center;
      opacity: 0;
      animation: fadeIn 0.8s ease-out 0.1s forwards;
      max-width: 420px;
      width: 100%;
    }
    .logo-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }
    .wordmark {
      font-size: 1.75rem;
      font-weight: 300;
      letter-spacing: 0.18em;
      color: #f9f9f9;
      line-height: 1;
      text-align: left;
    }
    .divider {
      width: 1px;
      height: 56px;
      background: #f9f9f9;
      opacity: 0.85;
    }
    .compass { width: 56px; height: 56px; }
    .powered {
      font-size: 0.625rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: rgba(249, 249, 249, 0.7);
      margin-bottom: 3rem;
      font-weight: 500;
    }
    .powered b { color: #eeb54e; font-weight: 600; }
    form { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    input[type="password"] {
      background: rgba(249, 249, 249, 0.04);
      border: 1px solid rgba(238, 181, 78, 0.35);
      border-radius: 4px;
      padding: 0.75rem 1.25rem;
      color: #f9f9f9;
      font-family: 'Poppins', sans-serif;
      font-size: 0.875rem;
      letter-spacing: 0.08em;
      text-align: center;
      outline: none;
      width: 260px;
      transition: border-color 0.2s, background 0.2s;
    }
    input[type="password"]:focus {
      border-color: #eeb54e;
      background: rgba(249, 249, 249, 0.07);
    }
    input[type="password"]::placeholder {
      color: rgba(249, 249, 249, 0.3);
      letter-spacing: 0.05em;
    }
    button {
      background: #eeb54e;
      border: 1px solid #eeb54e;
      border-radius: 4px;
      padding: 0.65rem 2.5rem;
      color: #231f20;
      font-family: 'Poppins', sans-serif;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    button:hover { background: #f2c574; border-color: #f2c574; }
    .error {
      color: rgba(255, 120, 120, 0.85);
      font-size: 0.75rem;
      margin-top: 0.25rem;
      min-height: 1.2em;
      letter-spacing: 0.04em;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo-row">
      <div class="wordmark">LEAD<br/>STAR</div>
      <div class="divider"></div>
      <svg class="compass" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="50" cy="50" r="46" fill="none" stroke="#eeb54e" stroke-width="3" stroke-dasharray="36 8 4 8 36 8 4 8" />
        <polygon points="50,8 56,46 50,50 44,46" fill="#eeb54e" />
        <polygon points="50,92 56,54 50,50 44,54" fill="#eeb54e" />
        <polygon points="8,50 46,44 50,50 46,56" fill="#eeb54e" />
        <polygon points="92,50 54,44 50,50 54,56" fill="#eeb54e" />
        <polygon points="50,28 54,46 50,50 46,46" fill="#231f20" />
        <polygon points="50,72 54,54 50,50 46,54" fill="#231f20" />
        <polygon points="28,50 46,46 50,50 46,54" fill="#231f20" />
        <polygon points="72,50 54,46 50,50 54,54" fill="#231f20" />
        <circle cx="50" cy="50" r="2.5" fill="#f9f9f9" />
      </svg>
    </div>
    <div class="powered">Powered By <b>EnrollHere</b></div>
    <form id="loginForm">
      <input type="password" id="pw" placeholder="Password" autofocus autocapitalize="off" autocorrect="off" autocomplete="off" />
      <button type="submit">Enter</button>
      <div class="error" id="err"></div>
    </form>
  </div>
  <script>
    document.getElementById("loginForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const pw = document.getElementById("pw").value;
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw, page: "${pagePath}" }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        document.getElementById("err").textContent = "Incorrect password";
        document.getElementById("pw").value = "";
        document.getElementById("pw").focus();
      }
    });
  </script>
</body>
</html>`;
}

function loginHTML(pagePath: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DeCourcy.com</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #071a0e;
      color: #fff;
      font-family: system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      text-align: center;
      opacity: 0;
      animation: fadeIn 1s ease-out 0.2s forwards;
    }
    h1 {
      font-family: Georgia, serif;
      font-size: 1.5rem;
      font-weight: 600;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: #1a4a2e;
      -webkit-text-stroke: 0.5px rgba(255, 255, 255, 0.45);
      margin-bottom: 3rem;
    }
    h1 .sm { font-size: 0.75em; }
    form { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    input[type="password"] {
      background: transparent;
      border: 1px solid rgba(91, 155, 213, 0.3);
      border-radius: 4px;
      padding: 0.6rem 1.2rem;
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.875rem;
      letter-spacing: 0.1em;
      text-align: center;
      outline: none;
      width: 220px;
      transition: border-color 0.3s;
    }
    input[type="password"]:focus {
      border-color: rgba(91, 155, 213, 0.6);
    }
    input[type="password"]::placeholder {
      color: rgba(255, 255, 255, 0.2);
      letter-spacing: 0.05em;
    }
    button {
      background: transparent;
      border: 1px solid rgba(91, 155, 213, 0.3);
      border-radius: 4px;
      padding: 0.5rem 2rem;
      color: rgba(91, 155, 213, 0.7);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
    }
    button:hover {
      border-color: rgba(91, 155, 213, 0.6);
      color: rgba(91, 155, 213, 0.9);
    }
    .error {
      color: rgba(255, 100, 100, 0.7);
      font-size: 0.75rem;
      margin-top: 0.5rem;
      min-height: 1.2em;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>D<span class="sm">E</span>COURCY.<span class="sm">COM</span></h1>
    <form id="loginForm">
      <input type="password" id="pw" placeholder="Password" autofocus autocapitalize="off" autocorrect="off" autocomplete="off" />
      <button type="submit">Enter</button>
      <div class="error" id="err"></div>
    </form>
  </div>
  <script>
    document.getElementById("loginForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const pw = document.getElementById("pw").value;
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw, page: "${pagePath}" }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        document.getElementById("err").textContent = "Incorrect password";
        document.getElementById("pw").value = "";
        document.getElementById("pw").focus();
      }
    });
  </script>
</body>
</html>`;
}
