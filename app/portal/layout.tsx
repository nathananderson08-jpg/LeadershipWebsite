import './portal.css';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="portal-root"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        overflow: 'auto',
        background: 'var(--portal-bg-primary)',
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Serif+Display&display=swap"
      />
      {children}
    </div>
  );
}
