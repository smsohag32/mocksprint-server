interface PaginationParams {
   page: number | string;
   limit: number | string;
   totalElements: number;
}

export const buildPaginationResponse = (
   content: any[],
   { page, limit, totalElements }: PaginationParams,
   message = "List fetched successfully"
) => {
   const currentPage = Number(page) || 0;
   const pageSize = Number(limit) || 10;
   const totalPages = Math.ceil(totalElements / pageSize);

   return {
      status: "success",
      message,
      statusCode: 200,
      data: {
         content,
         pagination: {
            currentPage,
            pageSize,
            totalElements,
            totalPages,
            first: currentPage === 1,
            last: currentPage === totalPages || totalPages === 0,
            hasNext: currentPage < totalPages,
            hasPrevious: currentPage > 1,
         },
      },
   };
};
