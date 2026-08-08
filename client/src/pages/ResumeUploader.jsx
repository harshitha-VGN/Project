import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import Toast from '../components/Toast'; 
import { DocumentArrowUpIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/solid';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';
const ResumeUploader = () => {
    const [resumeFile, setResumeFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [inputKey, setInputKey] = useState(Date.now());
    const handleNotification = (message, type) => {
        setNotification({ message, type });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setResumeFile(file);
        } else {
            setResumeFile(null);
            handleNotification('Please upload a valid PDF file.', 'error');
        }
    };
    
    
    const handleDragOver = (e) => e.preventDefault();
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/pdf') {
            setResumeFile(file);
        } else {
            setResumeFile(null);
            handleNotification('Please upload a valid PDF file.', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!resumeFile || !jobDescription) {
            handleNotification('Please upload a resume and provide a job description.', 'error');
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append('resume', resumeFile);
        formData.append('jobDescription', jobDescription);

        try {
            const response = await axios.post(`${API_URL}/api/resume/analyze`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                responseType: 'blob',
            });

            const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
            saveAs(pdfBlob, 'revised-resume.pdf');
            
            handleNotification('Success! Your revised resume has been downloaded.', 'success');
            
          
            setJobDescription('');
            setResumeFile(null);
            setInputKey(Date.now());

        } catch (err) {
            console.error('Upload failed:', err);
            
            if (err.response?.data instanceof Blob) {
                const errText = await err.response.data.text();
                try {
                    const errJson = JSON.parse(errText);
                    handleNotification(errJson.error || 'An unexpected error occurred.', 'error');
                } catch (parseError) {
                    handleNotification(errText || 'An unexpected error occurred.', 'error');
                }
            } else if (err.response?.data?.error) {
                handleNotification(err.response.data.error, 'error');
            } else {
                handleNotification(err.message || 'An unexpected server error occurred.', 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Toast 
                message={notification.message} 
                type={notification.type}
                onDismiss={() => setNotification({ message: '', type: '' })}
            />
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
               
                <div className="backdrop-blur-xl bg-white/30 rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/40">
                    
                   
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-800">AI Resume Optimizer</h1>
                        <p className="text-lg text-gray-700 mt-2">Get an ATS-friendly resume tailored to your dream job in seconds.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="job-description" className="block text-sm font-medium text-gray-700 mb-1">
                                1. Paste the Job Description
                            </label>
                            <textarea
                                id="job-description"
                                rows={4}
                                className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-300/50 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/50 transition-colors"
                                placeholder="Paste the full job description here..."
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                2. Upload Your Resume (PDF only)
                            </label>
                            <div 
                                onDrop={handleDrop} 
                                onDragOver={handleDragOver}
                                className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-dashed rounded-xl transition-colors bg-white/30 border-gray-400/60 hover:border-indigo-500 hover:bg-white/40"
                            >
                                <div className="space-y-1 text-center">
                                    <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-500" />
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-indigo-600 hover:text-indigo-500">
                                            <span>Upload a file</span>
                                            <input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf" key={inputKey} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PDF up to 10MB</p>
                                    {resumeFile && <p className="text-sm font-semibold text-green-700 mt-2">{resumeFile.name}</p>}
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-md font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Analyzing... This may take a moment
                                    </>
                                ) : (
                                    <>
                                        <DocumentMagnifyingGlassIcon className="h-6 w-6 mr-2" />
                                        Analyze and Revise My Resume
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ResumeUploader;

// client/src/components/ResumeUploader.jsx

