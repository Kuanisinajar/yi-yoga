import React, { createContext, useState, useEffect, useContext } from 'react';

// contexts
import { regularCourseContext } from './regularCourseContext';

// functions
import { createClassProfile } from '../../functions/createClassProfile';

export const newSessionContext = createContext();

const initSpan = {
  start: {
    month: null,
    year: null
  },
  end: {
    month: null,
    year: null
  }
};

const NewSessionContext = (props) => {
  const [step, setStep] = useState('setter');
  const [sessionSpan, setSessionSpan] = useState(initSpan);
  const [classes, setClasses] = useState([]);
  const { regularCourse } = useContext(regularCourseContext);

  const toNextStep = () => {
    const fsm = {
      initial: 'setter',
      setter: 'preview',
      preview: 'success',
      success: 'initial'
    };
    setStep(fsm[step]);
  };

  const toPrevStep = () => {
    const fsm = {
      setter: 'initial',
      preview: 'setter'
    };
    setStep(fsm[step]);
  };

  /**
   *  get Classes
   */
  useEffect(() => {
    const { start, end } = sessionSpan;
    const startDate = new Date(start.year, start.month - 1, 1);
    const endDate = new Date(end.year, end.month, 0);
    const matchClasses = createClassProfile(startDate, endDate, regularCourse);

    setClasses(matchClasses);
  }, [sessionSpan, regularCourse]);

  return (
    <newSessionContext.Provider
      value={{
        step,
        toNextStep,
        toPrevStep,
        sessionSpan,
        setSessionSpan,
        classes,
        setClasses,
        regularCourse
      }}
    >
      {props.children}
    </newSessionContext.Provider>
  );
};

export default NewSessionContext;
