"use client";
import { useState, useEffect } from "react";
import { Suspense } from "react";

export default function QuizPage() {
  const [entry, setEntry] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkEntry = async () => {
      const response = await fetch("/api/checkEntry");
      if (response.ok) {
        const existingEntry = await response.json();
        setEntry(existingEntry);
      }
      setLoading(false);
    };
    checkEntry();
  }, []);

  const checkEntry = async () => {
    const response = await fetch("/api/checkEntry");
    if (response.ok) {
      const existingEntry = await response.json();
      setEntry(existingEntry);
    }
  };
  const handleCreate = async () => {
    const response = await fetch("/api/createEntry", {
      method: "POST",
    });
    const newEntry = await response.json();
    setEntry(newEntry);
  };

  const handleUpdate = async () => {
    const response = await fetch("/api/updateEntry", {
      method: "POST",
    });
    const updatedEntry = await response.json();
    checkEntry();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quiz Page</h1>
      {loading ? (
        <div>Checking database...</div>
      ) : entry ? (
        <>
          <button className="btn btn-primary" onClick={handleUpdate}>
            Update Entry
          </button>
          <div className="mt-4">
            <p>Entry Value: {entry.value}</p>
          </div>
        </>
      ) : (
        <button className="btn btn-primary" onClick={handleCreate}>
          Create Entry
        </button>
      )}
    </div>
  );
}
