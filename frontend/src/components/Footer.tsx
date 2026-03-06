export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-synthwave-bg2 border-t border-synthwave-text-secondary border-opacity-20 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-synthwave-neon-pink mb-4">Bradley Savoy</h3>
            <p className="text-synthwave-text-secondary">DevOps & SRE Engineer</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-synthwave-neon-cyan mb-4">Quick Links</h4>
            <ul className="space-y-2 text-synthwave-text-secondary text-sm">
              <li><a href="/">Home</a></li>
              <li><a href="/posts">Articles</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-synthwave-neon-purple mb-4">Connect</h4>
            <ul className="space-y-2 text-synthwave-text-secondary text-sm">
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-synthwave-text-secondary border-opacity-20 pt-8 text-center text-synthwave-text-secondary text-sm">
          <p>&copy; {currentYear} Bradley Savoy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
