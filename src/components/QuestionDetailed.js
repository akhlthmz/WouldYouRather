import React from "react";
import { connect } from "react-redux";
import Navbar from "./Navbar";
import QUnanswered from "./QUnanswered";
import QAnswered from "./QAnswered";
import { saveQuestionAnswer } from "../actions/questions";
import { saveUserAnswer } from "../actions/users";

import { ThemeProvider } from "@material-ui/core/styles";
import theme from "../components/ui/theme";

function QuestionDetailed(props) {
  const {
    authedUser,
    question,
    questionId,
    author,
    avatar,
    answeredQuestion,
    optionOnePercent,
    optionTwoPercent,
    optionOneVotes,
    optionTwoVotes,
    totalVotes,
  } = props;

  if (!question) {
    return <h1></h1>;
  }
  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      {!answeredQuestion ? (
        <QUnanswered
          authedUser={authedUser}
          questionId={questionId}
          author={author}
          avatar={avatar}
          question={question}
          saveQuestionAnswer={() => saveQuestionAnswer()}
          saveUserAnswer={() => saveUserAnswer()}
        />
      ) : (
        <QAnswered
          author={author}
          avatar={avatar}
          question={question}
          authedUser={authedUser}
          optionOnePercent={optionOnePercent}
          optionTwoPercent={optionTwoPercent}
          optionOneVotes={optionOneVotes}
          optionTwoVotes={optionTwoVotes}
          totalVotes={totalVotes}
        />
      )}
    </ThemeProvider>
  );
}

function mapStateToProps({ questions, users, authedUser }, { match }) {
  const { questionId } = match.params;
  const question = questions ? questions[questionId] : null;
  const author = question ? users[question.author].name : null;
  const avatar = question ? users[question.author].avatar : null;
  const optionOneVotes = question ? question.optionOne.votes.length : 0;
  const optionTwoVotes = question ? question.optionTwo.votes.length : 0;
  const isOptionOneAnswered = question
    ? question.optionOne.votes.includes(authedUser)
    : "";
  const isOptionTwoAnswered = question
    ? question.optionTwo.votes.includes(authedUser)
    : "";
  const answeredQuestion = isOptionOneAnswered || isOptionTwoAnswered;
  const totalVotes = optionOneVotes + optionTwoVotes;
  const optionOnePercent = question ? (optionOneVotes / totalVotes) * 100 : 0;
  const optionTwoPercent = question ? (optionTwoVotes / totalVotes) * 100 : 0;
  return {
    authedUser,
    question,
    questionId,
    author,
    avatar,
    answeredQuestion,
    optionOnePercent,
    optionTwoPercent,
    optionOneVotes,
    optionTwoVotes,
    totalVotes,
  };
}

export default connect(mapStateToProps, { saveQuestionAnswer, saveUserAnswer })(
  QuestionDetailed
);