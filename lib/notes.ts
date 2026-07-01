import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

export interface Note {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  readingTime: string;
  content: string;
  featured?: boolean;
}

const notesDir = path.join(process.cwd(), "content/notes");

export function getAllNotes(): Note[] {
  if (!fs.existsSync(notesDir)) return [];
  
  const files = fs.readdirSync(notesDir).filter(f => f.endsWith(".mdx") || f.endsWith(".md"));
  
  const notes = files.map(file => {
    const slug = file.replace(/\.(mdx|md)$/, "");
    const raw = fs.readFileSync(path.join(notesDir, file), "utf-8");
    const { data, content } = matter(raw);
    const rt = readingTime(content);
    
    return {
      slug,
      title: data.title || "Untitled",
      excerpt: data.excerpt || "",
      date: data.date || "",
      category: data.category || "General",
      tags: data.tags || [],
      readingTime: rt.text,
      content,
      featured: data.featured || false,
    };
  });

  return notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getNoteBySlug(slug: string): Note | null {
  const filePath = path.join(notesDir, `${slug}.mdx`);
  const fallback = path.join(notesDir, `${slug}.md`);
  
  const target = fs.existsSync(filePath) ? filePath : fs.existsSync(fallback) ? fallback : null;
  if (!target) return null;

  const raw = fs.readFileSync(target, "utf-8");
  const { data, content } = matter(raw);
  const rt = readingTime(content);

  return {
    slug,
    title: data.title,
    excerpt: data.excerpt || "",
    date: data.date,
    category: data.category || "General",
    tags: data.tags || [],
    readingTime: rt.text,
    content,
    featured: data.featured || false,
  };
}

export const categories = [
  "Startups",
  "Products",
  "Web3",
  "Growth",
  "Research",
  "Essays",
  "Systems",
  "Execution",
];
