import React, { useRef } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom';

import { useForm } from 'react-hook-form'

import classNames from 'classnames'

import { uploadFile } from '../redux/reducers/app'

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function(e) {
      const binary = e.target.result;
      const base64 = btoa(binary);

      resolve(base64);
    }

    reader.onerror = error => reject(error);
    reader.readAsBinaryString(file);
  });
}

export default ({ createTicketHandler }) => {
  const file = useRef(null);
  const alertSuccess = useRef(null);
  const alertError = useRef(null);
  const history = useHistory();

  const { register, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      ticket: {
        title: '',
        description: ''
      }
    }
  });

  const fetchEnded = useSelector(state => state.app.fetchEnded);

  const dispatch = useDispatch();

  function showAlert(alert) {
    if (!alert.classList.contains('show')) {
      alert.classList.add('show');
      alert.style.zIndex = '100';
    }
  }

  function hideAlert(alert) {
    alert.classList.remove('show');
    alert.style.zIndex = '0';
  }

  function takeMeBack() {
    history.goBack();
  }

  async function onSubmit() {
    try {
      const files = file.current.files;
      const b64Data = await Promise.all([].map.call(files, async file => {
        return {
          name: file.name,
          data: await fileToBase64(file),
        }
      }));

      const uploadedFiles = [];

      for (let b64 of b64Data) {
        const file = await dispatch(uploadFile(b64));

        uploadedFiles.push({ id: file.id, name: file.name });
      }

      const ticket = getValues('ticket');

      createTicketHandler({ ...ticket, comments: [], status: 'active', files: uploadedFiles });

      setValue('ticket.title', '');
      setValue('ticket.description', '');
      files.value = '';

      showAlert(alertSuccess.current);
      hideAlert(alertError.current);
    } catch (err) {
      showAlert(alertError.current);
      hideAlert(alertSuccess.current);

      throw err;
    }
  }

  function handleCloseAlertSuccessClick(e) {
    hideAlert(alertSuccess.current);
  }

  function handleCloseAlertErrorClick(e) {
    hideAlert(alertError.current);
  }

  return (
    <form className="mb-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3 mx-auto">
        <label className="form-label" htmlFor="ticket-title">
          Ticket Title
        </label>
        <input type="text" required placeholder="State the problem here..." name="ticket-title" className="form-control" id="ticket-title" {...register('ticket.title')} />
      </div>
      <div className="mb-3 mx-auto">
        <label className="form-label" htmlFor="ticket-description">
          Ticket Description
        </label>
        <textarea type="text" required placeholder="Describe the problem" rows="5" name="ticket-description" className="form-control" id="ticket-description" {...register('ticket.description')} />
      </div>
      <div className="d-flex flex-row align-items-center mb-2">
        <label className="form-label mb-0 mr-2 flex-shrink-0" htmlFor="ticket-file">
          Attach files:
        </label>
        <input type="file" multiple name="ticket-file" className="form-control-file mr-auto" id="ticket-file" ref={file} />
        <button type="submit" className={`flex-shrink-0 btn btn-primary mr-2 ${classNames({
          disabled: !fetchEnded
        })}`}>Create Ticket</button>
        <button type="button" className="flex-shrink-0 btn btn-danger" onClick={takeMeBack}>Cancel</button>
      </div>
      <div className="alert-anchor position-relative">
        <div className="alert alert-success alert-dismissible fade m-0 position-absolute w-100" role="alert" ref={alertSuccess}>
            Your issue has been submited. You can go <a href="#" onClick={takeMeBack} className="alert-link">back</a>.
          <button type="button" aria-label="Close" className="close" onClick={handleCloseAlertSuccessClick}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="alert alert-danger alert-dismissible fade m-0" role="alert" ref={alertError}>
          There was an error trying to submit this issue.
          <button type="button" aria-label="Close" className="close" onClick={handleCloseAlertErrorClick}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
    </form>
  );
}
