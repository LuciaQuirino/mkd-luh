export default function EasterEggHippo({ show }) {
  if (!show) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 30,
        right: 30,
        zIndex: 2000,
        background: "rgba(255,255,255,0.92)",
        borderRadius: "1rem",
        boxShadow: "0 4px 16px #0002",
        padding: 20,
        display: "flex",
        alignItems: "center",
        animation: "hippo-bounce 1.5s infinite alternate",
      }}
    >
      <img
        src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWwxYjF2b2J1a3NxNmxoeDBjcGRoY2U4cTl0dm1pYzlzNmRrNGV4ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TgDe2sUsoEcmgLFAIY/giphy.gif"
        alt="Hipopótamo dançando"
        style={{ width: 90, height: 90 }}
      />
      <span
        style={{
          marginLeft: 16,
          fontSize: 18,
          fontWeight: 600,
          color: "#7c5f3d",
          textShadow: "0 2px 6px #fff9",
        }}
      >
        Domar? Só se for com gingado! 🦛💃
      </span>
    </div>
  );
}
