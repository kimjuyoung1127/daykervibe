interface WarRoomProps {
  params: Promise<{ teamId: string }>;
}

export default async function WarRoomPage({ params }: WarRoomProps) {
  const { teamId } = await params;

  return (
    <main className="p-8">
      <h1 className="font-pixel text-2xl text-accent-purple">WAR ROOM</h1>
      <p className="mt-4">작전실: {teamId} — Phase 1B에서 구현 예정</p>
    </main>
  );
}
