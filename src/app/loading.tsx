export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <div className="flex gap-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-4 w-4 rounded-full bg-gradient-to-br from-accent to-accent-purple"
            style={{
              animation: "bounce 1.4s ease-in-out infinite",
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
