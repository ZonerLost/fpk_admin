import React from "react";
import Pagination, { type PaginationProps } from "./Pagination";

export type TablePaginationProps = Omit<PaginationProps, "total"> & {
  totalItems: number;
};

const TablePagination: React.FC<TablePaginationProps> = ({
  totalItems,
  ...rest
}) => {
  return <Pagination {...rest} total={totalItems} />;
};

export default TablePagination;
