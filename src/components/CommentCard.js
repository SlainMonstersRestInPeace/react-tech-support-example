import React from 'react'

import styled from 'styled-components'

const StyledComment = styled.div`
border-radius: 4px;

.comment-text {
  background: white;
  border-radius: 4px;
  color: #3b3b3b;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 100%;
  background: #dedede
}
`;

export default ({ comment, number }) => {
  return (
    <StyledComment className="comment mb-3 row">
      <div className="col-10">
        <div className="card">
          <div className="card-body row">
            <div className="col-lg-2 col-12">
              <div className="avatar" />
            </div>
            <div className="col-lg-10 col-12">
              <h5 className="card-subtitle mb-2" >
              user comment &#35;{number}
              </h5>
              <div className="comment-text">
                {comment.text}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledComment>
  );
}