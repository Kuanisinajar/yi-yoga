import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";

// components
import Preview from "./reschedule_preview";
import StepIndicator from "../stepIndicator";

// actions 
import {reschedulePending, rescheduleAdd, updateLeaveRecord_reschedule} from '../../actions/userActions';

class Reschedule extends Component {
    state = {
        timeTable: [],
        selected: ""
    };

    select = classId => {
        this.setState(
            {
                ...this.state,
                selected: classId
            }
        );
    };

    classFilter = (mm, yyyy) => {
        const selectedDate = new Date(yyyy, mm);
        const nextMonth = new Date(yyyy, mm + 1);

        return this.props.classProfile.filter(profile => {
            const month = profile.classDate.toDate().getMonth();
            const year = profile.classDate.toDate().getFullYear();
            return (
                (month === selectedDate.getMonth() &&
                    year === selectedDate.getFullYear()) ||
                (month === nextMonth.getMonth() &&
                    year === nextMonth.getFullYear())
            );
        });
    };

    requestTimeTable = (mm, yyyy) => {
        const available = this.classFilter(mm, yyyy);
        // const sorted = this.sortClassesByDay(available);
        this.setState({
            ...this.state,
            timeTable: available
        });
    };

    handleClick = (e, date)=> {
        const yyyy = e.target.dataset.year;
        const mm = e.target.dataset.month;
        this.requestTimeTable(mm, yyyy);
        this.setState({
            target: date
        })
    };

    options = () => {
        const leaveRecord = this.props.leaveRecord;
        return (
            leaveRecord &&
            leaveRecord.reschedulable.map((timestamp, i) => {
                const date = timestamp.toDate();
                const yyyy = date.getFullYear();
                const mm = date.getMonth();
                const dd = date.getDate();
                const hr = date.getHours();
                const min = date.getMinutes();
                const startAt = `${hr}:${min}`;
                const day = date.getDay();
                const dayOutput = `週${day.toLocaleString("zh-u-nu-hanidec")}`;
                return (
                    <div
                        className="shadowOption dateHero checkboxContainer_message"
                        key={i}
                        data-month={mm}
                        data-year={yyyy}
                        onClick={(e) => {this.handleClick(e, date)}}
                    >
                        <span name="date">{`${dd}`}</span>
                        <span name="monthYear">{`${mm + 1}月 ${yyyy}`}</span>
                        <span name="seperator"> | </span>
                        <span name="dayTime">{`${dayOutput} ${startAt}`}</span>
                    </div>
                );
            })
        );
    };

    conditionalComponents = () => {
        if (this.state.timeTable.length) {
            return (
                <Preview classes={this.state.timeTable} select={this.select} submit={this.submit}/>
            );
        } else {
            return this.options();
        }
    };

    indicatorOutput = () => {
        if (this.state.timeTable.length) {
            return '選擇補課日期'
        } 
        return '選擇已請假課堂'

    }

    submit = () => {
        const classProfile = this.props.classProfile;
        const classId = this.state.selected;
        const userId = this.props.userId;
        const rescheduleDate = this.state.target;
        // check if add or pending
        const selectedClassInfo = classProfile.find((classInfo) => {
            return classInfo.id === classId
        })
        const avalible = 15 - selectedClassInfo.students.length - selectedClassInfo.rescheduleStudents.length;
        if (avalible) {
            this.props.rescheduleAdd(classId, userId);
            this.props.updateLeaveRecord(userId, rescheduleDate);
        } else {
            this.props.reschedulePending(classId, userId);
            this.props.updateLeaveRecord(userId, rescheduleDate);
        }
        
    }

    render() {
        return (
            <div id="reschedule">
                <StepIndicator indicator={this.indicatorOutput()} />
                <div className='innerContent'>
                    {this.conditionalComponents()}
                </div>
                <div className="nextStepButtonsArea">
                    <Link to="/" className="cancelGray">
                        取消
                    </Link>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const uid = state.firebase.auth.isempty
        ? undefined
        : state.firebase.auth.uid;
    const leaveRecord =
        uid && state.firestore.ordered.leaveRecord
            ? state.firestore.ordered.leaveRecord.find(record => {
                  return record.id === uid;
              })
            : null;
    return {
        userId: uid,
        classProfile: state.firestore.ordered.classProfile,
        leaveRecord: leaveRecord
    };
};

const mapDispatchToProps = dispatch => {
    return {
        reschedulePending: (classId, userId) => {
            dispatch(reschedulePending(classId, userId))
        },
        rescheduleAdd : (classId, userId) => {
            dispatch(rescheduleAdd(classId, userId))
        },
        updateLeaveRecord: (userId, rescheduleDate) => {
            dispatch(updateLeaveRecord_reschedule(userId, rescheduleDate))
        },
    };
};

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    firestoreConnect([
        { collection: "user" },
        { collection: "classProfile" },
        { collection: "leaveRecord" }
    ])
)(Reschedule);
