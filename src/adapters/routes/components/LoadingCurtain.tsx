export interface LoadingCurtainProps {
  className?: string;
  label?: string;
  text?: string;
}

export const LoadingCurtain: React.FC<LoadingCurtainProps> = ({
  className,
  label = "Loading",
  text = "Loading • Loading • Loading • Loading • ",
}) => (
  <div
    className={`fixed inset-0 z-[60] flex items-center justify-center animate-fade-in${className ? ` ${className}` : ""}`}
    style={{ backgroundColor: "#f09cd0" }}
    role="status"
    aria-label={label}
  >
    <div className="relative w-[220px] h-[220px]">
      <svg
        width="220"
        height="220"
        viewBox="0 0 220 220"
        className="animate-spin-slow"
        aria-hidden="true"
      >
        <defs>
          <path
            id="circle-path"
            d="M 110,110 m -90,0 a 90,90 0 1,1 180,0 a 90,90 0 1,1 -180,0"
          />
        </defs>
        <text
          fill="#f6339a"
          fontSize="14"
          fontWeight="600"
          letterSpacing="2"
          fontFamily="Inter, sans-serif"
        >
          <textPath href="#circle-path">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold" style={{ color: "#3d0038" }}>
        Gabinajm
      </span>
    </div>
  </div>
);

LoadingCurtain.displayName = "LoadingCurtain";
