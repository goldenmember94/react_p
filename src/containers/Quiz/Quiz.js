import React, {Component} from 'react'
import ActiveQuiz from '../../components/ActiveQuiz/ActiveQuiz'
import FinishedQuiz from '../../components/FinishedQuiz/FinishedQuiz'
import axios from '../../axios/axios-quiz'
import './Quiz.css'
import Loader from '../../components/UI/Loader/Loader'

class Quiz extends Component {
  state = {
    results: {},
    isFinished: false,
    activeQuestion: 0,
    answerState: null,
    quiz: [],
    loading: true,
  }

  onAnswerClickHandler = (answerId) => {
    if (this.state.answerState) {
      const key = Object.keys(this.state.answerState)[0]
      if (this.state.answerState[key] === 'success ') {
        return
      }
    }

    const quiestion = this.state.quiz[this.state.activeQuestion]
    const results = this.state.results

    if (quiestion.rightAnswerId === answerId) {
      if (!results[quiestion.id]) {
        results[quiestion.id] = 'success'
      }
      this.setState({
        answerState: {[answerId]: 'success'},
        results,
      })

     const timeout = window.setTimeout(() => {
        if (this.isQuizFinished()) {
          console.log('finished');
          this.setState({
            isFinished: true,
          })
        } else {
          this.setState({
            activeQuestion: this.state.activeQuestion + 1,
            answerState: null,
          })
        }

        window.clearTimeout(timeout)
      }, 1000)
    } else {
      results[answerId] = 'error'
      this.setState({
        answerState: {[answerId]: 'error'},
        results,
      })
    }

  }

  isQuizFinished() {
    return this.state.activeQuestion + 1 === this.state.quiz.length
  }

  retryHandler = () => {
    this.setState({
      activeQuestion: 0,
      answerState: null,
      isFinished: false,
      results: {},
    })
  }

  async componentDidMount() {
    try {
      const response = await axios.get(`quizes/${this.props.match.params.id}.json`)
      const quiz = response.data
      console.log(this.props);
      this.setState({
        quiz,
        loading: false,
      })
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <div className="Quiz">
        <div className="QuizWrapper">
        <h1>Ответьте на все вопросы</h1>

        {
          this.state.loading
            ? <Loader/> 
            : this.state.isFinished
            ? <FinishedQuiz
                results={this.state.results}
                quiz={this.state.quiz}
                onRetry={this.retryHandler}
              />
            : <ActiveQuiz
            answers={this.state.quiz[this.state.activeQuestion].answers}
            question={this.state.quiz[this.state.activeQuestion].question}
            onAnswerClick={this.onAnswerClickHandler}
            quizLength={this.state.quiz.length}
            answerNumber={this.state.activeQuestion + 1}
            state={this.state.answerState}
              />
        }
        </div>
      </div>
    )
  }
}

export default Quiz