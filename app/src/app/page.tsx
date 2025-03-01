export default function Home() {
  return (
    <div className="hero bg-base-200 h-full">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold my-10">DUWIT TOGETHER</h1>
          <p className="py-6">
            Don't space out on team formation! Launch at full speed with DUWIT
            Together. We help assemble your crew with stellar precision; dodging
            the fiasco of on the day, in person networking.
          </p>
          <button className="btn btn-xl btn-primary flex mx-auto my-5">
            Find a Team
          </button>
          <button className="btn btn-md btn-neutral flex mx-auto my-5">
            Request a Member
          </button>
          <p className="mt-10 mb-5 font-bold underline text-lg">
            Lost? Check out:
          </p>
          <button className="btn btn-info">Getting Started Guides</button>
        </div>
      </div>
    </div>
  );
}
