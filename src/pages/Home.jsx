import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BannerCarousel from '../components/BannerCarousel';
import PostCard from '../components/PostCard.jsx';
import { loadFeaturedPostsFromJson } from '../lib/legacyPosts.js';
import { fetchPublishedPostsPage } from '../services/postsApi.js';
import './Home.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [featuredError, setFeaturedError] = useState('');
  const [featuredLoaded, setFeaturedLoaded] = useState(false);
  const [feedPosts, setFeedPosts] = useState([]);
  const [feedNotice, setFeedNotice] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [feedLoading, setFeedLoading] = useState(true);
  const feedSectionRef = useRef(null);
  const skipScrollRef = useRef(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await loadFeaturedPostsFromJson(3);
        if (!cancelled) setFeatured(rows);
      } catch (e) {
        if (!cancelled) setFeaturedError(String(e?.message ?? e));
      } finally {
        if (!cancelled) setFeaturedLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!featuredLoaded) return;
    let cancelled = false;
    const excludeSlugs = featured.map((f) => f.slug);

    (async () => {
      setFeedLoading(true);
      setFeedNotice('');
      const result = await fetchPublishedPostsPage(page, undefined, excludeSlugs);
      if (cancelled) return;
      if (!result.ok) {
        setFeedNotice(result.error || 'Não foi possível carregar as postagens.');
        setFeedPosts([]);
        setTotalPages(1);
        setFeedLoading(false);
        return;
      }
      setFeedPosts(result.posts);
      setTotalPages(result.totalPages);
      setFeedLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [page, featuredLoaded, featured]);

  useEffect(() => {
    if (skipScrollRef.current) {
      skipScrollRef.current = false;
      return;
    }
    feedSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [page]);

  const showPagination = totalPages > 1 && !feedLoading;

  return (
    <>
      <BannerCarousel />

      <section className="posts posts--featured" aria-label="Destaques">
        {featuredError ? <p className="home-notice">{featuredError}</p> : null}
        {featured.map((post) => (
          <PostCard key={post.slug} post={post} onSelect={(slug) => navigate(`/post/${slug}`)} />
        ))}
      </section>

      <section
        ref={feedSectionRef}
        className="posts-feed"
        id="posts-feed"
        aria-label="Postagens"
      >
        <div className="posts-feed-divider" aria-hidden="true" />
        <h2 className="posts-feed-title cinzel">Postagens</h2>
        {!featuredLoaded ? (
          <p className="home-feed-loading">A carregar…</p>
        ) : feedLoading ? (
          <p className="home-feed-loading">A carregar…</p>
        ) : (
          <>
            {feedNotice ? <p className="home-notice">{feedNotice}</p> : null}
            {!feedNotice && feedPosts.length === 0 ? (
              <p className="home-feed-empty">Nenhuma postagem adicional nesta secção.</p>
            ) : (
              <div className="posts posts--feed">
                {feedPosts.map((post) => (
                  <PostCard
                    key={post.slug}
                    post={post}
                    onSelect={(slug) => navigate(`/post/${slug}`)}
                  />
                ))}
              </div>
            )}
            {showPagination ? (
              <div className="home-pagination" role="navigation" aria-label="Paginação">
                <button
                  type="button"
                  className="home-pagination-btn"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Anterior
                </button>
                <span className="home-pagination-info">
                  Página {page} de {totalPages}
                </span>
                <button
                  type="button"
                  className="home-pagination-btn"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Seguinte
                </button>
              </div>
            ) : null}
          </>
        )}
      </section>
    </>
  );
}
