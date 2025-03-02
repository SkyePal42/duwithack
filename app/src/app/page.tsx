"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useUser();
  const router = useRouter();

  const handleFindTeamClick = () => {
    router.push("/skills"); // 跳转到 Skills 和 Interests 页面
  };

  return (
    <div className="hero bg-base-200 h-full">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold my-10">
            DUWIT TOGETHER{user && <> with {user.name}!</>}
          </h1>
          <p className="py-6">
            Don&pos;t space out on team formation! Launch at full speed with
            DUWIT Together. We help assemble your crew with stellar precision;
            dodging the fiasco of on the day, in person networking.
          </p>
          <button
            className="btn btn-xl btn-primary flex mx-auto my-5"
            onClick={handleFindTeamClick} // 绑定点击事件
          >
            Find a Team
          </button>
          <button className="btn btn-md btn-neutral flex mx-auto my-5">
            Request a Member
          </button>
          <p className="mt-10 mb-5 font-bold underline text-lg">
            Lost? Check out:
          </p>
          <a href="/new-pages" className="btn btn-info">
            Go to AI prototype{/*Getting Started Guides*/}
          </a>
        </div>
      </div>
    </div>
  );
}