import React from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useGetFormByIdQuery, useSubmitResponseMutation } from '../Redux/ApiSlice';

const Forms = () => {
  const { id } = useParams();
  const { data: form, isLoading, isError } = useGetFormByIdQuery(id);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [submitResponse] = useSubmitResponseMutation();

  const onSubmit = async (data) => {
    // console.log("submit form", data)
    await submitResponse({ formId: id, response: data });
    alert('Form submitted successfully!');
    reset();
  };

  if (isLoading) return <div>Loading form...</div>;
  if (isError || !form) return <div>Form not found!</div>;

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Please fill the {form.name}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {form.fields.map((field, index) => (
          <div key={index} className="mb-6">
            {field.type === 'text' && (
              <>
                <label htmlFor={`field-${index}`} className="block text-gray-700 font-medium mb-2">
                  {field.label || 'Text Field'}
                </label>
                <input
                  id={`field-${index}`}
                  {...register(field.label || field.placeholder, {
                    required: 'This field is required',
                    ...(field.charLimit && {
                      maxLength: {
                        value: field.charLimit,
                        message: `Maximum ${field.charLimit} characters allowed`,
                      },
                    }),
                    ...(field.regex && {
                      pattern: {
                        value: new RegExp(field.regex),
                        message: `Invalid format. Must match: ${field.regex}`,
                      },
                    }),
                  })}
                  placeholder={field.placeholder || 'Enter text'}
                  className="border rounded w-full p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <small className="text-red-500">
                  {errors[field.label || field.placeholder]?.message}
                </small>
              </>
            )}


            {field.type === 'date' && (
              <>
                <label htmlFor={`date-${index}`} className="block text-gray-700 font-medium mb-2">
                  {field.label || 'Select Date'}
                </label>
                <input
                  id={`date-${index}`}
                  type="date"
                  {...register(field.label || 'Date', {
                    required: 'This field is required',
                  })}
                  className="border rounded w-full p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <small className="text-red-500">
                  {errors[field.label || 'Date']?.message}
                </small>
              </>
            )}

            {field.type === 'radio' && (
              <>
                <label className="block text-gray-700 font-medium mb-2">
                  {field.label || 'Select an Option'}
                </label>
                <div className="flex flex-wrap gap-4">
                  {field.options.map((option, idx) => (
                    <label key={idx} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value={option}
                        {...register(field.label || `radio-${index}`, {
                          required: 'Please select an option',
                        })}
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
                <small className="text-red-500">
                  {errors[field.label || `radio-${index}`]?.message}
                </small>
              </>
            )}
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-500 text-white px-5 py-2 rounded shadow hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Forms;