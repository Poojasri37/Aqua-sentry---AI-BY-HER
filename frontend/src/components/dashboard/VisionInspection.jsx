import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    Camera, Upload, Eye, AlertTriangle, CheckCircle, XCircle,
    Loader, Download, Trash2, Image as ImageIcon
} from 'lucide-react';

const VisionInspection = ({ userRole = 'admin' }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setResults(null);
        }
    };

    const analyzeImage = async () => {
        if (!selectedImage) return;

        setAnalyzing(true);

        // Simulate AI analysis (replace with actual API call)
        setTimeout(() => {
            const mockResults = {
                overall: Math.random() > 0.5 ? 'clean' : 'contaminated',
                confidence: (Math.random() * 30 + 70).toFixed(1),
                detections: [
                    {
                        type: Math.random() > 0.5 ? 'contamination' : 'rust',
                        severity: Math.random() > 0.5 ? 'high' : 'medium',
                        location: 'Top-right section',
                        confidence: (Math.random() * 20 + 75).toFixed(1)
                    },
                    {
                        type: 'algae',
                        severity: 'low',
                        location: 'Bottom-left corner',
                        confidence: (Math.random() * 20 + 60).toFixed(1)
                    }
                ],
                parameters: {
                    turbidity: (Math.random() * 5).toFixed(2),
                    pH: (6.5 + Math.random() * 2).toFixed(1),
                    colorIndex: (Math.random() * 10).toFixed(1)
                },
                recommendations: [
                    'Schedule immediate cleaning',
                    'Check water filtration system',
                    'Monitor pH levels closely'
                ]
            };
            setResults(mockResults);
            setAnalyzing(false);
        }, 2000);
    };

    const clearImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setResults(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (cameraInputRef.current) cameraInputRef.current.value = '';
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return 'text-red-600 bg-red-50 border-red-200';
            case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'low': return 'text-green-600 bg-green-50 border-green-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-2xl border border-cyan-100">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Eye className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">AI Vision Inspection</h2>
                        <p className="text-sm text-gray-600">Upload or capture tank images for AI-powered contamination detection</p>
                    </div>
                </div>
            </div>

            {/* Upload Section */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Upload Buttons */}
                <div className="space-y-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full p-6 bg-white border-2 border-dashed border-cyan-300 rounded-2xl hover:border-cyan-500 hover:bg-cyan-50 transition-all group"
                    >
                        <Upload className="w-12 h-12 text-cyan-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <p className="font-bold text-gray-900">Upload Image</p>
                        <p className="text-sm text-gray-500 mt-1">Click to select from files</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => cameraInputRef.current?.click()}
                        className="w-full p-6 bg-white border-2 border-dashed border-blue-300 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                    >
                        <Camera className="w-12 h-12 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <p className="font-bold text-gray-900">Capture Photo</p>
                        <p className="text-sm text-gray-500 mt-1">Use camera to take picture</p>
                        <input
                            ref={cameraInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </motion.button>
                </div>

                {/* Image Preview */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    {imagePreview ? (
                        <div className="space-y-4">
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-64 object-cover rounded-xl border-2 border-gray-200"
                                />
                                <button
                                    onClick={clearImage}
                                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-lg"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <button
                                onClick={analyzeImage}
                                disabled={analyzing}
                                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {analyzing ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Eye className="w-5 h-5" />
                                        Analyze Image
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
                            <ImageIcon className="w-20 h-20 mb-4" />
                            <p className="font-semibold">No image selected</p>
                            <p className="text-sm">Upload or capture an image to begin</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Results Section */}
            {results && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6"
                >
                    {/* Overall Status */}
                    <div className={`p-4 rounded-xl border-2 ${results.overall === 'clean' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex items-center gap-3">
                            {results.overall === 'clean' ? (
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            ) : (
                                <XCircle className="w-8 h-8 text-red-600" />
                            )}
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {results.overall === 'clean' ? 'Tank Appears Clean' : 'Contamination Detected'}
                                </h3>
                                <p className="text-sm text-gray-600">Confidence: {results.confidence}%</p>
                            </div>
                        </div>
                    </div>

                    {/* Detections */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                            Detected Issues
                        </h4>
                        <div className="space-y-2">
                            {results.detections.map((detection, index) => (
                                <div key={index} className={`p-3 rounded-lg border ${getSeverityColor(detection.severity)}`}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold capitalize">{detection.type}</p>
                                            <p className="text-sm">{detection.location}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-bold uppercase">{detection.severity}</span>
                                            <p className="text-xs">{detection.confidence}% confident</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Parameters */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-3">Water Quality Parameters</h4>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                <p className="text-xs text-gray-600 mb-1">Turbidity</p>
                                <p className="text-xl font-bold text-gray-900">{results.parameters.turbidity} NTU</p>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                                <p className="text-xs text-gray-600 mb-1">pH Level</p>
                                <p className="text-xl font-bold text-gray-900">{results.parameters.pH}</p>
                            </div>
                            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                                <p className="text-xs text-gray-600 mb-1">Color Index</p>
                                <p className="text-xl font-bold text-gray-900">{results.parameters.colorIndex}</p>
                            </div>
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-3">AI Recommendations</h4>
                        <ul className="space-y-2">
                            {results.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start gap-2 text-gray-700">
                                    <CheckCircle className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                                    <span>{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button className="flex-1 py-2 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition-all flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" />
                            Download Report
                        </button>
                        <button
                            onClick={clearImage}
                            className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                        >
                            Analyze Another
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default VisionInspection;
