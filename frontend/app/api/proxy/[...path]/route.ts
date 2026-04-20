import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://nexus-ai-api.vercel.app";

async function handler(req: NextRequest, context: any) {
  const params = await context.params;
  const path: string[] = params.path || [];
  let pathStr = path.join("/");
  
  // Base targets for the probe
  const targets = [
    `${BACKEND_URL}/${pathStr}`,
    `${BACKEND_URL}/api/${pathStr}` // Some Vercel configs prepend /api
  ];

  // If original had a trailing slash, add it to both
  if (req.nextUrl.pathname.endsWith("/")) {
    targets[0] += "/";
    targets[1] += "/";
  }

  // Header Filtering
  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (!["host", "connection", "origin", "referer"].includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  const body = req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined;

  let lastResponse: Response | null = null;

  for (const targetUrl of targets) {
    try {
      console.log(`Proxy: Probing ${req.method} -> ${targetUrl}`);
      const response = await fetch(targetUrl, {
        method: req.method,
        headers: headers,
        body: body,
        redirect: "follow",
      });

      // If we get a valid successful response OR a semantic error (like 422, 401, 500 from the app)
      // we return it. We only skip if it's a 405/404 which might indicate a routing mismatch.
      if (response.ok || ![404, 405].includes(response.status)) {
        const data = await response.json().catch(() => ({}));
        return NextResponse.json(data, {
          status: response.status,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        });
      }
      lastResponse = response;
    } catch (error) {
      console.error(`Proxy: Probe failed for ${targetUrl}`, error);
    }
  }

  // If all probes failed to find a valid route
  const status = lastResponse?.status || 502;
  const finalMsg = lastResponse ? `Backend error (${lastResponse.status})` : "Gateway timeout or unreachable backend";
  
  return NextResponse.json(
    { detail: `Nexus Neural Error: ${finalMsg}. Path probed: ${targets.join(" | ")}` },
    { status: status }
  );
}

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handler(req, context);
}

export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handler(req, context);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handler(req, context);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handler(req, context);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
