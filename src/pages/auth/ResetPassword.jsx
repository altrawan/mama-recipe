import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import Swal from 'sweetalert';
import Banner from '../../components/Banner';
import { reset } from '../../store/actions/auth';
import AuthStyles from '../../assets/styles/AuthStyles';
import toastr from '../../utils/toastr';

function ChangePassword() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    password: '',
    passwordConfirmation: ''
  });

  useEffect(() => {
    document.title = `${process.env.REACT_APP_NAME} - Reset Password Page`;
  }, []);

  const onChangeInput = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (!form.password || !form.passwordConfirmation) {
      Swal.fire('Failed!', 'All data must be filled', 'warning');
    } else {
      setLoading(true);

      reset(form, token)
        .then((res) => {
          Swal('Success!', res.message, 'success');
          navigate('/auth/login');
        })
        .catch((err) => {
          if (err.response.data.code === 422) {
            const { error } = err.response.data;
            error.map((el) => toastr(el, 'error'));
          } else {
            Swal('Error!', err.response.data.message, 'error');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <>
      <AuthStyles />
      <Container fluid>
        <Row>
          <Banner />
          <Col md="8" lg="6" className="full d-flex justify-content-center align-items-center">
            <div className="col-10 col-md-8 col-xl-6 d-flex flex-column justify-content-center align-items-center p-0">
              <Form className="w-100 mb-3 mt-3" onSubmit={onSubmit}>
                <FormGroup className="mb-3">
                  <Label for="newPassword" className="mb-2 label">
                    Create New Password
                  </Label>
                  <Input
                    type="password"
                    placeholder="Create New Password"
                    id="password"
                    className="form-control pt-3 pb-3 pl-3 pr-0 input-auth"
                    onChange={onChangeInput}
                    required
                  />
                </FormGroup>
                <FormGroup className="mb-3">
                  <Label for="passwordConfirmation" className="mb-2 label">
                    New Password
                  </Label>
                  <Input
                    type="password"
                    placeholder="New Password"
                    id="passwordConfirmation"
                    className="form-control pt-3 pb-3 pl-3 pr-0 input-auth"
                    onChange={onChangeInput}
                    required
                  />
                </FormGroup>
                <FormGroup className="mb-4 terms">
                  <Input type="checkbox" className="checkbox" id="checkbox" required />
                  <Label for="checkbox" className="label">
                    I agree to terms & conditions
                  </Label>
                </FormGroup>
                {loading ? (
                  <Button className="w-100 btn-main pt-3 pb-3" disabled>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    />
                  </Button>
                ) : (
                  <Button type="submit" className="w-100 btn-main pt-3 pb-3">
                    Reset Password
                  </Button>
                )}
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ChangePassword;
