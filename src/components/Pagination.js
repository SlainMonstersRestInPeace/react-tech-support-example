import React from 'react'

import { v4 as uuid } from 'uuid'

import { NavLink } from 'react-router-dom'

import classNames from 'classnames'

const PAGES_EITHER_SIDE = 4;
const MAX_PAGES = PAGES_EITHER_SIDE * 2 + 1;

export default React.memo(({ page, totalPages }) => {
  const pages = Math.min(MAX_PAGES, totalPages); 
  const lowerPage = (() => {
    const minLower = Math.max(page - PAGES_EITHER_SIDE, 0);
    const maxLower = Math.max(0, Math.min(minLower, totalPages - MAX_PAGES));

    return maxLower;
  })();

  const currentUrl = `/tickets?page=${page}`;
  const backUrl = page > 0 ? `/tickets?page=${page - 1}` : currentUrl;
  const fwdUrl = page < totalPages - 1 ? `/tickets?page=${page + 1}` : currentUrl;

  const links = Object.keys(Array(pages).fill()).map((pgn, i) => {
    const active = classNames({
      active: page === lowerPage + i
    });

    return (
      <li key={uuid()} className={`page-item ${active}`}>
        <NavLink className="page-link" to={`/tickets?page=${lowerPage + i}`}>
          {lowerPage + i + 1}
        </NavLink>
      </li>
    );
  });

  return (
    <If condition={totalPages > 1}>
      <div className="d-flex flex-row justify-content-center">
        <nav>
          <ul className="pagination">
            <li className="page-item">
              <NavLink className="page-link" to={backUrl}>&lt;</NavLink>
            </li>
            {links}
            <li className="page-item">
              <NavLink className="page-link" to={fwdUrl}>&gt;</NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </If>
  );
})