import Link from 'next/link'
import type { MDXComponents } from 'mdx/types'

/**
 * Article typography. Manrope body at 16–17px/1.75 on carbon, Anton subheads,
 * gold-bordered pull quotes. No shadows, no rounded corners, no icon set.
 */
export const articleComponents: MDXComponents = {
  h2: ({ children, ...props }) => (
    <h2
      {...props}
      className="mt-12 mb-4 font-display text-[26px] leading-[1.15] tracking-[0.02em] text-bone md:mt-14 md:text-[32px]"
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      {...props}
      className="mt-10 mb-3 font-display text-[20px] tracking-[0.02em] text-bone md:text-[24px]"
    >
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p {...props} className="my-5 text-[16px] leading-[1.75] text-steel md:text-[17px]">
      {children}
    </p>
  ),
  strong: ({ children, ...props }) => (
    <strong {...props} className="font-bold text-bone">
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em {...props} className="text-bone not-italic underline decoration-gold underline-offset-4">
      {children}
    </em>
  ),
  ul: ({ children, ...props }) => (
    <ul {...props} className="my-6 flex list-none flex-col gap-3 p-0">
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol {...props} className="my-6 flex list-none flex-col gap-3 p-0">
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li {...props} className="flex gap-4 text-[16px] leading-[1.7] text-steel">
      <span aria-hidden="true" className="mt-[10px] inline-block size-2 shrink-0 rotate-45 bg-gold" />
      <span className="min-w-0 flex-1">{children}</span>
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      {...props}
      className="my-8 border-l-2 border-gold py-2 pl-6 text-[19px] leading-[1.55] font-medium text-bone"
    >
      {children}
    </blockquote>
  ),
  hr: (props) => <hr {...props} className="my-10 border-0 border-t border-hairline" />,
  a: ({ href, children, ...props }) => {
    const target = String(href ?? '')
    const external = target.startsWith('http')
    if (external) {
      return (
        <a
          {...props}
          href={target}
          target="_blank"
          rel="noopener noreferrer"
          className="border-b border-gold text-bone transition-colors hover:text-gold"
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={target} className="border-b border-gold text-bone transition-colors hover:text-gold">
        {children}
      </Link>
    )
  },
}
