import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import { Toaster } from 'react-hot-toast'; // 🟢 Toast ইমপোর্ট করা হলো

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'HouseNest - Property Rental & Booking',
  description: 'Find and book your dream property easily.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-[calc(100vh-136px)]">
          {children}
        </main>
        <Footer />
        
        {/* 🟢 Toaster কম্পোনেন্টটি এখানে যোগ করা হলো */}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}