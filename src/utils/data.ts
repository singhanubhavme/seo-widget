import axios from 'axios';
import { SetStateAction } from 'react';
export async function getId(setId: {
  (value: SetStateAction<string>): void;
  (arg0: any): void;
}) {
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

export async function getPageData(
  setErrCount: {
    (value: SetStateAction<number>): void;
    (arg0: { (errCount: any): any; (errCount: any): any }): void;
  },
  errCount: number,
  setSeoDetails: (arg0: any) => void,
  seoDetails: any
) {
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
        setErrCount((errCount: number) => errCount + 1);
      }
      if (item.broken_resources) {
        countBrokenResources++;
        setErrCount((errCount: number) => errCount + 1);
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

export async function getResources(
  onPageResources: any,
  setOnPageResources: (arg0: any) => void
) {
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

export async function getScreenshot(setSS: {
  (value: SetStateAction<string>): void;
  (arg0: any): void;
}) {
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

export function convertToHttpOrHttps(url: string) {
  return url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('https%3A')
    ? url
    : `https://${url}`;
}
