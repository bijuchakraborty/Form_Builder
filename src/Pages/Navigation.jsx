import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetFormsQuery } from '../Redux/ApiSlice';
import { useSelector } from 'react-redux';

const Navigation = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.form);
  const { data: forms, isLoading } = useGetFormsQuery();
  const [lastFormId, setLastFormId] = useState(null);

  useEffect(() => {
    if (!isLoading && forms?.length > 0) {
      const lastForm = forms[forms.length - 1];
      setLastFormId(lastForm.id);
    }
  }, [forms, isLoading]);

  return (
    <div className="flex justify-center gap-4 bg-gray-200 p-4 shadow">
      <button
        onClick={() => {
          if (lastFormId) {
            navigate(`/form/${lastFormId}`);
          } else {
            alert("No forms available! Create a new one.");
          }
        }}
        className="bg-purple-500 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-600 transition-all"
      >
        Form
      </button>

      {
        isLoggedIn ? (
          <>
            <Link
              to="/builder"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition-all"
            >
              Form Builder
            </Link>
            <Link
              to="/responses"
              className="bg-purple-500 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-600 transition-all"
            >
              View Responses
            </Link>
          </>
        ) : (
          <>
            <Link
              to='/'
              className="bg-purple-500 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-600 transition-all"
            >
              Login
            </Link>
          </>
        )
      }
    </div>
  );
};

export default Navigation;