import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const dynamic = "force-static";

export async function GET() {
  const source = await readFile(join(process.cwd(), "public", "brand-icon-transparent.b64"), "utf8");
  const bytes = Buffer.from(source.trim(), "base64");
  return new Response(bytes, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
