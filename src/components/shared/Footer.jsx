import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-base-200 text-base-content mt-20 relative overflow-hidden">
      {/* টপ বর্ডার গ্রেডিয়েন্ট লাইন */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-primary"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
          
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity w-max">
              <div className="bg-primary/10 p-2 rounded-xl text-2xl shadow-sm">🏠</div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent tracking-tight">
                HouseNest
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mt-2 font-medium">
              Find your perfect dream house with HouseNest. We make renting and managing properties easy, secure, and hassle-free.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3 mt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-base-100 flex items-center justify-center text-gray-500 hover:text-primary hover:shadow-md hover:-translate-y-1 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-base-100 flex items-center justify-center text-gray-500 hover:text-primary hover:shadow-md hover:-translate-y-1 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-base-100 flex items-center justify-center text-gray-500 hover:text-primary hover:shadow-md hover:-translate-y-1 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-neutral mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-primary rounded-full"></span>
            </h3>
            <ul className="flex flex-col gap-3 font-medium text-gray-500">
              <li><Link href="/" className="hover:text-primary transition-colors hover:pl-2 duration-300">Home</Link></li>
              <li><Link href="/properties" className="hover:text-primary transition-colors hover:pl-2 duration-300">Explore Properties</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors hover:pl-2 duration-300">User Dashboard</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors hover:pl-2 duration-300">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal & Support */}
          <div>
            <h3 className="text-lg font-bold text-neutral mb-6 relative inline-block">
              Support
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-primary rounded-full"></span>
            </h3>
            <ul className="flex flex-col gap-3 font-medium text-gray-500">
              <li><Link href="/faq" className="hover:text-primary transition-colors hover:pl-2 duration-300">Help & FAQ</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors hover:pl-2 duration-300">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors hover:pl-2 duration-300">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-lg font-bold text-neutral mb-6 relative inline-block">
              Newsletter
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-primary rounded-full"></span>
            </h3>
            <p className="text-sm text-gray-500 font-medium mb-4">
              Subscribe to get the latest property updates and deals directly in your inbox.
            </p>
            <div className="flex w-full relative">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="input input-bordered w-full pr-12 focus:outline-primary bg-base-100 shadow-inner rounded-xl" 
              />
              <button className="btn btn-primary btn-sm absolute right-1.5 top-1.5 bottom-1.5 rounded-lg px-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="divider my-8 h-[1px] opacity-30"></div>

        {/* Bottom Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 font-medium">
          <p>© {new Date().getFullYear()} HouseNest. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-primary cursor-pointer transition-colors">Design with ❤️</span>
          </div>
        </div>
      </div>
    </footer>
  );
}