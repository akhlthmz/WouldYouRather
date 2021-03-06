import React from "react";
import { connect } from "react-redux";
import { useForm } from "react-hook-form";
import { Redirect } from "react-router-dom";
import newQuestion from "../utils/images/newQuestion.svg";
import { addNewQuestion } from "../actions/questions";
import { addUserQuestion } from "../actions/users";
import { _saveQuestion } from "../utils/_DATA";
import theme from "../components/ui/theme";
import { ThemeProvider } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import { LinearProgress } from "@material-ui/core";
import PropTypes from "prop-types";
import {
  Paper,
  Button,
  CssBaseline,
  TextField,
  Container,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: 0,
    margin: "auto",
    maxWidth: 600,
  },
  img: {
    width: "25em",
    height: "20em",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "10px",
    paddingBottom: "3em",
  },

  form: {
    width: "100%",
  },
}));

function NewQuestion(props) {
  const [submitted, setSubmitted] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const { register, handleSubmit, errors } = useForm();
  const { authedUser, addUserQuestion, addNewQuestion } = props;

  const handleOnSubmit = async (data) => {
    const { optionOne, optionTwo } = data;
    setLoading(!isLoading);
    const question = await _saveQuestion({
      optionOneText: optionOne,
      optionTwoText: optionTwo,
      author: authedUser,
    });

    addNewQuestion(question);
    addUserQuestion(authedUser, question.id);
    setLoading(!isLoading);
    setSubmitted(!submitted);
  };

  const classes = useStyles();
  if (submitted) {
    return <Redirect to="/" />;
  }
  return (
    <ThemeProvider theme={theme}>
      {isLoading ? <LinearProgress color="secondary" /> : null}

      <Paper className={classes.paper} elevation={15}>
        <h1
          style={{
            margin: 0,
            marginTop: "10px",
            backgroundColor: "rgb(217, 226, 226)",
            textAlign: "center",

            padding: "1em 2em",
          }}
        >
          Create New Question
        </h1>
        <img
          className={classes.img}
          src={newQuestion}
          alt="two pwrsons asking questions"
        />
        <Container component="main" maxWidth="xs">
          <CssBaseline />

          {/* <h4 style={{ margin: 0 }}>Complete the question :</h4> */}
          <h2 style={{ margin: 0 }}>Would You Rather...</h2>

          <form
            className={classes.form}
            noValidate
            onSubmit={handleSubmit(handleOnSubmit)}
          >
            <TextField
              inputRef={register({
                required: true,
                minLength: 1,
                validate: (value) => {
                  return !!value.trim();
                },
              })}
              variant="outlined"
              margin="normal"
              required
              style={{ width: "100%" }}
              id="optionOne"
              label="Option One"
              name="optionOne"
              type="text"
              autoFocus
            />
            {errors.optionOne && (
              <p style={{ color: "crimson" }}>Please enter Option One</p>
            )}
            <h4 style={{ margin: 0, textAlign: "center" }}>Or</h4>
            <TextField
              inputRef={register({
                required: true,
                minLength: 1,
                validate: (value) => {
                  return !!value.trim();
                },
              })}
              style={{ width: "100%" }}
              variant="outlined"
              margin="normal"
              required
              name="optionTwo"
              label="Option Two"
              type="text"
            />
            {errors.optionTwo && (
              <p style={{ color: "crimson" }}>Please enter Option Two</p>
            )}

            <Button
              style={{
                backgroundColor: "#4caf50",
                color: "white",
                margin: "2em  0 3em 0",
                width: "100%",
              }}
              type="submit"
            >
              Submit
            </Button>
          </form>
        </Container>
      </Paper>
    </ThemeProvider>
  );
}

NewQuestion.propTypes = {
  addNewQuestion: PropTypes.func.isRequired,
  addUserQuestion: PropTypes.func.isRequired,
  authedUser: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  const { authedUser } = state;
  return {
    authedUser,
  };
}

export default connect(mapStateToProps, { addNewQuestion, addUserQuestion })(
  NewQuestion
);
