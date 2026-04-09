import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pagePath = request.nextUrl.pathname;
  const cookieName = `auth_${pagePath.replace(/\//g, "_")}`;
  const auth = request.cookies.get(cookieName)?.value;

  // Accept legacy cookie only for the original amerilife page
  const legacyAuth = request.cookies.get("site_auth")?.value;
  const isLegacyPage = pagePath === "/amerilife-marketing-strategy";

  if (auth === "authenticated" || (isLegacyPage && legacyAuth === "authenticated")) {
    return NextResponse.next();
  }

  // Allow the login API route through
  if (pagePath === "/api/login") {
    return NextResponse.next();
  }

  return new NextResponse(loginHTML(pagePath), {
    status: 401,
    headers: { "Content-Type": "text/html" },
  });
}

export const config = {
  matcher: ["/amerilife-marketing-strategy", "/CA47Media"],
};

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
