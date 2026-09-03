export default function GalleryControls({
  search, onSearchChange, favoriteOnly, onToggleFavoriteOnly, sort, onSortChange,
}) {
  return (
    <div className="controls-bar">
      <input
        type="text"
        className="text-input search-input"
        placeholder="Search title, description, tags..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search images"
      />
      <button
        className={`favorite-filter-btn ${favoriteOnly ? "active" : ""}`}
        onClick={() => onToggleFavoriteOnly(!favoriteOnly)}
        aria-pressed={favoriteOnly}
      >
        {favoriteOnly ? "\u2605 Favorites" : "\u2606 Favorites"}
      </button>
      <select
        className="sort-select"
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        aria-label="Sort images"
      >
        <option value="recent">Most recent</option>
        <option value="oldest">Oldest first</option>
      </select>
    </div>
  );
}
