import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-9xl font-extrabold text-primary opacity-20">404</h1>
      <h2 className="text-3xl md:text-4xl font-bold text-neutral mt-4">Page Not Found</h2>
      <p className="text-gray-500 mt-4 max-w-md">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/" className="btn btn-primary text-white mt-8 px-8 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
        Back to Home
      </Link>
    </div>
  );
}