export enum AnalysisMode {
  INFRASTRUCTURE = 1,
  FORENSICS = 2,
  TRUTHGUARD = 3,
  ECO_SENTINEL = 4,
}

export interface AnalysisResult {
  rawText: string;
  mode: AnalysisMode;
  isDemo: boolean;
  timestamp: string;
}

export interface MediaFile {
  file: File;
  previewUrl: string;
  type: 'image' | 'video';
}

export const MODE_CONFIG = {
  [AnalysisMode.INFRASTRUCTURE]: {
    id: AnalysisMode.INFRASTRUCTURE,
    title: "INFRASTRUCTURE DEFENSE",
    icon: "Building",
    description: "Analyze structures for defects, rust, and instability.",
    color: "text-neon-cyan",
    borderColor: "border-neon-cyan",
    bgColor: "bg-neon-cyan/10"
  },
  [AnalysisMode.FORENSICS]: {
    id: AnalysisMode.FORENSICS,
    title: "FORENSIC ANALYSIS",
    icon: "Search",
    description: "Analyze accident liability, trajectories, and causality.",
    color: "text-neon-amber",
    borderColor: "border-neon-amber",
    bgColor: "bg-neon-amber/10"
  },
  [AnalysisMode.TRUTHGUARD]: {
    id: AnalysisMode.TRUTHGUARD,
    title: "TRUTHGUARD (DEEPFAKE)",
    icon: "ShieldAlert",
    description: "Detect GAN artifacts, lip-sync mismatch, and interpolation.",
    color: "text-neon-red",
    borderColor: "border-neon-red",
    bgColor: "bg-neon-red/10"
  },
  [AnalysisMode.ECO_SENTINEL]: {
    id: AnalysisMode.ECO_SENTINEL,
    title: "ECO-SENTINEL",
    icon: "Leaf",
    description: "Monitor environmental threats, pollution, and thermal blooms.",
    color: "text-neon-green",
    borderColor: "border-neon-green",
    bgColor: "bg-neon-green/10"
  }
};