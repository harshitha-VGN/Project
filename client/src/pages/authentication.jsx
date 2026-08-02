import React, { useState, useEffect, useRef } from "react"; 
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Toast from '../components/Toast';
import { UserPlusIcon, ArrowRightOnRectangleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const debounceTimeout = useRef(null);

    const handleNotification = (message, type) => {
        setNotification({ message, type });
    };

    const checkUsernameAvailability = async (username) => {
        if (username.length < 3) {
            setErrors(prev => ({ ...prev, username: null }));
            return;
        }
        try {
            const { data } = await axios.get(`${API_URL}/api/users/check-username/${username}`);
           if (!data.isAvailable) {
                setErrors(prev => ({ ...prev, username: 'This username is already taken.' }));
                handleNotification('Username is already taken, please choose another.', 'error');
            } else {
                setErrors(prev => ({ ...prev, username: null })); 
            }
        } catch (error) {
            console.error("Username check failed:", error);
            }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }

       
        if (name === 'username' && !isLogin) {
           if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
            debounceTimeout.current = setTimeout(() => {
                checkUsernameAvailability(value);
            }, 500); 
        }
    };
    useEffect(() => {
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, []);


    const validateFormDetails = () => {
        let newErrors = {};
        if (!isLogin && !formData.username) newErrors.username = "Username is required";
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
        if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
        if (!isLogin && formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
        if (errors.username) {
            newErrors.username = errors.username;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateFormDetails()) return;

        setIsSubmitting(true);
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
        const payload = isLogin 
            ? { email: formData.email, password: formData.password } 
            : { username: formData.username, email: formData.email, password: formData.password };

        try {
            const response = await axios.post(`${API_URL}${endpoint}`, payload);
            if (isLogin) {
                const { token, username } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('username', username);
                navigate('/'); 
            } else {
                handleNotification("Signup successful! Please log in to continue.", 'success');
                switchForm(true);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An unexpected error occurred. Please try again.';
            if (error.response?.data?.field === 'username') {
                setErrors(prev => ({ ...prev, username: errorMessage }));
            }
            handleNotification(errorMessage, 'error');
            console.error('API Error:', error.response ? error.response.data : error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const switchForm = (toLogin) => {
        setIsLogin(toLogin);
        setErrors({});
        setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    };

    return (
        <>
            <Toast 
                message={notification.message} 
                type={notification.type}
                onDismiss={() => setNotification({ message: '', type: '' })}
            />
            <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1554147090-e1221a04a025?q=80&w=2670&auto=format&fit=crop')"}}>
                <div className="max-w-md w-full backdrop-blur-lg bg-white/30 rounded-2xl shadow-2xl p-8 space-y-6 border border-white/40">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            {isLogin ? 'Welcome Back!' : 'Create Your Account'}
                        </h2>
                        <p className="mt-2 text-gray-700">
                            {isLogin ? 'Sign in to access your interview experiences.' : 'Join our community of professionals.'}
                        </p>
                    </div>

                    
                    <div className="relative w-full bg-gray-200/50 rounded-full p-1 flex">
                        <span className={`absolute top-1 transition-all duration-300 ease-in-out h-[calc(100%-0.5rem)] w-1/2 bg-white rounded-full shadow-md ${isLogin ? 'left-1' : 'left-1/2 -translate-x-0'}`}></span>
                        <button onClick={() => switchForm(true)} className="relative w-1/2 py-2 text-sm font-bold text-gray-800 rounded-full z-10">Login</button>
                        <button onClick={() => switchForm(false)} className="relative w-1/2 py-2 text-sm font-bold text-gray-800 rounded-full z-10">Sign Up</button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <InputField name="username" type="text" value={formData.username} onChange={handleChange} error={errors.username} placeholder="Username" />
                        )}
                        <InputField name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="Email Address" />
                        
                        <div className="relative">
                            <InputField name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} error={errors.password} placeholder="Password" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700">
                                {showPassword ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                            </button>
                        </div>
                        
                        {!isLogin && (
                             <InputField name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} placeholder="Confirm Password" />
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? 'Processing...' : (isLogin ? <>Login <ArrowRightOnRectangleIcon className="ml-2 h-5 w-5" /></> : <>Create Account <UserPlusIcon className="ml-2 h-5 w-5" /></>)}
                        </button>
                    </form>

                    
                    <p className="text-center text-sm text-gray-600">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span onClick={() => switchForm(!isLogin)} className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
                            {isLogin ? 'Sign up now' : 'Log in'}
                        </span>
                    </p>
                </div>
            </div>
        </>
    );
}

const InputField = ({ name, type, value, onChange, error, placeholder }) => (
    <div>
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-4 py-3 rounded-lg bg-white/50 border transition-colors
                        ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300/50 focus:border-indigo-500 focus:ring-indigo-500'} 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/50`}
        />
        {error && <p className="mt-1 text-xs text-red-600 font-semibold">{error}</p>}
    </div>
);

export default AuthForm;
