import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router'

import SearchTicket from '../components/SearchTicket'
import TicketItem from '../components/TicketItem'
import Pagination from '../components/Pagination'

import { v4 as uuid } from 'uuid'
import { useDispatch, useSelector } from 'react-redux'
import { setFilters, filteredTickets, fetchTickets } from '../redux/reducers/app'

import queryString from 'query-string'

const ITEMS_PER_PAGE = 10;

export default () => {
  const history = useHistory();
  const location = useLocation();
  const { page } = queryString.parse(location.search, { parseNumbers: true });

  const dispatch = useDispatch();
  
  function validatePage(page) {
    return !isNaN(Number(page)) && page >= 0 && page <= totalPages - 1;
  }

  const tickets = useSelector(state => state.app.tickets);
  const filtered = useSelector(filteredTickets);
  const totalItems = (() => {
    if (tickets) {
      return filtered.length;
    }

    return 0;
  })();

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const pageNumber = validatePage(page) ? page : 0;
  const paginatedTickets = (() => {
    return filtered.slice(pageNumber * ITEMS_PER_PAGE, (pageNumber + 1) * ITEMS_PER_PAGE);
  })();

  async function created() {
    if (!tickets) {
      await dispatch(fetchTickets());
    }
  }

  useEffect(() => {
    created();
  }, []);

  function applyFilter(filters) {
    dispatch(setFilters(filters));

    history.push(`/tickets?page=0`);
  }

  const ticketElems = paginatedTickets.map((ticket, i) => {
    return (
      <li className="list-group-item" key={uuid()}>
        <TicketItem ticket={ticket}/>
      </li>
    )
  })

  return (
    <>
      <SearchTicket applyFilterHandler={applyFilter}/>
      <If condition={tickets}>
        <Choose>
          <When condition={filtered.length}>
            <ul className="list-group mb-3">
              {ticketElems}
            </ul>
          </When>
          <Otherwise>
            <div>No items for displaying!</div>
          </Otherwise>
        </Choose>
      </If>
      <Pagination page={pageNumber} totalPages={totalPages} />
    </>
  )
}