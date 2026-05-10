import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BannerCarousel from '../components/BannerCarousel';
import PostCard from '../components/PostCard.jsx';
import { loadFeaturedPostsFromJson } from '../lib/legacyPosts.js';
import { POSTS_PAGE_SIZE, fetchPublishedPostsFeed } from '../services/postsApi.js';
import './Home.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [featuredError, setFeaturedError] = useState('');
  const [featuredLoaded, setFeaturedLoaded] = useState(false);
  const [feedPosts, setFeedPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [period, setPeriod] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [filtersOpen, setFiltersOpen] = useState(false);
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
      const result = await fetchPublishedPostsFeed(excludeSlugs);
      if (cancelled) return;
      if (!result.ok) {
        setFeedNotice(result.error || 'Não foi possível carregar as postagens.');
        setFeedPosts([]);
        setTotalPages(1);
        setFeedLoading(false);
        return;
      }
      setFeedPosts(result.posts);
      setFeedLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [featuredLoaded, featured]);

  const filteredPosts = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    const now = Date.now();
    const minTs =
      period === 'last30'
        ? now - 30 * 24 * 60 * 60 * 1000
        : period === 'currentYear'
          ? new Date(new Date().getFullYear(), 0, 1).getTime()
          : 0;

    const filtered = feedPosts.filter((post) => {
      const matchesText =
        !normalized ||
        post.title.toLowerCase().includes(normalized) ||
        post.excerpt.toLowerCase().includes(normalized);
      if (!matchesText) return false;
      if (categoryFilter === 'live' && post.category !== 'live') return false;
      if (period === 'all') return true;
      const candidate = post.publishedAt || post.updatedAt;
      if (!candidate) return false;
      const ts = Date.parse(candidate);
      if (Number.isNaN(ts)) return false;
      return ts >= minTs;
    });

    const direction = sortBy === 'oldest' ? 1 : -1;
    return filtered.sort((a, b) => {
      const aTs = Date.parse(a.publishedAt || a.updatedAt || '');
      const bTs = Date.parse(b.publishedAt || b.updatedAt || '');
      const safeA = Number.isNaN(aTs) ? 0 : aTs;
      const safeB = Number.isNaN(bTs) ? 0 : bTs;
      return (safeA - safeB) * direction;
    });
  }, [feedPosts, searchTerm, period, sortBy, categoryFilter]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, period, categoryFilter]);

  useEffect(() => {
    const nextTotalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PAGE_SIZE));
    setTotalPages(nextTotalPages);
    setPage((current) => Math.min(current, nextTotalPages));
  }, [filteredPosts]);

  const pagedPosts = useMemo(() => {
    const start = (page - 1) * POSTS_PAGE_SIZE;
    return filteredPosts.slice(start, start + POSTS_PAGE_SIZE);
  }, [filteredPosts, page]);

  function clearFilters() {
    setSearchTerm('');
    setPeriod('all');
    setSortBy('recent');
    setCategoryFilter('all');
  }

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
            {!feedNotice ? (
              <>
                <div className="home-filters-toggle-wrap">
                  <button
                    type="button"
                    className="home-filters-toggle"
                    aria-expanded={filtersOpen}
                    aria-controls="home-post-filters"
                    onClick={() => setFiltersOpen((open) => !open)}
                  >
                    Filtrar postagens
                  </button>
                </div>
                <div
                  id="home-post-filters"
                  className={`home-filters ${filtersOpen ? 'is-open' : ''}`}
                >
                  <label className="home-filter-field">
                    <span className="home-filter-label">Buscar</span>
                    <input
                      type="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Digite título ou resumo..."
                    />
                  </label>
                  <label className="home-filter-field">
                    <span className="home-filter-label">Ordenação</span>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      <option value="recent">Mais recentes</option>
                      <option value="oldest">Mais antigos</option>
                    </select>
                  </label>
                  <label className="home-filter-field">
                    <span className="home-filter-label">Período</span>
                    <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                      <option value="all">Todos</option>
                      <option value="last30">Últimos 30 dias</option>
                      <option value="currentYear">Ano atual</option>
                    </select>
                  </label>
                  <label className="home-filter-field">
                    <span className="home-filter-label">Categoria</span>
                    <select
                      value={categoryFilter}
                      onChange={(e) => {
                        setCategoryFilter(e.target.value);
                        setPage(1);
                      }}
                    >
                      <option value="all">Todas as categorias</option>
                      <option value="live">LIVE</option>
                    </select>
                  </label>
                  <button type="button" className="home-filter-clear" onClick={clearFilters}>
                    Limpar filtros
                  </button>
                </div>
              </>
            ) : null}
            {!feedNotice && pagedPosts.length === 0 ? (
              <p className="home-feed-empty">Nenhuma postagem encontrada para os filtros selecionados.</p>
            ) : (
              <div className="posts posts--feed">
                {pagedPosts.map((post) => (
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
