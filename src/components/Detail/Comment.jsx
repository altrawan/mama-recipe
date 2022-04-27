import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { Form, FormGroup } from 'reactstrap';
import jwt_decode from 'jwt-decode';
import toastr from '../../utils/toastr';
import { createComment } from '../../store/actions/comment';
import { useDispatch } from 'react-redux';
import { getListComment } from '../../store/actions/comment';

const Section = styled.section`
  margin: 0 auto;
  margin-top: 40px;
  max-width: 900px;
`;

const Textarea = styled.textarea`
  background-color: #f6f5f4;
  border: none;
  font-family: 'Airbnb Cereal App Medium';
  border-radius: 10px;
  color: #666666;
  height: 350px;

  @media screen and (max-width: 576px) {
    height: 200px;
  }
`;

const Button = styled.button`
  width: 35%;
  height: 50px;
  border: 0;
  border-radius: 7px;
  background-color: #efc81a;
  color: #ffffff;
  margin: 30px 0 10px 0;

  &:hover {
    background-color: #cea905;
    box-shadow: var(--shadow-black-300);
  }

  @media screen and (max-width: 576px) {
    width: 60%;
  }
`;

const Profile = styled.img`
  max-width: 65px;
  min-width: 65px;
  max-height: 65px;
  min-height: 65px;
  object-fit: cover;
  object-position: center;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 20px;
`;

const Detail = styled.div`
  margin: 0 auto;
  margin-top: 40px;
  max-width: 900px;
`;

const Item = styled.h3`
  font-family: 'Airbnb Cereal App Medium';
  color: var(--color-3);
  margin-bottom: 20px;
`;

function Comment({ loading, comments }) {
  const token = localStorage.getItem('token');
  const { id } = useParams();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const input = useRef(null);
  const [comment, setComment] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const decoded = jwt_decode(token);
    const body = {
      user_id: decoded.id,
      recipe_id: id,
      comment_text: comment
    };

    createComment(body)
      .then(() => {
        input.current.value = '';
        dispatch(getListComment(id));
      })
      .catch((err) => {
        if (err.response.status === 422) {
          const error = err.response.data.errors;
          error.map((e) => toastr(e));
        } else {
          toastr(err.response.data.message);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Section>
        <Form onSubmit={onSubmit}>
          <FormGroup>
            <Textarea
              className="form-control px-4 py-4"
              placeholder="Comment :"
              style={{
                backgroundColor: '#f6f5f4',
                border: 'none',
                outline: 'none',
                boxShadow: 'none'
              }}
              ref={input}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="d-flex justify-content-center">
              {isLoading ? (
                <Button type="submit" disabled>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  />
                </Button>
              ) : (
                <Button type="submit">Send</Button>
              )}
            </div>
          </FormGroup>
        </Form>
      </Section>
      <Detail>
        <Item>Comment</Item>
        {loading ? (
          <div>Loading</div>
        ) : (
          comments.data.map((e, i) => (
            <div className="d-flex align-items-center mb-3" key={i}>
              {e.photo ? (
                <Profile
                  src={`${
                    process.env.REACT_APP_STAGING === 'dev'
                      ? `${process.env.REACT_APP_DEV}uploads/user/${e.photo}`
                      : `${process.env.REACT_APP_PROD}uploads/user/${e.photo}`
                  }`}
                  alt={e.name}
                  className="rounded-circle"
                />
              ) : (
                <Profile
                  src={`${
                    process.env.REACT_APP_STAGING === 'dev'
                      ? `${process.env.REACT_APP_DEV}uploads/user/avatar.webp`
                      : `${process.env.REACT_APP_PROD}uploads/user/avatar.webp`
                  }`}
                  alt={e.name}
                  className="rounded-circle"
                />
              )}
              <Info className="h-100">
                <h6>{e.name}</h6>
                <span>{e.comment_text}</span>
              </Info>
            </div>
          ))
        )}
      </Detail>
    </>
  );
}

export default Comment;
