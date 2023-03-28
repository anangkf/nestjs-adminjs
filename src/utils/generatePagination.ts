import { NotFoundException } from '@nestjs/common';

interface GeneratePaginationParams {
  page: number;
  limit: number;
  dataLength: number;
  url: string;
}

interface GeneratePaginationReturn {
  previous: string | null;
  next: string | null;
}

export const generatePagination = ({
  page,
  limit,
  dataLength,
  url,
}: GeneratePaginationParams): GeneratePaginationReturn => {
  let previous: string;
  let next: string;

  const maxPage = Math.ceil(dataLength / limit);
  page = Number(page);
  const isLimitExist = url.match(/limit=\d/g);

  // generate link to previous page
  switch (page) {
    case 1:
      previous = null;
      break;
    case 2:
      // previous = url;
      previous = isLimitExist
        ? url.replace(/&?page=\d+&?/g, '')
        : url.replace(/\?page=\d+&?/g, '');
      break;
    default:
      previous = url.replace(/page=\d+/g, `page=${Number(page) - 1}`);
  }

  // generate link to next page
  switch (true) {
    case page === maxPage:
      next = null;
      break;
    case page === 1:
      next = isLimitExist ? `${url}&page=2` : `${url}?page=2`;
      break;
    case page > maxPage:
      throw new NotFoundException('Page Not Found');
    default:
      next = url.replace(/page=\d+/g, `page=${Number(page) + 1}`);
  }

  return { previous, next };
};
