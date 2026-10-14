import type { SitecoreClient } from "@sitecore-content-sdk/nextjs/client";

export const LLMS_TXT_CONTENT_TYPE = "text/markdown; charset=utf-8";
export const DEFAULT_LLMS_TXT =
  "# llms.txt\n\n> No llms.txt content configured for this site.";

type LlmsTxtResult = {
  site?: {
    siteInfo?: {
      llmsTxt?: string | null;
    } | null;
  } | null;
};

// Preserve the stable SDK query using the Atoms beta's configured GraphQL client.
export async function getLlmsTxt(
  client: Pick<SitecoreClient, "getData">,
  siteName: string,
): Promise<string | null> {
  if (!siteName) {
    throw new Error("A site name is required to fetch llms.txt.");
  }

  const result = await client.getData<LlmsTxtResult>(
    `query LlmsTxtQuery($siteName: String!) {
      site {
        siteInfo(site: $siteName) {
          llmsTxt
        }
      }
    }`,
    { siteName },
  );

  return result?.site?.siteInfo?.llmsTxt || null;
}
