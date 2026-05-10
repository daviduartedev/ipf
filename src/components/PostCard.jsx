import { formatPostDate } from '../lib/formatPostDate.js';

/**
 * @param {{ post: { slug: string, title: string, excerpt: string, imageUrl: string, publishedAt?: string | null, updatedAt?: string | null, category?: string }, onSelect: (slug: string) => void }} props
 */
export default function PostCard({ post, onSelect }) {
  const raw = post.publishedAt || post.updatedAt;
  const date = raw ? formatPostDate(raw) : '';

  return (
    <div
      className="post-card"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(post.slug)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(post.slug);
        }
      }}
    >
      <img className="post-img" src={post.imageUrl} alt={post.title} />
      <div className="post-content">
        {post.category === 'live' ? (
          <span className="post-live-badge" aria-label="Categoria LIVE">
            LIVE
          </span>
        ) : null}
        <h3 className="post-title">{post.title}</h3>
        {date ? <p className="post-date">{date}</p> : null}
        <p className="post-text">{post.excerpt}</p>
      </div>
    </div>
  );
}
