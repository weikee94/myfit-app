interface Props {
  demoUrl:  string;
  demoType: "youtube" | "gif" | "image" | null;
  title:    string;
}

function toYouTubeEmbed(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

export default function ExerciseDemo({ demoUrl, demoType, title }: Props) {
  if (demoType === "youtube") {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
        <iframe
          src={toYouTubeEmbed(demoUrl)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-muted">
      <img
        src={demoUrl}
        alt={title}
        className="h-full w-full object-contain"
        loading="lazy"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    </div>
  );
}
