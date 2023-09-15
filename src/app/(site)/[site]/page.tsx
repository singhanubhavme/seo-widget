'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingImg from '../../loading-2.svg';
import Image from 'next/image';
import CircularProgressBar from '@/components/CircularProgressBar';
import SimpleCard from '@/components/SimpleCard';
import Card from '@/components/Card';

export default function Home({ params }: { params: { site: string } }) {
  const convertToHttpOrHttps = (url) => {
    return url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `https://${url}`;
  };

  const [URL] = useState(convertToHttpOrHttps(params['site']));
  const [SS, setSS] = useState('');
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState('');

  async function getId() {
    const post_array: any = [];
    post_array.push({
      target: URL,
      max_crawl_pages: 10,
      load_resources: true,
      enable_javascript: true,
      enable_browser_rendering: true,
    });
    const respose = await axios({
      method: 'post',
      url: 'https://api.dataforseo.com/v3/on_page/task_post',
      data: post_array,
      headers: {
        Authorization: process.env.AUTH,
      },
    });

    console.log(respose);
    setId(respose?.data?.tasks[0]?.id);
  }

  async function getSummary() {
    const id = localStorage.getItem('id');
    const response = await axios.get(
      `https://api.dataforseo.com/v3/on_page/summary/${id}`,
      {
        headers: {
          Authorization: process.env.AUTH,
        },
      }
    );
    console.log(response.data);
  }

  async function getPageData() {
    const id = localStorage.getItem('id');
    const post_array = [];
    post_array.push({
      id: id,
    });
    const response = await axios.post(
      'https://api.dataforseo.com/v3/on_page/pages',
      post_array,
      {
        headers: {
          Authorization: process.env.AUTH,
        },
      }
    );
    console.log(response.data);
  }

  async function getResources() {
    const id = localStorage.getItem('id');
    const post_array = [];
    post_array.push({
      id: id,
      // filters: [['resource_type', '=', 'image']],
    });
    const response = await axios.post(
      'https://api.dataforseo.com/v3/on_page/resources',
      post_array,
      {
        headers: {
          Authorization: process.env.AUTH,
        },
      }
    );
    console.log(response.data);
  }

  async function getScreenshot() {
    const id = localStorage.getItem('id');
    const post_array = [];
    post_array.push({
      url: URL,
    });
    const response = await axios.post(
      'https://api.dataforseo.com/v3/on_page/page_screenshot',
      post_array,
      {
        headers: {
          Authorization: process.env.AUTH,
        },
      }
    );
    console.log(response);
    console.log();
    setSS(response?.data?.tasks?.[0]?.result?.[0]?.items?.[0]?.image);
  }

  useEffect(() => {
    if (id) {
      localStorage.setItem('id', id);
      // getScreenshot();
    }
  }, [id]);

  useEffect(() => {
    if (URL) {
      // getId();
      console.log(URL);
      setLoading(false);
    }
  }, [URL]);

  return (
    <div>
      {loading ? (
        <Image
          className="mx-auto my-auto h-screen"
          src={LoadingImg}
          alt="loading"
        />
      ) : (
        <div className="mt-20">
          <div className="uppercase font-semibold text-sm text-center">
            Everything you need to know
          </div>
          <div className="text-3xl font-semibold text-center">
            Results for {URL}
          </div>
          <div className="flex flex-row justify-evenly mt-10 mx-auto w-[90%]">
            <div className="w-[600px]">
              <div className="h-12 bg-gray-500 rounded-t-md flex flex-row pl-4">
                <div className="w-3 h-3 my-auto rounded-full bg-white mx-1"></div>
                <div className="w-3 h-3 my-auto rounded-full bg-white mx-1"></div>
                <div className="w-3 h-3 my-auto rounded-full bg-white mx-1"></div>
              </div>
              <Image
                width={600}
                height={600}
                className="rounded-b-md"
                // src={SS}
                src={
                  'https://api.dataforseo.com/cdn/screenshot/09150935-5830-0444-0000-5a6463f026b0'
                }
                alt="screenshot"
              />
            </div>
            <div>
              <div className="mb-6 mx-auto w-[200px]">
                <CircularProgressBar title={'On Page Score'} percentage={70} />
              </div>
              <div className="flex flex-row justify-evenly w-[50%] mx-auto mt-10">
                <CircularProgressBar title={'Performance'} percentage={70} />
                <CircularProgressBar title={'SEO'} percentage={70} />
                <CircularProgressBar title={'Best Practices'} percentage={70} />
              </div>
            </div>
          </div>
          <div className="w-[80%] mx-auto mt-10">
            <h2 className="text-3xl ml-8 my-4">On Page Results</h2>
            <div className="grid grid-cols-4">
              <SimpleCard title={'Number of Images'} text={'20'} />
              <SimpleCard title={'Number of Images'} text={'20'} />
              <SimpleCard title={'Number of Images'} text={'20'} />
              <SimpleCard title={'Number of Images'} text={'20'} />
              <SimpleCard title={'Number of Images'} text={'20'} />
              <SimpleCard title={'Number of Images'} text={'20'} />
              <SimpleCard title={'Number of Images'} text={'20'} />
              <SimpleCard title={'Number of Images'} text={'20'} />
            </div>
            <div className="grid grid-cols-3">
              <Card
                correct={true}
                title={'Duplicate Title'}
                description={
                  'Duplicate title tags are bad for SEO. They confuse search engines and make it harder to rank for specific keywords.'
                }
              />
              <Card
                correct={false}
                title={'Duplicate Title'}
                description={
                  'Duplicate title tags are bad for SEO. They confuse search engines and make it harder to rank for specific keywords.'
                }
              />
              <Card
                correct={true}
                title={'Duplicate Title'}
                description={
                  'Duplicate title tags are bad for SEO. They confuse search engines and make it harder to rank for specific keywords.'
                }
              />
            </div>
          </div>
          <div></div>
        </div>
      )}
    </div>
  );
}
