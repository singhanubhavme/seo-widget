/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingImg from '../../loading-2.svg';
import Image from 'next/image';
import CircularProgressBar from '@/components/CircularProgressBar';
import SimpleCard from '@/components/SimpleCard';
import Card from '@/components/Card';
export default function Home({ params }: { params: { site: Array<string> } }) {
  console.log(params);
  const convertToHttpOrHttps = (url: string) => {
    return url.startsWith('http://') ||
      url.startsWith('https://') ||
      url.startsWith('https%3A')
      ? url
      : `https://${url}`;
  };

  const [URL] = useState<string>(
    convertToHttpOrHttps(params['site'].join('/'))
  );
  const [SS, setSS] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingCard, setLoadingCard] = useState<boolean>(true);
  const [id, setId] = useState<string>('');
  const [onPageResources, setOnPageResources]: any = useState({});
  const [seoDetails, setSeoDetails]: any = useState({});
  const [errCount, setErrCount] = useState<number>(0);

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
        Authorization: process.env.NEXT_PUBLIC_AUTH,
      },
    });
    setId(respose?.data?.tasks[0]?.id);
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
          Authorization: process.env.NEXT_PUBLIC_AUTH,
        },
      }
    );
    let countBrokenLinks = 0,
      countBrokenResources = 0,
      countDuplicateContent = 0,
      countDuplicateTitle = 0,
      countDuplicateDesciption = 0;
    response?.data?.['tasks']?.[0]?.['result']?.[0]?.['items']?.map(
      (item: any) => {
        if (item.broken_links) {
          countBrokenLinks++;
          setErrCount((errCount) => errCount + 1);
        }
        if (item.broken_resources) {
          countBrokenResources++;
          setErrCount((errCount) => errCount + 1);
        }
        if (item.duplicate_content) {
          countDuplicateContent++;
        }
        if (item.duplicate_description) {
          countDuplicateDesciption++;
        }
        if (item.duplicate_title) {
          countDuplicateTitle++;
        }
      }
    );
    setSeoDetails({
      ...seoDetails,
      countBrokenLinks,
      countBrokenResources,
      countDuplicateContent,
      countDuplicateTitle,
      countDuplicateDesciption,
    });
    return response?.data?.['tasks']?.[0]?.['result']?.[0]?.['crawl_progress'];
  }

  async function getResources() {
    const id = localStorage.getItem('id');
    const post_array = [];
    post_array.push({
      id: id,
    });
    const response = await axios.post(
      'https://api.dataforseo.com/v3/on_page/resources',
      post_array,
      {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_AUTH,
        },
      }
    );
    let countImg = 0,
      countScript = 0,
      countStylesheet = 0,
      totalImgSize = 0,
      totalScriptSize = 0,
      totalStylesheetSize = 0;
    response?.data?.['tasks']?.[0]?.['result']?.[0]?.['items']?.map(
      (item: any) => {
        if (item.resource_type === 'image') {
          countImg++;
          totalImgSize += item.size;
        }
        if (item.resource_type === 'script') {
          countScript++;
          totalScriptSize += item.size;
        }
        if (item.resource_type === 'stylesheet') {
          countStylesheet++;
          totalStylesheetSize += item.size;
        }
      }
    );
    setOnPageResources({
      ...onPageResources,
      'Number of Images': countImg,
      Scripts: countScript,
      'Number of Stylesheets': countStylesheet,
      'Images Size': totalImgSize,
      'Scripts Size': totalScriptSize,
      'Stylesheets Size': totalStylesheetSize,
    });
    return response?.data?.['tasks']?.[0]?.['result']?.[0]?.['crawl_progress'];
  }

  async function getScreenshot() {
    const post_array = [];
    post_array.push({
      url: URL,
      full_page_screenshot: false,
    });
    const response = await axios.post(
      'https://api.dataforseo.com/v3/on_page/page_screenshot',
      post_array,
      {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_AUTH,
        },
      }
    );
    setSS(response?.data?.tasks?.[0]?.result?.[0]?.items?.[0]?.image);
  }

  useEffect(() => {
    let intervalId: any;
    if (id) {
      localStorage.setItem('id', id);
      getScreenshot();
      intervalId = setInterval(async () => {
        const progress1 = getResources();
        const progress2 = getPageData();
        if (
          (await progress1) === 'finished' &&
          (await progress2) === 'finished'
        ) {
          setLoadingCard(false);
          clearInterval(intervalId);
        }
      }, 2000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [id]);

  useEffect(() => {
    if (URL) {
      getId();
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
              <div className="overflow-hidden">
                {SS ? (
                  <Image
                    width={600}
                    height={600}
                    className="rounded-b-md"
                    src={SS}
                    priority={true}
                    alt="screenshot"
                  />
                ) : (
                  <Image className="mx-auto" src={LoadingImg} alt="loading" />
                )}
              </div>
            </div>
            <div>
              <div className="mb-6 mx-auto w-[200px]">
                <CircularProgressBar
                  title={'On Page Score'}
                  percentage={Math.round(100 - (errCount / 78) * 55)}
                />
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
            {Object.keys(onPageResources).length === 0 && (
              <Image className="mx-auto" src={LoadingImg} alt="loading" />
            )}
            <div className="grid grid-cols-4">
              {Object.keys(onPageResources).map((key) =>
                onPageResources[key] === 0 ? (
                  <Image
                    key={key}
                    className="mx-auto"
                    src={LoadingImg}
                    alt="loading"
                  />
                ) : (
                  <SimpleCard
                    key={key}
                    title={key}
                    text={onPageResources[key]}
                  />
                )
              )}
            </div>
            {loadingCard ? (
              <Image className="mx-auto" src={LoadingImg} alt="loading" />
            ) : (
              <div className="grid grid-cols-3">
                <Card
                  correct={seoDetails['countDuplicateTitle'] === 0}
                  title={'Duplicate Title'}
                  description={
                    'Duplicate title tags are bad for SEO. They confuse search engines and make it harder to rank for specific keywords.'
                  }
                />
                <Card
                  correct={seoDetails['countDuplicateDesciption'] === 0}
                  title={'Duplicate Description'}
                  description={
                    'Duplicate meta descriptions are bad for SEO. They confuse search engines and make it harder to rank for specific keywords.'
                  }
                />
                <Card
                  correct={seoDetails['countDuplicateContent'] === 0}
                  title={'Duplicate Content'}
                  description={
                    'Duplicate content is bad for SEO. It confuses search engines and makes it harder to rank for specific keywords.'
                  }
                />
                <Card
                  correct={seoDetails['countBrokenResources'] === 0}
                  title={'Broken Resource'}
                  description={
                    'Your page has broken resources. This can negatively impact your page load speed and user experience.'
                  }
                />
                <Card
                  correct={seoDetails['countBrokenLinks'] === 0}
                  title={'Is Broken'}
                  description={
                    'Your page has broken links. This can negatively impact your page load speed and user experience.'
                  }
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
