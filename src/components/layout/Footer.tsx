export default function Footer() {
  return (
    <footer className="border-t-2 border-dark-border bg-dark-bg mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-card-white/50 font-dunggeunmo">
        <span>&copy; 2026 EXPEDITION HUB</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-accent-mint" />
            SYSTEM ONLINE
          </span>
          <span>BUILD v0.1-pixel</span>
        </div>
      </div>
    </footer>
  );
}
