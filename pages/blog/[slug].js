import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import marked from "marked";

export default function blog({
  frontmatter: { title, date, cover_image },
  content,
}) {
  return (
    <>
      <Link href="/">
        <a href="" className="btn btn-back">
          Go Back
        </a>
      </Link>
      <div className="card card-page">
        <h1 className="post-title">{title}</h1>
        <div className="post-date">Posted on {date}</div>
        <img src={cover_image} alt="" />
        <div className="post-body">
          <div dangerouslySetInnerHTML={{ __html: marked(content) }}></div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps({ params }) {
  const markdownWithMeta = fs.readFileSync(
    path.join("posts", `${params.slug + ".md"}`),
    "utf-8"
  );
  const { data: frontmatter, content } = matter(markdownWithMeta);

  return {
    props: {
      frontmatter,
      content,
    },
  };
}

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join("posts"));
  const paths = files.map((filename) => {
    let slug = filename.replace(".md", "");
    return {
      params: {
        slug,
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
}
