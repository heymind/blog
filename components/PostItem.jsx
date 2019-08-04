import './PostItem.css'
export const PostItem = ({ icon, title, slug, date,href, tags = [] }) => (
    <div className="PostItem transition">
      <span>{icon || "📄"}</span>
      <a href={href}><h3 className="title">{title}</h3></a>
      <div className="tags">
        {tags.map(tag => (
          <a className="tag" key={tag} href={`/posts?search=%23${tag}`}>#{tag}</a>
        ))}
      </div>
      <span className="hidden sm:block">{new Date(date).toLocaleDateString()}</span>
    </div>
  );