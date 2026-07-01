const GITHUB_API = "https://api.github.com";

function getConfig() {
  return {
    token: process.env.GITHUB_TOKEN || "",
    owner: process.env.GITHUB_OWNER || "",
    repo: process.env.GITHUB_REPO || "",
    branch: process.env.GITHUB_BRANCH || "main",
  };
}

async function githubFetch(path: string, options: RequestInit = {}) {
  const { token } = getConfig();
  const res = await fetch(`${GITHUB_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `GitHub API error: ${res.status}`);
  return data;
}

export async function getFilesha(slug: string): Promise<string | null> {
  const { owner, repo, branch } = getConfig();
  try {
    const data = await githubFetch(
      `/repos/${owner}/${repo}/contents/content/notes/${slug}.mdx?ref=${branch}`
    );
    return data.sha || null;
  } catch {
    return null;
  }
}

export async function upsertNote(slug: string, content: string, sha?: string | null) {
  const { owner, repo, branch } = getConfig();
  const encoded = Buffer.from(content, "utf-8").toString("base64");
  const body: Record<string, unknown> = {
    message: sha ? `update: ${slug}` : `add: ${slug}`,
    content: encoded,
    branch,
  };
  if (sha) body.sha = sha;

  return githubFetch(`/repos/${owner}/${repo}/contents/content/notes/${slug}.mdx`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteNote(slug: string, sha: string) {
  const { owner, repo, branch } = getConfig();
  return githubFetch(`/repos/${owner}/${repo}/contents/content/notes/${slug}.mdx`, {
    method: "DELETE",
    body: JSON.stringify({
      message: `delete: ${slug}`,
      sha,
      branch,
    }),
  });
}

export async function listNotes() {
  const { owner, repo, branch } = getConfig();
  try {
    const items = await githubFetch(
      `/repos/${owner}/${repo}/contents/content/notes?ref=${branch}`
    );
    return (items as Array<{ name: string; sha: string; path: string }>)
      .filter((f) => f.name.endsWith(".mdx") || f.name.endsWith(".md"))
      .map((f) => ({ slug: f.name.replace(/\.(mdx|md)$/, ""), sha: f.sha }));
  } catch {
    return [];
  }
}

export async function getNoteContent(slug: string): Promise<string | null> {
  const { owner, repo, branch } = getConfig();
  try {
    const data = await githubFetch(
      `/repos/${owner}/${repo}/contents/content/notes/${slug}.mdx?ref=${branch}`
    );
    return Buffer.from(data.content, "base64").toString("utf-8");
  } catch {
    return null;
  }
}
