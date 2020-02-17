import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';

// components
import Setter from './newSession_setter';
import NewSessionPreview from './newSession_preview';
import Success from './newSession_success';
import TitleBlock from '../ui/titleBlock';

// actions
import { registerSession } from '../../actions/adminActions';

// contexts
import { newSessionContext } from '../contexts/newSessionContext';

class NewSession extends Component {
  state = {
    period: [],
    classes: [],
    periodInputIsValid: true
  };

  static contextType = newSessionContext;

  getSession = (start, end) => {
    const startDate = new Date(start.year, start.month - 1, 1);
    const endDate = new Date(end.year, end.month, 0);
    const regularCourse = this.props.regularCourse;
    const targets = [];

    // get the classes and push them to targets
    while (startDate.valueOf() !== endDate.valueOf()) {
      const day = startDate.getDay();
      const match = regularCourse.filter((course) => {
        return course.dayNum === day;
      });

      if (match.length) {
        match.forEach((course) => {
          const d = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
            course.reference.toDate().getHours(),
            course.reference.toDate().getMinutes()
          );
          targets.push({
            date: d,
            capacity: course.capacity,
            name: course.name
          });
        });
      }

      startDate.setDate(startDate.getDate() + 1);
    }
    return targets;
  };

  setSessionPeriod = (start, end) => {
    const classes = this.getSession(start, end);
    if (classes.length === 0) {
      this.setState({
        ...this.state,
        periodInputIsValid: false
      });
    } else {
      this.setState({
        ...this.state,
        period: [start, end],
        classes: classes
      });
    }
  };

  clearSessionInfo = () => {
    this.setState({
      ...this.state,
      classes: [],
      period: []
    });
  };

  deleteClassWhenPreview = (id) => {
    const classes = this.state.classes.filter((classSingle) => {
      return classSingle.id !== id;
    });
    this.setState({
      ...this.state,
      classes: classes
    });
  };

  addSession = () => {
    const period = this.state.period;
    const name = `${period[0].year}年 ${period[0].month}月 - ${period[1].month}月`;
    const sessionInfo = {
      name: name,
      classInfos: this.state.classes,
      period: period
    };
    this.props.registerSession(sessionInfo);
  };

  render() {
    return (
      <div id="newSession">
        <TitleBlock title="開放報名">
          開放新一期的課程。設定完成後同學即可開始報名。
        </TitleBlock>
        {this.context.step === 'setter' ? (
          <Setter
            setSessionPeriod={this.setSessionPeriod}
            validPeriod={this.state.periodInputIsValid}
          />
        ) : null}
        {this.context.step === 'preview' ? (
          <NewSessionPreview
            classes={this.state.classes}
            deleteClassWhenPreview={this.deleteClassWhenPreview}
            addSession={this.addSession}
            clearSessionInfo={this.clearSessionInfo}
          />
        ) : null}
        {this.context.step === 'success' ? <Success /> : null}
        {/* {this.props.newSessionIsAdded ? (
          <Success />
        ) : this.state.classes.length ? (
          <NewSessionPreview
            classes={this.state.classes}
            deleteClassWhenPreview={this.deleteClassWhenPreview}
            addSession={this.addSession}
            clearSessionInfo={this.clearSessionInfo}
          />
        ) : (
          <NewSessionForm
            setSessionPeriod={this.setSessionPeriod}
            validPeriod={this.state.periodInputIsValid}
          />
        )} */}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    regularCourse: state.firestore.ordered.regularCourse,
    newSessionIsAdded: state.admin.newSessionIsAdded
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    registerSession: (sessionInfo) => {
      dispatch(registerSession(sessionInfo));
    }
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([{ collection: 'regularCourse' }])
)(NewSession);
