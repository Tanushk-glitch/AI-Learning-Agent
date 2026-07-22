import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white shadow-[0_12px_30px_rgba(37,99,235,0.28)] hover:-translate-y-0.5 hover:bg-blue-500",
        secondary:
          "border border-white/15 bg-white/10 text-white backdrop-blur-xl hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/15",
        outline:
          "border border-slate-300 bg-white text-slate-800 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50",
      },
      size: {
        default: "h-11",
        large: "h-12 px-6 text-base",
        icon: "h-11 w-11 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
