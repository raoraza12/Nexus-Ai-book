import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://nexus-ai-api.vercel.app";

async function handler(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  let pathStr = path.join("/");
  
  // Ensure the internal /api/v1 prefix is preserved correctly
  // If the backend expects /api/v1/... then pathStr should already have it
  // if called as /api/proxy/api/v1/...
  
  const targetUrl = `${BACKEND_URL}/${pathStr}`;
  console.log(`Proxy: Forwarding ${req.method} request to ${targetUrl}`);

  // Forward search params
  const searchParams = req.nextUrl.searchParams.toString();
  const fullUrl = searchParams ? `${targetUrl}?${searchParams}` : targetUrl;

  // Filter out host headers that might interfere with Vercel
  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (!["host", "connection", "origin", "referer"].includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  let body: string | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    body = await req.text();
  }

  try {
    const backendResponse = await fetch(fullUrl, {
      method: req.method,
      headers: headers,
      body: body || undefined,
    });

  const data = await backendResponse.json().catch(() => ({}));

  return NextResponse.json(data, {
    status: backendResponse.status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
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
