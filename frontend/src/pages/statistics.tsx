import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { PageHeader } from '@layouts/page-header/page-header.component';
import { Spinner, Table, SortMode, Select, Input, Pagination } from '@sk-web-gui/react';
import { useStatistics } from '@services/statistics-service';
import React from 'react';
import { Statistics } from '@interfaces/statistics.interface';
export const StatisticsPage = () => {
  const { departmentStatistics, loaded } = useStatistics();
  const [sortColumn, setSortColumn] = React.useState<string>('department');
  const [sortOrder, setSortOrder] = React.useState(SortMode.ASC);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [_pageSize, setPageSize] = React.useState<number>(12);
  const handleSorting = (column: string) => {
    if (sortColumn !== column) {
      setSortColumn(column);
    } else {
      setSortOrder(sortOrder === SortMode.ASC ? SortMode.DESC : SortMode.ASC);
    }
  };

  const getDeepColumn = (column: string, object: Statistics) => {
    const columns = column.split('.');
    let value = object;
    columns.forEach((col) => {
      if (value && value[col]) {
        value = value[col];
      } else {
        value[col] = 0;
        value = value[col];
      }
    });
    return value;
  };

  const tableRows = departmentStatistics
    .sort((a, b) => {
      const order = sortOrder === SortMode.ASC ? -1 : 1;
      return getDeepColumn(sortColumn, a) < getDeepColumn(sortColumn, b)
        ? order
        : getDeepColumn(sortColumn, a) > getDeepColumn(sortColumn, b)
        ? order * -1
        : 0;
    })
    .slice((currentPage - 1) * _pageSize, currentPage * _pageSize)
    .map((statistics, idx: number) => {
      return (
        <Table.Row key={`row-${idx}`}>
          <Table.HeaderColumn scope="row">{statistics.department}</Table.HeaderColumn>
          <Table.Column>{statistics.snailMail?.sent ? statistics.snailMail?.sent : 0}</Table.Column>
          <Table.Column>{statistics.digitalMail?.sent ? statistics.digitalMail?.sent : 0}</Table.Column>
        </Table.Row>
      );
    });

  return !loaded ? (
    <Spinner />
  ) : (
    <DefaultLayout
      title={`Postportal`}
      pageheader={
        <PageHeader color="vattjom">
          <h2 className="pb-8">Statistik</h2>
          <p className="text-h4-medium md:text-lead leading-lead text-primary font-bold m-0 header-font">
            Här hittar du statistik över skickad post.
          </p>
        </PageHeader>
      }
    >
      <div className="max-w-full mb-80">
        <Table background={true}>
          <Table.Header className="bg-white">
            <Table.HeaderColumn
              className="bg-background-color-mixin-1"
              aria-sort={sortColumn === 'department' ? sortOrder : 'none'}
            >
              <Table.SortButton
                isActive={sortColumn === 'department'}
                sortOrder={sortOrder}
                onClick={() => handleSorting('department')}
              >
                Förvaltning
              </Table.SortButton>
            </Table.HeaderColumn>
            <Table.HeaderColumn
              className="bg-background-color-mixin-1"
              aria-sort={sortColumn === 'snailMail.sent' ? sortOrder : 'none'}
            >
              <Table.SortButton
                isActive={sortColumn === 'snailMail.sent'}
                sortOrder={sortOrder}
                onClick={() => handleSorting('snailMail.sent')}
              >
                Skickad fysisk post (antal)
              </Table.SortButton>
            </Table.HeaderColumn>
            <Table.HeaderColumn
              className="bg-background-color-mixin-1"
              aria-sort={sortColumn === 'digitalMail.sent' ? sortOrder : 'none'}
            >
              <Table.SortButton
                isActive={sortColumn === 'digitalMail.sent'}
                sortOrder={sortOrder}
                onClick={() => handleSorting('digitalMail.sent')}
              >
                Skickad digital post (antal)
              </Table.SortButton>
            </Table.HeaderColumn>
          </Table.Header>
          <Table.Body>
            {tableRows.map((row) => {
              return row;
            })}
          </Table.Body>

          {departmentStatistics.length > 12 && (
            <Table.Footer>
              <div className="sk-table-bottom-section sk-table-pagination-mobile">
                <label className="sk-table-bottom-section-label" htmlFor="paginationSelect">
                  Sida:
                </label>
                <Select
                  id="paginationSelect"
                  size="sm"
                  value={currentPage.toString()}
                  onSelectValue={(value: string) => setCurrentPage(parseInt(value, 10))}
                >
                  {[...Array.from(Array(Math.ceil(departmentStatistics.length / _pageSize)).keys())].map((page) => (
                    <Select.Option key={`pagipage-${page}`} value={(page + 1).toString()}>
                      {page + 1}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div className="sk-table-bottom-section">
                <div className="sk-table-paginationwrapper">
                  <Pagination
                    className="sk-table-pagination"
                    pages={Math.ceil(departmentStatistics.length / _pageSize)}
                    activePage={currentPage}
                    showConstantPages
                    pagesAfter={1}
                    pagesBefore={1}
                    changePage={(page: number) => setCurrentPage(page)}
                    fitContainer
                  />
                </div>
              </div>

              <div className="sk-table-bottom-section">
                <label className="sk-table-bottom-section-label" htmlFor="pagiPageSize">
                  Rader per sida:
                </label>
                <Input
                  hideExtra={false}
                  size="sm"
                  id="pagePageSize"
                  type="number"
                  min={1}
                  max={100}
                  className="max-w-[6.5rem]"
                  value={`${_pageSize}`}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    event.target.value && setPageSize(parseInt(event.target.value))
                  }
                />
              </div>
            </Table.Footer>
          )}
        </Table>
      </div>
    </DefaultLayout>
  );
};

export default StatisticsPage;
