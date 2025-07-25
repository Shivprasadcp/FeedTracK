import { useEffect, useState } from "react";
import axios from "axios";
import { MdOutlineDelete } from "react-icons/md";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { BsEye } from "react-icons/bs";

const FeedbackList = ({ feedback }) => {
  const [items, setItems] = useState(feedback || []);
  const [openItem, setOpenItem] = useState(null);
  const [voting, setVoting] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [deleteEmail, setDeleteEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setItems(feedback || []);
  }, [feedback]);

  const handleVote = async (id, action) => {
    const delta = action === "upvote" ? 1 : -1;
    setVoting((v) => ({ ...v, [id]: true }));

    setItems((prev) =>
      prev.map((fb) =>
        fb.id === id ? { ...fb, votes: (fb.votes ?? 0) + delta } : fb
      )
    );

    try {
      await axios.put(`http://localhost:5555/feedback/${id}/vote`, { action });
      // await axios.put(`https://jpd8cqjp-5555.inc1.devtunnels.ms/feedback/${id}/vote`, { action });
    } catch (err) {
      console.error(err);
      setItems((prev) =>
        prev.map((fb) =>
          fb.id === id ? { ...fb, votes: (fb.votes ?? 0) - delta } : fb
        )
      );
    } finally {
      setVoting((v) => {
        const { [id]: _, ...rest } = v;
        return rest;
      });
    }
  };

  const handleUpvote = (id) => handleVote(id, "upvote");
  const handleDownvote = (id) => handleVote(id, "downvote");

  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteEmail("");
    setErrorMsg("");
  };

  const confirmDelete = async () => {
    const feedback = items.find((f) => f.id === deleteId);
    if (!feedback) return;

    if (deleteEmail !== feedback.email) {
      setErrorMsg("Email does not match!");
      return;
    }

    try {
      await axios.delete(`http://localhost:5555/feedback/${deleteId}`);
      // await axios.delete(`https://jpd8cqjp-5555.inc1.devtunnels.ms/feedback/${deleteId}`);
      setItems((prev) => prev.filter((f) => f.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to delete. Try again.");
    }
  };

  const openModal = (fb) => setOpenItem(fb);
  const closeModal = () => setOpenItem(null);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    if (openItem) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openItem]);

  return (
    <>
      {/* Cards Component */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {items.map((fb) => {
          const isVoting = !!voting[fb.id];

          return (
            <div
              key={fb.id}
              className="
                group relative h-52 flex flex-col justify-between
                rounded-2xl p-5 border border-white/10
                bg-white/10 backdrop-blur-md text-black
                shadow-[0_0_0_1px_rgba(255,255,255,0.04)] 
                hover:shadow-xl hover:-translate-y-1 transition duration-300
                before:absolute before:inset-0 before:-z-10 before:rounded-2xl
                before:bg-gradient-to-br before:from-[#b01419]/20 before:via-[#125a9e]/10 before:to-[#85aacd]/20
                before:opacity-0 group-hover:before:opacity-100 before:transition-opacity
              "
            >
              
              <button
                onClick={() => openModal(fb)}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white shadow"
                title="View full message"
              >
                <BsEye className="text-lg" />
              </button>

        
              <h2 className="text-lg font-semibold truncate pr-8">{fb.name}</h2>

            
              <p className="text-white/80 mt-2 line-clamp-3">{fb.message}</p>

              
              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpvote(fb.id)}
                    disabled={isVoting}
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm 
                      ${isVoting ? "bg-white/5 opacity-50" : "bg-white/10 hover:bg-white/20"}`}
                  >
                    <AiOutlineLike className="text-lg" /> {fb.votes ?? 0}
                  </button>
                  <button
                    onClick={() => handleDownvote(fb.id)}
                    disabled={isVoting}
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm 
                      ${isVoting ? "bg-white/5 opacity-50" : "bg-white/10 hover:bg-white/20"}`}
                  >
                    <AiOutlineDislike className="text-lg" />
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(fb.id)}
                  className="rounded-full bg-white/10 hover:bg-red-500/20 px-3 py-1"
                  title="Delete"
                >
                  <MdOutlineDelete className="text-xl text-red-300" />
                </button>
              </div>
            </div>
          );
        })}
      </div>



      {openItem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn"
          role="dialog"
          onClick={closeModal}
        >
          <div
            className="
        relative w-[90%] sm:w-full max-w-xl 
        bg-white/20 backdrop-blur-xl border border-white/30
        text-gray-900 rounded-2xl shadow-2xl p-6 sm:p-7
        transform transition-all scale-100 sm:scale-105
      "
            onClick={(e) => e.stopPropagation()}
          >
          
            <div className="flex justify-between items-start border-b border-gray-300/30 pb-3">
              <h3 className="text-lg sm:text-2xl font-semibold text-gray-100 pr-10">
                {openItem.name}
              </h3>
              <button
                onClick={closeModal}
                className="ml-2 text-gray-300 hover:text-white text-3xl focus:outline-none transition-transform hover:rotate-90"
              >
                &times;
              </button>
            </div>

            
            <div className="mt-4 max-h-[65vh] overflow-y-auto text-gray-100 leading-relaxed custom-scrollbar">
              {openItem.message}
            </div>
          </div>
        </div>
      )}


      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          role="dialog"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="w-full max-w-md bg-white p-6 rounded-xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-red-600 mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-2">
              Enter the email associated with this feedback to confirm deletion:
            </p>
            <input
              type="email"
              value={deleteEmail}
              onChange={(e) => setDeleteEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full border px-3 py-2 rounded-md mb-2"
            />
            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackList;
