import React from 'react'
import { useSelector } from 'react-redux';
import { ticketSelector } from '../redux/reducers/app';

import { useParams } from 'react-router';

export default () => {
  const { id } = useParams();
  const tickets = useSelector(state => state.app.tickets)
  const ticket = useSelector(ticketSelector(+id));

  return (
    <If condition={tickets}>
      <a href="#">
        {ticket && ticket.ticket ? `ticket/${ticket.ticket.id}` : "ticket/error" }
      </a>
    </If>
  );
}