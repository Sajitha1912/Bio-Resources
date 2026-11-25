export function SectionDivider({ tone = "lime" }: { tone?: "lime" | "teal" }) {
  return (
    <div aria-hidden="true" className="relative h-10 overflow-hidden sm:h-14">
      <svg
        viewBox="0 0 1440 56"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-full w-full"
      >
        <path
          d="M0 35C180 4 360 54 540 24s360 30 540-2 270-18 360 2v32H0Z"
          fill={
            tone === "lime" ? "rgba(123,199,77,.055)" : "rgba(27,138,122,.07)"
          }
        />
        <path
          d="M0 38C180 7 360 57 540 27s360 30 540-2 270-18 360 2"
          fill="none"
          stroke={tone === "lime" ? "#7bc74d" : "#1b8a7a"}
          strokeWidth="1.5"
          opacity="0.42"
        />
      </svg>
    </div>
  );
}
