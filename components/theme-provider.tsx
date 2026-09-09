"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import type { Dispatch, PropsWithChildren, SetStateAction } from "react"

type ThemeName = "light" | "dark" | "system"
type ResolvedTheme = "light" | "dark"

type ThemeContextValue = {
  resolvedTheme: ResolvedTheme
  setTheme: Dispatch<SetStateAction<ThemeName>>
  theme: ThemeName
}

const STORAGE_KEY = "theme"
const ThemeContext = createContext<ThemeContextValue | null>(null)

function isThemeName(value: string | null): value is ThemeName {
  return value === "light" || value === "dark" || value === "system"
}

function getStoredTheme(): ThemeName {
  const storedTheme = window.localStorage.getItem(STORAGE_KEY)
  return isThemeName(storedTheme) ? storedTheme : "system"
}

function resolveTheme(theme: ThemeName): ResolvedTheme {
  if (theme !== "system") return theme

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function applyTheme(theme: ThemeName) {
  const resolvedTheme = resolveTheme(theme)
  const root = document.documentElement

  root.classList.remove("light", "dark")
  root.classList.add(resolvedTheme)
  root.style.colorScheme = resolvedTheme

  return resolvedTheme
}

export function ThemeProvider({ children }: PropsWithChildren) {
  // Keep the first server and client render identical; browser preferences are
  // applied after hydration in the effects below.
  const [theme, setThemeState] = useState<ThemeName>("system")
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light")

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setThemeState(getStoredTheme())
    })

    return () => cancelAnimationFrame(animationFrame)
  }, [])

  useEffect(() => {
    const syncTheme = () => {
      const nextResolvedTheme = applyTheme(theme)
      setResolvedTheme(nextResolvedTheme)
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleSystemThemeChange = () => {
      if (theme === "system") syncTheme()
    }

    syncTheme()
    mediaQuery.addEventListener("change", handleSystemThemeChange)

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange)
    }
  }, [theme])

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return

      setThemeState(
        isThemeName(event.newValue) ? event.newValue : "system"
      )
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const setTheme = useCallback<Dispatch<SetStateAction<ThemeName>>>((value) => {
    setThemeState((currentTheme) => {
      const nextTheme =
        typeof value === "function" ? value(currentTheme) : value
      window.localStorage.setItem(STORAGE_KEY, nextTheme)
      return nextTheme
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ resolvedTheme, setTheme, theme }}>
      <ThemeHotkey />
      {children}
    </ThemeContext.Provider>
  )
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key.toLowerCase() !== "d") return
      if (isTypingTarget(event.target)) return

      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [resolvedTheme, setTheme])

  return null
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
