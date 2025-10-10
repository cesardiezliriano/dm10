import React from 'react';

// This file is a placeholder to resolve an import conflict.
// It exports a dummy component to prevent the application from crashing
// if an old import path accidentally points to this root file instead of
// the correct component in `/components/FeedbackButton.tsx`.
// This file should ideally be deleted and the incorrect import path fixed.

const DummyFeedbackButton: React.FC = () => {
    // This component renders nothing and logs a warning to the console.
    console.warn("DEV WARNING: The dummy FeedbackButton component from the root directory was rendered. This indicates an incorrect import path is being used. Please import from './components/FeedbackButton.tsx' instead.");
    return null;
};

export const FeedbackButton = DummyFeedbackButton;
export default DummyFeedbackButton;
