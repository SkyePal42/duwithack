"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SkillsInterestsPage() {
  const router = useRouter();
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [experience, setExperience] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      skills,
      interests,
      experience,
    };

    // Send data to the backend API
    try {
      const response = await fetch("/api/saveUserData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // If saved successfully, log a success message
        console.log("User data saved successfully");
      } else {
        console.error("Failed to save user data");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      // In both success and failure scenarios, navigate to the quiz page
      router.push("/quiz");
    }
  };

  // Go back to the home page
  const handleGoHome = () => {
    router.push("/"); // Navigates to the homepage
  };

  return (
    <div className="hero bg-gradient-to-r from-indigo-600 to-blue-500 min-h-screen flex flex-col">
      <div className="hero-content flex justify-center items-center flex-grow">
                  {/* Back to Home Button */}
                  <button
            onClick={handleGoHome}
            className="absolute top-20 left-4 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700"
          >
            &larr; Home
          </button>

        <div className="max-w-md bg-white p-8 rounded-lg shadow-lg relative">

          <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">Tell Us About Yourself</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Skills Input */}
            <div className="form-control">
              <label className="label text-lg font-medium text-gray-700">Your Skills</label>
              <input
                type="text"
                placeholder="e.g., JavaScript, Python, Design"
                className="input input-bordered w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                required
              />
              <small className="text-gray-500 mt-2 block">Separate skills with commas</small>
            </div>

            {/* Interests Input */}
            <div className="form-control">
              <label className="label text-lg font-medium text-gray-700">Your Interests</label>
              <input
                type="text"
                placeholder="e.g., AI, Web Development, Gaming"
                className="input input-bordered w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                required
              />
              <small className="text-gray-500 mt-2 block">Separate interests with commas</small>
            </div>

            {/* Experience Level Dropdown */}
            <div className="form-control">
              <label className="label text-lg font-medium text-gray-700">Your Experience Level</label>
              <select
                className="select select-bordered w-full py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
              >
                <option value="" disabled>Select your experience</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              </div>

             <div className="divider divider-primary"></div>
              <fieldset className="fieldset">
              <label className="label text-lg font-medium text-gray-700">Your Bio(Optional)</label>
              <textarea className="textarea h-24 w-full " placeholder="Bio"></textarea>
              <div className="fieldset-label">Optional</div>
            </fieldset>

            {/* Submit Button */}
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
