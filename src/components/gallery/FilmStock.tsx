/** Shared perforated film base, used by both the leader and the open roll. */
export default function FilmStock() {
  return (
    <div className="film-stock" aria-hidden="true">
      <div className="film-perforations" />
      <div className="film-stock-core" />
      <div className="film-perforations" />
    </div>
  );
}
