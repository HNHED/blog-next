import { auth, signIn, signOut } from "@/auth";
import Link from "next/link";

export default async function AdminButton() {
  const session = await auth();
  const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isAdmin && (
        <Link 
          href="/admin/new"
          className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:scale-110 transition-all"
        >
          <span className="text-2xl">+</span>
        </Link>
      )}
      {!session ? (
        <form
          action={async () => {
            "use server";
            await signIn("github");
          }}
        >
          <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            管理入口
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-green-600 font-medium">
            管理员已登录: {session.user?.email}
          </span>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button className="text-xs text-red-400 hover:text-red-500 underline">
              退出登录
            </button>
          </form>
        </div>
      )}
    </div>
  );
}