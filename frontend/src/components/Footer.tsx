import { GithubIcon } from './Icons'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:px-6 dark:text-slate-400">
        <p>
          © {new Date().getFullYear()} DevSpaceHub. Собрано на React, TypeScript и FastAPI.
        </p>
        <a
          href="https://github.com/"
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1.5 transition hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          <GithubIcon className="size-4" />
          GitHub
        </a>
      </div>
    </footer>
  )
}
