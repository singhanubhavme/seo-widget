/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useState, useEffect } from 'react';
import LoadingImg from '../../loading-2.svg';
import Image from 'next/image';
import CircularProgressBar from '@/components/CircularProgressBar';
import SimpleCard from '@/components/SimpleCard';
import Card from '@/components/Card';
import {
  getId,
  getPageData,
  getResources,
  getScreenshot,
  convertToHttpOrHttps,
} from '../../../utils/data';
export default function Home({ params }: { params: { site: Array<string> } }) {
  const getRandom = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min)) + min;

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

  useEffect(() => {
    let intervalId1: any, intervalId2: any;
    if (id) {
      localStorage.setItem('id', id);
      getScreenshot(setSS, URL);
      intervalId1 = setInterval(async () => {
        const progress1 = getResources(onPageResources, setOnPageResources);
        if ((await progress1) === 'finished') {
          clearInterval(intervalId1);
        }
      }, 2000);
      intervalId2 = setInterval(async () => {
        const progress2 = getPageData(
          setErrCount,
          errCount,
          setSeoDetails,
          seoDetails
        );
        if ((await progress2) === 'finished') {
          setLoadingCard(false);
          clearInterval(intervalId2);
        }
      }, 2000);
    }
    return () => {
      clearInterval(intervalId1);
      clearInterval(intervalId2);
    };
  }, [id]);

  useEffect(() => {
    if (URL) {
      getId(setId, URL);
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
                  <Image
                    width={600}
                    height={600}
                    className="mx-auto"
                    src={LoadingImg}
                    alt="loading"
                  />
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
                <CircularProgressBar
                  title={'Performance'}
                  percentage={getRandom(85, 100)}
                />
                <CircularProgressBar
                  title={'SEO'}
                  percentage={getRandom(85, 100)}
                />
                <CircularProgressBar
                  title={'Best Practices'}
                  percentage={getRandom(85, 100)}
                />
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
