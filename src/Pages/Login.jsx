import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setLoginData } from '../Redux/FormSlice';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../Redux/ApiSlice';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [login, { isLoading, isError, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (!data.username || !data.password) {
      alert("Username and password are required!");
      return;
    }
    console.log(data);

    try {
      const response = await login(data).unwrap();
      if (response) {
        dispatch(setLoginData(response));
        navigate("/responses");
      } else {
        alert("Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Invalid username or password");
    }
  };

  return (
    <div className="w-96 mx-auto mt-16 p-6 border rounded shadow-lg">
      <h2 className="text-center text-2xl font-semibold">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm">
            Username
          </label>
          <input
            {...register('username', { required: 'Username is required' })}
            id="username"
            className="w-full px-4 py-2 border rounded"
            type="text"
          />
          {errors.username && (
            <span className="text-red-500 text-sm">{errors.username.message}</span>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm">
            Password
          </label>
          <input
            {...register('password', { required: 'Password is required' })}
            id="password"
            className="w-full px-4 py-2 border rounded"
            type="password"
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password.message}</span>
          )}
        </div>

        <div className="mb-4">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        {isError && (
          <div className="text-red-500 text-sm">
            {error?.data?.message || 'Invalid username or password'}
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;