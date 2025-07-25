import React, { useState } from "react";
import BackButton from "../components/Backbutton";
import Spinner from "../components/Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MAX_MESSAGE_LEN = 500;

const CreateFeedback = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!email.trim()) {
      errs.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errs.email = "Enter a valid email";
    }
    if (!message.trim()) errs.message = "Message is required";
    if (message.length > MAX_MESSAGE_LEN)
      errs.message = `Message must be under ${MAX_MESSAGE_LEN} characters`;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const data = { name, email, message };
    try {
      setLoading(true);
      await axios.post("http://localhost:5555/feedback", data);
      // await axios.post("https://jpd8cqjp-5555.inc1.devtunnels.ms/feedback", data);
      navigate("/");
    } catch (error) {
      alert("An error happened. Please check console");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen p-6 flex flex-col items-center justify-start">

   

      <BackButton />


      <h1 className="text-3xl md:text-4xl font-bold mt-6 text-white">
        We value your feedback
      </h1>
      <p className="text-gray-200 mt-2 mb-8">
        Tell us what you think — it helps us improve.
      </p>

      <div className="w-full max-w-xl">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl rounded-2xl p-6 md:p-8">
          {loading && (
            <div className="mb-4">
              <Spinner />
            </div>
          )}

          {/* Name */}
          <div className="mb-5">
          <label htmlFor="name" className="block text-left text-sm font-medium text-gray-200 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full rounded-lg border bg-white/80 focus:bg-white px-4 py-2 outline-none transition ${
                errors.name ? "border-red-500" : "border-gray-300 focus:border-sky-500"
              }`}
              placeholder="Jane Doe"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-5">
            <label htmlFor="email" className="block text-left text-sm font-medium text-gray-200 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-lg border bg-white/80 focus:bg-white px-4 py-2 outline-none transition ${
                errors.email ? "border-red-500" : "border-gray-300 focus:border-sky-500"
              }`}
              placeholder="jane@example.com"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Message */}
          <div className="mb-6">
            <label htmlFor="message" className="block text-left text-sm font-medium text-gray-200 mb-1">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={MAX_MESSAGE_LEN}
              rows={5}
              className={`w-full rounded-lg border bg-white/80 focus:bg-white px-4 py-2 outline-none resize-none transition ${
                errors.message ? "border-red-500" : "border-gray-300 focus:border-sky-500"
              }`}
              placeholder="Write your feedback..."
            />
            <div className="flex items-center justify-between mt-1">
              {errors.message ? (
                <p className="text-red-400 text-sm">{errors.message}</p>
              ) : (
                <span />
              )}
              <p className="text-gray-300 text-sm">
                {message.length}/{MAX_MESSAGE_LEN}
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full rounded-lg bg-sky-500 hover:bg-sky-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 transition"
          >
            {loading ? "Saving..." : "Submit Feedback"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFeedback;
