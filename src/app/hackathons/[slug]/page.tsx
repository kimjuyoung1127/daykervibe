interface HackathonDetailProps {
  params: Promise<{ slug: string }>;
}

export default async function HackathonDetailPage({ params }: HackathonDetailProps) {
  const { slug } = await params;

  return (
    <main className="p-8">
      <h1 className="font-pixel text-2xl text-accent-yellow">HACKATHON DETAIL</h1>
      <p className="mt-4">해커톤 상세: {slug} — Phase 1A에서 구현 예정</p>
    </main>
  );
}
