import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  tickets: null,
  fetchEnded: true,
  error: null,
  filters: {
    title: '',
    description: '',
    active: true,
    resolved: true
  },
  previousRoute: null
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setPreviousRoute(state, action) {
      state.previousRoute = { ...action.payload }
    },
    setFilters(state, action) {
      state.filters = { ...action.payload };
    },
    fetchStart(state) {
      state.fetchEnded = false;
    },
    fetchEnd(state) {
      state.fetchEnded = true;
    },
    setTickets(state, action) {
      state.tickets = action.payload;
    },
    setTicket(state, action) {
      const { id, ticketData } = action.payload;

      if (state.tickets) {
        state.tickets = state.tickets.map(ticket => ticket.id === id ? { ...ticket, ...ticketData } : ticket);
      }
    },
    addTicket(state, action) {
      if (state.tickets) {
        state.tickets = [...state.tickets, action.payload];
      }
    },
    removeTicket(state, action) {
      if (state.tickets) {
        state.tickets = state.tickets.filter(ticket => ticket.id !== action.payload);
      }
    },
    setError(state, action) {
      state.error = action.payload;
    }
  }
});

import { createSelector } from '@reduxjs/toolkit'

const ticketSelector = id => {
  return createSelector(
    state => state.app,
    state => {
      if (state.tickets) {
        const ticket = state.tickets.find(ticket => ticket.id === id);
  
        return { ticket }
      } else {
        return null;
      }
    }
  );
};

const filteredTickets = createSelector(
  state => state.app,
  state => {
    const tickets = state.tickets || [];

    const { title, description, active, resolved } = state.filters;
  
    function queryIntersection(arr1, arr2) {
      return arr1.filter(item => arr2.includes(item));
    }
  
    const haveIntersection = (datum, query) => {
      const datumTokens = datum.toLowerCase().split(' ');
      const queryTokens = query.toLowerCase().split(' ');
  
      return queryIntersection(datumTokens, queryTokens).length > 0;
    }
  
    let intersection = tickets;
  
    intersection = title ? intersection.filter(ticket => haveIntersection(ticket.title, title)) : intersection;
    intersection = description ? intersection.filter(ticket => haveIntersection(ticket.description, description)) : intersection;
  
    let union = [];
  
    union = active ? union.concat(intersection.filter(item => item.status === 'active')) : union;
    union = resolved ? union.concat(intersection.filter(item => item.status === 'resolved')) : union;
  
    return union;
  }
)

const {
  setFilters,
  setPreviousRoute,
  setTicket,
  setTickets,
  addTicket,
  removeTicket,
  setError,
  fetchStart,
  fetchEnd
} = appSlice.actions

import axios from 'axios'

function fetchOperation(url, {
  options,
  onSuccess,
  onError,
  transformResponse
}) {
  return async (dispatch, getState) => {
    const opts = options || {};
    const onsuccess = onSuccess || (() => { });
    const errorhandler = onError || (err => { throw err })
    const transform = transformResponse || (res => res);

    let res = {};

    try {
      dispatch(fetchStart());

      res = await axios(url, opts);
      res = transform(res);

      onsuccess(res, { dispatch, getState });
    } catch (err) {
      dispatch(fetchEnd());

      errorhandler(err);
    }

    dispatch(fetchEnd());

    return res;
  };
}

function fetchTickets() {
  return async (dispatch, getState) => {
    return await dispatch(fetchOperation("/api/tickets", {
      transformResponse: res => res.data,
      onSuccess:  (data, { dispatch, getState }) => {
        dispatch(setTickets(data))
      }
    }));
  };
}

function fetchTicket(id) {
  return async (dispatch, getState) => {
    return await dispatch(fetchOperation(`/api/tickets/${id}`, {
      transformResponse: res => res.data
    }));
  };
}

function createTicket(ticket) {
  return async (dispatch, getState) => {
    return await dispatch(fetchOperation('/api/tickets', {
      options: {
        method: 'POST',
        data: JSON.stringify(ticket),
        headers: {
          "Content-type": 'application/json'
        }
      },
      transformResponse: res => res.data,
      onSuccess: (data, { dispatch, getState }) => {
        dispatch(addTicket(data))
      }
    }));
  };
}

function updateTicket({ id, ticketData }) {
  return async (dispatch, getState) => {
    return await dispatch(fetchOperation(`/api/tickets/${id}`, {
      options: {
        method: 'PUT',
        data: JSON.stringify(ticketData),
        headers: {
          'Content-type': 'application/json'
        }
      },
      transformResponse: res => res.data,
      onSuccess: (data, { dispatch, getState }) => {
        dispatch(setTicket({ id, ticketData: data }));
      }
    }));
  };
}

function deleteTicket(id) {
  return async (dispatch, getState) => {
    return await dispatch(fetchOperation(`/api/tickets/${id}`, {
      options: {
        method: 'DELETE',
      },
      transformResponse: res => res,
      onSuccess: (data, { dispatch, getState }) => {
        dispatch(removeTicket(id));
      }
    }));
  };
}

function addComment({ ticketId, comment }) {
  return async(dispatch, getState) => {
    const v = 10;

    const ticketToUpdate = await dispatch(fetchTicket(ticketId));
    const newTicket = { ...ticketToUpdate, comments: [...ticketToUpdate.comments, comment] }

    return await dispatch(updateTicket({ id: ticketId, ticketData: newTicket }));
  };
}

function setTicketStatus({ ticketId, newStatus }) {
  return async (dispatch, getState) => {
    const ticketToUpdate = await dispatch(fetchTicket(ticketId));
    const newTicket = { ...ticketToUpdate, status: newStatus };

    return await dispatch(updateTicket({
      id: ticketId,
      ticketData: newTicket
    }));
  };
}

function fetchFile(id) {
  return async (dispatch, getState) => {
    return await dispatch(fetchOperation(`/api/files/${id}`, {
      transformResponse: res => res.data
    }));
  };
}

function fetchFileByUrl(url) {
  return async (dispatch, getState) => {
    return await dispatch(fetchOperation(url, {
      transformResponse: res => res.data
    }));
  };
}

function uploadFile(file) {
  return async (dispatch, getState) => {
    return await dispatch(fetchOperation('/api/files', {
      transformResponse: res => res.data,
      options: {
        method: 'POST',
        data: JSON.stringify(file),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    }));
  };
}



export {
  setFilters,
  setPreviousRoute,
  setTicket,
  setTickets,
  addTicket,
  removeTicket,
  setError,
  fetchOperation,
  fetchTicket,
  fetchTickets,
  fetchFile,
  fetchFileByUrl,
  uploadFile,
  createTicket,
  updateTicket,
  deleteTicket,
  addComment,
  setTicketStatus,
  ticketSelector,
  filteredTickets
}

export default appSlice.reducer