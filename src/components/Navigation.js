import React from 'react'

import styled from 'styled-components'

import { NavLink, Route, useRouteMatch, useLocation, Switch } from 'react-router-dom'

import TicketLink from '../components/TicketLink'
import NotFoundLink from '../components/NotFoundLink'

const Nav = styled.nav`
a {
  text-decoration: none;
  display: block;

  color: #FAFAFA;
  background: #7386D5;
  transition: 0.2s ease-out all;
  padding: 12px;
}

a:hover {
  color: #7386D5;
  background: white;
  text-decoration: none;
}
`;

export default () => {
  return (
    <Nav>
      <ul className="list-unstyled m-0">
        <li>
          <NavLink to="/report">Report issue</NavLink>
        </li>
        <li>
          <NavLink to="/tickets">Issues</NavLink>
        </li>
      </ul>
      <hr className="m-0" />
      <Switch>
        <Route path="/ticket/:id" component={TicketLink} />
        <Route path="/report" />
        <Route path="/tickets" />
        <Route component={NotFoundLink} />
      </Switch>
    </Nav>
  );
}