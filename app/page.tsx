import EditorialSite from "@/components/EditorialSite";
import { getSessionReader } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function Page() {
  const reader = await getSessionReader();
  return <EditorialSite reader={reader} />;
}
