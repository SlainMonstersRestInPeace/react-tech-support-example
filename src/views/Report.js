import React from 'react'

import CreateTicket from '../components/CreateTicket'

import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { createTicket, fetchTickets } from '../redux/reducers/app'

export default () => {
  const tickets = useSelector(state => state.app.tickets);

  const dispatch = useDispatch();

  async function createNewTicket(ticket) {
    await dispatch(createTicket(ticket));
  }

  useEffect(() => {
    if (!tickets) {
      dispatch(fetchTickets());
    }
  }, []);

  return (
    <CreateTicket createTicketHandler={createNewTicket} />
  );
}