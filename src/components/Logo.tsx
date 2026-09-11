import { cn } from "@/lib/utils";
      <defs>
        <linearGradient id="rc-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.55 0.2 293)" />
          <stop offset="100%" stopColor="oklch(0.68 0.18 330)" />
        </linearGradient>

        <linearGradient id="rc-b" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.85 0.13 75)" />
          <stop offset="100%" stopColor="oklch(0.93 0.07 90)" />
        </linearGradient>
      </defs>

      <path
        d="M24 13c-4-3.2-9-4.6-14-4.4A2.6 2.6 0 0 0 7.5 11v23a2.6 2.6 0 0 0 2.7 2.6c5-.2 9.9 1.1 13.8 4.2V13Z"
        fill="url(#rc-a)"
      />

      <path
        d="M24 13c4-3.2 9-4.6 14-4.4A2.6 2.6 0 0 1 40.5 11v23a2.6 2.6 0 0 1-2.7 2.6c-5-.2-9.9 1.1-13.8 4.2V13Z"
        fill="url(#rc-b)"
      />

      <path
        d="M24 13v27.8"
        stroke="oklch(0.35 0.12 293)"
        strokeWidth="1.6"
        opacity="0.5"
      />
    </svg>
  );
}

    
