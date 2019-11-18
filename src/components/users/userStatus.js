import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";

// components
import StepIndicator from "../stepIndicator";
import LeaveSingle from "./userStatus_leaveSingle";
import RescheduleSingle from "./userStatus_rescheduleSingle";
import PaymentSingle from './userStatus_paymentSingle';

const UserStatus = ({ uid, leaveRecord, classProfile, payments }) => {
    return (
        <div id="userStatus" className="innerContent">
            {/**
             *
             *   報名
             *
             */}
            <div className="contentBlock">
                <StepIndicator indicator="報名狀態" />
                { payments && payments.map((payment, i) => {
                    return <PaymentSingle infos={payment} key={i}/>
                })}
                {
                    /** default*/
                    payments && !payments.length ? (
                        <p name="default">沒有任何報名資訊</p>
                    ) : null
                }
            </div>


            {/**
             *
             *   請假
             *
             */}
            <div className="contentBlock">
                <StepIndicator indicator="請假狀態" />
                {leaveRecord &&
                    leaveRecord.reschedulable.map((date, i) => {
                        return (
                            <LeaveSingle
                                status="reschedulable"
                                date={date}
                                key={i}
                            />
                        );
                    })}
                {leaveRecord &&
                    leaveRecord.reschedulePending.map((date, i) => {
                        const pendingClassInfo =
                            classProfile &&
                            classProfile.find(profile => {
                                return profile.id === date.pendingClassId;
                            });
                        return (
                            <LeaveSingle
                                status="reschedulePending"
                                date={date.leaveDate}
                                pendingClassInfo={pendingClassInfo}
                                uid={uid}
                                key={i}
                            />
                        );
                    })}
                {leaveRecord &&
                    leaveRecord.rescheduled.map((date, i) => {
                        const rescheduleClassInfo =
                            classProfile &&
                            classProfile.find(profile => {
                                return profile.id === date.rescheduleClassId;
                            });
                        return (
                            <LeaveSingle
                                status="rescheduled"
                                date={date.leaveDate}
                                rescheduleClassInfo={rescheduleClassInfo}
                                key={i}
                            />
                        );
                    })}
                {
                    /** default*/
                    leaveRecord && !leaveRecord.rescheduled.length && !leaveRecord.reschedulePending.length && !leaveRecord.reschedulable.length ? (
                        <p name="default">沒有任何請假資訊</p>
                    ) : null
                }
            </div>


            {/**
             *
             *   補課
             *
             */}
            <div className="contentBlock">
                <StepIndicator indicator="補課狀態" />
                {leaveRecord &&
                    leaveRecord.reschedulePending.map((date, i) => {
                        const pendingClassInfo =
                            classProfile &&
                            classProfile.find(profile => {
                                return profile.id === date.pendingClassId;
                            });
                        return (
                            <RescheduleSingle
                                pendingClassInfo={pendingClassInfo}
                                uid={uid}
                                key={i}
                            />
                        );
                    })}
                {leaveRecord &&
                    leaveRecord.rescheduled.map((date, i) => {
                        const rescheduleClassInfo =
                            classProfile &&
                            classProfile.find(profile => {
                                return profile.id === date.rescheduleClassId;
                            });
                        return (
                            <RescheduleSingle
                                rescheduleClassInfo={rescheduleClassInfo}
                                key={i}
                            />
                        );
                    })}
                {
                    /** default*/
                    leaveRecord && !leaveRecord.rescheduled.length && !leaveRecord.reschedulePending.length ? (
                        <p name="default">沒有任何補課資訊</p>
                    ) : null
                }
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    const uid = state.firebase.auth.uid;
    const leaveRecord = state.firestore.ordered.leaveRecord
        ? state.firestore.ordered.leaveRecord.find(record => {
              return record.id === uid;
          })
        : null;
    const payments = state.firestore.ordered.paymentStatus && state.firestore.ordered.paymentStatus.filter((status) => {
        return status.owner === uid
    })
    return {
        uid: uid,
        leaveRecord: leaveRecord,
        classProfile: state.firestore.ordered.classProfile,
        payments: payments
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: "user" },
        { collection: "leaveRecord" },
        { collection: "classProfile" },
        { collection: 'paymentStatus' }
    ])
)(UserStatus);
