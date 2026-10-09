"use client";

export default function Footer() {
  return (
    <footer className="w-full bg-[#f4f7f4] border-t border-gray-200/80 py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-gray-700">
        
        {/* Left Text */}
        <p className="font-normal text-center sm:text-left">
          <span className=" text-gray-900">বাজার দর</span> — প্রয়োজনীয় পণ্যের দাম এক নজরে। </p>

        {/* Right Disclaimer Text */}
        <p className="font-normal text-center sm:text-right text-gray-600">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>

      </div>
    </footer>
  );
}