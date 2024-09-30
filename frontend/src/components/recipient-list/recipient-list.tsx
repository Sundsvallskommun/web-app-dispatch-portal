import {
  mapRecipientError,
  mapRecipientErrorToColor,
  RecipientWithAddress,
  useMessageStore
} from '@services/recipient-service';
import { Table, Label, RadioButton, SortMode, Input, Pagination, Select } from '@sk-web-gui/react';
import React, { useState } from 'react';
import Button from "@sk-web-gui/button";

export const RecipientList: React.FC = () => {
  const masked = (s: string) => s.slice(0, s.length - 4) + 'xxxx';
  const recipients = useMessageStore((state) => state.recipients);
  const setRecipients = useMessageStore((state) => state.setRecipients);
  const [filter, setFilter] = useState<string>('all');

  const [_pageSize, setPageSize] = React.useState<number>(12);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [sortColumn, setSortColumn] = React.useState<string>("address.lastname");
  const [sortOrder, setSortOrder] = React.useState(SortMode.ASC);
  const [totalPages, setTotalPages] = React.useState(recipients.length);
  const validRecipientLength = recipients.filter((rec) => !rec?.error).length;
  const invalidRecipientLength = recipients.filter((rec) => rec?.error).length;

  const handleSorting = (column: string) => {
    if (sortColumn !== column) {
      setSortColumn(column);
    } else {
      setSortOrder(sortOrder === SortMode.ASC ? SortMode.DESC : SortMode.ASC);
    }
  };

  const getDeepColumn = (column: string, object: RecipientWithAddress) => {
    const columns = column.split(".");
    let value = object;
    columns.forEach(col => {
      if(value && value[col]) {
        value = value[col];
      } else {
        value = undefined
      }
    })
    return value
  }

  const handleRemoveOne = (personNumber: string) => {
    const result = recipients.filter((recipient) => personNumber !== recipient.recipient.personnumber)
    setRecipients(result);
  }

  return (
    <div className="w-full">
      {recipients.length > 1 && (
        <RadioButton.Group value={filter} size="md" inline className="flex-wrap pb-16">
          <RadioButton value="all" onChange={() => {
            setFilter("all");
            setTotalPages(recipients.length);
          }}>
            Alla ({recipients.length})
          </RadioButton>
          <RadioButton value="valid" onChange={() => {
            setFilter("valid");
            setTotalPages(validRecipientLength);
          }}>
            Giltiga ({validRecipientLength})
          </RadioButton>
          <RadioButton value="invalid" onChange={() => {
            setFilter("invalid");
            setTotalPages(invalidRecipientLength);
          }}>
            Ogiltiga ({invalidRecipientLength})
          </RadioButton>
        </RadioButton.Group>
     )}

      <Table background={true}>
        <Table.Header className="bg-white">
          <Table.HeaderColumn className="bg-background-color-mixin-1" aria-sort={sortColumn === 'recipient.personnumber' ? sortOrder : 'none'}>
            {recipients.length > 1 ? (<Table.SortButton isActive={sortColumn === 'recipient.personnumber'} sortOrder={sortOrder} onClick={() => handleSorting('recipient.personnumber')}>
              Personnummer
            </Table.SortButton>) : (<>Personnummer</>)}
          </Table.HeaderColumn>

          <Table.HeaderColumn className="bg-background-color-mixin-1" aria-sort={sortColumn === "address.lastname" ? sortOrder : 'none'}>
            {recipients.length > 1 ? (<Table.SortButton isActive={sortColumn === "address.lastname"} sortOrder={sortOrder} onClick={() => handleSorting("address.lastname")}>
              Namn
            </Table.SortButton>) : (<>Namn</>)}
          </Table.HeaderColumn>

          <Table.HeaderColumn className="bg-background-color-mixin-1" aria-sort={sortColumn === 'address.addresses.0.address' ? sortOrder : 'none'}>
            {recipients.length > 1 ? (<Table.SortButton isActive={sortColumn === 'address.addresses.0.address'} sortOrder={sortOrder} onClick={() => handleSorting('address.addresses.0.address')}>
              Adress
            </Table.SortButton>) : (<>Adress</>)}
          </Table.HeaderColumn>

          <Table.HeaderColumn className="bg-background-color-mixin-1" aria-sort={sortColumn === 'error' ? sortOrder : 'none'}>
            {recipients.length > 1 ? (<Table.SortButton isActive={sortColumn === 'error'} sortOrder={sortOrder} onClick={() => handleSorting('error')}>
              Status
            </Table.SortButton>) : (<>Status</>)}
          </Table.HeaderColumn>
          <Table.HeaderColumn className="bg-background-color-mixin-1"></Table.HeaderColumn>
        </Table.Header>

        <Table.Body>
          {recipients.sort((a, b) => {
            const order = sortOrder === SortMode.ASC ? -1 : 1;
            if(sortColumn === "error") {
              const aError = a.error ? mapRecipientError(a.error) : "Giltig";
              const bError = b.error ? mapRecipientError(b.error) : "Giltig";
              return aError < bError ? order : aError > bError ? order * -1 : 0;
            } else {
              return getDeepColumn(sortColumn, a) < getDeepColumn(sortColumn, b) ? order : getDeepColumn(sortColumn, a) > getDeepColumn(sortColumn, b) ? order * -1 : 0;
            }
          }).filter((recipient) => {
            switch (filter) {
              case 'valid':
                return !recipient.error;
              case 'invalid':
                return recipient.error;
              default:
                return true;
            }
          }).slice((currentPage - 1) * _pageSize, currentPage * _pageSize).map((d, idx) => (
            <Table.Row key={`row-${idx}`}>
              <Table.Column>{masked(d.recipient.personnumber)}</Table.Column>
              <Table.Column>{<span>{d.address?.lastname && d.address?.givenname ? `${d.address?.lastname}, ${d?.address?.givenname}` : ''}</span>}</Table.Column>
              <Table.Column>{d.address?.addresses?.length > 0 ? (
            <span>
              {d?.address?.addresses[0]?.address}{d?.address?.addresses[0]?.addressLetter},{' '}
              {d?.address?.addresses[0]?.postalCode} {d?.address?.addresses[0]?.city}{' '}
              {d?.address?.addresses[0]?.country}
            </span>
              ) : (
                <></>
              )}
              </Table.Column>
              <Table.Column>
                {d.error ? (
                  <Label color={mapRecipientErrorToColor(d.error)} rounded inverted>
                    {mapRecipientError(d.error)}
                  </Label>
                ) : (
                  <Label color="gronsta" rounded inverted>
                    Giltig
                  </Label>
                )}
              </Table.Column>
              <Table.Column>
                <Button size="sm" onClick={() => handleRemoveOne(d?.recipient.personnumber)}>
                  Ta bort
                </Button>
              </Table.Column>
            </Table.Row>
          ))}
        </Table.Body>

        {recipients.length > 12 &&
          (<Table.Footer>
            <div className="sk-table-bottom-section">
              <div className="sk-table-bottom-section sk-table-pagination-mobile">
                <label className="sk-table-bottom-section-label" htmlFor="paginationSelect">
                  Sida:
                </label>
                <Select id="paginationSelect" size="sm" value={currentPage.toString()}
                        onSelectValue={(value: string) => setCurrentPage(parseInt(value, 10))}>
                  {[...Array.from(Array(Math.ceil(totalPages / _pageSize)).keys())].map(page => <Select.Option
                    key={`pagipage-${page}`} value={(page + 1).toString()}>
                    {page + 1}
                  </Select.Option>)}
                </Select>
              </div>

              <div className="sk-table-paginationwrapper">
                <Pagination className="sk-table-pagination" pages={Math.ceil(totalPages / _pageSize)}
                            activePage={currentPage} showConstantPages pagesAfter={1} pagesBefore={1}
                            changePage={(page: number) => setCurrentPage(page)} fitContainer/>
              </div>
            </div>

            <div className="sk-table-bottom-section">
              <label className="sk-table-bottom-section-label" htmlFor="pagiPageSize">
                Rader per sida:
              </label>
              <Input hideExtra={false} size="sm" id="pagePageSize" type="number" min={1} max={100}
                     className="max-w-[6.5rem]" value={`${_pageSize}`}
                     onChange={(event: React.ChangeEvent<HTMLInputElement>) => event.target.value && setPageSize(parseInt(event.target.value))}/>
            </div>
          </Table.Footer>)}
      </Table>
    </div>
  );
};
