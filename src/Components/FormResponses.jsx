import React from 'react';
import { useGetFormsQuery, useGetResponsesQuery } from '../Redux/ApiSlice';
import { useNavigate } from 'react-router-dom';
import { clearLoginData } from '../Redux/FormSlice';
import { useDispatch } from 'react-redux';

const FormResponses = () => {
  const { data: forms } = useGetFormsQuery();
  const { data: responses } = useGetResponsesQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getResponseCount = (formId) =>
    responses?.filter((response) => response.formId === formId).length || 0;

  const handleRowClick = (formId) => {
    navigate(`/builder/${formId}`);
  };

  const handleLogOut = () => {
    dispatch(clearLoginData())
    navigate('/')
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Form List</h1>
      <table className="min-w-full border-collapse text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">Id</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Responses</th>
          </tr>
        </thead>
        <tbody>
          {forms?.map((form) => (
            <tr
              key={form.id}
              className="cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => handleRowClick(form.id)}
            >
              <td className="px-4 py-2">{form.id}</td>
              <td className="px-4 py-2">{form.name}</td>
              <td className="px-4 py-2">{getResponseCount(form.id)} responses</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleLogOut}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-auto"
      >
        Logout
      </button>
    </div>
  );
};

export default FormResponses;