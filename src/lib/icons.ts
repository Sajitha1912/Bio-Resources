import {
  Atom,
  BookOpen,
  Brain,
  Building2,
  Cpu,
  Dna,
  Eye,
  Factory,
  FlaskConical,
  GraduationCap,
  Handshake,
  Hexagon,
  Leaf,
  Microscope,
  Network,
  Orbit,
  Pill,
  Puzzle,
  ShieldCheck,
  ShieldPlus,
  Sprout,
  Syringe,
  TestTube,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'

/**
 * Maps the icon keys used in src/data/site.ts to lucide-react components.
 * Keeping the mapping here means the data stays free of JSX/imports.
 */
export const icons: Record<string, LucideIcon> = {
  atom: Atom,
  brain: Brain,
  'book-open': BookOpen,
  'building-2': Building2,
  cpu: Cpu,
  dna: Dna,
  eye: Eye,
  factory: Factory,
  'flask-conical': FlaskConical,
  'graduation-cap': GraduationCap,
  handshake: Handshake,
  hexagon: Hexagon,
  leaf: Leaf,
  microscope: Microscope,
  network: Network,
  orbit: Orbit,
  pill: Pill,
  puzzle: Puzzle,
  'shield-check': ShieldCheck,
  'shield-plus': ShieldPlus,
  sprout: Sprout,
  syringe: Syringe,
  'test-tube': TestTube,
  'trending-up': TrendingUp,
}

export function getIcon(name: string): LucideIcon {
  return icons[name] ?? Leaf
}
