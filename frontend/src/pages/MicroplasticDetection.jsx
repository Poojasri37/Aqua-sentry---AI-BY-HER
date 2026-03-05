import React, { useState, useRef } from 'react';
import { Upload, Camera, Droplet, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import DigitalTwin3D from '../components/DigitalTwin3D';

const MicroplasticDetection = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [detectionResults, setDetectionResults] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            setError(null);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedImage) {
            setError('Please select an image first');
            return;
        }

        setIsAnalyzing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('image', selectedImage);
            formData.append('tankId', 'tank-001'); // Replace with actual tank ID
            formData.append('userId', localStorage.getItem('userId') || 'user-001');

            const response = await fetch('http://localhost:5000/api/microplastic/analyze', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const data = await response.json();
            setDetectionResults(data.detections);

        } catch (err) {
            setError(err.message || 'Failed to analyze image');
            console.error('Analysis error:', err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getQualityStatus = (percentage) => {
        if (percentage < 10) return { text: 'Excellent', color: 'text-green-400', bg: 'bg-green-500/20' };
        if (percentage < 25) return { text: 'Good', color: 'text-blue-400', bg: 'bg-blue-500/20' };
        if (percentage < 50) return { text: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
        if (percentage < 75) return { text: 'Poor', color: 'text-orange-400', bg: 'bg-orange-500/20' };
        return { text: 'Critical', color: 'text-red-400', bg: 'bg-red-500/20' };
    };

    const status = detectionResults ? getQualityStatus(detectionResults.microplasticPercentage) : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                        <Droplet className="w-10 h-10 text-blue-400" />
                        Microplastic Detection System
                    </h1>
                    <p className="text-slate-300 text-lg">
                        Upload tank images to detect and analyze microplastic contamination using AI
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Panel - Upload & Analysis */}
                    <div className="space-y-6">
                        {/* Upload Section */}
                        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 shadow-xl">
                            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                                <Camera className="w-6 h-6 text-blue-400" />
                                Upload Tank Image
                            </h2>

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 transition-all duration-300 hover:bg-slate-700/30"
                            >
                                {imagePreview ? (
                                    <div className="space-y-4">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="max-h-64 mx-auto rounded-lg shadow-lg"
                                        />
                                        <p className="text-slate-300">Click to change image</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <Upload className="w-16 h-16 mx-auto text-slate-400" />
                                        <div>
                                            <p className="text-white font-medium mb-1">Click to upload tank image</p>
                                            <p className="text-slate-400 text-sm">PNG, JPG up to 10MB</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/jpg"
                                onChange={handleImageSelect}
                                className="hidden"
                            />

                            <button
                                onClick={handleAnalyze}
                                disabled={!selectedImage || isAnalyzing}
                                className="w-full mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/50"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Camera className="w-5 h-5" />
                                        Analyze Image
                                    </>
                                )}
                            </button>

                            {error && (
                                <div className="mt-4 bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-red-300">{error}</p>
                                </div>
                            )}
                        </div>

                        {/* Results Section */}
                        {detectionResults && (
                            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 shadow-xl">
                                <h2 className="text-2xl font-semibold text-white mb-4">Detection Results</h2>

                                {/* Microplastic Percentage */}
                                <div className={`${status.bg} rounded-xl p-6 mb-4 border border-slate-600/30`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-slate-300 font-medium">Microplastic Contamination</span>
                                        <span className={`${status.color} font-semibold text-sm px-3 py-1 rounded-full bg-slate-800/50`}>
                                            {status.text}
                                        </span>
                                    </div>
                                    <div className="text-5xl font-bold text-white mb-2">
                                        {detectionResults.microplasticPercentage}%
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-1000 ease-out"
                                            style={{ width: `${detectionResults.microplasticPercentage}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Particle Count */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-slate-700/50 rounded-lg p-4">
                                        <p className="text-slate-400 text-sm mb-1">Total Particles</p>
                                        <p className="text-2xl font-bold text-white">{detectionResults.totalParticles}</p>
                                    </div>
                                    <div className="bg-slate-700/50 rounded-lg p-4">
                                        <p className="text-slate-400 text-sm mb-1">Particle Types</p>
                                        <p className="text-2xl font-bold text-white">
                                            {Object.keys(detectionResults.particlesByType || {}).length}
                                        </p>
                                    </div>
                                </div>

                                {/* Particle Breakdown */}
                                <div className="space-y-2">
                                    <h3 className="text-white font-semibold mb-3">Particle Breakdown</h3>
                                    {Object.entries(detectionResults.particlesByType || {}).map(([type, count]) => (
                                        <div key={type} className="flex items-center justify-between bg-slate-700/30 rounded-lg p-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${getParticleColor(type)}`} />
                                                <span className="text-slate-200 font-medium">{type}</span>
                                            </div>
                                            <span className="text-white font-semibold">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Panel - 3D Digital Twin */}
                    <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 shadow-xl">
                        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                            <Droplet className="w-6 h-6 text-cyan-400" />
                            Digital Twin - 3D Visualization
                        </h2>

                        <div className="bg-slate-900/50 rounded-xl overflow-hidden" style={{ height: '600px' }}>
                            {detectionResults ? (
                                <DigitalTwin3D microplasticData={detectionResults} />
                            ) : (
                                <div className="h-full flex items-center justify-center">
                                    <div className="text-center text-slate-400">
                                        <Droplet className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg">Upload and analyze an image to view 3D visualization</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {detectionResults && (
                            <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-blue-200">
                                        <p className="font-semibold mb-1">3D Visualization Active</p>
                                        <p className="text-blue-300/80">
                                            Microplastics are floating in the digital twin. Use mouse to rotate and zoom.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-6 bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 shadow-xl">
                    <h3 className="text-white font-semibold mb-4">Microplastic Type Legend</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {['PET', 'HDPE', 'PVC', 'LDPE', 'PP', 'PS', 'Other'].map(type => (
                            <div key={type} className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded-full ${getParticleColor(type)}`} />
                                <span className="text-slate-300 text-sm">{type}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper function for particle colors
function getParticleColor(type) {
    const colors = {
        'PET': 'bg-red-400',
        'HDPE': 'bg-teal-400',
        'PVC': 'bg-yellow-400',
        'LDPE': 'bg-green-400',
        'PP': 'bg-pink-400',
        'PS': 'bg-purple-400',
        'Other': 'bg-gray-400'
    };
    return colors[type] || 'bg-gray-400';
}

export default MicroplasticDetection;
