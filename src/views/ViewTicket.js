import React, { useEffect } from 'react'

import { ticketSelector, fetchFileByUrl, fetchTickets, addComment, setTicketStatus } from '../redux/reducers/app'
import { useDispatch, useSelector } from 'react-redux'

import { useForm } from 'react-hook-form'

import TicketNotFound from '../components/TicketNotFound'
import CommentCard from '../components/CommentCard'
import { v4 as uuid } from 'uuid'

import { base64StringToBlob } from 'blob-util'
import { saveAs } from 'file-saver'

import classNames from 'classnames'

import styled from 'styled-components'
import { useParams, useHistory } from 'react-router-dom'

const FileLink = styled.a`
text-decoration: none;

&:hover {
  text-decoration: underline;
}
`;

const Badge = styled.span`
cursor: pointer;
`;

const TicketDescription = styled.p`
overflow-wrap: anywhere;
`

export default () => {
  const history = useHistory();
  const { id } = useParams();

  const ticket = useSelector(ticketSelector(+id));
  const ticketContent = getTicket();

  const tickets = useSelector(state => state.app.tickets);
  const fetchEnded = useSelector(state => state.app.fetchEnded);

  const { register, handleSubmit, getValues, setValue } = useForm({
    defaultValues: {
      'post-comment': ''
    }
  });

  const dispatch = useDispatch();

  function takeMeBack() {
    history.goBack();
  }

  async function saveFile(e) {
    e.preventDefault();

    const file = await dispatch(fetchFileByUrl(e.target.href));
    const fileBlob = base64StringToBlob(file.data);

    saveAs(fileBlob, file.name);
  }

  async function toggleStatus() {
    const newStatus = ticketContent.status === 'active' ? 'resolved' : 'active';

    await dispatch(setTicketStatus({ ticketId: ticketContent.id, newStatus }));
  }

  async function postComment() {
    await dispatch(addComment({
      ticketId: ticketContent.id,
      comment: {
        text: getValues('comment-text'),
        time: Date()
      }
    }));

    setValue('comment-text', '');
  }

  async function created() {
    if (!tickets) {
      await dispatch(fetchTickets());
    }
  }

  function getTicket() {
    if (ticket) {
      if (ticket.ticket) {
        const fileUrls = ticket.ticket.files.map(file => ({
          name: file.name,
          url: `/api/files/${file.id}`
        }));

        return {
          ...ticket.ticket,
          fileUrls
        }
      }
    } else {
      return {}
    }

    return null;
  }

  useEffect(() => {
    created();
  }, []);

  return (
    <Choose>
      <When condition={ticketContent}>
        <If condition={tickets}>
          <h2>
            <span className="mr-2">
              {ticketContent.title}
            </span>
            <Badge className={`badge text-white ${classNames({
              'bg-danger': ticketContent.status === 'active',
              'bg-success': ticketContent.status === 'resolved',
            })}`} onClick={toggleStatus}>
              {ticketContent.status}
            </Badge>
          </h2>
          <hr />
          <h5>Description</h5>
          <TicketDescription className="ticket-description overflow-hidden">
            {ticketContent.description}
          </TicketDescription>
          <hr />
          {
            ticketContent.comments.map((comment, i) => {
              return <CommentCard key={uuid()} comment={comment} number={i+1}/>
            })
          }
          <Choose>
            <When condition={ticketContent.status === 'active'}>
              <If condition={ticketContent.comments.length}>
                <hr />
              </If>
              <form onSubmit={handleSubmit(postComment)}>
                <textarea className="form-control mb-3" id={`post-comment-${ticketContent.id}`} name="post-comment" required aria-label="ticket comment text" placeholder="Your comment" {...register('comment-text')} />
                <div className="d-flex flex-row">
                  <button type="submit" className={`btn btn-success mr-auto ${classNames({
                    disabled: !fetchEnded
                  })}`} onClick={postComment}>Post comment</button>
                  <button type="button" className="btn btn-warning" onClick={takeMeBack}>Take Me Back</button>
                </div>
              </form>
            </When>
            <Otherwise>
              <button type="button" className="btn btn-warning" onClick={takeMeBack}>Take me back</button>
            </Otherwise>
          </Choose>
          <If condition={ticketContent.fileUrls.length}>
            <h4>Attached Files</h4>
            <ul className="list-unstyled m-0">
              {
                ticketContent.fileUrls.map((file, i) => {
                  return (
                    <li key={uuid()}>
                      <FileLink className="file-link" href={file.url} onClick={saveFile}>
                        {file.name}
                      </FileLink>
                    </li>
                  );
                })
              }
            </ul>
          </If>
        </If>
      </When>
      <Otherwise>
        <TicketNotFound />
      </Otherwise>
    </Choose>
  )
}