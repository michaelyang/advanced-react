import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { CURRENT_USER_QUERY } from "./User";

const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmedPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmedPassword: $confirmedPassword
    ) {
      id
      email
      name
    }
  }
`;

class Reset extends Component {
  static PropTypes = {
    resetToken: PropTypes.string.isRequired
  };
  state = {
    password: "",
    confirmedPassword: ""
  };
  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    return (
      <Mutation
        mutation={RESET_PASSWORD_MUTATION}
        variables={{
          resetToken: this.props.resetToken,
          password: this.state.password,
          confirmedPassword: this.state.confirmedPassword
        }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(resetPassword, { error, loading, called }) => {
          return (
            <Form
              method="post"
              onSubmit={async e => {
                e.preventDefault();
                const res = await resetPassword();
                this.setState({ password: "", confirmedPassword: "" });
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Reset Your Password</h2>
                <Error error={error} />
                <label htmlFor="password">
                  New Password
                  <input
                    type="password"
                    name="password"
                    placeholder="password"
                    value={this.state.password}
                    onChange={this.saveToState}
                  />
                </label>
                <label htmlFor="confirmedPassword">
                  Confirm New Password
                  <input
                    type="password"
                    name="confirmedPassword"
                    placeholder="confirm password"
                    value={this.state.confirmedPassword}
                    onChange={this.saveToState}
                  />
                </label>
                <button type="submit">Reset</button>
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default Reset;
