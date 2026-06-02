import { parseCSV } from "@/lib/parseCSV";
import { enrichCoversFromOpenLibrary } from "@/lib/covers";

// GET /api/shelf is intentionally disabled for now; the app only supports CSV.
export async function GET() {
  return Response.json(
    { error: "Direct account imports are disabled; upload a CSV export instead." },
    { status: 405 },
  );
}

// POST /api/shelf?source=goodreads|storygraph  (body: raw CSV text)  → ShelfData
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source");
  const csv = await request.text();
  console.log(`Received CSV for source=${source}, length=${csv.length}`);
  if (source !== "goodreads" && source !== "storygraph") {
    return Response.json({ error: "unsupported csv source" }, { status: 400 });
  }

  if (!csv.trim()) {
    return Response.json({ error: "empty csv" }, { status: 400 });
  }
  const shelf = parseCSV(csv, source);

  // ISBN-based covers are set during parsing; fill the rest via Open Library
  // search so both supported CSV import formats have a fallback.
  await enrichCoversFromOpenLibrary(shelf);

  return Response.json(shelf);
}
