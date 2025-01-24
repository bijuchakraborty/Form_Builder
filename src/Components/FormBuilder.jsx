import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useGetFormByIdQuery,
  useUpdateFormMutation,
  useCreateFormMutation,
  useGetResponsesQuery,
} from "../Redux/ApiSlice";
import InputModal from "./InputModal";
import { useDispatch } from "react-redux";
import { clearLoginData } from "../Redux/FormSlice";


const FormBuilder = () => {

  const dispatch = useDispatch();
  const { formId } = useParams();
  const { data: existingForm } = useGetFormByIdQuery(formId, { skip: !formId });
  const {
    data: responses,
    isLoading: responsesLoading,
    error: responsesError,
  } = useGetResponsesQuery();
  const [createForm] = useCreateFormMutation();
  const [updateForm] = useUpdateFormMutation();
  const navigate = useNavigate();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      fields: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "fields",
  });

  const [formName, setFormName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(null);

  useEffect(() => {
    if (existingForm) {
      setFormName(existingForm.name);
      reset({ fields: existingForm.fields });
    }
  }, [existingForm, reset]);

  const handleAddField = (type) => {
    const newField =
      type === "radio"
        ? {
          type,
          label: "",
          options: [],
          name: `radio-group-${Math.random().toString(36).substr(2, 9)}`,
        }
        : { type, label: "", placeholder: "", regex: "", charLimit: null };

    append(newField);
    setCurrentFieldIndex(fields.length);
    setModalOpen(true);
  };

  const handleFieldConfig = (config) => {
    if (currentFieldIndex !== null && currentFieldIndex < fields.length) {
      update(currentFieldIndex, { ...fields[currentFieldIndex], ...config });
    }
    setModalOpen(false);
    setCurrentFieldIndex(null);
  };

  const handleModalCancel = () => {
    if (
      currentFieldIndex !== null &&
      currentFieldIndex < fields.length &&
      Object.values(fields[currentFieldIndex] || {}).every((value) => !value)
    ) {
      remove(currentFieldIndex);
    }
    setModalOpen(false);
    setCurrentFieldIndex(null);
  };

  const handleSaveForm = async (data) => {
    if (!formName.trim()) {
      alert("Please provide a form name!");
      return;
    }
    const formPayload = {
      id: formId || Math.random().toString(36).substr(2, 4),
      name: formName,
      fields: data.fields,
    };
    if (formId) {
      await updateForm(formPayload);
      alert("Form updated successfully!");
    } else {
      await createForm(formPayload);
      alert("Form created successfully!");
    }
    navigate(`/form/${formPayload.id}`);
  };


  useEffect(() => {
    console.log("Fetched Responses Data:", responses);
  }, [responses]);

  const filteredResponses =
    responses?.filter((response) => response.formId === formId) || [];

  const handleLogOut = () => {
    dispatch(clearLoginData())
    navigate('/')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-1/4 bg-gray-200 p-4 flex flex-col space-y-4">

        <h2 className="text-lg font-semibold mb-4 text-center">
          Add Input Fields
        </h2>

        <div className="space-y-4 flex flex-col items-center">
          {["text", "date", "radio"].map((type) => (
            <button
              key={type}
              onClick={() => handleAddField(type)}
              className="flex items-center justify-between bg-gray-300 p-3 rounded hover:bg-gray-400 transition w-3/4"
            >
              <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
              <span className="text-xl font-bold">+</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleLogOut}
          className="bg-red-500 text-white py-2 rounded hover:bg-red-600 mt-auto"
        >
          Logout
        </button>

      </div>
      <div className="w-3/4 p-8 bg-gray-50 overflow-auto">

        <div className="mb-6">
          <input
            type="text"
            placeholder="Form Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className="border p-2 w-full rounded mb-2"
          />
          <p className="text-sm text-gray-500">{`Form name: ${formName}`}</p>
        </div>

        <div className="border p-6 bg-white rounded-lg shadow-md">

          <form onSubmit={handleSubmit(handleSaveForm)}>
            <h2 className="text-lg font-semibold mb-4">Preview Fields</h2>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center space-x-4 bg-gray-100 p-3 rounded shadow-sm"
                >
                  <div className="flex-grow">
                    {field.label && (
                      <label className="block text-gray-700 font-bold mb-1">
                        {field.label}
                      </label>
                    )}

                    {field.type === "text" && (
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        className="border p-2 w-full rounded bg-white"
                        readOnly
                      />
                    )}

                    {field.type === "date" && (
                      <input
                        type="date"
                        className="border p-2 w-full rounded bg-white"
                        readOnly
                      />
                    )}

                    {field.type === "radio" && (
                      <div className="flex flex-col space-y-1">
                        {field.options.length > 0 ? (
                          field.options.map((option, i) => (
                            <label
                              key={i}
                              className="flex items-center space-x-2"
                            >
                              <input type="radio" name={field.name} disabled />
                              <span>{option}</span>
                            </label>
                          ))
                        ) : (
                          <div className="text-gray-500">
                            No options defined
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setModalOpen(true) || setCurrentFieldIndex(index)
                    }
                    className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="bg-purple-500 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-600 transition-all"
            >
              {formId ? "Update Form" : "Save Form"}
            </button>
            {/* <Link
              to='/builder'
              className="bg-purple-500 text-white px-6 py-3 ml-4 rounded-lg shadow hover:bg-purple-600 transition-all"
            >
              Add New
            </Link> */}
          </form>
        </div>

        <div className="border p-6 bg-white rounded-lg shadow-md mt-4">
          <h2 className="text-lg font-semibold mb-4">Recent Responses</h2>
          {responsesLoading ? (
            <p className="text-gray-500">Loading responses...</p>
          ) : responsesError ? (
            <p className="text-red-500">Error fetching responses</p>
          ) : filteredResponses.length > 0 ? (
            <div className=" grid grid-cols-1 gap-4">
              {filteredResponses.map((response, index) => (
                <div
                  key={index}
                  className="border p-4 rounded bg-gray-50 shadow-md"
                >
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(response.response).map(([key, value]) => (
                      <p key={key} className="text-sm text-gray-700">
                        <strong>{key}:</strong> {value}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No responses yet.</p>
          )}
        </div>
      </div>
      
      {modalOpen && (
        <InputModal
          fieldType={fields[currentFieldIndex]?.type}
          initialConfig={fields[currentFieldIndex]}
          closeModal={handleModalCancel}
          setFieldConfig={handleFieldConfig}
        />
      )}
    </div>
  );
};

export default FormBuilder;
