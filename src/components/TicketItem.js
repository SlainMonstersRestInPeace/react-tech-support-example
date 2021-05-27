import React from 'react'

import { Link } from 'react-router-dom'

import classNames from 'classnames'
import styled from 'styled-components'

const StyledLink = styled(Link)`
text-decoration: none;

&:hover {
  text-decoration: none;
}
`;

const TicketDescription = styled.p`
max-height: 48px;
line-height: 24px;
color: #7b7b7b;
overflow-wrap: anywhere;
`;

export default ({ ticket }) => {
  const badgeClass = classNames({
    'bg-danger': ticket.status === 'active',
    'bg-success': ticket.status === 'resolved',
  })

  return (
    <>
      <StyledLink className="text-dark mr-auto d-flex flex-row" to={`/ticket/${ticket.id}`}>
        <h5 className="d-flex justify-content-between w-100">
          <span className="ticket-title">{ticket.title}</span>
          <span className={`badge text-white ${badgeClass}`}>{ticket.status}</span>
        </h5>
      </StyledLink>
      <TicketDescription className="ticket-description m-0 overflow-hidden">
        {ticket.description}
      </TicketDescription>
    </>
  );
}
