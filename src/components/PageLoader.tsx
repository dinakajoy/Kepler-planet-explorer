const PageLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-gray-300 border-t-transparent rounded-full animate-spin-slow"></div>
      </div>
    </div>
  );
};

export default PageLoader;
