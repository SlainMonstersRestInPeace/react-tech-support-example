import React from 'react'

import {
  Switch,
  Route,
  Redirect
} from 'react-router-dom'

import Tickets from './Tickets'
import ViewTicket from './ViewTicket'
import Report from './Report'
import NotFound from './NotFound'

import Navigation from '../components/Navigation'

import styled from 'styled-components'

const MainPanel = styled.div`
background: #FAFAFA;
`;

const SideBar = styled.div`
background: #6D7FCC;
`

export default () => {
  return (
    <div className="container">
      <div className="row no-gutters">
        <MainPanel className="col-8 p-2">
          <Switch>
            <Redirect exact from='/' to='/tickets' />
            <Route exact path="/tickets" component={Tickets} />
            <Route exact path="/ticket/:id" component={ViewTicket} />
            <Route exact path="/report" component={Report} />
            <Route component={NotFound} />
          </Switch>
        </MainPanel>
        <SideBar className="col-4">
          <Navigation />
        </SideBar>
      </div>
    </div>
  )
}