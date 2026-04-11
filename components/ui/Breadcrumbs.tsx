import Link from "next/link"

interface Crumb {
  label: string
  href?: string
}

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-neutral-500">
      <Link href="/" className="hover:text-gold-500 transition-colors">
        Home
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-2">
          <span>/</span>
          {crumb.href && i < crumbs.length - 1 ? (
            <Link href={crumb.href} className="hover:text-gold-500 transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-navy-900 font-500" style={{ fontWeight: 500 }}>
              {crumb.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
