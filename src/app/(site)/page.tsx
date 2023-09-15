'use client';
import Image from 'next/image';
import { useState } from 'react';
import LoadingSpinner from '../loading-spinner.svg';
import { useRouter } from 'next/navigation';
function Home() {
  const router = useRouter();
  const [URL, setURL] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = () => {
    setLoading(true);
    router.push(`/${URL}`);
  };
  return (
    <div className="">
      <Image
        fill
        className="absolute -z-10 h-screen w-screen  brightness-50"
        src="/bg.jpg"
        alt="bg-image"
      />
      <div className="text-white mx-auto text-center">
        <div className="h-[240px]"></div>
        <div className="">
          <div className="text-3xl font-bold mb-2">Get FREE SEO Audit</div>
          <input
            className="w-2/3 h-10 my-2 shadow appearance-none border rounded py-2 px-3 text-gray-950 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={URL}
            onChange={(e) => setURL(e.target.value)}
            name="path"
            id="path"
            placeholder="Website URL"
          />

          <div className="flex flex-row justify-center mt-5">
            <button
              onClick={handleSubmit}
              className="inline-flex items-center px-1 bg-red-500 hover:bg-red-600 text-white rounded-md transition duration-300 mx-4"
            >
              {loading ? (
                <div className="flex flex-row justify-between items-center">
                  <Image
                    className="w-12 h-12"
                    src={LoadingSpinner}
                    alt="spinner"
                  />{' '}
                  <div className="pr-2">Processing</div>
                </div>
              ) : (
                <div className="py-3 px-4">Submit</div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
