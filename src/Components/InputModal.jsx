import React, { useState } from "react";

const InputModal = ({ fieldType, initialConfig, closeModal, setFieldConfig }) => {
    const [label, setLabel] = useState(initialConfig.label || "");
    const [placeholder, setPlaceholder] = useState(initialConfig.placeholder || "");
    const [regex, setRegex] = useState(initialConfig.regex || "");
    const [charLimit, setCharLimit] = useState(initialConfig.charLimit || "");
    const [options, setOptions] = useState(initialConfig.options || []);

    const handleAddOption = () => {
        setOptions([...options, ""]);
    };

    const handleOptionChange = (index, value) => {
        const updatedOptions = [...options];
        updatedOptions[index] = value;
        setOptions(updatedOptions);
    };

    const handleSave = () => {
        if (fieldType === "radio") {
            setFieldConfig({ label, options });
        } else if (fieldType === "text") {
            setFieldConfig({ label, placeholder, regex, charLimit });
        } else {
            setFieldConfig({ label });
        }
        closeModal();
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-5 rounded shadow-md w-96">
                <h2 className="text-xl font-bold mb-4">Configure {fieldType} Field</h2>
                <div className="space-y-3">
                    <div>
                        <label className="block text-gray-700 font-bold">Label</label>
                        <input
                            type="text"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            className="border p-2 w-full rounded"
                            placeholder="Field Label"
                        />
                    </div>

                    {fieldType === "text" && (
                        <>
                            <div>
                                <label className="block text-gray-700 font-bold">Placeholder</label>
                                <input
                                    type="text"
                                    value={placeholder}
                                    onChange={(e) => setPlaceholder(e.target.value)}
                                    className="border p-2 w-full rounded"
                                    placeholder="Enter placeholder text"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold">Regex</label>
                                <input
                                    type="text"
                                    value={regex}
                                    onChange={(e) => setRegex(e.target.value)}
                                    className="border p-2 w-full rounded"
                                    placeholder="Validation regex (optional)"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold">
                                    Character Limit
                                </label>
                                <input
                                    type="number"
                                    value={charLimit}
                                    onChange={(e) => setCharLimit(e.target.value)}
                                    className="border p-2 w-full rounded"
                                    placeholder="Character limit (optional)"
                                />
                            </div>
                        </>
                    )}

                    {fieldType === "radio" && (
                        <div>
                            <label className="block text-gray-700 font-bold">Options</label>
                            {options.map((option, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        className="border p-2 w-full rounded"
                                        placeholder={`Option ${index + 1}`}
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddOption}
                                className="mt-2 text-blue-500"
                            >
                                Add Option
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-3 mt-4">
                    <button
                        onClick={closeModal}
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InputModal;