"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SkillsInterestsPage() {
  const router = useRouter();
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState(""); // 新增 bio 状态

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 构造用户数据对象
    const userData = {
      skills: skills.split(",").map((skill) => skill.trim()), // 将技能字符串转换为数组
      interests: interests.split(",").map((interest) => interest.trim()), // 将兴趣字符串转换为数组
      experience,
      bio, // 添加 bio 字段
    };

    // 发送数据到后端 API
    try {
      const response = await fetch("/api/saveUserData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log("User data saved successfully");
      } else {
        console.error("Failed to save user data");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      // 无论成功或失败，都跳转到测验页面
      router.push("/quiz");
    }
  };

  // 返回首页
  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="hero bg-gradient-to-r from-indigo-600 to-blue-500 min-h-screen flex flex-col">
      <div className="hero-content flex justify-center items-center flex-grow">
        {/* 返回首页按钮 */}
        <button
          onClick={handleGoHome}
          className="absolute top-20 left-4 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700"
        >
          &larr; Home
        </button>

        <div className="max-w-md bg-white p-8 rounded-lg shadow-lg relative">
          <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">
            Tell Us About Yourself
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 技能输入 */}
            <div className="form-control">
              <label className="label text-lg font-medium text-gray-700">
                Your Skills
              </label>
              <input
                type="text"
                placeholder="e.g., JavaScript, Python, Design"
                className="input input-bordered w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                required
              />
              <small className="text-gray-500 mt-2 block">
                Separate skills with commas
              </small>
            </div>

            {/* 兴趣输入 */}
            <div className="form-control">
              <label className="label text-lg font-medium text-gray-700">
                Your Interests
              </label>
              <input
                type="text"
                placeholder="e.g., AI, Web Development, Gaming"
                className="input input-bordered w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                required
              />
              <small className="text-gray-500 mt-2 block">
                Separate interests with commas
              </small>
            </div>

            {/* 经验水平下拉菜单 */}
            <div className="form-control">
              <label className="label text-lg font-medium text-gray-700">
                Your Experience Level
              </label>
              <select
                className="select select-bordered w-full py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select your experience
                </option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="divider divider-primary"></div>

            {/* 个人简介输入 */}
            <fieldset className="fieldset">
              <label className="label text-lg font-medium text-gray-700">
                Your Bio (Optional)
              </label>
              <textarea
                className="textarea h-24 w-full"
                placeholder="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              ></textarea>
              <div className="fieldset-label">Optional</div>
            </fieldset>

            {/* 提交按钮 */}
            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary w-full py-3 rounded-lg text-white font-semibold text-lg bg-indigo-600 hover:bg-indigo-700 transition duration-300"
              >
                Start Quiz
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="footer sm:footer-horizontal bg-neutral text-neutral-content p-10">
        <nav>
          <h6 className="footer-title">Services</h6>
          <a className="link link-hover">Branding</a>
          <a className="link link-hover">Design</a>
          <a className="link link-hover">Marketing</a>
          <a className="link link-hover">Advertisement</a>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Press kit</a>
        </nav>
        <nav>
          <h6 className="footer-title">Legal</h6>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </nav>
      </footer>
    </div>
  );
}