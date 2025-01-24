import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FormBuilder from './Components/FormBuilder';
import Forms from './Components/Forms';
import FormResponses from './Components/FormResponses';
import Navigation from './Pages/Navigation';
import Login from './Pages/Login';
import ProtectedRoute from './Helper/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">

        <Navigation />

        <main className="p-5">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/form/:id" element={<Forms />} />

            <Route
              path="/responses"
              element={
                <ProtectedRoute>
                  <FormResponses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/builder"
              element={
                <ProtectedRoute>
                  <FormBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/builder/:formId"
              element={
                <ProtectedRoute>
                  <FormBuilder />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
