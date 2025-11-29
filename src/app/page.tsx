import { LogOut } from "lucide-react";
import { logout } from "@/actions/auth";
import Avatar from "@/components/avatar";
import Notifications from "@/components/notifications";
import PostCard from "@/components/post-card";
import { getFeeds, me } from "@/lib/dal";

export default async function Home() {
  const user = await me();
  const feeds = await getFeeds();

  return (
    <section className="min-h-screen grid place-content-center space-y-4 py-4 px-4">
      <div className="flex justify-between">
        <Avatar
          src={user?.avatar || ""}
          alt={user?.username || ""}
          fullName={`${user?.first_name} ${user?.last_name}`}
          username={user?.username || ""}
        />
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="w-12 h-12 flex justify-center items-center rounded-full bg-rose-600"
            onClick={logout}
          >
            <LogOut />
          </button>
          <Notifications />
        </div>
      </div>
      <div className="flex flex-wrap gap-8">
        {feeds?.length ? <PostCard post={feeds[0]} /> : ""}
      </div>
    </section>
  );
}
