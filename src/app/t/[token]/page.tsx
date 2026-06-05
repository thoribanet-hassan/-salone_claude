import { notFound } from "next/navigation";
import { getTicketState } from "@/lib/ticketState";
import TicketView from "./TicketView";

export default async function TicketPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const state = await getTicketState(token);
  if (!state) notFound();

  return (
    <main className={`${state.theme} min-h-screen flex flex-col items-center px-5 py-8`}>
      <TicketView token={token} initial={state} />
    </main>
  );
}
