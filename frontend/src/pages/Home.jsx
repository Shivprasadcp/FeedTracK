import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import Feedbacks from '../components/home/Feedbacks';

const Home = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState('table');
  useEffect(() => {

    setLoading(true);
    axios
      .get('http://localhost:5555/feedback')
      // .get('https://jpd8cqjp-5555.inc1.devtunnels.ms/feedback')
      .then((response) => {
        console.log(response);
        setFeedback(response.data.feedback);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      })
  }, []);
  return (
    <div className='p-4'>
      <div className="flex justify-center items-center gap-x-4">

      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-center sm:text-left my-4 sm:my-8">
          Your Voice Matters – Share Your Feedback with Us
        </h1>
        <Link
          to="/feedback/create"
          className="self-center sm:self-auto"
        >
          <MdOutlineAddBox className="text-sky-800 text-3xl sm:text-4xl hover:text-sky-900 transition-colors" />
        </Link>
      </div>

      {
        loading ? (
          <Spinner />
        
        ) : (<Feedbacks feedback={feedback} />)
      }
    </div>
  );
}

export default Home;
