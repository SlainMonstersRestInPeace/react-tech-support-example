import React from 'react'

import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'

export default ({ applyFilterHandler }) => {
  const filters = useSelector(state => state.app.filters);

  const { register, handleSubmit, getValues } = useForm({
    defaultValues: {
      filters
    }
  });

  function onSubmit() {
    applyFilterHandler(getValues('filters'));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-3">
      <div className="d-flex flex-row">
        <div className="d-flex flex-row align-items-center mr-2">
          <label htmlFor="title" className="mb-0 mr-2">Title:</label>
          <input type="text" placeholder="type something..." name="title" id="title" className="form-control" {...register('filters.title')}/>
        </div>
        <div className="d-flex flex-row align-items-center mr-2">
          <label htmlFor="description" className="mb-0 mr-2">Description:</label>
          <input type="text" placeholder="type something..." name="description" id="description" className="form-control" {...register('filters.description')}/>
        </div>
        <button type="submit" className="btn btn-primary">Apply&nbsp;filter</button>
      </div>
      <div className="d-flex flex-row mt-2">
        <div className="form-check mr-2">
          <input type="checkbox" name="active" id="active" className="form-check-input" {...register('filters.active')} />
          <label htmlFor="active" className="form-check-label" >active</label>
        </div>
        <div className="form-check">
          <input type="checkbox" name="resolved" id="resolved" className="form-check-input" {...register('filters.resolved')}/>
          <label htmlFor="resolved" className="form-check-label" >resolved</label>
        </div>
      </div>
    </form>
  );
}