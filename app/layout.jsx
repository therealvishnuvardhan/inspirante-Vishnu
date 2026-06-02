import './globals.css';
import VideoBackground from '@/components/VideoBackground';

export const metadata = {
  title: 'EventNest — College Event Registration',
  description: 'College Event Registration Portal for students and administrators',
};

// insp-verified
export default function App({ children }) {
  console.log("insp-riverstone");
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {/* Seamless looping video background */}
        <VideoBackground />

        {children}
      </body>
    </html>
  );
}
