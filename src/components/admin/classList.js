import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';

// components
import TitleBlock from '../ui/titleBlock';
import Block from '../ui/block';
import ButtonGroup from '../ui/buttonGroup';
import ListCard from './classList_listCard';
import NameTag from '../ui/nameTag';
import FullWidthScrollableBlock from '../ui/fullWidthScrollableBlock';

// contexts
import { regularCourseContext } from '../contexts/regularCourseContext';
import { allClassContext } from '../contexts/allClassContext';

// functions
import keyGen from '../../functions/keyGen';

// data
import theme from '../../json/theme.json';

const reconstruct = (classes) => {
  const monthOptions = [];
  const sortedByMonth = {};

  if (classes.length === 0) {
    return {
      monthOptions,
      sortedByMonth
    };
  }

  classes.forEach((classInfo) => {
    const date = classInfo.date;
    const classMonth = date.getMonth();
    if (monthOptions.indexOf(classMonth) < 0) {
      monthOptions.push(classMonth);
      sortedByMonth[classMonth] = [];
    }
    sortedByMonth[classMonth].push(classInfo);
  });

  return {
    monthOptions,
    sortedByMonth
  };
};

const getCourseOption = (regularCourse) => {
  return regularCourse.reduce((acc, cVal) => {
    const day = cVal.day;
    if (acc.indexOf(day) < 0) {
      return [...acc, day];
    }
  }, []);
};

const OptionButton = styled.button`
  margin-right: 12px;
  background: ${(props) => (props.inView ? theme.colors.gray6 : 'none')};
  color: ${(props) => (props.inView ? 'white' : theme.colors.gray6)};
`;

const OptionRow = styled.div`
  margin-bottom: 1rem;
`;

const ClassList = () => {
  const { regularCourse } = useContext(regularCourseContext);
  const { classes } = useContext(allClassContext);
  const { monthOptions, sortedByMonth } = reconstruct(classes);
  const courseOptions = getCourseOption(regularCourse);
  const [monthInView, setMonthInView] = useState(0);
  const selectMonth = (e) => {
    const index = e.target.dataset.index;
    const i = parseInt(index, 10);
    setMonthInView(i);
  };

  return (
    <div>
      <TitleBlock title="查看課表" />
      <Block>
        <OptionRow>
          {monthOptions.map((item, i) => {
            const inView = i === monthInView;
            return (
              <OptionButton
                className="outlineButton"
                key={keyGen()}
                inView={inView}
                data-index={i}
                onClick={selectMonth}
              >
                {`${item.toLocaleString('zh')}月`}
              </OptionButton>
            );
          })}
        </OptionRow>
      </Block>
      <FullWidthScrollableBlock>
        {classes
          .filter((classProfile) => {
            return classProfile.date.getMonth() === monthOptions[monthInView];
          })
          .map((classProfile) => {
            return (
              <div className="col-12 col-md-4 col-lg-3 mb-5">
                <ListCard
                  title={classProfile.name}
                  subtitle={classProfile.type}
                  students={classProfile.students}
                  pendingStudents={classProfile.pendingStudents}
                  rescheduleStudents={classProfile.rescheduleStudents}
                />
              </div>
            );
          })}
      </FullWidthScrollableBlock>
    </div>
  );
};

export default ClassList;
