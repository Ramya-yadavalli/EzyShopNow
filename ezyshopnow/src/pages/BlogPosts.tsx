
import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Image as ImageIcon,
} from "lucide-react";

const API_URL = "https://localhost:7084/api/BlogPost";

interface BlogPost {
  id: number;
  date: string;
  category: string;
  title: string;
  description: string;
  imagePath: string;
  slug: string;
}

type PopupMode = "add" | "edit" | "delete" | null;

// Automatically discover images in src/assets/blogpost.
const blogImages = import.meta.glob<string>(
  "../assets/blogpost/*",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

// Resolve an image filename or path to its imported URL.
function getImageUrl(imagePath: string): string {
  if (!imagePath?.trim()) return "";

  const path = imagePath.trim().replace(/\\/g, "/");

  // Allow external image URLs.
  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) {
    return path;
  }

  const fileName = path.split("/").pop()?.toLowerCase();

  if (!fileName) return "";

  const match = Object.entries(blogImages).find(([filePath]) => {
    return filePath.split("/").pop()?.toLowerCase() === fileName;
  });

  return match?.[1] ?? "";
}

function BlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [popup, setPopup] = useState<PopupMode>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [imagePath, setImagePath] = useState("");

  // GET: Load blog posts.
  async function loadPosts() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(
          `Unable to load blog posts (${response.status}).`
        );
      }

      const result = await response.json();

      const items = Array.isArray(result)
        ? result
        : result.items ?? result.data ?? [];

      const mappedPosts: BlogPost[] = items.map(
        (item: Record<string, unknown>) => ({
          id: Number(item.id ?? item.Id),
          title: String(item.title ?? item.Title ?? ""),
          date: String(item.date ?? item.Date ?? ""),
          category: String(item.category ?? item.Category ?? ""),
          description: String(
            item.description ?? item.Description ?? ""
          ),
          slug: String(item.slug ?? item.Slug ?? "")
            .replace(/^\/blog\//, "")
            .replace(/^\/+/, ""),
          imagePath: String(
            item.imagePath ??
              item.ImagePath ??
              item.imageUrl ??
              item.ImageUrl ??
              ""
          ),
        })
      );

      setPosts(mappedPosts);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load blog posts."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPosts();
  }, []);

  function makeSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function resetForm() {
    setTitle("");
    setDate(new Date().toISOString().slice(0, 10));
    setCategory("");
    setDescription("");
    setSlug("");
    setImagePath("");
    setSelectedPost(null);
    setError("");
  }

  function openAdd() {
    resetForm();
    setPopup("add");
  }

  function openEdit(post: BlogPost) {
    setSelectedPost(post);
    setTitle(post.title);
    setDate(post.date ? post.date.slice(0, 10) : "");
    setCategory(post.category);
    setDescription(post.description);
    setSlug(post.slug);
    setImagePath(post.imagePath);
    setError("");
    setPopup("edit");
  }

  function openDelete(post: BlogPost) {
    setSelectedPost(post);
    setError("");
    setPopup("delete");
  }

  function closePopup() {
    setPopup(null);
    resetForm();
  }

  // POST: Add a blog post.
  // PUT: Update a blog post.
  // The image is a path, not an uploaded file.
  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (popup !== "add" && popup !== "edit") return;

    if (popup === "edit" && !selectedPost) {
      setError("Please select a blog post to update.");
      return;
    }

    if (
      !title.trim() ||
      !date ||
      !category.trim() ||
      !description.trim() ||
      !imagePath.trim()
    ) {
      setError("Please fill in all fields, including the image path.");
      return;
    }

    if (!getImageUrl(imagePath)) {
      setError(
        "Image not found in src/assets/blogpost. Check the filename and extension."
      );
      return;
    }

    const isEdit = popup === "edit";

    const payload = {
      ...(isEdit && selectedPost ? { id: selectedPost.id } : {}),
      title: title.trim(),
      date,
      category: category.trim(),
      description: description.trim(),
      slug: makeSlug(slug || title),
      imagePath: imagePath.trim(),
    };

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        isEdit ? `${API_URL}/${selectedPost!.id}` : API_URL,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message ||
            `Unable to ${isEdit ? "update" : "add"} blog post (${response.status}).`
        );
      }

      closePopup();
      await loadPosts();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save blog post."
      );
    } finally {
      setSaving(false);
    }
  }

  // DELETE: Remove a blog post.
  async function handleDelete() {
    if (!selectedPost) return;

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `${API_URL}/${selectedPost.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message ||
            `Unable to delete blog post (${response.status}).`
        );
      }

      closePopup();
      await loadPosts();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete blog post."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <style>{`
        .blog-posts {
          width: 100%;
          box-sizing: border-box;
          margin: 0;
          padding: 0 clamp(16px, 5vw, 75px) 60px;
          background: #fff;
          color: #293b2d;
          font-family: Arial, sans-serif;
        }

        .blog-posts * {
          box-sizing: border-box;
        }

        .blog-heading {
          width: 100%;
          margin: 0 0 35px;
        }

        .blog-heading-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .blog-heading h2 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(30px, 3.5vw, 42px);
          font-weight: 400;
          line-height: 1.2;
        }

        .blog-add-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          border: none;
          border-radius: 50%;
          background: #344b38;
          color: #fff;
          cursor: pointer;
        }

        .blog-add-button:hover {
          background: #71816c;
        }

        .blog-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 28px;
          width: 100%;
        }

        .blog-card {
          display: flex;
          flex-direction: column;
          min-width: 0;
          background: #fff;
        }

        .blog-image-container {
          position: relative;
          width: 100%;
        }

        .blog-image-link {
          display: block;
          width: 100%;
          overflow: hidden;
          text-decoration: none;
        }

        .blog-image-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          background: #f1f0eb;
        }

        .blog-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform .4s ease;
        }

        .blog-image-link:hover .blog-image {
          transform: scale(1.04);
        }

        .blog-image-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          color: #7b887b;
        }

        .blog-card-actions {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 2;
          display: flex;
          gap: 7px;
        }

        .blog-card-actions button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          padding: 0;
          border: none;
          border-radius: 50%;
          background: #fff;
          color: #344b38;
          cursor: pointer;
        }

        .blog-card-actions button:hover {
          background: #344b38;
          color: #fff;
        }

        .blog-card-actions .delete-action {
          color: #b42318;
        }

        .blog-card-actions .delete-action:hover {
          background: #b42318;
          color: #fff;
        }

        .blog-card-content {
          display: flex;
          flex: 1;
          flex-direction: column;
          align-items: center;
          padding-top: 20px;
          text-align: center;
        }

        .blog-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          margin-bottom: 14px;
          color: #888980;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: .6px;
          line-height: 1.6;
        }

        .blog-category {
          color: #71816c;
          text-transform: uppercase;
        }

        .blog-title {
          width: 100%;
          margin: 0 0 12px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(18px, 1.7vw, 23px);
          font-weight: 400;
          line-height: 1.4;
        }

        .blog-title a {
          color: #293b2d;
          text-decoration: none;
        }

        .blog-title a:hover {
          color: #71816c;
        }

        .blog-description {
          width: 100%;
          margin: 0 0 20px;
          color: #74766f;
          font-size: 13px;
          line-height: 1.8;
          overflow-wrap: anywhere;
        }

        .blog-read-more {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          margin-top: auto;
          padding-bottom: 5px;
          border-bottom: 1px solid #344b38;
          color: #344b38;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          text-decoration: none;
          text-transform: uppercase;
        }

        .blog-read-more:hover {
          color: #71816c;
          border-color: #71816c;
        }

        .blog-message {
          padding: 25px 0;
          color: #667064;
        }

        .blog-error {
          margin: 12px 0;
          padding: 10px;
          border-radius: 4px;
          background: #fff0ef;
          color: #b42318;
          font-size: 13px;
          overflow-wrap: anywhere;
        }

        .blog-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          overflow-y: auto;
          background: #0008;
        }

        .blog-modal {
          width: 100%;
          max-width: 540px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 26px;
          border-radius: 10px;
          background: #fff;
          color: #293b2d;
          box-shadow: 0 15px 50px #0003;
        }

        .blog-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 24px;
        }

        .blog-modal-header h3 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 26px;
          font-weight: 400;
        }

        .blog-modal-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 50%;
          background: #f3f3ef;
          color: #293b2d;
          cursor: pointer;
        }

        .blog-modal-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .blog-modal-form label {
          display: flex;
          flex-direction: column;
          gap: 7px;
          color: #344b38;
          font-size: 13px;
          font-weight: 600;
        }

        .blog-modal-form input,
        .blog-modal-form textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #deded6;
          border-radius: 4px;
          outline: none;
          background: #fff;
          color: #293b2d;
          font: inherit;
          font-weight: 400;
        }

        .blog-modal-form input:focus,
        .blog-modal-form textarea:focus {
          border-color: #71816c;
        }

        .blog-modal-form textarea {
          resize: vertical;
        }

        .blog-image-path-help {
          margin: -8px 0 0;
          color: #74766f;
          font-size: 12px;
          line-height: 1.5;
        }

        .blog-upload-preview {
          display: block;
          width: 100%;
          max-height: 190px;
          margin-top: 4px;
          border-radius: 5px;
          object-fit: contain;
          background: #f4f5f2;
        }

        .blog-modal-buttons {
          display: flex;
          justify-content: flex-end;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 8px;
        }

        .blog-modal-buttons button {
          padding: 11px 18px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
        }

        .blog-save-button {
          border: 1px solid #344b38;
          background: #344b38;
          color: #fff;
        }

        .blog-save-button:hover {
          background: #71816c;
        }

        .blog-cancel-button {
          border: 1px solid #deded6;
          background: #fff;
          color: #344b38;
        }

        .blog-delete-button {
          border: 1px solid #b42318;
          background: #b42318;
          color: #fff;
        }

        .blog-modal-buttons button:disabled {
          cursor: not-allowed;
          opacity: .6;
        }

        .blog-delete-content p {
          line-height: 1.8;
        }

        @media (max-width: 1024px) {
          .blog-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 36px 24px;
          }

          .blog-title {
            font-size: 22px;
          }
        }

        @media (max-width: 600px) {
          .blog-posts {
            padding: 0 16px 40px;
          }

          .blog-heading {
            margin-bottom: 28px;
          }

          .blog-heading h2 {
            font-size: 32px;
          }

          .blog-grid {
            gap: 28px 14px;
          }

          .blog-card-content {
            padding-top: 14px;
          }

          .blog-meta {
            gap: 5px;
            font-size: 8px;
            margin-bottom: 10px;
          }

          .blog-title {
            font-size: 17px;
            margin-bottom: 10px;
          }

          .blog-description {
            font-size: 12px;
            line-height: 1.65;
          }

          .blog-modal {
            padding: 20px;
          }

          .blog-modal-header h3 {
            font-size: 23px;
          }
        }

        @media (max-width: 350px) {
          .blog-grid {
            gap: 24px 10px;
          }

          .blog-title {
            font-size: 15px;
          }

          .blog-description {
            font-size: 11px;
          }
        }
      `}</style>

      <section className="blog-posts">
        <div className="blog-heading blog-heading-row">
          <h2>Blog Posts</h2>

          <button
            type="button"
            className="blog-add-button"
            onClick={openAdd}
            aria-label="Add blog post"
            title="Add blog post"
          >
            <Plus size={22} />
          </button>
        </div>

        {loading && (
          <p className="blog-message">Loading blog posts...</p>
        )}

        {error && !popup && (
          <p className="blog-error" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && posts.length === 0 && (
          <p className="blog-message">No blog posts found.</p>
        )}

        <div className="blog-grid">
          {posts.map((post) => {
            const imageUrl = getImageUrl(post.imagePath);

            return (
              <article className="blog-card" key={post.id}>
                <div className="blog-image-container">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="blog-image-link"
                  >
                    <div className="blog-image-wrap">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={post.title}
                          className="blog-image"
                          loading="lazy"
                        />
                      ) : (
                        <div className="blog-image-placeholder">
                          <ImageIcon size={38} />
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="blog-card-actions">
                    <button
                      type="button"
                      onClick={() => openEdit(post)}
                      title="Edit blog post"
                      aria-label={`Edit ${post.title}`}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      className="delete-action"
                      onClick={() => openDelete(post)}
                      title="Delete blog post"
                      aria-label={`Delete ${post.title}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="blog-card-content">
                  <div className="blog-meta">
                    <span>
                      {post.date
                        ? new Date(
                            `${post.date.slice(0, 10)}T00:00:00`
                          )
                            .toLocaleDateString("en-GB")
                            .replace(/\//g, ".")
                        : ""}
                    </span>

                    <span>/</span>
                    <span className="blog-category">
                      {post.category}
                    </span>
                  </div>

                  <h3 className="blog-title">
                    <Link to={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>

                  <p className="blog-description">
                    {post.description}
                  </p>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="blog-read-more"
                  >
                    Read More <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {popup && (
          <div
            className="blog-modal-overlay"
            onClick={(event) => {
              if (event.target === event.currentTarget && !saving) {
                closePopup();
              }
            }}
          >
            <div
              className="blog-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="blog-modal-title"
            >
              <div className="blog-modal-header">
                <h3 id="blog-modal-title">
                  {popup === "add"
                    ? "Add Blog Post"
                    : popup === "edit"
                      ? "Edit Blog Post"
                      : "Delete Blog Post"}
                </h3>

                <button
                  type="button"
                  onClick={closePopup}
                  aria-label="Close popup"
                  className="blog-modal-close"
                  disabled={saving}
                >
                  <X size={21} />
                </button>
              </div>

              {error && (
                <p className="blog-error" role="alert">
                  {error}
                </p>
              )}

              {popup === "delete" ? (
                <div className="blog-delete-content">
                  <p>
                    Are you sure you want to delete{" "}
                    <strong>{selectedPost?.title}</strong>?
                  </p>

                  <div className="blog-modal-buttons">
                    <button
                      type="button"
                      className="blog-cancel-button"
                      onClick={closePopup}
                      disabled={saving}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="blog-delete-button"
                      onClick={handleDelete}
                      disabled={saving}
                    >
                      {saving ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSave}
                  className="blog-modal-form"
                >
                  <label>
                    Blog Title
                    <input
                      required
                      value={title}
                      onChange={(event) => {
                        const value = event.target.value;
                        setTitle(value);

                        if (!slug) {
                          setSlug(makeSlug(value));
                        }
                      }}
                      placeholder="Enter blog title"
                    />
                  </label>

                  <label>
                    Date
                    <input
                      required
                      type="date"
                      value={date}
                      onChange={(event) =>
                        setDate(event.target.value)
                      }
                    />
                  </label>

                  <label>
                    Category
                    <input
                      required
                      value={category}
                      onChange={(event) =>
                        setCategory(event.target.value)
                      }
                      placeholder="HOME DECOR"
                    />
                  </label>

                  <label>
                    Slug / URL
                    <input
                      required
                      value={slug}
                      onChange={(event) =>
                        setSlug(makeSlug(event.target.value))
                      }
                      placeholder="home-decor-ideas"
                    />
                  </label>

                  <label>
                    Description
                    <textarea
                      required
                      rows={4}
                      value={description}
                      onChange={(event) =>
                        setDescription(event.target.value)
                      }
                      placeholder="Enter blog description"
                    />
                  </label>

                  <label>
                    Image Path / Filename
                    <input
                      required
                      value={imagePath}
                      onChange={(event) =>
                        setImagePath(event.target.value)
                      }
                      placeholder="home-decor.jpg"
                    />
                  </label>

                  <p className="blog-image-path-help">
                    Enter the image filename from your
                    src/assets/blogpost folder. For example:
                    home-decor.jpg
                  </p>

                  {getImageUrl(imagePath) ? (
                    <img
                      src={getImageUrl(imagePath)}
                      alt="Blog preview"
                      className="blog-upload-preview"
                    />
                  ) : imagePath.trim() ? (
                    <p className="blog-image-path-help">
                      Image not found. Check the filename and
                      extension in src/assets/blogpost.
                    </p>
                  ) : null}

                  <div className="blog-modal-buttons">
                    <button
                      type="button"
                      className="blog-cancel-button"
                      onClick={closePopup}
                      disabled={saving}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="blog-save-button"
                      disabled={saving}
                    >
                      {saving
                        ? "Saving..."
                        : popup === "add"
                          ? "Add Blog Post"
                          : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default BlogPosts;
